import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlayerCard } from '@/components/PlayerCard';
import { PitchView } from '@/components/PitchView';
import { DRAFT_SLOTS, useGame } from '@/context/GameContext';
import { Player, Squad, generateRandomSquadForPosition } from '@/data/players';
import { useColors } from '@/hooks/useColors';

export default function DraftScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { myTeamSlots, selectPlayerForSlot, getCurrentSlotIndex, generateAITeam, setupTournament } = useGame();
  const [currentSquad, setCurrentSquad] = useState<Squad | null>(null);
  const [isDraftComplete, setIsDraftComplete] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentSlotIndex = getCurrentSlotIndex();
  const currentSlot = currentSlotIndex >= 0 ? DRAFT_SLOTS[currentSlotIndex] : null;
  const filledCount = myTeamSlots.filter(s => s.player).length;

  useEffect(() => {
    if (currentSlot) {
      loadNewSquad();
    } else {
      setIsDraftComplete(true);
    }
  }, [currentSlotIndex]);

  function loadNewSquad() {
    if (!currentSlot) return;
    const squad = generateRandomSquadForPosition(currentSlot.positionType);
    setCurrentSquad(squad);
    slideAnim.setValue(50);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  }

  function handleSelectPlayer(player: Player) {
    if (!currentSlot) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    selectPlayerForSlot(currentSlot.id, player);
  }

  function handleStartTournament() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    generateAITeam();
    setupTournament();
    router.replace('/draw');
  }

  const eligiblePlayers = useMemo(() => {
    if (!currentSquad || !currentSlot) return [];
    return currentSquad.players.filter(p => p.positionType === currentSlot.positionType);
  }, [currentSquad, currentSlot]);

  const positionLabel = currentSlot
    ? currentSlot.positionType === 'GK' ? 'Goalkeeper'
      : currentSlot.positionType === 'DEF' ? 'Defender'
        : currentSlot.positionType === 'MID' ? 'Midfielder'
          : 'Forward'
    : '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Draft Your Team</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>اختر فريقك</Text>
          </View>
          <View style={[styles.progressBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.progressNum, { color: colors.primary }]}>{filledCount}</Text>
            <Text style={[styles.progressOf, { color: colors.mutedForeground }]}>/11</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
          <Animated.View
            style={[styles.progressFill, { backgroundColor: colors.primary, width: `${(filledCount / 11) * 100}%` }]}
          />
        </View>

        {/* Pitch */}
        <PitchView
          slots={myTeamSlots}
          activeSlotId={currentSlot?.id}
        />

        {/* Draft complete */}
        {isDraftComplete ? (
          <View style={styles.completeSection}>
            <View style={[styles.completeCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
              <Text style={styles.completeIcon}>🏆</Text>
              <Text style={[styles.completeTitle, { color: colors.primary }]}>Team Complete!</Text>
              <Text style={[styles.completeSub, { color: colors.mutedForeground }]}>اكتمل فريقك • فريقك جاهز للبطولة</Text>
            </View>
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: colors.primary }]}
              onPress={handleStartTournament}
              activeOpacity={0.85}
            >
              <Ionicons name="trophy" size={24} color={colors.primaryForeground} />
              <Text style={[styles.startBtnText, { color: colors.primaryForeground }]}>
                Start Tournament
              </Text>
              <Ionicons name="chevron-forward" size={22} color={colors.primaryForeground} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Current pick info */}
            {currentSquad && currentSlot && (
              <View style={[styles.pickHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.pickInfo}>
                  <Text style={styles.squadFlag}>{currentSquad.flag}</Text>
                  <View>
                    <Text style={[styles.squadName, { color: colors.foreground }]}>
                      {currentSquad.nationality}{currentSquad.year > 0 ? ` ${currentSquad.year}` : ''}
                    </Text>
                    <Text style={[styles.pickLabel, { color: colors.mutedForeground }]}>
                      Pick your <Text style={{ color: colors.primary }}>{positionLabel}</Text>
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={loadNewSquad}
                  style={[styles.shuffleBtn, { backgroundColor: colors.muted }]}
                >
                  <Ionicons name="shuffle" size={18} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            )}

            {/* Players list */}
            <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
              {eligiblePlayers.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onSelect={handleSelectPlayer}
                  disabled={false}
                />
              ))}
              {eligiblePlayers.length === 0 && (
                <TouchableOpacity
                  style={[styles.emptySquad, { backgroundColor: colors.card }]}
                  onPress={loadNewSquad}
                >
                  <Ionicons name="refresh" size={24} color={colors.mutedForeground} />
                  <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                    No eligible players — tap to try another squad
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  progressNum: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  progressOf: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: 4, borderRadius: 2 },
  pickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  squadFlag: { fontSize: 28 },
  squadName: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  pickLabel: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  shuffleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySquad: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  completeSection: { gap: 16 },
  completeCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    gap: 8,
  },
  completeIcon: { fontSize: 48 },
  completeTitle: { fontFamily: 'Inter_700Bold', fontSize: 24 },
  completeSub: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center' },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  startBtnText: { fontFamily: 'Inter_700Bold', fontSize: 18 },
});
