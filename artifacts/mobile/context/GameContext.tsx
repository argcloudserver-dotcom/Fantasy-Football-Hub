import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { HISTORICAL_TEAMS, getRandomHistoricalTeams } from '@/data/historicalTeams';
import { Player, generateRandomSquadForPosition } from '@/data/players';

export type GamePhase =
  | 'home' | 'lobby' | 'draft' | 'team' | 'draw'
  | 'groupStage' | 'standings' | 'knockout' | 'winner';

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

// 4-3-3: bottom→top = GK → DEF → MID → FWD
// y=0 is top of pitch, y=100 is bottom. GK defends at bottom (high y).
export const DRAFT_SLOTS: DraftSlot[] = [
  { id: 'LW',  label: 'LW',  positionType: 'FWD', x: 12, y: 12 },
  { id: 'ST',  label: 'ST',  positionType: 'FWD', x: 50, y: 8  },
  { id: 'RW',  label: 'RW',  positionType: 'FWD', x: 84, y: 12 },
  { id: 'CM1', label: 'CM',  positionType: 'MID', x: 18, y: 42 },
  { id: 'CDM', label: 'CDM', positionType: 'MID', x: 50, y: 50 },
  { id: 'CM2', label: 'CM',  positionType: 'MID', x: 80, y: 42 },
  { id: 'LB',  label: 'LB',  positionType: 'DEF', x: 10, y: 66 },
  { id: 'CB1', label: 'CB',  positionType: 'DEF', x: 33, y: 70 },
  { id: 'CB2', label: 'CB',  positionType: 'DEF', x: 63, y: 70 },
  { id: 'RB',  label: 'RB',  positionType: 'DEF', x: 86, y: 66 },
  { id: 'GK',  label: 'GK',  positionType: 'GK',  x: 50, y: 86 },
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
  type: 'goal' | 'yellowCard' | 'redCard' | 'miss' | 'save' | 'halftime' | 'substitution' | 'whistle';
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
};

interface GameContextType extends GameState {
  setPhase: (phase: GamePhase) => void;
  setPlayerName: (name: string) => void;
  setGameMode: (mode: GameMode) => void;
  startGame: () => void;
  selectPlayerForSlot: (slotId: string, player: Player) => void;
  selectNextPlayerByPosition: (player: Player) => boolean;
  isPositionTypeFull: (positionType: PositionType) => boolean;
  getFilledCountByType: (positionType: PositionType) => number;
  getTotalSlotsByType: (positionType: PositionType) => number;
  getCurrentSlotIndex: () => number;
  generateAITeam: () => void;
  setupTournament: () => void;
  simulateAllNonPlayerGroupMatches: () => void;
  playNextPlayerGroupMatch: () => GroupMatch | null;
  playNextGroupMatch: () => GroupMatch | null;
  advanceToKnockout: () => void;
  playNextKnockoutMatch: () => KnockoutMatch | null;
  resetGame: () => void;
  generateRoomCode: () => string;
  playSpecificKnockoutMatch: (round: string, matchIndex: number) => KnockoutMatch | null;
  getTournamentPosition: () => string;
}

const GameContext = createContext<GameContextType | null>(null);

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function getTeamRating(slots: DraftSlot[]): number {
  const players = slots.filter(s => s.player).map(s => s.player!);
  if (players.length === 0) return 75;
  return Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length);
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

function generateMatchEventsWithNames(
  homeTeamId: string, awayTeamId: string,
  homeGoals: number, awayGoals: number,
  homeTeamName: string, awayTeamName: string,
  homePlayerNames: string[] = [], awayPlayerNames: string[] = []
): MatchEvent[] {
  const events: MatchEvent[] = [];
  const usedMinutes = new Set<number>([45, 90]);

  function uniqueMinute(min: number, max: number): number {
    let m = Math.floor(Math.random() * (max - min + 1)) + min;
    let tries = 0;
    while (usedMinutes.has(m) && tries < 30) {
      m = Math.floor(Math.random() * (max - min + 1)) + min;
      tries++;
    }
    usedMinutes.add(m);
    return m;
  }

  function pickName(names: string[], fallback: string): string {
    if (names.length > 0) return names[Math.floor(Math.random() * names.length)].split(' ').slice(-1)[0];
    return fallback;
  }

  // Goals first half
  let homeHalf1 = 0, homeHalf2 = 0, awayHalf1 = 0, awayHalf2 = 0;
  for (let i = 0; i < homeGoals; i++) { Math.random() < 0.4 ? homeHalf1++ : homeHalf2++; }
  for (let i = 0; i < awayGoals; i++) { Math.random() < 0.4 ? awayHalf1++ : awayHalf2++; }

  // First half goals
  for (let i = 0; i < homeHalf1; i++) {
    const scorer = pickName(homePlayerNames, homeTeamName);
    const min = uniqueMinute(5, 44);
    events.push({ minute: min, type: 'goal', teamId: homeTeamId, description: `⚽ Goal! ${scorer} scores for ${homeTeamName}!`, descriptionAr: `⚽ هدف! ${homeTeamName} يسجل!` });
  }
  for (let i = 0; i < awayHalf1; i++) {
    const scorer = pickName(awayPlayerNames, awayTeamName);
    const min = uniqueMinute(5, 44);
    events.push({ minute: min, type: 'goal', teamId: awayTeamId, description: `⚽ Goal! ${scorer} scores for ${awayTeamName}!`, descriptionAr: `⚽ هدف! ${awayTeamName} يسجل!` });
  }

  // Half time
  const htHome = homeHalf1;
  const htAway = awayHalf1;
  events.push({ minute: 45, type: 'halftime', teamId: 'system', description: `⏱ Half Time — ${homeTeamName} ${htHome}–${htAway} ${awayTeamName}`, descriptionAr: `⏱ نهاية الشوط الأول — ${htHome}–${htAway}` });

  // Second half goals
  for (let i = 0; i < homeHalf2; i++) {
    const scorer = pickName(homePlayerNames, homeTeamName);
    const min = uniqueMinute(46, 88);
    events.push({ minute: min, type: 'goal', teamId: homeTeamId, description: `⚽ Goal! ${scorer} scores for ${homeTeamName}!`, descriptionAr: `⚽ هدف! ${homeTeamName} يسجل!` });
  }
  for (let i = 0; i < awayHalf2; i++) {
    const scorer = pickName(awayPlayerNames, awayTeamName);
    const min = uniqueMinute(46, 88);
    events.push({ minute: min, type: 'goal', teamId: awayTeamId, description: `⚽ Goal! ${scorer} scores for ${awayTeamName}!`, descriptionAr: `⚽ هدف! ${awayTeamName} يسجل!` });
  }

  // Cards
  const cards = Math.floor(Math.random() * 3);
  for (let i = 0; i < cards; i++) {
    const isHome = Math.random() < 0.5;
    const name = isHome ? pickName(homePlayerNames, homeTeamName) : pickName(awayPlayerNames, awayTeamName);
    events.push({ minute: uniqueMinute(20, 85), type: 'yellowCard', teamId: isHome ? homeTeamId : awayTeamId, description: `🟨 Yellow card for ${name}`, descriptionAr: `🟨 بطاقة صفراء لـ ${name}` });
  }

  // Red card (10% chance)
  if (Math.random() < 0.10) {
    const isHome = Math.random() < 0.5;
    const teamName = isHome ? homeTeamName : awayTeamName;
    events.push({ minute: uniqueMinute(55, 85), type: 'redCard', teamId: isHome ? homeTeamId : awayTeamId, description: `🔴 Red card! ${teamName} down to 10 men`, descriptionAr: `🔴 بطاقة حمراء! ${teamName} بـ 10 لاعبين` });
  }

  // Substitution
  events.push({ minute: uniqueMinute(55, 75), type: 'substitution', teamId: Math.random() < 0.5 ? homeTeamId : awayTeamId, description: `🔄 Substitution`, descriptionAr: `🔄 تغيير لاعب` });

  // Misses
  const misses = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < misses; i++) {
    const isHome = Math.random() < 0.5;
    const name = isHome ? pickName(homePlayerNames, homeTeamName) : pickName(awayPlayerNames, awayTeamName);
    events.push({ minute: uniqueMinute(10, 85), type: 'miss', teamId: isHome ? homeTeamId : awayTeamId, description: `❌ ${name} goes close! Just wide!`, descriptionAr: `❌ ${name} يضيع فرصة!` });
  }

  // Saves
  if (Math.random() < 0.6) {
    events.push({ minute: uniqueMinute(15, 85), type: 'save', teamId: Math.random() < 0.5 ? homeTeamId : awayTeamId, description: `🧤 Brilliant save by the goalkeeper!`, descriptionAr: `🧤 تصدي رائع من الحارس!` });
  }

  // Full time
  events.push({ minute: 90, type: 'whistle', teamId: 'system', description: `⚡ Full Time — ${homeTeamName} ${homeGoals}–${awayGoals} ${awayTeamName}`, descriptionAr: `⚡ نهاية المباراة — ${homeGoals}–${awayGoals}` });

  return events.sort((a, b) => a.minute - b.minute);
}

// Simpler events for AI vs AI matches (not shown to player)
function generateSimpleEvents(homeTeamId: string, awayTeamId: string, homeGoals: number, awayGoals: number): MatchEvent[] {
  return [
    { minute: 45, type: 'halftime', teamId: 'system', description: 'Half Time', descriptionAr: 'نهاية الشوط الأول' },
    { minute: 90, type: 'whistle', teamId: 'system', description: 'Full Time', descriptionAr: 'نهاية المباراة' },
  ];
}

function applyMatchToGroups(groups: GroupTeam[][], match: GroupMatch, homeGoals: number, awayGoals: number): GroupTeam[][] {
  return groups.map(group => group.map(team => {
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
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);

  useEffect(() => {
    AsyncStorage.getItem('wcfm_playerName').then(name => {
      if (name) setState(s => ({ ...s, playerName: name }));
    });
  }, []);

  const setPhase = useCallback((phase: GamePhase) => setState(s => ({ ...s, phase })), []);

  const setPlayerName = useCallback((name: string) => {
    setState(s => ({ ...s, playerName: name }));
    AsyncStorage.setItem('wcfm_playerName', name);
  }, []);

  const setGameMode = useCallback((mode: GameMode) => setState(s => ({ ...s, gameMode: mode })), []);

  const generateRoomCode = useCallback((): string => {
    const code = generateCode();
    setState(s => ({ ...s, roomCode: code }));
    return code;
  }, []);

  const startGame = useCallback(() => {
    setState(s => ({
      ...s, myTeamSlots: initialSlots(), opponentTeamSlots: initialSlots(),
      groups: [], groupMatches: [], knockoutTeams: [], knockoutMatches: [],
      currentMatchIndex: 0, winner: null, phase: 'draft',
    }));
  }, []);

  const getCurrentSlotIndex = useCallback((): number => {
    return state.myTeamSlots.findIndex(s => !s.player);
  }, [state.myTeamSlots]);

  const selectPlayerForSlot = useCallback((slotId: string, player: Player) => {
    setState(s => ({
      ...s,
      myTeamSlots: s.myTeamSlots.map(slot => slot.id === slotId ? { ...slot, player } : slot),
    }));
  }, []);

  // New: fill next empty slot of matching position type, returns true if successful
  const selectNextPlayerByPosition = useCallback((player: Player): boolean => {
    let success = false;
    setState(s => {
      const nextSlot = s.myTeamSlots.find(slot => !slot.player && slot.positionType === player.positionType);
      if (!nextSlot) return s;
      success = true;
      return {
        ...s,
        myTeamSlots: s.myTeamSlots.map(slot => slot.id === nextSlot.id ? { ...slot, player } : slot),
      };
    });
    return success;
  }, []);

  const isPositionTypeFull = useCallback((positionType: PositionType): boolean => {
    return state.myTeamSlots.filter(s => s.positionType === positionType).every(s => !!s.player);
  }, [state.myTeamSlots]);

  const getFilledCountByType = useCallback((positionType: PositionType): number => {
    return state.myTeamSlots.filter(s => s.positionType === positionType && !!s.player).length;
  }, [state.myTeamSlots]);

  const getTotalSlotsByType = useCallback((positionType: PositionType): number => {
    return state.myTeamSlots.filter(s => s.positionType === positionType).length;
  }, [state.myTeamSlots]);

  const generateAITeam = useCallback(() => {
    setState(s => {
      const aiSlots = DRAFT_SLOTS.map(slot => {
        const squad = generateRandomSquadForPosition(slot.positionType);
        const player = squad.players.length > 0
          ? squad.players[Math.floor(Math.random() * squad.players.length)]
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
        id: 'player', name: `${s.playerName || 'You'}'s XI`, nameAr: `فريق ${s.playerName || 'اللاعب'}`,
        flag: '⭐', rating: playerTeamRating, isPlayer: true, isOpponent: false,
        points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      };
      const opponentTeam: GroupTeam = {
        id: 'opponent', name: `${s.opponentName}'s XI`, nameAr: `فريق ${s.opponentName}`,
        flag: '🤖', rating: opponentTeamRating, isPlayer: false, isOpponent: true,
        points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      };

      const historicals = getRandomHistoricalTeams(14);
      const histTeams: GroupTeam[] = historicals.map(ht => ({
        id: ht.id, name: ht.name, nameAr: ht.nameAr, flag: ht.flag, rating: ht.rating,
        isPlayer: false, isOpponent: false, points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
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
              homeTeamId: group[i].id, awayTeamId: group[j].id,
              homeGoals: 0, awayGoals: 0, played: false, events: [], groupIndex: gIdx,
            });
          }
        }
      });

      return { ...s, groups, groupMatches, currentMatchIndex: 0, phase: 'draw' };
    });
  }, []);

  // Silently simulates all AI-vs-AI group matches in one shot
  const simulateAllNonPlayerGroupMatches = useCallback(() => {
    setState(s => {
      let newGroups = s.groups.map(g => [...g]);
      const newMatches = s.groupMatches.map(match => {
        if (match.played) return match;
        if (match.homeTeamId === 'player' || match.awayTeamId === 'player') return match;
        if (match.homeTeamId === 'opponent' || match.awayTeamId === 'opponent') {
          // Also play opponent matches silently
        }
        const allTeams = newGroups.flat();
        const home = allTeams.find(t => t.id === match.homeTeamId);
        const away = allTeams.find(t => t.id === match.awayTeamId);
        if (!home || !away) return match;
        const { homeGoals, awayGoals } = simulateMatch(home.rating, away.rating);
        newGroups = applyMatchToGroups(newGroups, match, homeGoals, awayGoals);
        return { ...match, homeGoals, awayGoals, played: true, events: generateSimpleEvents(match.homeTeamId, match.awayTeamId, homeGoals, awayGoals) };
      });
      return { ...s, groupMatches: newMatches, groups: newGroups };
    });
  }, []);

  // Plays the next player-involved group match with full rich events
  const playNextPlayerGroupMatch = useCallback((): GroupMatch | null => {
    let result: GroupMatch | null = null;
    setState(s => {
      const nextIdx = s.groupMatches.findIndex(m =>
        !m.played && (m.homeTeamId === 'player' || m.awayTeamId === 'player')
      );
      if (nextIdx === -1) return s;

      const match = s.groupMatches[nextIdx];
      const allTeams = s.groups.flat();
      const home = allTeams.find(t => t.id === match.homeTeamId);
      const away = allTeams.find(t => t.id === match.awayTeamId);
      if (!home || !away) return s;

      const { homeGoals, awayGoals } = simulateMatch(home.rating, away.rating);

      // Get player names for event descriptions
      const homePlayerNames = match.homeTeamId === 'player'
        ? s.myTeamSlots.filter(sl => sl.player).map(sl => sl.player!.name)
        : match.homeTeamId === 'opponent'
          ? s.opponentTeamSlots.filter(sl => sl.player).map(sl => sl.player!.name)
          : [];
      const awayPlayerNames = match.awayTeamId === 'player'
        ? s.myTeamSlots.filter(sl => sl.player).map(sl => sl.player!.name)
        : match.awayTeamId === 'opponent'
          ? s.opponentTeamSlots.filter(sl => sl.player).map(sl => sl.player!.name)
          : [];

      const events = generateMatchEventsWithNames(
        match.homeTeamId, match.awayTeamId, homeGoals, awayGoals,
        home.name, away.name, homePlayerNames, awayPlayerNames
      );
      const played: GroupMatch = { ...match, homeGoals, awayGoals, played: true, events };
      result = played;

      const newMatches = s.groupMatches.map((m, i) => i === nextIdx ? played : m);
      const newGroups = applyMatchToGroups(s.groups, match, homeGoals, awayGoals);
      return { ...s, groupMatches: newMatches, groups: newGroups };
    });
    return result;
  }, []);

  // Legacy: plays any next unplayed match
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
      const events = generateSimpleEvents(match.homeTeamId, match.awayTeamId, homeGoals, awayGoals);
      const played: GroupMatch = { ...match, homeGoals, awayGoals, played: true, events };
      result = played;
      return { ...s, groupMatches: s.groupMatches.map((m, i) => i === unplayed ? played : m), groups: applyMatchToGroups(s.groups, match, homeGoals, awayGoals) };
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
      const allTeams: GroupTeam[] = [
        ...s.groups.flat(),
        ...HISTORICAL_TEAMS.map(ht => ({
          id: ht.id, name: ht.name, nameAr: ht.nameAr, flag: ht.flag, rating: ht.rating,
          isPlayer: false, isOpponent: false, points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
        })),
      ];
      const getTeam = (id: string) => allTeams.find(t => t.id === id) ?? s.knockoutTeams.find(t => t.id === id);

      const unplayedIdx = s.knockoutMatches.findIndex(m => !m.played);
      if (unplayedIdx === -1) return s;

      const match = s.knockoutMatches[unplayedIdx];
      const home = getTeam(match.homeTeamId);
      const away = getTeam(match.awayTeamId);
      if (!home || !away) return s;

      let { homeGoals, awayGoals } = simulateMatch(home.rating, away.rating);
      if (homeGoals === awayGoals) { Math.random() < 0.5 ? homeGoals++ : awayGoals++; }

      const homePlayerNames = match.homeTeamId === 'player' ? s.myTeamSlots.filter(sl => sl.player).map(sl => sl.player!.name) : [];
      const awayPlayerNames = match.awayTeamId === 'player' ? s.myTeamSlots.filter(sl => sl.player).map(sl => sl.player!.name) : [];
      const events = generateMatchEventsWithNames(match.homeTeamId, match.awayTeamId, homeGoals, awayGoals, home.name, away.name, homePlayerNames, awayPlayerNames);

      const winnerId = homeGoals > awayGoals ? match.homeTeamId : match.awayTeamId;
      const played: KnockoutMatch = { ...match, homeGoals, awayGoals, played: true, events, winnerId };
      result = played;

      const newKO = s.knockoutMatches.map((m, i) => i === unplayedIdx ? played : m);
      const playedQFs = newKO.filter(m => m.round === 'QF' && m.played);
      const playedSFs = newKO.filter(m => m.round === 'SF' && m.played);

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
      const finalMatch = finalMatches.find(m => m.round === 'F' && m.played);
      if (finalMatch?.winnerId) {
        winner = allTeams.find(t => t.id === finalMatch.winnerId) ?? s.knockoutTeams.find(t => t.id === finalMatch.winnerId) ?? null;
      }

      return { ...s, knockoutMatches: finalMatches, winner };
    });
    return result;
  }, []);

  const resetGame = useCallback(() => {
    setState(s => ({ ...defaultState, playerName: s.playerName, myTeamSlots: initialSlots(), opponentTeamSlots: initialSlots() }));
  }, []);

  // Play a specific knockout match by round + matchIndex
  const playSpecificKnockoutMatch = useCallback((round: string, matchIndex: number): KnockoutMatch | null => {
    let result: KnockoutMatch | null = null;
    setState(s => {
      const allTeams: GroupTeam[] = [
        ...s.groups.flat(),
        ...HISTORICAL_TEAMS.map(ht => ({
          id: ht.id, name: ht.name, nameAr: ht.nameAr, flag: ht.flag, rating: ht.rating,
          isPlayer: false, isOpponent: false, points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
        })),
      ];
      const getTeam = (id: string) => allTeams.find(t => t.id === id) ?? s.knockoutTeams.find(t => t.id === id);

      const targetIdx = s.knockoutMatches.findIndex(m => m.round === round && m.matchIndex === matchIndex && !m.played);
      if (targetIdx === -1) return s;

      const match = s.knockoutMatches[targetIdx];
      const home = getTeam(match.homeTeamId);
      const away = getTeam(match.awayTeamId);
      if (!home || !away) return s;

      let { homeGoals, awayGoals } = simulateMatch(home.rating, away.rating);
      if (homeGoals === awayGoals) { Math.random() < 0.5 ? homeGoals++ : awayGoals++; }

      const homePlayerNames = match.homeTeamId === 'player' ? s.myTeamSlots.filter(sl => sl.player).map(sl => sl.player!.name) : [];
      const awayPlayerNames = match.awayTeamId === 'player' ? s.myTeamSlots.filter(sl => sl.player).map(sl => sl.player!.name) : [];
      const events = generateMatchEventsWithNames(match.homeTeamId, match.awayTeamId, homeGoals, awayGoals, home.name, away.name, homePlayerNames, awayPlayerNames);

      const winnerId = homeGoals > awayGoals ? match.homeTeamId : match.awayTeamId;
      const played: KnockoutMatch = { ...match, homeGoals, awayGoals, played: true, events, winnerId };
      result = played;

      const newKO = s.knockoutMatches.map((m, i) => i === targetIdx ? played : m);
      const playedQFs = newKO.filter(m => m.round === 'QF' && m.played);
      const playedSFs = newKO.filter(m => m.round === 'SF' && m.played);

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
      const finalMatch = finalMatches.find(m => m.round === 'F' && m.played);
      if (finalMatch?.winnerId) {
        winner = allTeams.find(t => t.id === finalMatch.winnerId) ?? s.knockoutTeams.find(t => t.id === finalMatch.winnerId) ?? null;
      }

      return { ...s, knockoutMatches: finalMatches, winner };
    });
    return result;
  }, []);

  const getTournamentPosition = useCallback((): string => {
    if (state.winner?.isPlayer) return '🏆 Champion!';
    const myTeamId = 'player';
    const lostIn = state.knockoutMatches.find(m =>
      m.played && m.winnerId && m.winnerId !== myTeamId &&
      (m.homeTeamId === myTeamId || m.awayTeamId === myTeamId)
    );
    if (!lostIn) return '⚽ Group Stage Exit';
    if (lostIn.round === 'F') return '🥈 Runner-Up';
    if (lostIn.round === 'SF') return '🏅 Semi-Finalist';
    if (lostIn.round === 'QF') return '💪 Quarter-Finalist';
    return '⚽ Group Stage Exit';
  }, [state.knockoutMatches, state.winner]);

  const value: GameContextType = {
    ...state,
    setPhase, setPlayerName, setGameMode, startGame,
    selectPlayerForSlot, selectNextPlayerByPosition,
    isPositionTypeFull, getFilledCountByType, getTotalSlotsByType,
    getCurrentSlotIndex, generateAITeam, setupTournament,
    simulateAllNonPlayerGroupMatches, playNextPlayerGroupMatch, playNextGroupMatch,
    advanceToKnockout, playNextKnockoutMatch, resetGame, generateRoomCode,
    playSpecificKnockoutMatch, getTournamentPosition,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
