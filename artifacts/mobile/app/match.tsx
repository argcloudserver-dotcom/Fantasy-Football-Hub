import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { GroupMatch, GroupTeam, MatchEvent, useGame } from '@/context/GameContext';
import { useColors } from '@/hooks/useColors';

const MATCH_DURATION_MS = 30000;
const GROUP_LETTERS = ['A', 'B', 'C', 'D'];

export default function MatchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    groups,
    groupMatches,
    simulateAllNonPlayerGroupMatches,
    playNextPlayerGroupMatch,
    advanceToKnockout,
  } = useGame();

  // State
  const [aiSimulated, setAiSimulated] = useState(false);
  const [activeMatch, setActiveMatch] = useState<GroupMatch | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState<MatchEvent[]>([]);
  const [liveMinute, setLiveMinute] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [liveHomeGoals, setLiveHomeGoals] = useState(0);
  const [liveAwayGoals, setLiveAwayGoals] = useState(0);
  const [showAllResults, setShowAllResults] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allTeams: GroupTeam[] = groups.flat();
  const getTeam = (id: string) => allTeams.find(t => t.id === id);

  // Player's group (group 0 = player's group)
  const playerGroup = groups[0] ?? [];
  const playerGroupIndex = 0;

  // All group matches
  const playerGroupMatches = groupMatches.filter(m => m.groupIndex === playerGroupIndex);
  const playerOwnMatches = groupMatches.filter(
    m => m.homeTeamId === 'player' || m.awayTeamId === 'player'
  );
  const allPlayerMatchesDone = playerOwnMatches.length > 0 && playerOwnMatches.every(m => m.played);

  // Simulate AI matches on mount
  useEffect(() => {
    const t = setTimeout(() => {
      simulateAllNonPlayerGroupMatches();
      setAiSimulated(true);
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopTimer(), []);

  const handlePlayMatch = useCallback(() => {
    if (isSimulating) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const match = playNextPlayerGroupMatch();
    if (!match) return;

    setActiveMatch(match);
    setVisibleEvents([]);
    setLiveMinute(0);
    setCountdown(30);
    setLiveHomeGoals(0);
    setLiveAwayGoals(0);
    setIsSimulating(true);

    const events = match.events;
    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / MATCH_DURATION_MS);
      const minute = Math.min(90, Math.round(progress * 90));
      const remaining = Math.max(0, Math.ceil((MATCH_DURATION_MS - elapsed) / 1000));

      setLiveMinute(minute);
      setCountdown(remaining);

      const nowEvents = events.filter(e => e.minute <= minute);
      setVisibleEvents(nowEvents);

      // Live score = count goals so far
      const hg = nowEvents.filter(e => e.type === 'goal' && e.teamId === match.homeTeamId).length;
      const ag = nowEvents.filter(e => e.type === 'goal' && e.teamId === match.awayTeamId).length;
      setLiveHomeGoals(hg);
      setLiveAwayGoals(ag);

      if (progress >= 1) {
        stopTimer();
        setLiveMinute(90);
        setCountdown(0);
        setVisibleEvents(events);
        setLiveHomeGoals(match.homeGoals);
        setLiveAwayGoals(match.awayGoals);
        setIsSimulating(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 100);
  }, [isSimulating, playNextPlayerGroupMatch, stopTimer]);

  const handleAdvance = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    advanceToKnockout();
    router.replace('/standings');
  };

  const getEventIcon = (type: MatchEvent['type']) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellowCard': return '🟨';
      case 'redCard': return '🔴';
      case 'miss': return '❌';
      case 'save': return '🧤';
      case 'halftime': return '⏱';
      case 'substitution': return '🔄';
      case 'whistle': return '⚡';
      default: return '•';
    }
  };

  // Sorted group standings
  const sortedGroup = [...playerGroup].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return (b.gf - b.ga) - (a.gf - a.ga);
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Group {GROUP_LETTERS[playerGroupIndex]}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Your group stage matches</Text>
        </View>

        {/* Your 3 matches */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Matches</Text>
          {playerOwnMatches.map((match, idx) => {
            const home = getTeam(match.homeTeamId);
            const away = getTeam(match.awayTeamId);
            const isActive = activeMatch?.homeTeamId === match.homeTeamId && activeMatch?.awayTeamId === match.awayTeamId;
            const isPlayed = match.played;

            return (
              <View key={idx} style={[styles.matchRow, { borderTopColor: colors.border, borderTopWidth: idx > 0 ? 1 : 0 }]}>
                <View style={styles.matchStatus}>
                  {isPlayed ? (
                    <Text style={{ fontSize: 18 }}>
                      {(match.homeTeamId === 'player' ? match.homeGoals > match.awayGoals : match.awayGoals > match.homeGoals) ? '✅' : (match.homeGoals === match.awayGoals ? '🟡' : '❌')}
                    </Text>
                  ) : (
                    <Ionicons name="time" size={18} color={colors.mutedForeground} />
                  )}
                </View>
                <View style={styles.matchTeams}>
                  <View style={styles.matchTeamLine}>
                    <Text style={styles.matchFlag}>{home?.flag ?? '⭐'}</Text>
                    <Text style={[styles.matchTeamName, { color: colors.foreground }]} numberOfLines={1}>{home?.name ?? '...'}</Text>
                    {isPlayed && (
                      <Text style={[styles.matchGoal, { color: colors.primary }]}>{match.homeGoals}</Text>
                    )}
                  </View>
                  <View style={styles.matchTeamLine}>
                    <Text style={styles.matchFlag}>{away?.flag ?? '?'}</Text>
                    <Text style={[styles.matchTeamName, { color: colors.foreground }]} numberOfLines={1}>{away?.name ?? '...'}</Text>
                    {isPlayed && (
                      <Text style={[styles.matchGoal, { color: colors.primary }]}>{match.awayGoals}</Text>
                    )}
                  </View>
                </View>
                {!isPlayed && !isSimulating && (
                  <TouchableOpacity
                    style={[styles.playBtn, { backgroundColor: colors.primary }]}
                    onPress={handlePlayMatch}
                  >
                    <Ionicons name="play" size={14} color={colors.primaryForeground} />
                    <Text style={[styles.playBtnText, { color: colors.primaryForeground }]}>Play</Text>
                  </TouchableOpacity>
                )}
                {isActive && isSimulating && (
                  <View style={[styles.livePill, { backgroundColor: '#FF3B30' }]}>
                    <Text style={styles.livePillText}>LIVE</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Live match simulation card */}
        {(isSimulating || (activeMatch && !isSimulating)) && (
          <LiveMatchCard
            match={activeMatch}
            events={visibleEvents}
            minute={liveMinute}
            countdown={countdown}
            homeGoals={liveHomeGoals}
            awayGoals={liveAwayGoals}
            isSimulating={isSimulating}
            getTeam={getTeam}
            getEventIcon={getEventIcon}
            colors={colors}
          />
        )}

        {/* Play button (if not simulating and matches remain) */}
        {!allPlayerMatchesDone && !isSimulating && !activeMatch && (
          <TouchableOpacity
            style={[styles.bigPlayBtn, { backgroundColor: colors.primary }]}
            onPress={handlePlayMatch}
            activeOpacity={0.85}
          >
            <Ionicons name="football" size={22} color={colors.primaryForeground} />
            <Text style={[styles.bigPlayBtnText, { color: colors.primaryForeground }]}>Play Next Match</Text>
          </TouchableOpacity>
        )}

        {/* Group A standings */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Group {GROUP_LETTERS[playerGroupIndex]} Standings</Text>
          <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.thTeam, { color: colors.mutedForeground }]}>Team</Text>
            <Text style={[styles.th, { color: colors.mutedForeground }]}>P</Text>
            <Text style={[styles.th, { color: colors.mutedForeground }]}>W</Text>
            <Text style={[styles.th, { color: colors.mutedForeground }]}>L</Text>
            <Text style={[styles.th, { color: colors.mutedForeground }]}>GD</Text>
            <Text style={[styles.thPts, { color: colors.mutedForeground }]}>Pts</Text>
          </View>
          {sortedGroup.map((team, i) => {
            const qualified = i < 2;
            return (
              <View key={team.id} style={[styles.standingRow, { backgroundColor: qualified ? colors.success + '11' : 'transparent' }]}>
                <View style={[styles.posDot, { backgroundColor: qualified ? colors.success : 'transparent' }]}>
                  <Text style={[styles.posNum, { color: qualified ? '#fff' : colors.mutedForeground }]}>{i + 1}</Text>
                </View>
                <Text style={styles.teamFlagSm}>{team.flag}</Text>
                <Text style={[styles.thTeamName, { color: team.isPlayer ? colors.primary : colors.foreground }]} numberOfLines={1}>
                  {team.name.split(' ').slice(-2).join(' ')}
                  {team.isPlayer ? ' ★' : ''}
                </Text>
                <Text style={[styles.th, { color: colors.mutedForeground }]}>{team.played}</Text>
                <Text style={[styles.th, { color: colors.foreground }]}>{team.won}</Text>
                <Text style={[styles.th, { color: colors.foreground }]}>{team.lost}</Text>
                <Text style={[styles.th, { color: team.gf - team.ga >= 0 ? colors.success : colors.destructive }]}>
                  {team.gf - team.ga > 0 ? `+${team.gf - team.ga}` : team.gf - team.ga}
                </Text>
                <Text style={[styles.thPts, { color: colors.primary }]}>{team.points}</Text>
              </View>
            );
          })}
        </View>

        {/* View all results toggle */}
        <TouchableOpacity
          style={[styles.toggleBtn, { borderColor: colors.border }]}
          onPress={() => setShowAllResults(v => !v)}
        >
          <Ionicons name={showAllResults ? 'chevron-up' : 'chevron-down'} size={16} color={colors.mutedForeground} />
          <Text style={[styles.toggleText, { color: colors.mutedForeground }]}>
            {showAllResults ? 'Hide all group results' : 'View all group results'}
          </Text>
        </TouchableOpacity>

        {showAllResults && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>All Group {GROUP_LETTERS[playerGroupIndex]} Matches</Text>
            {playerGroupMatches.map((m, i) => {
              const h = getTeam(m.homeTeamId);
              const a = getTeam(m.awayTeamId);
              return (
                <View key={i} style={[styles.allMatchRow, { borderTopColor: colors.border, borderTopWidth: i > 0 ? 1 : 0 }]}>
                  <Text style={styles.matchFlag}>{h?.flag}</Text>
                  <Text style={[styles.allMatchName, { color: colors.foreground }]} numberOfLines={1}>{h?.name?.split(' ').slice(-1)[0]}</Text>
                  <Text style={[styles.allMatchScore, { color: m.played ? colors.primary : colors.mutedForeground }]}>
                    {m.played ? `${m.homeGoals} – ${m.awayGoals}` : 'vs'}
                  </Text>
                  <Text style={[styles.allMatchName, { color: colors.foreground, textAlign: 'right' }]} numberOfLines={1}>{a?.name?.split(' ').slice(-1)[0]}</Text>
                  <Text style={styles.matchFlag}>{a?.flag}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Advance to knockout */}
        {allPlayerMatchesDone && !isSimulating && (
          <View style={styles.advanceSection}>
            <View style={[styles.doneCard, { backgroundColor: colors.card, borderColor: colors.success }]}>
              <Text style={styles.doneEmoji}>✅</Text>
              <Text style={[styles.doneTitle, { color: colors.success }]}>Group Stage Complete!</Text>
              <Text style={[styles.doneSub, { color: colors.mutedForeground }]}>انتهت مرحلة المجموعات</Text>
            </View>
            <TouchableOpacity
              style={[styles.advanceBtn, { backgroundColor: colors.primary }]}
              onPress={handleAdvance}
              activeOpacity={0.85}
            >
              <Ionicons name="trophy" size={22} color={colors.primaryForeground} />
              <Text style={[styles.advanceBtnText, { color: colors.primaryForeground }]}>
                View Standings & Advance
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function LiveMatchCard({ match, events, minute, countdown, homeGoals, awayGoals, isSimulating, getTeam, getEventIcon, colors }: {
  match: GroupMatch | null;
  events: MatchEvent[];
  minute: number;
  countdown: number;
  homeGoals: number;
  awayGoals: number;
  isSimulating: boolean;
  getTeam: (id: string) => GroupTeam | undefined;
  getEventIcon: (type: MatchEvent['type']) => string;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
}) {
  if (!match) return null;
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);

  return (
    <View style={[styles.liveCard, { backgroundColor: colors.card, borderColor: isSimulating ? '#FF3B30' : colors.primary }]}>
      {/* Live header */}
      <View style={[styles.liveHeader, { backgroundColor: isSimulating ? '#FF3B30' : colors.success }]}>
        <Text style={styles.liveHeaderText}>
          {isSimulating ? `LIVE • ${minute}'` : '⚡ FULL TIME'}
        </Text>
        {isSimulating && (
          <View style={styles.countdownBadge}>
            <Ionicons name="timer" size={12} color="#fff" />
            <Text style={styles.countdownText}>{countdown}s</Text>
          </View>
        )}
      </View>

      {/* Score */}
      <View style={styles.liveScoreRow}>
        <View style={styles.liveTeamBox}>
          <Text style={styles.liveFlagLarge}>{home?.flag ?? '⭐'}</Text>
          <Text style={[styles.liveTeamName, { color: colors.foreground }]} numberOfLines={2}>{home?.name}</Text>
        </View>
        <View style={styles.liveScoreBox}>
          <Text style={[styles.liveScore, { color: colors.primary }]}>{homeGoals}</Text>
          <Text style={[styles.liveDash, { color: colors.mutedForeground }]}>–</Text>
          <Text style={[styles.liveScore, { color: colors.primary }]}>{awayGoals}</Text>
        </View>
        <View style={styles.liveTeamBox}>
          <Text style={styles.liveFlagLarge}>{away?.flag ?? '?'}</Text>
          <Text style={[styles.liveTeamName, { color: colors.foreground }]} numberOfLines={2}>{away?.name}</Text>
        </View>
      </View>

      {/* Event ticker */}
      {events.length > 0 && (
        <View style={[styles.tickerContainer, { borderTopColor: colors.border }]}>
          {[...events].reverse().slice(0, 8).map((event, i) => (
            <View key={i} style={[styles.tickerRow, { backgroundColor: event.type === 'halftime' || event.type === 'whistle' ? colors.muted + '80' : 'transparent' }]}>
              <Text style={[styles.tickerMin, { color: colors.mutedForeground }]}>{event.minute}'</Text>
              <Text style={styles.tickerIcon}>{getEventIcon(event.type)}</Text>
              <Text style={[styles.tickerDesc, { color: event.type === 'goal' ? colors.primary : event.type === 'halftime' || event.type === 'whistle' ? colors.foreground : colors.mutedForeground }]} numberOfLines={1}>
                {event.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14 },
  header: { gap: 2 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  section: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, padding: 12, paddingBottom: 8 },

  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 },
  matchStatus: { width: 24, alignItems: 'center' },
  matchTeams: { flex: 1, gap: 5 },
  matchTeamLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchFlag: { fontSize: 18 },
  matchTeamName: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13 },
  matchGoal: { fontFamily: 'Inter_700Bold', fontSize: 16, minWidth: 20, textAlign: 'right' },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  playBtnText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  livePill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  livePillText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },

  bigPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  bigPlayBtnText: { fontFamily: 'Inter_700Bold', fontSize: 17 },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    gap: 2,
  },
  thTeam: { flex: 3, fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.5 },
  th: { width: 22, textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 11 },
  thPts: { width: 28, textAlign: 'center', fontFamily: 'Inter_700Bold', fontSize: 12 },
  standingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 7, gap: 4 },
  posDot: { width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  posNum: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  teamFlagSm: { fontSize: 15 },
  thTeamName: { flex: 3, fontFamily: 'Inter_500Medium', fontSize: 12, marginLeft: 2 },

  toggleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, borderRadius: 10, borderWidth: 1 },
  toggleText: { fontFamily: 'Inter_500Medium', fontSize: 13 },

  allMatchRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  allMatchName: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12 },
  allMatchScore: { fontFamily: 'Inter_700Bold', fontSize: 14, minWidth: 40, textAlign: 'center' },

  advanceSection: { gap: 12 },
  doneCard: { alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 2, gap: 6 },
  doneEmoji: { fontSize: 36 },
  doneTitle: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  doneSub: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  advanceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 16, gap: 10 },
  advanceBtnText: { fontFamily: 'Inter_700Bold', fontSize: 17 },

  liveCard: { borderWidth: 2, borderRadius: 14, overflow: 'hidden' },
  liveHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 12 },
  liveHeaderText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#fff', letterSpacing: 1 },
  countdownBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  countdownText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#fff' },
  liveScoreRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, gap: 4 },
  liveTeamBox: { flex: 1, alignItems: 'center', gap: 4 },
  liveFlagLarge: { fontSize: 28 },
  liveTeamName: { fontFamily: 'Inter_600SemiBold', fontSize: 12, textAlign: 'center' },
  liveScoreBox: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 80, justifyContent: 'center' },
  liveScore: { fontFamily: 'Inter_700Bold', fontSize: 36 },
  liveDash: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  tickerContainer: { borderTopWidth: 1, paddingVertical: 6 },
  tickerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 4 },
  tickerMin: { fontFamily: 'Inter_600SemiBold', fontSize: 11, width: 26 },
  tickerIcon: { fontSize: 14, width: 18 },
  tickerDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, flex: 1 },
});
