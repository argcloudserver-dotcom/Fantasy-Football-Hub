import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { HISTORICAL_TEAMS, HistoricalTeam, getRandomHistoricalTeams } from '@/data/historicalTeams';
import { Player, generateRandomSquadForPosition } from '@/data/players';

export type GamePhase =
  | 'home'
  | 'lobby'
  | 'draft'
  | 'team'
  | 'draw'
  | 'groupStage'
  | 'standings'
  | 'knockout'
  | 'winner';

export type GameMode = 'vsAI' | 'vsPlayer';
export type PositionType = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface DraftSlot {
  id: string;
  label: string;
  positionType: PositionType;
  player?: Player;
  x: number;
  y: number;
}

export const DRAFT_SLOTS: DraftSlot[] = [
  { id: 'ST', label: 'ST', positionType: 'FWD', x: 45, y: 8 },
  { id: 'LW', label: 'LW', positionType: 'FWD', x: 12, y: 14 },
  { id: 'RW', label: 'RW', positionType: 'FWD', x: 78, y: 14 },
  { id: 'CM1', label: 'CM', positionType: 'MID', x: 22, y: 34 },
  { id: 'CDM', label: 'CDM', positionType: 'MID', x: 45, y: 42 },
  { id: 'CM2', label: 'CM', positionType: 'MID', x: 68, y: 34 },
  { id: 'LB', label: 'LB', positionType: 'DEF', x: 10, y: 60 },
  { id: 'CB1', label: 'CB', positionType: 'DEF', x: 32, y: 65 },
  { id: 'CB2', label: 'CB', positionType: 'DEF', x: 58, y: 65 },
  { id: 'RB', label: 'RB', positionType: 'DEF', x: 80, y: 60 },
  { id: 'GK', label: 'GK', positionType: 'GK', x: 45, y: 82 },
];

export interface GroupTeam {
  id: string;
  name: string;
  nameAr: string;
  flag: string;
  rating: number;
  isPlayer: boolean;
  isOpponent: boolean;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
}

export interface GroupMatch {
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number;
  awayGoals: number;
  played: boolean;
  events: MatchEvent[];
  groupIndex: number;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellowCard' | 'redCard' | 'miss' | 'save';
  teamId: string;
  description: string;
  descriptionAr: string;
}

export interface KnockoutMatch {
  round: 'QF' | 'SF' | 'F';
  matchIndex: number;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals?: number;
  awayGoals?: number;
  played: boolean;
  events: MatchEvent[];
  winnerId?: string;
}

interface GameState {
  phase: GamePhase;
  playerName: string;
  opponentName: string;
  gameMode: GameMode;
  roomCode: string | null;
  myTeamSlots: DraftSlot[];
  opponentTeamSlots: DraftSlot[];
  groups: GroupTeam[][];
  groupMatches: GroupMatch[];
  knockoutTeams: GroupTeam[];
  knockoutMatches: KnockoutMatch[];
  currentMatchIndex: number;
  winner: GroupTeam | null;
  matchLog: string[];
}

const initialSlots = (): DraftSlot[] => DRAFT_SLOTS.map(s => ({ ...s }));

const defaultState: GameState = {
  phase: 'home',
  playerName: '',
  opponentName: 'AI Manager',
  gameMode: 'vsAI',
  roomCode: null,
  myTeamSlots: initialSlots(),
  opponentTeamSlots: initialSlots(),
  groups: [],
  groupMatches: [],
  knockoutTeams: [],
  knockoutMatches: [],
  currentMatchIndex: 0,
  winner: null,
  matchLog: [],
};

interface GameContextType extends GameState {
  setPhase: (phase: GamePhase) => void;
  setPlayerName: (name: string) => void;
  setGameMode: (mode: GameMode) => void;
  startGame: () => void;
  selectPlayerForSlot: (slotId: string, player: Player) => void;
  getCurrentSlotIndex: () => number;
  generateAITeam: () => void;
  setupTournament: () => void;
  playNextGroupMatch: () => GroupMatch | null;
  advanceToKnockout: () => void;
  playNextKnockoutMatch: () => KnockoutMatch | null;
  resetGame: () => void;
  generateRoomCode: () => string;
}

const GameContext = createContext<GameContextType | null>(null);

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 6);
}

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getTeamRating(slots: DraftSlot[]): number {
  const players = slots.filter(s => s.player).map(s => s.player!);
  if (players.length === 0) return 75;
  return Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length);
}

const EVENT_DESCRIPTIONS = {
  goal: [
    { en: 'GOAL! Stunning finish!', ar: 'هدف! تسديدة رائعة!' },
    { en: 'GOAL! Into the net!', ar: 'هدف! في الشبكة!' },
    { en: 'GOAL! What a strike!', ar: 'هدف! يا له من ضربة!' },
    { en: 'GOAL! Clinical finish!', ar: 'هدف! إنهاء بارع!' },
  ],
  yellowCard: [
    { en: 'Yellow card shown!', ar: 'بطاقة صفراء!' },
    { en: 'Caution for a foul!', ar: 'إنذار بعد خطأ!' },
  ],
  miss: [
    { en: 'Close! Just wide!', ar: 'قريبة! خارجة قليلاً!' },
    { en: 'Off the post!', ar: 'على العمود!' },
    { en: 'Chance goes begging!', ar: 'الفرصة ضائعة!' },
  ],
  save: [
    { en: 'Brilliant save by the keeper!', ar: 'تصدي رائع من الحارس!' },
    { en: 'What a stop!', ar: 'توقف مذهل!' },
  ],
};

function generateMatchEvents(homeTeamId: string, awayTeamId: string, homeGoals: number, awayGoals: number): MatchEvent[] {
  const events: MatchEvent[] = [];
  const usedMinutes = new Set<number>();

  function uniqueMinute(min: number, max: number): number {
    let m = Math.floor(Math.random() * (max - min + 1)) + min;
    let tries = 0;
    while (usedMinutes.has(m) && tries < 20) {
      m = Math.floor(Math.random() * (max - min + 1)) + min;
      tries++;
    }
    usedMinutes.add(m);
    return m;
  }

  for (let i = 0; i < homeGoals; i++) {
    const d = EVENT_DESCRIPTIONS.goal[Math.floor(Math.random() * EVENT_DESCRIPTIONS.goal.length)];
    events.push({ minute: uniqueMinute(5, 88), type: 'goal', teamId: homeTeamId, description: d.en, descriptionAr: d.ar });
  }
  for (let i = 0; i < awayGoals; i++) {
    const d = EVENT_DESCRIPTIONS.goal[Math.floor(Math.random() * EVENT_DESCRIPTIONS.goal.length)];
    events.push({ minute: uniqueMinute(5, 88), type: 'goal', teamId: awayTeamId, description: d.en, descriptionAr: d.ar });
  }

  const cards = Math.floor(Math.random() * 3);
  for (let i = 0; i < cards; i++) {
    const d = EVENT_DESCRIPTIONS.yellowCard[Math.floor(Math.random() * EVENT_DESCRIPTIONS.yellowCard.length)];
    const team = Math.random() < 0.5 ? homeTeamId : awayTeamId;
    events.push({ minute: uniqueMinute(20, 85), type: 'yellowCard', teamId: team, description: d.en, descriptionAr: d.ar });
  }

  const misses = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < misses; i++) {
    const d = EVENT_DESCRIPTIONS.miss[Math.floor(Math.random() * EVENT_DESCRIPTIONS.miss.length)];
    const team = Math.random() < 0.5 ? homeTeamId : awayTeamId;
    events.push({ minute: uniqueMinute(10, 85), type: 'miss', teamId: team, description: d.en, descriptionAr: d.ar });
  }

  const saves = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < saves; i++) {
    const d = EVENT_DESCRIPTIONS.save[Math.floor(Math.random() * EVENT_DESCRIPTIONS.save.length)];
    const team = Math.random() < 0.5 ? homeTeamId : awayTeamId;
    events.push({ minute: uniqueMinute(10, 85), type: 'save', teamId: team, description: d.en, descriptionAr: d.ar });
  }

  return events.sort((a, b) => a.minute - b.minute);
}

function simulateMatch(homeRating: number, awayRating: number): { homeGoals: number; awayGoals: number } {
  const ratingDiff = (homeRating - awayRating) / 10;
  const variance = (Math.random() - 0.5) * 2.0;
  const homeExpected = Math.max(0, 1.3 + ratingDiff * 0.15 + variance * 0.8);
  const awayExpected = Math.max(0, 1.1 - ratingDiff * 0.15 + variance * -0.5);
  const homeGoals = Math.max(0, Math.round(homeExpected + (Math.random() - 0.5)));
  const awayGoals = Math.max(0, Math.round(awayExpected + (Math.random() - 0.5)));
  return { homeGoals, awayGoals };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);

  useEffect(() => {
    AsyncStorage.getItem('wcfm_playerName').then(name => {
      if (name) setState(s => ({ ...s, playerName: name }));
    });
  }, []);

  const setPhase = useCallback((phase: GamePhase) => {
    setState(s => ({ ...s, phase }));
  }, []);

  const setPlayerName = useCallback((name: string) => {
    setState(s => ({ ...s, playerName: name }));
    AsyncStorage.setItem('wcfm_playerName', name);
  }, []);

  const setGameMode = useCallback((mode: GameMode) => {
    setState(s => ({ ...s, gameMode: mode }));
  }, []);

  const generateRoomCode = useCallback((): string => {
    const code = generateCode();
    setState(s => ({ ...s, roomCode: code }));
    return code;
  }, []);

  const startGame = useCallback(() => {
    setState(s => ({
      ...s,
      myTeamSlots: initialSlots(),
      opponentTeamSlots: initialSlots(),
      groups: [],
      groupMatches: [],
      knockoutTeams: [],
      knockoutMatches: [],
      currentMatchIndex: 0,
      winner: null,
      phase: 'draft',
    }));
  }, []);

  const getCurrentSlotIndex = useCallback((): number => {
    return state.myTeamSlots.findIndex(s => !s.player);
  }, [state.myTeamSlots]);

  const selectPlayerForSlot = useCallback((slotId: string, player: Player) => {
    setState(s => {
      const updated = s.myTeamSlots.map(slot =>
        slot.id === slotId ? { ...slot, player } : slot
      );
      return { ...s, myTeamSlots: updated };
    });
  }, []);

  const generateAITeam = useCallback(() => {
    setState(s => {
      const aiSlots = DRAFT_SLOTS.map(slot => {
        const squad = generateRandomSquadForPosition(slot.positionType);
        const eligible = squad.players;
        const player = eligible.length > 0
          ? eligible[Math.floor(Math.random() * eligible.length)]
          : undefined;
        return { ...slot, player };
      });
      return { ...s, opponentTeamSlots: aiSlots };
    });
  }, []);

  const setupTournament = useCallback(() => {
    setState(s => {
      const playerTeamRating = getTeamRating(s.myTeamSlots);
      const opponentTeamRating = getTeamRating(s.opponentTeamSlots);

      const playerTeam: GroupTeam = {
        id: 'player',
        name: `${s.playerName || 'You'}'s XI`,
        nameAr: `فريق ${s.playerName || 'اللاعب'}`,
        flag: '⭐',
        rating: playerTeamRating,
        isPlayer: true,
        isOpponent: false,
        points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      };

      const opponentTeam: GroupTeam = {
        id: 'opponent',
        name: `${s.opponentName}'s XI`,
        nameAr: `فريق ${s.opponentName}`,
        flag: '🤖',
        rating: opponentTeamRating,
        isPlayer: false,
        isOpponent: true,
        points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      };

      const historicals = getRandomHistoricalTeams(14);
      const histTeams: GroupTeam[] = historicals.map(ht => ({
        id: ht.id,
        name: ht.name,
        nameAr: ht.nameAr,
        flag: ht.flag,
        rating: ht.rating,
        isPlayer: false,
        isOpponent: false,
        points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      }));

      const groups: GroupTeam[][] = [
        [playerTeam, histTeams[0], histTeams[1], histTeams[2]],
        [opponentTeam, histTeams[3], histTeams[4], histTeams[5]],
        [histTeams[6], histTeams[7], histTeams[8], histTeams[9]],
        [histTeams[10], histTeams[11], histTeams[12], histTeams[13]],
      ];

      const groupMatches: GroupMatch[] = [];
      groups.forEach((group, gIdx) => {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            groupMatches.push({
              homeTeamId: group[i].id,
              awayTeamId: group[j].id,
              homeGoals: 0,
              awayGoals: 0,
              played: false,
              events: [],
              groupIndex: gIdx,
            });
          }
        }
      });

      return {
        ...s,
        groups,
        groupMatches,
        currentMatchIndex: 0,
        phase: 'draw',
      };
    });
  }, []);

  const playNextGroupMatch = useCallback((): GroupMatch | null => {
    let result: GroupMatch | null = null;
    setState(s => {
      const unplayed = s.groupMatches.findIndex(m => !m.played);
      if (unplayed === -1) return s;

      const match = s.groupMatches[unplayed];
      const allTeams = s.groups.flat();
      const home = allTeams.find(t => t.id === match.homeTeamId);
      const away = allTeams.find(t => t.id === match.awayTeamId);
      if (!home || !away) return s;

      const { homeGoals, awayGoals } = simulateMatch(home.rating, away.rating);
      const events = generateMatchEvents(home.id, away.id, homeGoals, awayGoals);
      const played: GroupMatch = { ...match, homeGoals, awayGoals, played: true, events };
      result = played;

      const newMatches = s.groupMatches.map((m, i) => i === unplayed ? played : m);

      const newGroups = s.groups.map(group => group.map(team => {
        if (team.id === match.homeTeamId) {
          const w = homeGoals > awayGoals ? 1 : 0;
          const d = homeGoals === awayGoals ? 1 : 0;
          const l = homeGoals < awayGoals ? 1 : 0;
          return { ...team, played: team.played + 1, won: team.won + w, drawn: team.drawn + d, lost: team.lost + l, gf: team.gf + homeGoals, ga: team.ga + awayGoals, points: team.points + (w * 3 + d) };
        }
        if (team.id === match.awayTeamId) {
          const w = awayGoals > homeGoals ? 1 : 0;
          const d = homeGoals === awayGoals ? 1 : 0;
          const l = awayGoals < homeGoals ? 1 : 0;
          return { ...team, played: team.played + 1, won: team.won + w, drawn: team.drawn + d, lost: team.lost + l, gf: team.gf + awayGoals, ga: team.ga + homeGoals, points: team.points + (w * 3 + d) };
        }
        return team;
      }));

      return { ...s, groupMatches: newMatches, groups: newGroups };
    });
    return result;
  }, []);

  const advanceToKnockout = useCallback(() => {
    setState(s => {
      const qualifiers: GroupTeam[] = [];
      s.groups.forEach(group => {
        const sorted = [...group].sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          return (b.gf - b.ga) - (a.gf - a.ga);
        });
        qualifiers.push(sorted[0], sorted[1]);
      });

      const qfMatches: KnockoutMatch[] = [
        { round: 'QF', matchIndex: 0, homeTeamId: qualifiers[0].id, awayTeamId: qualifiers[5].id, played: false, events: [] },
        { round: 'QF', matchIndex: 1, homeTeamId: qualifiers[1].id, awayTeamId: qualifiers[4].id, played: false, events: [] },
        { round: 'QF', matchIndex: 2, homeTeamId: qualifiers[2].id, awayTeamId: qualifiers[7].id, played: false, events: [] },
        { round: 'QF', matchIndex: 3, homeTeamId: qualifiers[3].id, awayTeamId: qualifiers[6].id, played: false, events: [] },
      ];

      return { ...s, knockoutTeams: qualifiers, knockoutMatches: qfMatches, phase: 'knockout' };
    });
  }, []);

  const playNextKnockoutMatch = useCallback((): KnockoutMatch | null => {
    let result: KnockoutMatch | null = null;
    setState(s => {
      const allTeams = [...s.groups.flat(), ...HISTORICAL_TEAMS.map(ht => ({
        id: ht.id, name: ht.name, nameAr: ht.nameAr, flag: ht.flag, rating: ht.rating,
        isPlayer: false, isOpponent: false, points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      }))];

      const getTeam = (id: string) => allTeams.find(t => t.id === id) ?? s.knockoutTeams.find(t => t.id === id);

      const unplayedIdx = s.knockoutMatches.findIndex(m => !m.played);
      if (unplayedIdx === -1) return s;

      const match = s.knockoutMatches[unplayedIdx];
      const home = getTeam(match.homeTeamId);
      const away = getTeam(match.awayTeamId);
      if (!home || !away) return s;

      let { homeGoals, awayGoals } = simulateMatch(home.rating, away.rating);
      if (homeGoals === awayGoals) {
        Math.random() < 0.5 ? homeGoals++ : awayGoals++;
      }
      const winnerId = homeGoals > awayGoals ? match.homeTeamId : match.awayTeamId;
      const events = generateMatchEvents(home.id, away.id, homeGoals, awayGoals);
      const played: KnockoutMatch = { ...match, homeGoals, awayGoals, played: true, events, winnerId };
      result = played;

      const newKO = s.knockoutMatches.map((m, i) => i === unplayedIdx ? played : m);

      const playedQFs = newKO.filter(m => m.round === 'QF' && m.played);
      const playedSFs = newKO.filter(m => m.round === 'SF' && m.played);
      const playedFs = newKO.filter(m => m.round === 'F' && m.played);

      let finalMatches = [...newKO];

      if (playedQFs.length === 4 && !newKO.some(m => m.round === 'SF')) {
        const qfWinners = playedQFs.map(m => m.winnerId!);
        finalMatches = [...newKO,
          { round: 'SF' as const, matchIndex: 0, homeTeamId: qfWinners[0], awayTeamId: qfWinners[1], played: false, events: [] },
          { round: 'SF' as const, matchIndex: 1, homeTeamId: qfWinners[2], awayTeamId: qfWinners[3], played: false, events: [] },
        ];
      }

      if (playedSFs.length === 2 && !newKO.some(m => m.round === 'F')) {
        const sfWinners = playedSFs.map(m => m.winnerId!);
        finalMatches = [...finalMatches,
          { round: 'F' as const, matchIndex: 0, homeTeamId: sfWinners[0], awayTeamId: sfWinners[1], played: false, events: [] },
        ];
      }

      let winner = s.winner;
      if (playedFs.length === 1 || (match.round === 'F' && played.played)) {
        const finalMatch = finalMatches.find(m => m.round === 'F' && m.played);
        if (finalMatch?.winnerId) {
          const winnerTeam = allTeams.find(t => t.id === finalMatch.winnerId) ?? s.knockoutTeams.find(t => t.id === finalMatch.winnerId);
          winner = winnerTeam ?? null;
        }
      }

      return { ...s, knockoutMatches: finalMatches, winner };
    });
    return result;
  }, []);

  const resetGame = useCallback(() => {
    setState(s => ({ ...defaultState, playerName: s.playerName, myTeamSlots: initialSlots(), opponentTeamSlots: initialSlots() }));
  }, []);

  const value: GameContextType = {
    ...state,
    setPhase,
    setPlayerName,
    setGameMode,
    startGame,
    selectPlayerForSlot,
    getCurrentSlotIndex,
    generateAITeam,
    setupTournament,
    playNextGroupMatch,
    advanceToKnockout,
    playNextKnockoutMatch,
    resetGame,
    generateRoomCode,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
