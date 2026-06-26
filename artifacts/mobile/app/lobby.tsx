import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useColors } from '@/hooks/useColors';

export default function LobbyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { playerName, gameMode, roomCode, startGame, opponentName } = useGame();
  const [playerReady, setPlayerReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  // Simulate AI opponent joining
  useEffect(() => {
    if (gameMode === 'vsAI') {
      const timer = setTimeout(() => setOpponentReady(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [gameMode]);

  useEffect(() => {
    if (playerReady && opponentReady) {
      let c = 3;
      setCountdown(c);
      const interval = setInterval(() => {
        c--;
        if (c === 0) {
          clearInterval(interval);
          startGame();
          router.replace('/draft');
        } else {
          setCountdown(c);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [playerReady, opponentReady]);

  const handleReady = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPlayerReady(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 20), paddingBottom: insets.bottom + 20 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {gameMode === 'vsAI' ? 'VS AI' : 'Multiplayer Lobby'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Room Code */}
        {gameMode === 'vsPlayer' && roomCode && (
          <View style={[styles.codeCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <Text style={[styles.codeLabel, { color: colors.mutedForeground }]}>Room Code • رمز الغرفة</Text>
            <Text style={[styles.code, { color: colors.primary }]}>{roomCode}</Text>
            <Text style={[styles.codeHint, { color: colors.mutedForeground }]}>Share with your friend</Text>
          </View>
        )}

        {/* Players */}
        <View style={styles.players}>
          <PlayerSlot
            name={playerName || 'You'}
            isReady={playerReady}
            isYou
            colors={colors}
          />

          <View style={styles.vsContainer}>
            <Text style={[styles.vs, { color: colors.primary }]}>VS</Text>
          </View>

          <PlayerSlot
            name={gameMode === 'vsAI' ? 'AI Manager' : opponentName || 'Waiting...'}
            isReady={opponentReady}
            isYou={false}
            colors={colors}
          />
        </View>

        {/* Countdown overlay */}
        {countdown !== null && (
          <View style={[styles.countdownOverlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <Text style={styles.countdownText}>Starting game...</Text>
          </View>
        )}

        {/* Ready Button */}
        {!playerReady && !countdown && (
          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <TouchableOpacity
              style={[styles.readyBtn, { backgroundColor: colors.primary }]}
              onPress={handleReady}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={28} color={colors.primaryForeground} />
              <Text style={[styles.readyText, { color: colors.primaryForeground }]}>Ready!</Text>
              <Text style={[styles.readyAr, { color: colors.primaryForeground }]}>جاهز!</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {playerReady && !opponentReady && (
          <View style={[styles.waitingContainer, { backgroundColor: colors.card }]}>
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <Ionicons name="time" size={24} color={colors.mutedForeground} />
            </Animated.View>
            <Text style={[styles.waitingText, { color: colors.mutedForeground }]}>
              Waiting for opponent...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function PlayerSlot({ name, isReady, isYou, colors }: {
  name: string;
  isReady: boolean;
  isYou: boolean;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
}) {
  return (
    <View style={[styles.playerSlot, { backgroundColor: colors.card, borderColor: isReady ? colors.success : colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: isYou ? colors.primary : colors.muted }]}>
        <Text style={styles.avatarIcon}>{isYou ? '⭐' : '🤖'}</Text>
      </View>
      <Text style={[styles.playerName, { color: colors.foreground }]}>{name}</Text>
      <View style={[styles.statusBadge, { backgroundColor: isReady ? colors.success + '33' : colors.muted }]}>
        <View style={[styles.statusDot, { backgroundColor: isReady ? colors.success : colors.mutedForeground }]} />
        <Text style={[styles.statusText, { color: isReady ? colors.success : colors.mutedForeground }]}>
          {isReady ? 'Ready' : 'Not Ready'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, gap: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 4 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  codeCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 4,
  },
  codeLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, letterSpacing: 1 },
  code: {
    fontFamily: 'Inter_700Bold',
    fontSize: 40,
    letterSpacing: 8,
  },
  codeHint: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  players: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  playerSlot: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 10,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: { fontSize: 28 },
  playerName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  vsContainer: { alignItems: 'center' },
  vs: { fontFamily: 'Inter_700Bold', fontSize: 28 },
  readyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  readyText: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  readyAr: { fontFamily: 'Inter_400Regular', fontSize: 16 },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  waitingText: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    zIndex: 100,
  },
  countdownNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 80,
    color: '#FFD700',
  },
  countdownText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    color: '#FFFFFF',
  },
});
