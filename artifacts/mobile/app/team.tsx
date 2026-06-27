import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PitchView } from '@/components/PitchView';
import { DraftSlot, useGame } from '@/context/GameContext';
import { useColors } from '@/hooks/useColors';

const POS_TYPE_COLOR: Record<string, string> = {
  GK: '#FF9500',
  DEF: '#34C759',
  MID: '#007AFF',
  FWD: '#FF2D55',
};

export default function TeamScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { myTeamSlots, generateAITeam, setupTournament, startGame } = useGame();

  const filledSlots = myTeamSlots.filter(s => s.player);
  const overallRating = filledSlots.length > 0
    ? Math.round(filledSlots.reduce((sum, s) => sum + (s.player?.rating ?? 0), 0) / filledSlots.length)
    : 0;

  const bestSlot = useMemo<DraftSlot | null>(() => {
    return filledSlots.reduce<DraftSlot | null>((best, s) => {
      if (!best || (s.player?.rating ?? 0) > (best.player?.rating ?? 0)) return s;
      return best;
    }, null);
  }, [filledSlots]);

  const weakestSlot = useMemo<DraftSlot | null>(() => {
    return filledSlots.reduce<DraftSlot | null>((worst, s) => {
      if (!worst || (s.player?.rating ?? 0) < (worst.player?.rating ?? 0)) return s;
      return worst;
    }, null);
  }, [filledSlots]);

  const getRatingColor = (r: number) => {
    if (r >= 90) return colors.primary;
    if (r >= 82) return colors.success;
    if (r >= 75) return colors.accent;
    return colors.destructive;
  };

  function handleConfirm() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    generateAITeam();
    setupTournament();
    router.replace('/draw');
  }

  function handleBack() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    startGame();
    router.replace('/draft');
  }

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
          <Text style={[styles.title, { color: colors.foreground }]}>Your Team</Text>
          <Text style={[styles.titleAr, { color: colors.mutedForeground }]}>فريقك</Text>
        </View>

        {/* Overall rating banner */}
        <View style={[styles.ratingBanner, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.ratingMain}>
            <Text style={[styles.ratingLabel, { color: colors.mutedForeground }]}>TEAM RATING</Text>
            <Text style={[styles.ratingValue, { color: getRatingColor(overallRating) }]}>{overallRating}</Text>
          </View>
          <View style={[styles.ratingDivider, { backgroundColor: colors.border }]} />
          {bestSlot?.player && (
            <View style={styles.ratingInfo}>
              <Text style={[styles.ratingInfoLabel, { color: colors.mutedForeground }]}>⭐ BEST PLAYER</Text>
              <Text style={[styles.ratingInfoName, { color: colors.primary }]} numberOfLines={1}>
                {bestSlot.player.name}
              </Text>
              <Text style={[styles.ratingInfoSub, { color: colors.mutedForeground }]}>
                {bestSlot.label} • {bestSlot.player.rating}
              </Text>
            </View>
          )}
          {weakestSlot?.player && weakestSlot.player.rating < 84 && (
            <>
              <View style={[styles.ratingDivider, { backgroundColor: colors.border }]} />
              <View style={styles.ratingInfo}>
                <Text style={[styles.ratingInfoLabel, { color: colors.destructive }]}>⚠️ WEAKEST</Text>
                <Text style={[styles.ratingInfoName, { color: colors.foreground }]} numberOfLines={1}>
                  {weakestSlot.player.name}
                </Text>
                <Text style={[styles.ratingInfoSub, { color: colors.mutedForeground }]}>
                  {weakestSlot.label} • {weakestSlot.player.rating}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Pitch with player names */}
        <View style={[styles.pitchWrapper, { borderColor: colors.border }]}>
          <PitchView slots={myTeamSlots} showNames />
        </View>

        {/* Player list by position */}
        {(['GK', 'DEF', 'MID', 'FWD'] as const).map(pt => {
          const grouped = filledSlots.filter(s => s.positionType === pt);
          if (grouped.length === 0) return null;
          return (
            <View key={pt} style={[styles.posGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.posGroupHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.posGroupDot, { backgroundColor: POS_TYPE_COLOR[pt] }]} />
                <Text style={[styles.posGroupTitle, { color: colors.foreground }]}>{pt === 'GK' ? 'Goalkeeper' : pt === 'DEF' ? 'Defenders' : pt === 'MID' ? 'Midfielders' : 'Forwards'}</Text>
              </View>
              {grouped.map((slot, i) => (
                <View key={slot.id} style={[styles.playerRow, { borderTopColor: colors.border, borderTopWidth: i > 0 ? 1 : 0 }]}>
                  <Text style={styles.playerFlag}>{slot.player!.flag}</Text>
                  <View style={styles.playerInfo}>
                    <Text style={[styles.playerName, { color: colors.foreground }]} numberOfLines={1}>{slot.player!.name}</Text>
                    <Text style={[styles.playerNameAr, { color: colors.mutedForeground }]} numberOfLines={1}>{slot.player!.nameAr}</Text>
                  </View>
                  <View style={[styles.slotLabel, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.slotLabelText, { color: colors.mutedForeground }]}>{slot.label}</Text>
                  </View>
                  <Text style={[styles.playerRating, { color: getRatingColor(slot.player!.rating) }]}>
                    {slot.player!.rating}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <Ionicons name="trophy" size={22} color={colors.primaryForeground} />
            <Text style={[styles.confirmBtnText, { color: colors.primaryForeground }]}>Confirm Team →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: colors.border }]}
            onPress={handleBack}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={18} color={colors.foreground} />
            <Text style={[styles.backBtnText, { color: colors.foreground }]}>← Back (Reset Draft)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  header: { gap: 2 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 26 },
  titleAr: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  ratingBanner: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  ratingMain: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    gap: 2,
  },
  ratingLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1 },
  ratingValue: { fontFamily: 'Inter_700Bold', fontSize: 42 },
  ratingDivider: { width: 1 },
  ratingInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 3,
  },
  ratingInfoLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 0.5 },
  ratingInfoName: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  ratingInfoSub: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  pitchWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  posGroup: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  posGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderBottomWidth: 1,
  },
  posGroupDot: { width: 8, height: 8, borderRadius: 4 },
  posGroupTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 },
  playerFlag: { fontSize: 20 },
  playerInfo: { flex: 1, gap: 1 },
  playerName: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  playerNameAr: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  slotLabel: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  slotLabelText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  playerRating: { fontFamily: 'Inter_700Bold', fontSize: 18, minWidth: 32, textAlign: 'right' },
  actions: { gap: 10 },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  confirmBtnText: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
  },
  backBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
});
