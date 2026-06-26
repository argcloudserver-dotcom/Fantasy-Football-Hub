import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
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
        position: 'absolute',
        left: x,
        top: 0,
        width: 10,
        height: 10,
        borderRadius: 2,
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
  const { winner, playerName, resetGame, knockoutMatches } = useGame();

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

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 40),
            paddingBottom: insets.bottom + 30,
          }
        ]}
      >
        {/* Trophy */}
        <Animated.Text style={[styles.trophy, { transform: [{ translateY: trophyBounce }] }]}>
          🏆
        </Animated.Text>

        {/* Result */}
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
            <Text style={[styles.champion, { color: colors.mutedForeground }]}>Tournament Over</Text>
            <Text style={[styles.playerLabel, { color: colors.foreground }]}>
              Better luck next time!
            </Text>
          </>
        )}

        {/* Winner team */}
        {winner && (
          <View style={[styles.winnerCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <Text style={styles.winnerFlag}>{winner.flag}</Text>
            <View>
              <Text style={[styles.winnerName, { color: colors.foreground }]}>{winner.name}</Text>
              <Text style={[styles.winnerSub, { color: colors.mutedForeground }]}>
                {winner.isPlayer ? 'Your team' : 'AI Team'} • Rating {winner.rating}
              </Text>
            </View>
            <View style={[styles.crownBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.crownText}>👑</Text>
            </View>
          </View>
        )}

        {/* Final score */}
        {finalMatch && finalMatch.homeGoals !== undefined && (
          <View style={[styles.finalScore, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.finalLabel, { color: colors.mutedForeground }]}>Final Score</Text>
            <Text style={[styles.finalGoals, { color: colors.primary }]}>
              {finalMatch.homeGoals} – {finalMatch.awayGoals}
            </Text>
          </View>
        )}

        {/* Stars */}
        <View style={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={[styles.star, { color: i < (isPlayerWinner ? 5 : 2) ? colors.primary : colors.muted }]}>★</Text>
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  trophy: { fontSize: 80 },
  champion: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    letterSpacing: 2,
  },
  championAr: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  playerLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    textAlign: 'center',
  },
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
  winnerName: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  winnerSub: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  crownBadge: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownText: { fontSize: 20 },
  finalScore: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    gap: 4,
  },
  finalLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, letterSpacing: 1 },
  finalGoals: { fontFamily: 'Inter_700Bold', fontSize: 36 },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
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
  },
  homeBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16 },
});
