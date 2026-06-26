import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GroupTeam, useGame } from '@/context/GameContext';
import { useColors } from '@/hooks/useColors';

const GROUP_LETTERS = ['A', 'B', 'C', 'D'];

export default function DrawScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { groups } = useGame();
  const [revealed, setRevealed] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    const revealTimer = setTimeout(() => {
      let idx = 0;
      const interval = setInterval(() => {
        setRevealIndex(idx);
        idx++;
        if (idx >= groups.length) {
          clearInterval(interval);
          setRevealed(true);
        }
      }, 500);
    }, 500);
    return () => clearTimeout(revealTimer);
  }, []);

  const handleStartGroupStage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.replace('/match');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 20), paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, gap: 20 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={[styles.title, { color: colors.primary }]}>Tournament Draw</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>قرعة البطولة</Text>
          </View>

          {/* Groups */}
          {groups.map((group, gIdx) => (
            <GroupCard
              key={gIdx}
              letter={GROUP_LETTERS[gIdx]}
              teams={group}
              revealed={revealIndex >= gIdx}
              colors={colors}
            />
          ))}

          {/* Start button */}
          {revealed && (
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: colors.primary }]}
              onPress={handleStartGroupStage}
              activeOpacity={0.85}
            >
              <Ionicons name="football" size={24} color={colors.primaryForeground} />
              <Text style={[styles.startBtnText, { color: colors.primaryForeground }]}>
                Start Group Stage
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function GroupCard({ letter, teams, revealed, colors }: {
  letter: string;
  teams: GroupTeam[];
  revealed: boolean;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (revealed) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [revealed]);

  if (!revealed) return <View style={{ height: 140, borderRadius: 16, backgroundColor: colors.card, opacity: 0.3 }} />;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
      <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.groupHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.groupLetter, { color: colors.primary }]}>Group {letter}</Text>
          <Text style={[styles.groupSub, { color: colors.mutedForeground }]}>المجموعة {letter}</Text>
        </View>
        {teams.map(team => (
          <View key={team.id} style={styles.teamRow}>
            <Text style={styles.teamFlag}>{team.flag}</Text>
            <View style={styles.teamInfo}>
              <Text style={[styles.teamName, { color: colors.foreground }]}>
                {team.name}
                {team.isPlayer ? ' ⭐' : ''}
              </Text>
            </View>
            <View style={[styles.ratingBadge, { backgroundColor: getRatingBg(team.rating) }]}>
              <Text style={styles.ratingText}>{team.rating}</Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

function getRatingBg(rating: number): string {
  if (rating >= 93) return '#FFD700';
  if (rating >= 88) return '#C0C0C0';
  if (rating >= 83) return '#CD7F32';
  return '#4A5568';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  header: { alignItems: 'center', gap: 6, paddingVertical: 10 },
  trophyIcon: { fontSize: 48 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 26 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  groupCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
  },
  groupLetter: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  groupSub: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  teamFlag: { fontSize: 22 },
  teamInfo: { flex: 1 },
  teamName: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    color: '#1a1a1a',
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
    marginTop: 8,
  },
  startBtnText: { fontFamily: 'Inter_700Bold', fontSize: 18 },
});
