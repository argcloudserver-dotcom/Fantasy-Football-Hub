import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
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

const ARABIC_COMMENTARY = [
  'ما أروع هذا المباراة!',
  'الجمهور في هيجان!',
  'لحظة حاسمة في المباراة!',
  'قوة هجومية رائعة!',
  'ضغط مستمر من الفريق!',
  'دفاع صلب كالصخر!',
  'البطولة على المحك!',
];

export default function MatchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { groups, groupMatches, playNextGroupMatch, advanceToKnockout } = useGame();

  const [currentMatch, setCurrentMatch] = useState<GroupMatch | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState<MatchEvent[]>([]);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [matchDone, setMatchDone] = useState(false);
  const [commentary, setCommentary] = useState('');
  const [allGroupsDone, setAllGroupsDone] = useState(false);

  const scoreFade = useRef(new Animated.Value(1)).current;

  const allTeams = groups.flat();
  const getTeam = (id: string) => allTeams.find(t => t.id === id);

  const unplayedCount = groupMatches.filter(m => !m.played).length;
  const playedCount = groupMatches.filter(m => m.played).length;

  const homeTeam = currentMatch ? getTeam(currentMatch.homeTeamId) : null;
  const awayTeam = currentMatch ? getTeam(currentMatch.awayTeamId) : null;

  useEffect(() => {
    if (unplayedCount === 0 && groupMatches.length > 0) {
      setAllGroupsDone(true);
    }
  }, [groupMatches]);

  const handlePlayMatch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const match = playNextGroupMatch();
    if (!match) return;

    setCurrentMatch(match);
    setVisibleEvents([]);
    setCurrentMinute(0);
    setMatchDone(false);
    setIsSimulating(true);
    setCommentary(ARABIC_COMMENTARY[Math.floor(Math.random() * ARABIC_COMMENTARY.length)]);

    let elapsed = 0;
    const totalTime = 28000;
    const events = match.events;
    const interval = 100;
    const steps = totalTime / interval;

    const timer = setInterval(() => {
      elapsed += interval;
      const minute = Math.min(90, Math.round((elapsed / totalTime) * 90));
      setCurrentMinute(minute);

      const newEvents = events.filter(e => e.minute <= minute && !visibleEvents.find(v => v.minute === e.minute && v.description === e.description));
      if (newEvents.length > 0) {
        setVisibleEvents(prev => {
          const existing = new Set(prev.map(e => `${e.minute}_${e.description}`));
          const toAdd = newEvents.filter(e => !existing.has(`${e.minute}_${e.description}`));
          if (toAdd.length > 0) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          return [...prev, ...toAdd];
        });
      }

      if (elapsed >= totalTime) {
        clearInterval(timer);
        setCurrentMinute(90);
        setVisibleEvents(events);
        setMatchDone(true);
        setIsSimulating(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, interval);

    return () => clearInterval(timer);
  };

  const handleAdvance = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    advanceToKnockout();
    router.replace('/standings');
  };

  const getEventIcon = (type: MatchEvent['type']) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellowCard': return '🟨';
      case 'redCard': return '🟥';
      case 'miss': return '❌';
      case 'save': return '🧤';
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Group Stage</Text>
          <View style={[styles.progressPill, { backgroundColor: colors.card }]}>
            <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
              {playedCount}/{groupMatches.length}
            </Text>
          </View>
        </View>

        {/* Match card */}
        {currentMatch && homeTeam && awayTeam && (
          <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: currentMatch ? colors.primary : colors.border }]}>
            <View style={styles.scoreRow}>
              <View style={styles.teamBox}>
                <Text style={styles.teamFlag}>{homeTeam.flag}</Text>
                <Text style={[styles.teamName, { color: colors.foreground }]} numberOfLines={2}>{homeTeam.name}</Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={[styles.score, { color: colors.primary }]}>
                  {matchDone || !isSimulating ? (currentMatch.homeGoals ?? '0') : '–'}
                  {' : '}
                  {matchDone || !isSimulating ? (currentMatch.awayGoals ?? '0') : '–'}
                </Text>
                <Text style={[styles.minute, { color: colors.mutedForeground }]}>
                  {isSimulating ? `${currentMinute}'` : matchDone ? "FT" : ""}
                </Text>
              </View>
              <View style={styles.teamBox}>
                <Text style={styles.teamFlag}>{awayTeam.flag}</Text>
                <Text style={[styles.teamName, { color: colors.foreground }]} numberOfLines={2}>{awayTeam.name}</Text>
              </View>
            </View>

            {/* Match events ticker */}
            {visibleEvents.length > 0 && (
              <View style={[styles.tickerContainer, { borderTopColor: colors.border }]}>
                {[...visibleEvents].reverse().slice(0, 6).map((event, i) => (
                  <View key={i} style={styles.eventRow}>
                    <Text style={[styles.eventMinute, { color: colors.mutedForeground }]}>{event.minute}'</Text>
                    <Text style={styles.eventIcon}>{getEventIcon(event.type)}</Text>
                    <View style={styles.eventTeam}>
                      <Text style={styles.eventTeamFlag}>
                        {event.teamId === currentMatch.homeTeamId ? homeTeam.flag : awayTeam.flag}
                      </Text>
                    </View>
                    <Text style={[styles.eventDesc, { color: colors.foreground }]} numberOfLines={1}>
                      {event.description}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Arabic commentary */}
            {isSimulating && commentary && (
              <View style={[styles.commentaryBox, { backgroundColor: colors.muted }]}>
                <Text style={[styles.commentaryText, { color: colors.mutedForeground }]}>{commentary}</Text>
              </View>
            )}
          </View>
        )}

        {/* Play button */}
        {!allGroupsDone && !isSimulating && (
          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
            onPress={handlePlayMatch}
            activeOpacity={0.85}
          >
            <Ionicons name="play" size={22} color={colors.primaryForeground} />
            <Text style={[styles.playBtnText, { color: colors.primaryForeground }]}>
              {currentMatch ? 'Next Match' : 'Play First Match'}
            </Text>
          </TouchableOpacity>
        )}

        {isSimulating && (
          <View style={[styles.simulatingBtn, { backgroundColor: colors.muted }]}>
            <Animated.View>
              <Ionicons name="football" size={22} color={colors.mutedForeground} />
            </Animated.View>
            <Text style={[styles.simulatingText, { color: colors.mutedForeground }]}>Simulating...</Text>
          </View>
        )}

        {/* Standings preview */}
        {playedCount > 0 && groups.length > 0 && (
          <View style={[styles.standingsPreview, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.standingsTitle, { color: colors.foreground }]}>Group A Preview</Text>
            {[...groups[0]].sort((a, b) => b.points - a.points).map((team, i) => (
              <View key={team.id} style={styles.standingRow}>
                <Text style={[styles.standingPos, { color: i < 2 ? colors.success : colors.mutedForeground }]}>{i + 1}</Text>
                <Text style={styles.standingFlag}>{team.flag}</Text>
                <Text style={[styles.standingName, { color: colors.foreground }]} numberOfLines={1}>{team.name}</Text>
                <Text style={[styles.standingPts, { color: colors.primary }]}>{team.points}pts</Text>
              </View>
            ))}
          </View>
        )}

        {/* Advance to knockout */}
        {allGroupsDone && (
          <View style={styles.advanceSection}>
            <View style={[styles.allDoneCard, { backgroundColor: colors.card, borderColor: colors.success }]}>
              <Text style={styles.doneIcon}>✅</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  progressPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  progressText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  scoreCard: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  teamBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  teamFlag: { fontSize: 28 },
  teamName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },
  scoreBox: { alignItems: 'center', gap: 4, minWidth: 80 },
  score: { fontFamily: 'Inter_700Bold', fontSize: 32 },
  minute: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  tickerContainer: {
    borderTopWidth: 1,
    padding: 10,
    gap: 6,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventMinute: { fontFamily: 'Inter_600SemiBold', fontSize: 11, width: 26 },
  eventIcon: { fontSize: 14 },
  eventTeam: { width: 20 },
  eventTeamFlag: { fontSize: 14 },
  eventDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, flex: 1 },
  commentaryBox: {
    margin: 10,
    marginTop: 0,
    padding: 10,
    borderRadius: 8,
  },
  commentaryText: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'right' },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  playBtnText: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  simulatingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  simulatingText: { fontFamily: 'Inter_500Medium', fontSize: 15 },
  standingsPreview: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  standingsTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  standingPos: { fontFamily: 'Inter_700Bold', fontSize: 13, width: 16 },
  standingFlag: { fontSize: 16 },
  standingName: { fontFamily: 'Inter_400Regular', fontSize: 13, flex: 1 },
  standingPts: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  advanceSection: { gap: 12 },
  allDoneCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 6,
  },
  doneIcon: { fontSize: 36 },
  doneTitle: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  doneSub: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  advanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  advanceBtnText: { fontFamily: 'Inter_700Bold', fontSize: 17 },
});
