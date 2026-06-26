import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
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

export default function BracketScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { groups, knockoutTeams, knockoutMatches, winner, playNextKnockoutMatch } = useGame();

  const [isSimulating, setIsSimulating] = useState(false);
  const [liveEvents, setLiveEvents] = useState<MatchEvent[]>([]);
  const [liveMatch, setLiveMatch] = useState<KnockoutMatch | null>(null);
  const [liveMinute, setLiveMinute] = useState(0);

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

  const nextUnplayed = knockoutMatches.find(m => !m.played);
  const allDone = !nextUnplayed && knockoutMatches.length > 0;

  const handlePlayNext = () => {
    if (isSimulating) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const match = playNextKnockoutMatch();
    if (!match) return;

    setLiveMatch(match);
    setLiveEvents([]);
    setLiveMinute(0);
    setIsSimulating(true);

    let elapsed = 0;
    const totalTime = 20000;
    const events = match.events;
    const interval = 100;

    const timer = setInterval(() => {
      elapsed += interval;
      const minute = Math.min(90, Math.round((elapsed / totalTime) * 90));
      setLiveMinute(minute);
      const newEvents = events.filter(e => e.minute <= minute);
      setLiveEvents(newEvents);

      if (elapsed >= totalTime) {
        clearInterval(timer);
        setLiveMinute(90);
        setLiveEvents(events);
        setIsSimulating(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (match.winnerId && getTeam(match.winnerId)?.isPlayer) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }
    }, interval);
  };

  const handleWinner = () => {
    router.replace('/winner');
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

        {/* Live match */}
        {(isSimulating || liveMatch) && (
          <LiveMatchCard
            match={liveMatch}
            events={liveEvents}
            minute={liveMinute}
            isSimulating={isSimulating}
            getTeam={getTeam}
            getEventIcon={getEventIcon}
            colors={colors}
          />
        )}

        {/* QF */}
        <RoundSection title="Quarter-Finals" titleAr="ربع النهائي" matches={qfMatches} getTeam={getTeam} colors={colors} />

        {/* SF */}
        {sfMatches.length > 0 && (
          <RoundSection title="Semi-Finals" titleAr="نصف النهائي" matches={sfMatches} getTeam={getTeam} colors={colors} />
        )}

        {/* Final */}
        {finalMatch && (
          <RoundSection title="Final" titleAr="النهائي" matches={[finalMatch]} getTeam={getTeam} colors={colors} isFinal />
        )}

        {/* Winner */}
        {winner && (
          <View style={[styles.winnerCard, { backgroundColor: '#FFD70022', borderColor: colors.primary }]}>
            <Text style={styles.winnerCrown}>👑</Text>
            <Text style={[styles.winnerTitle, { color: colors.primary }]}>Champion!</Text>
            <Text style={styles.winnerFlag}>{winner.flag}</Text>
            <Text style={[styles.winnerName, { color: colors.foreground }]}>{winner.name}</Text>
            <TouchableOpacity
              style={[styles.celebrateBtn, { backgroundColor: colors.primary }]}
              onPress={handleWinner}
            >
              <Text style={[styles.celebrateBtnText, { color: colors.primaryForeground }]}>See Celebration</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Play button */}
        {!allDone && !winner && (
          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: isSimulating ? colors.muted : colors.primary }]}
            onPress={handlePlayNext}
            disabled={isSimulating}
            activeOpacity={0.85}
          >
            <Ionicons name={isSimulating ? 'time' : 'play'} size={22} color={isSimulating ? colors.mutedForeground : colors.primaryForeground} />
            <Text style={[styles.playBtnText, { color: isSimulating ? colors.mutedForeground : colors.primaryForeground }]}>
              {isSimulating ? 'Simulating...' : nextUnplayed ? `Play ${nextUnplayed.round}` : 'Continue'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

function RoundSection({ title, titleAr, matches, getTeam, colors, isFinal = false }: {
  title: string;
  titleAr: string;
  matches: KnockoutMatch[];
  getTeam: (id: string) => GroupTeam | undefined;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
  isFinal?: boolean;
}) {
  return (
    <View style={styles.roundSection}>
      <View style={styles.roundHeader}>
        <Text style={[styles.roundTitle, { color: isFinal ? colors.primary : colors.foreground }]}>{title}</Text>
        <Text style={[styles.roundTitleAr, { color: colors.mutedForeground }]}>{titleAr}</Text>
      </View>
      {matches.map((match, i) => {
        const home = getTeam(match.homeTeamId);
        const away = getTeam(match.awayTeamId);
        return (
          <View key={i} style={[styles.matchCard, { backgroundColor: colors.card, borderColor: match.played ? colors.border : colors.muted }]}>
            <MatchTeamRow team={home} goals={match.homeGoals} isWinner={match.winnerId === match.homeTeamId} colors={colors} />
            <View style={styles.matchDivider}>
              <Text style={[styles.vs, { color: colors.mutedForeground }]}>
                {match.played ? 'FT' : 'vs'}
              </Text>
            </View>
            <MatchTeamRow team={away} goals={match.awayGoals} isWinner={match.winnerId === match.awayTeamId} colors={colors} />
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
    <View style={[styles.matchTeamRow, { backgroundColor: isWinner ? `${colors.success}11` : 'transparent' }]}>
      <Text style={styles.matchFlag}>{team?.flag ?? '?'}</Text>
      <Text style={[styles.matchTeamName, { color: isWinner ? colors.success : colors.foreground }]} numberOfLines={1}>
        {team?.name ?? 'TBD'}
      </Text>
      {goals !== undefined && (
        <Text style={[styles.matchGoals, { color: isWinner ? colors.success : colors.foreground }]}>{goals}</Text>
      )}
    </View>
  );
}

function LiveMatchCard({ match, events, minute, isSimulating, getTeam, getEventIcon, colors }: {
  match: KnockoutMatch | null;
  events: MatchEvent[];
  minute: number;
  isSimulating: boolean;
  getTeam: (id: string) => GroupTeam | undefined;
  getEventIcon: (type: MatchEvent['type']) => string;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
}) {
  if (!match) return null;
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);
  const homeGoals = events.filter(e => e.type === 'goal' && e.teamId === match.homeTeamId).length;
  const awayGoals = events.filter(e => e.type === 'goal' && e.teamId === match.awayTeamId).length;

  return (
    <View style={[styles.liveCard, { backgroundColor: colors.card, borderColor: colors.accent }]}>
      <View style={[styles.liveHeader, { backgroundColor: colors.accent }]}>
        <Text style={styles.liveLabel}>{isSimulating ? `LIVE • ${minute}'` : 'FULL TIME'}</Text>
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
      {events.slice(-3).reverse().map((e, i) => (
        <View key={i} style={styles.liveEvent}>
          <Text style={[styles.liveEventMin, { color: colors.mutedForeground }]}>{e.minute}'</Text>
          <Text>{getEventIcon(e.type)}</Text>
          <Text style={[styles.liveEventDesc, { color: colors.foreground }]} numberOfLines={1}>{e.description}</Text>
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
  roundHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  roundTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  roundTitleAr: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  matchCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  matchTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
  },
  matchFlag: { fontSize: 20 },
  matchTeamName: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14 },
  matchGoals: { fontFamily: 'Inter_700Bold', fontSize: 18, minWidth: 24, textAlign: 'center' },
  matchDivider: { height: 1, backgroundColor: '#252D45', marginHorizontal: 10 },
  vs: { textAlign: 'center', fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  winnerCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    gap: 8,
  },
  winnerCrown: { fontSize: 48 },
  winnerTitle: { fontFamily: 'Inter_700Bold', fontSize: 28 },
  winnerFlag: { fontSize: 48 },
  winnerName: { fontFamily: 'Inter_700Bold', fontSize: 20, textAlign: 'center' },
  celebrateBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  celebrateBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  playBtnText: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  liveCard: {
    borderRadius: 14,
    borderWidth: 2,
    overflow: 'hidden',
  },
  liveHeader: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  liveLabel: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#fff', letterSpacing: 1 },
  liveScore: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  liveTeam: { flex: 1, alignItems: 'center', gap: 4 },
  liveFlag: { fontSize: 24 },
  liveName: { fontFamily: 'Inter_600SemiBold', fontSize: 12, textAlign: 'center' },
  liveGoals: { fontFamily: 'Inter_700Bold', fontSize: 28, minWidth: 70, textAlign: 'center' },
  liveEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  liveEventMin: { fontFamily: 'Inter_600SemiBold', fontSize: 11, width: 26 },
  liveEventDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, flex: 1 },
});
