import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GroupTeam, KnockoutMatch, MatchEvent, useGame } from '@/context/GameContext';
import { HISTORICAL_TEAMS } from '@/data/historicalTeams';
import { useColors } from '@/hooks/useColors';

const MATCH_DURATION_MS = 5000;

export default function BracketScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { groups, knockoutTeams, knockoutMatches, winner, playSpecificKnockoutMatch } = useGame();

  const [isSimulating, setIsSimulating] = useState(false);
  const [watchingKey, setWatchingKey] = useState<string | null>(null);
  const [liveEvents, setLiveEvents] = useState<MatchEvent[]>([]);
  const [liveMatch, setLiveMatch] = useState<KnockoutMatch | null>(null);
  const [liveMinute, setLiveMinute] = useState(0);
  const [liveHomeGoals, setLiveHomeGoals] = useState(0);
  const [liveAwayGoals, setLiveAwayGoals] = useState(0);
  const [matchPhase, setMatchPhase] = useState<'live' | 'complete' | null>(null);

  const allTeams: GroupTeam[] = [
    ...groups.flat(),
    ...HISTORICAL_TEAMS.map(ht => ({
      id: ht.id, name: ht.name, nameAr: ht.nameAr, flag: ht.flag, rating: ht.rating,
      isPlayer: false, isOpponent: false, points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
    })),
  ];

  const getTeam = (id: string) => allTeams.find(t => t.id === id) ?? knockoutTeams.find(t => t.id === id);

  const qfMatches = knockoutMatches.filter(m => m.round === 'QF');
  const sfMatches = knockoutMatches.filter(m => m.round === 'SF');
  const finalMatch = knockoutMatches.find(m => m.round === 'F');

  const qfAllDone = qfMatches.length === 4 && qfMatches.every(m => m.played);
  const sfAllDone = sfMatches.length === 2 && sfMatches.every(m => m.played);
  const allDone = !!finalMatch?.played;

  function canWatch(match: KnockoutMatch): boolean {
    if (match.played) return false;
    if (match.round === 'QF') return true;
    if (match.round === 'SF') return qfAllDone;
    if (match.round === 'F') return sfAllDone;
    return false;
  }

  const handleWatch = (match: KnockoutMatch) => {
    if (isSimulating || !canWatch(match)) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const result = playSpecificKnockoutMatch(match.round, match.matchIndex);
    if (!result) return;

    const key = `${match.round}_${match.matchIndex}`;
    setWatchingKey(key);
    setLiveMatch(result);
    setLiveEvents([]);
    setLiveMinute(0);
    setLiveHomeGoals(0);
    setLiveAwayGoals(0);
    setMatchPhase('live');
    setIsSimulating(true);

    const events = result.events;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / MATCH_DURATION_MS);
      const minute = Math.min(90, Math.round(progress * 90));

      setLiveMinute(minute);
      const nowEvents = events.filter(e => e.minute <= minute);
      setLiveEvents(nowEvents);
      setLiveHomeGoals(nowEvents.filter(e => e.type === 'goal' && e.teamId === result.homeTeamId).length);
      setLiveAwayGoals(nowEvents.filter(e => e.type === 'goal' && e.teamId === result.awayTeamId).length);

      if (progress >= 1) {
        clearInterval(timer);
        setLiveMinute(90);
        setLiveEvents(events);
        setLiveHomeGoals(result.homeGoals ?? 0);
        setLiveAwayGoals(result.awayGoals ?? 0);
        setMatchPhase('complete');
        setIsSimulating(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (result.winnerId && getTeam(result.winnerId)?.isPlayer) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }
    }, 50);
  };

  const getEventIcon = (type: MatchEvent['type']) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellowCard': return '🟨';
      case 'miss': return '❌';
      case 'save': return '🧤';
      default: return '•';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Knockout Stage</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>مرحلة الإقصاء</Text>
        </View>

        {/* Live match card — shown ONLY while simulating */}
        {matchPhase === 'live' && liveMatch && (
          <LiveMatchCard
            match={liveMatch}
            events={liveEvents}
            minute={liveMinute}
            homeGoals={liveHomeGoals}
            awayGoals={liveAwayGoals}
            isLive
            getTeam={getTeam}
            getEventIcon={getEventIcon}
            colors={colors}
          />
        )}

        {/* Full time card — shown ONLY after simulation */}
        {matchPhase === 'complete' && liveMatch && (
          <LiveMatchCard
            match={liveMatch}
            events={liveMatch.events}
            minute={90}
            homeGoals={liveMatch.homeGoals ?? 0}
            awayGoals={liveMatch.awayGoals ?? 0}
            isLive={false}
            getTeam={getTeam}
            getEventIcon={getEventIcon}
            colors={colors}
          />
        )}

        {/* Quarter-Finals */}
        <BracketRound
          title="Quarter-Finals" titleAr="ربع النهائي"
          matches={qfMatches}
          getTeam={getTeam}
          colors={colors}
          isSimulating={isSimulating}
          watchingKey={watchingKey}
          canWatch={canWatch}
          onWatch={handleWatch}
        />

        {/* Semi-Finals */}
        {(sfMatches.length > 0 || qfAllDone) && (
          <BracketRound
            title="Semi-Finals" titleAr="نصف النهائي"
            matches={sfMatches}
            getTeam={getTeam}
            colors={colors}
            isSimulating={isSimulating}
            watchingKey={watchingKey}
            canWatch={canWatch}
            onWatch={handleWatch}
            locked={!qfAllDone}
          />
        )}

        {/* Final */}
        {(finalMatch || sfAllDone) && (
          <BracketRound
            title="Final" titleAr="النهائي"
            matches={finalMatch ? [finalMatch] : []}
            getTeam={getTeam}
            colors={colors}
            isSimulating={isSimulating}
            watchingKey={watchingKey}
            canWatch={canWatch}
            onWatch={handleWatch}
            isFinal
            locked={!sfAllDone}
          />
        )}

        {/* Champion card */}
        {winner && (
          <View style={[styles.winnerCard, { backgroundColor: '#FFD70015', borderColor: colors.primary }]}>
            <Text style={styles.winnerCrown}>👑</Text>
            <Text style={[styles.winnerTitle, { color: colors.primary }]}>Champion!</Text>
            <Text style={styles.winnerFlag}>{winner.flag}</Text>
            <Text style={[styles.winnerName, { color: colors.foreground }]}>{winner.name}</Text>
            <TouchableOpacity
              style={[styles.celebrateBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.replace('/winner')}
            >
              <Text style={[styles.celebrateBtnText, { color: colors.primaryForeground }]}>See Results 🏆</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function BracketRound({ title, titleAr, matches, getTeam, colors, isSimulating, watchingKey, canWatch, onWatch, isFinal = false, locked = false }: {
  title: string; titleAr: string;
  matches: KnockoutMatch[];
  getTeam: (id: string) => GroupTeam | undefined;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
  isSimulating: boolean;
  watchingKey: string | null;
  canWatch: (m: KnockoutMatch) => boolean;
  onWatch: (m: KnockoutMatch) => void;
  isFinal?: boolean;
  locked?: boolean;
}) {
  return (
    <View style={styles.roundSection}>
      <View style={styles.roundHeader}>
        <Text style={[styles.roundTitle, { color: isFinal ? colors.primary : colors.foreground }]}>{title}</Text>
        <Text style={[styles.roundTitleAr, { color: colors.mutedForeground }]}>{titleAr}</Text>
        {locked && <View style={[styles.lockedPill, { backgroundColor: colors.muted }]}><Text style={[styles.lockedText, { color: colors.mutedForeground }]}>Locked</Text></View>}
      </View>

      {matches.length === 0 && !locked && (
        <View style={[styles.tbd, { borderColor: colors.border }]}>
          <Text style={[styles.tbdText, { color: colors.mutedForeground }]}>TBD — complete previous round</Text>
        </View>
      )}

      {matches.map((match, i) => {
        const home = getTeam(match.homeTeamId);
        const away = getTeam(match.awayTeamId);
        const key = `${match.round}_${match.matchIndex}`;
        const isWatching = watchingKey === key;
        const watchable = canWatch(match);
        const playerInvolved = home?.isPlayer || away?.isPlayer;

        return (
          <View key={i} style={[
            styles.matchCard,
            {
              backgroundColor: colors.card,
              borderColor: match.played
                ? (match.winnerId === 'player' ? colors.primary : colors.border)
                : isWatching
                  ? colors.accent
                  : colors.border,
              borderWidth: playerInvolved ? 1.5 : 1,
            }
          ]}>
            <MatchTeamRow team={home} goals={match.homeGoals} isWinner={match.winnerId === match.homeTeamId && match.played} colors={colors} />
            <View style={styles.matchMid}>
              <Text style={[styles.vs, { color: colors.mutedForeground }]}>
                {match.played ? 'FT' : 'vs'}
              </Text>
              {watchable && !match.played && !isSimulating && (
                <TouchableOpacity
                  style={[styles.watchBtn, { backgroundColor: playerInvolved ? colors.primary : colors.muted }]}
                  onPress={() => onWatch(match)}
                >
                  <Ionicons name="play" size={12} color={playerInvolved ? colors.primaryForeground : colors.mutedForeground} />
                  <Text style={[styles.watchBtnText, { color: playerInvolved ? colors.primaryForeground : colors.mutedForeground }]}>
                    {playerInvolved ? 'Play' : 'Watch'}
                  </Text>
                </TouchableOpacity>
              )}
              {isWatching && isSimulating && (
                <View style={[styles.watchBtn, { backgroundColor: '#FF3B30' }]}>
                  <Text style={[styles.watchBtnText, { color: '#fff' }]}>LIVE</Text>
                </View>
              )}
            </View>
            <MatchTeamRow team={away} goals={match.awayGoals} isWinner={match.winnerId === match.awayTeamId && match.played} colors={colors} />
          </View>
        );
      })}
    </View>
  );
}

function MatchTeamRow({ team, goals, isWinner, colors }: {
  team: GroupTeam | undefined;
  goals: number | undefined;
  isWinner: boolean;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
}) {
  return (
    <View style={[styles.matchTeamRow, { backgroundColor: isWinner ? colors.success + '15' : 'transparent' }]}>
      <Text style={styles.matchFlag}>{team?.flag ?? '?'}</Text>
      <Text style={[styles.matchTeamName, { color: isWinner ? colors.success : team?.isPlayer ? colors.primary : colors.foreground }]} numberOfLines={1}>
        {team?.name ?? 'TBD'}{team?.isPlayer ? ' ★' : ''}
      </Text>
      {goals !== undefined && (
        <Text style={[styles.matchGoals, { color: isWinner ? colors.success : colors.foreground }]}>{goals}</Text>
      )}
    </View>
  );
}

function LiveMatchCard({ match, events, minute, homeGoals, awayGoals, isLive, getTeam, getEventIcon, colors }: {
  match: KnockoutMatch;
  events: MatchEvent[];
  minute: number;
  homeGoals: number;
  awayGoals: number;
  isLive: boolean;
  getTeam: (id: string) => GroupTeam | undefined;
  getEventIcon: (type: MatchEvent['type']) => string;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
}) {
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);

  return (
    <View style={[styles.liveCard, { backgroundColor: colors.card, borderColor: isLive ? '#FF3B30' : colors.success }]}>
      <View style={[styles.liveHeader, { backgroundColor: isLive ? '#FF3B30' : colors.success }]}>
        <Text style={styles.liveLabel}>{isLive ? `LIVE • ${minute}'` : '⚡ FULL TIME'}</Text>
      </View>
      <View style={styles.liveScore}>
        <View style={styles.liveTeam}>
          <Text style={styles.liveFlag}>{home?.flag ?? '?'}</Text>
          <Text style={[styles.liveName, { color: colors.foreground }]} numberOfLines={1}>{home?.name ?? 'TBD'}</Text>
        </View>
        <Text style={[styles.liveGoals, { color: colors.primary }]}>{homeGoals} – {awayGoals}</Text>
        <View style={styles.liveTeam}>
          <Text style={styles.liveFlag}>{away?.flag ?? '?'}</Text>
          <Text style={[styles.liveName, { color: colors.foreground }]} numberOfLines={1}>{away?.name ?? 'TBD'}</Text>
        </View>
      </View>
      {events.slice(-4).reverse().map((e, i) => (
        <View key={i} style={styles.liveEvent}>
          <Text style={[styles.liveEventMin, { color: colors.mutedForeground }]}>{e.minute}'</Text>
          <Text>{getEventIcon(e.type)}</Text>
          <Text style={[styles.liveEventDesc, { color: e.type === 'goal' ? colors.primary : colors.foreground, fontFamily: e.type === 'goal' ? 'Inter_700Bold' : 'Inter_400Regular' }]} numberOfLines={1}>
            {e.description}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 20 },
  header: { gap: 4 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  roundSection: { gap: 10 },
  roundHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roundTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  roundTitleAr: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  lockedPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  lockedText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  tbd: { borderWidth: 1, borderRadius: 12, padding: 14, alignItems: 'center', borderStyle: 'dashed' },
  tbdText: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  matchCard: { borderRadius: 12, overflow: 'hidden' },
  matchTeamRow: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 8 },
  matchFlag: { fontSize: 20 },
  matchTeamName: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  matchGoals: { fontFamily: 'Inter_700Bold', fontSize: 20, minWidth: 24, textAlign: 'center' },
  matchMid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#252D45',
    backgroundColor: '#0D1525',
  },
  vs: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  watchBtnText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  winnerCard: { alignItems: 'center', padding: 24, borderRadius: 20, borderWidth: 2, gap: 8 },
  winnerCrown: { fontSize: 48 },
  winnerTitle: { fontFamily: 'Inter_700Bold', fontSize: 28 },
  winnerFlag: { fontSize: 48 },
  winnerName: { fontFamily: 'Inter_700Bold', fontSize: 20, textAlign: 'center' },
  celebrateBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  celebrateBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  liveCard: { borderRadius: 14, borderWidth: 2, overflow: 'hidden' },
  liveHeader: { paddingVertical: 7, paddingHorizontal: 12, alignItems: 'center' },
  liveLabel: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#fff', letterSpacing: 1 },
  liveScore: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  liveTeam: { flex: 1, alignItems: 'center', gap: 4 },
  liveFlag: { fontSize: 24 },
  liveName: { fontFamily: 'Inter_600SemiBold', fontSize: 12, textAlign: 'center' },
  liveGoals: { fontFamily: 'Inter_700Bold', fontSize: 30, minWidth: 70, textAlign: 'center' },
  liveEvent: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 4 },
  liveEventMin: { fontFamily: 'Inter_600SemiBold', fontSize: 11, width: 26 },
  liveEventDesc: { fontSize: 12, flex: 1 },
});
