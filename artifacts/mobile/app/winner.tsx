import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useColors } from '@/hooks/useColors';

function ConfettiPiece({ delay, x, color }: { delay: number; x: number; color: string }) {
  const animY = useRef(new Animated.Value(-20)).current;
  const animX = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;
  const animRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(animY, { toValue: 800, duration: 2500 + Math.random() * 1000, useNativeDriver: true }),
        Animated.timing(animX, { toValue: (Math.random() - 0.5) * 120, duration: 2500 + Math.random() * 1000, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(animOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(animOpacity, { toValue: 0, duration: 800, delay: 1500, useNativeDriver: true }),
        ]),
        Animated.timing(animRotate, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const rotate = animRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] });

  return (
    <Animated.View
      style={{
        position: 'absolute', left: x, top: 0, width: 10, height: 10, borderRadius: 2,
        backgroundColor: color,
        transform: [{ translateY: animY }, { translateX: animX }, { rotate }],
        opacity: animOpacity,
      }}
    />
  );
}

const CONFETTI_COLORS = ['#FFD700', '#FF6B35', '#00C853', '#2196F3', '#E91E63', '#9C27B0'];

export default function WinnerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { winner, playerName, resetGame, knockoutMatches, myTeamSlots, getTournamentPosition } = useGame();
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const trophyBounce = useRef(new Animated.Value(0)).current;

  const [confetti] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1500,
      x: Math.random() * 380,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }))
  );

  const isPlayerWinner = winner?.isPlayer;
  const finalMatch = knockoutMatches.find(m => m.round === 'F');

  // Stats
  const filledSlots = myTeamSlots.filter(s => s.player);
  const teamRating = filledSlots.length > 0
    ? Math.round(filledSlots.reduce((s, slot) => s + (slot.player?.rating ?? 0), 0) / filledSlots.length)
    : 0;

  const bestPlayer = filledSlots.reduce<typeof filledSlots[0] | null>((best, s) => {
    if (!best || (s.player?.rating ?? 0) > (best.player?.rating ?? 0)) return s;
    return best;
  }, null);

  // Tournament stats from all played matches
  const playerMatches = knockoutMatches.filter(m =>
    m.played && (m.homeTeamId === 'player' || m.awayTeamId === 'player')
  );
  const koWins = playerMatches.filter(m => m.winnerId === 'player').length;
  const koLosses = playerMatches.filter(m => m.winnerId && m.winnerId !== 'player').length;
  const goalsScored = playerMatches.reduce((sum, m) =>
    sum + (m.homeTeamId === 'player' ? (m.homeGoals ?? 0) : (m.awayGoals ?? 0)), 0
  );
  const goalsConceded = playerMatches.reduce((sum, m) =>
    sum + (m.homeTeamId === 'player' ? (m.awayGoals ?? 0) : (m.homeGoals ?? 0)), 0
  );

  const position = getTournamentPosition();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 300);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 600);

    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 6 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyBounce, { toValue: -12, duration: 600, useNativeDriver: true }),
        Animated.timing(trophyBounce, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleShare = async () => {
    const shareText = [
      '🏆 World Cup Fantasy Manager',
      '',
      `Result: ${position}`,
      `Player: ${playerName || 'Unknown'}`,
      `Team Rating: ${teamRating}`,
      bestPlayer?.player ? `Best Player: ${bestPlayer.player.name} (${bestPlayer.player.rating})` : '',
      '',
      finalMatch?.homeGoals !== undefined
        ? `Final Score: ${finalMatch.homeGoals} – ${finalMatch.awayGoals}`
        : '',
      `Knockout Record: ${koWins}W – ${koLosses}L`,
      `Goals: ${goalsScored} scored, ${goalsConceded} conceded`,
      '',
      'World Cup 1930–2026 • Play Now! 🌍',
    ].filter(Boolean).join('\n');

    try {
      await Share.share({ message: shareText, title: 'World Cup Fantasy Manager' });
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    } catch (_) {
      // Share dismissed
    }
  };

  const handlePlayAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetGame();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.navyDeep }]}>
      <LinearGradient
        colors={isPlayerWinner ? ['#2a1f00', '#1a1200', '#0A0E1A'] : ['#0a1a0a', '#0A0E1A', '#0A0E1A']}
        style={StyleSheet.absoluteFill}
      />

      {/* Confetti */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {confetti.map(c => (
          <ConfettiPiece key={c.id} delay={c.delay} x={c.x} color={c.color} />
        ))}
      </View>

      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 40),
            paddingBottom: insets.bottom + 30,
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Trophy */}
        <Animated.Text style={[styles.trophy, { transform: [{ translateY: trophyBounce }] }]}>
          🏆
        </Animated.Text>

        {/* Result title */}
        {isPlayerWinner ? (
          <>
            <Text style={[styles.champion, { color: colors.primary }]}>CHAMPION!</Text>
            <Text style={[styles.championAr, { color: colors.primary }]}>بطل العالم!</Text>
            <Text style={[styles.playerLabel, { color: colors.foreground }]}>
              {playerName || 'You'} won the World Cup
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.champion, { color: colors.mutedForeground }]}>{position}</Text>
            <Text style={[styles.playerLabel, { color: colors.foreground }]}>
              {playerName || 'You'}'s tournament run
            </Text>
          </>
        )}

        {/* Winner team */}
        {winner && (
          <View style={[styles.winnerCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <Text style={styles.winnerFlag}>{winner.flag}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.winnerName, { color: colors.foreground }]}>{winner.name}</Text>
              <Text style={[styles.winnerSub, { color: colors.mutedForeground }]}>
                {winner.isPlayer ? 'Your team' : 'AI Champion'} • Rating {winner.rating}
              </Text>
            </View>
            <View style={[styles.crownBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.crownText}>👑</Text>
            </View>
          </View>
        )}

        {/* Share / result card */}
        <View style={[styles.shareCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.shareTitle, { color: colors.foreground }]}>Your Tournament</Text>

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            <StatBox label="Team Rating" value={`${teamRating}`} color={colors.primary} />
            {bestPlayer?.player && (
              <StatBox label="Best Player" value={bestPlayer.player.name.split(' ').slice(-1)[0]} color={colors.success} />
            )}
            <StatBox label="KO Record" value={`${koWins}W-${koLosses}L`} color={colors.foreground} />
            <StatBox label="Goals" value={`${goalsScored}–${goalsConceded}`} color={colors.accent} />
          </View>

          {finalMatch?.homeGoals !== undefined && (
            <View style={[styles.finalScore, { borderTopColor: colors.border }]}>
              <Text style={[styles.finalLabel, { color: colors.mutedForeground }]}>Final Score</Text>
              <Text style={[styles.finalGoals, { color: colors.primary }]}>
                {finalMatch.homeGoals} – {finalMatch.awayGoals}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: shareStatus === 'copied' ? colors.success : colors.muted, borderColor: colors.border }]}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Ionicons name={shareStatus === 'copied' ? 'checkmark-circle' : 'share-social'} size={18} color={shareStatus === 'copied' ? '#fff' : colors.foreground} />
            <Text style={[styles.shareBtnText, { color: shareStatus === 'copied' ? '#fff' : colors.foreground }]}>
              {shareStatus === 'copied' ? 'Shared!' : 'Share Result'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stars */}
        <View style={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={[styles.star, { color: i < (isPlayerWinner ? 5 : koWins + 1) ? colors.primary : colors.muted }]}>★</Text>
          ))}
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[styles.playAgainBtn, { backgroundColor: colors.primary }]}
          onPress={handlePlayAgain}
          activeOpacity={0.85}
        >
          <Ionicons name="refresh" size={22} color={colors.primaryForeground} />
          <Text style={[styles.playAgainText, { color: colors.primaryForeground }]}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.homeBtn, { borderColor: colors.border }]}
          onPress={handlePlayAgain}
          activeOpacity={0.85}
        >
          <Ionicons name="home" size={20} color={colors.foreground} />
          <Text style={[styles.homeBtnText, { color: colors.foreground }]}>Home</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  const colors = useColors();
  return (
    <View style={[statStyles.box, { backgroundColor: colors.muted }]}>
      <Text style={[statStyles.value, { color }]} numberOfLines={1}>{value}</Text>
      <Text style={[statStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  box: { flex: 1, minWidth: '45%', padding: 10, borderRadius: 10, alignItems: 'center', gap: 3 },
  value: { fontFamily: 'Inter_700Bold', fontSize: 15, textAlign: 'center' },
  label: { fontFamily: 'Inter_400Regular', fontSize: 10, textAlign: 'center' },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  trophy: { fontSize: 80 },
  champion: { fontFamily: 'Inter_700Bold', fontSize: 32, letterSpacing: 2, textAlign: 'center' },
  championAr: { fontFamily: 'Inter_700Bold', fontSize: 18, textAlign: 'center' },
  playerLabel: { fontFamily: 'Inter_400Regular', fontSize: 16, textAlign: 'center' },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    width: '100%',
  },
  winnerFlag: { fontSize: 36 },
  winnerName: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  winnerSub: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  crownBadge: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  crownText: { fontSize: 20 },
  shareCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 0,
  },
  shareTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, padding: 14, paddingBottom: 10 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  finalScore: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 2,
  },
  finalLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1 },
  finalGoals: { fontFamily: 'Inter_700Bold', fontSize: 36 },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderTopWidth: 1,
  },
  shareBtnText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  stars: { flexDirection: 'row', gap: 8 },
  star: { fontSize: 28 },
  playAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 10,
    width: '100%',
  },
  playAgainText: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 10,
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
  },
  homeBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16 },
});
