import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PitchView } from '@/components/PitchView';
import { PositionType, useGame } from '@/context/GameContext';
import { Player, Squad, generateFullNationalTeamSquad } from '@/data/players';
import { useColors } from '@/hooks/useColors';

const POS_TYPE_LABEL: Record<PositionType, string> = {
  GK: 'Goalkeeper',
  DEF: 'Defender',
  MID: 'Midfielder',
  FWD: 'Forward',
};

const POS_TYPE_COLOR: Record<PositionType, string> = {
  GK: '#FF9500',
  DEF: '#34C759',
  MID: '#007AFF',
  FWD: '#FF2D55',
};

const ALL_POS_TYPES: PositionType[] = ['GK', 'DEF', 'MID', 'FWD'];

function getPlayerBio(player: Player): string {
  const era = player.year > 0 ? `${player.year} World Cup` : 'All-time legend';
  if (player.rating >= 98) return `Widely considered one of the greatest players in history. ${era}.`;
  if (player.rating >= 94) return `World-class talent who dominated the ${era}.`;
  if (player.rating >= 90) return `Elite ${POS_TYPE_LABEL[player.positionType].toLowerCase()} and key player at the ${era}.`;
  if (player.rating >= 85) return `Reliable ${POS_TYPE_LABEL[player.positionType].toLowerCase()} for ${player.nationality} at the ${era}.`;
  return `Important squad player for ${player.nationality} at the ${era}.`;
}

export default function DraftScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    myTeamSlots,
    selectNextPlayerByPosition,
    isPositionTypeFull,
    getFilledCountByType,
    getTotalSlotsByType,
  } = useGame();

  const [currentSquad, setCurrentSquad] = useState<Squad | null>(null);
  const [isDraftComplete, setIsDraftComplete] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const filledCount = myTeamSlots.filter(s => s.player).length;
  const allFull = filledCount === 11;

  useEffect(() => {
    if (allFull) setIsDraftComplete(true);
  }, [allFull]);

  useEffect(() => {
    loadNewSquad();
  }, []);

  function loadNewSquad() {
    const squad = generateFullNationalTeamSquad();
    setCurrentSquad(squad);
    slideAnim.setValue(30);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 90, friction: 9 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  }

  function handleTapPlayer(player: Player) {
    if (isPositionTypeFull(player.positionType)) return;
    setSelectedPlayer(player);
  }

  function handlePickFromModal() {
    if (!selectedPlayer) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = selectNextPlayerByPosition(selectedPlayer);
    setSelectedPlayer(null);
    if (success) {
      setTimeout(() => loadNewSquad(), 300);
    }
  }

  function handleViewTeam() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/team' as any);
  }

  const squadLabel = currentSquad
    ? currentSquad.year > 0
      ? `${currentSquad.flag} ${currentSquad.nationality} ${currentSquad.year}`
      : `${currentSquad.flag} ${currentSquad.nationality}`
    : '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Player pop-up modal */}
      <Modal
        visible={!!selectedPlayer}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPlayer(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {selectedPlayer && (
              <>
                {/* Rating circle */}
                <View style={[styles.modalRating, { backgroundColor: POS_TYPE_COLOR[selectedPlayer.positionType] }]}>
                  <Text style={styles.modalRatingNum}>{selectedPlayer.rating}</Text>
                </View>

                {/* Flag + Names */}
                <Text style={styles.modalFlag}>{selectedPlayer.flag}</Text>
                <Text style={[styles.modalName, { color: colors.foreground }]}>{selectedPlayer.name}</Text>
                <Text style={[styles.modalNameAr, { color: colors.mutedForeground }]}>{selectedPlayer.nameAr}</Text>

                {/* Badges row */}
                <View style={styles.modalBadges}>
                  <View style={[styles.modalBadge, { backgroundColor: POS_TYPE_COLOR[selectedPlayer.positionType] + '22', borderColor: POS_TYPE_COLOR[selectedPlayer.positionType] }]}>
                    <Text style={[styles.modalBadgeText, { color: POS_TYPE_COLOR[selectedPlayer.positionType] }]}>
                      {selectedPlayer.position}
                    </Text>
                  </View>
                  {selectedPlayer.year > 0 && (
                    <View style={[styles.modalBadge, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                      <Text style={[styles.modalBadgeText, { color: colors.mutedForeground }]}>{selectedPlayer.year}</Text>
                    </View>
                  )}
                  <View style={[styles.modalBadge, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                    <Text style={[styles.modalBadgeText, { color: colors.mutedForeground }]}>{selectedPlayer.nationality}</Text>
                  </View>
                </View>

                {/* Bio */}
                <Text style={[styles.modalBio, { color: colors.mutedForeground }]}>
                  {getPlayerBio(selectedPlayer)}
                </Text>

                {/* Buttons */}
                <TouchableOpacity
                  style={[styles.modalPickBtn, { backgroundColor: POS_TYPE_COLOR[selectedPlayer.positionType] }]}
                  onPress={handlePickFromModal}
                >
                  <Ionicons name="add-circle" size={20} color="#fff" />
                  <Text style={styles.modalPickBtnText}>Pick This Player</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                  onPress={() => setSelectedPlayer(null)}
                >
                  <Text style={[styles.modalCancelText, { color: colors.mutedForeground }]}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Draft Your Team</Text>
            <Text style={[styles.titleAr, { color: colors.mutedForeground }]}>اختر فريقك</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: allFull ? colors.success : colors.primary }]}>
            <Text style={[styles.countText, { color: colors.primaryForeground }]}>
              {filledCount}<Text style={{ fontSize: 14 }}>/11</Text>
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
          <View style={[styles.progressFill, { backgroundColor: allFull ? colors.success : colors.primary, width: `${(filledCount / 11) * 100}%` as any }]} />
        </View>

        {/* Position slots status */}
        <View style={styles.slotsStatus}>
          {ALL_POS_TYPES.map(pt => {
            const filled = getFilledCountByType(pt);
            const total = getTotalSlotsByType(pt);
            const full = filled === total;
            return (
              <View key={pt} style={[styles.posStatus, { backgroundColor: full ? POS_TYPE_COLOR[pt] + '22' : colors.muted, borderColor: full ? POS_TYPE_COLOR[pt] : colors.border }]}>
                <Text style={[styles.posStatusLabel, { color: full ? POS_TYPE_COLOR[pt] : colors.mutedForeground }]}>{pt}</Text>
                {full
                  ? <Text style={{ fontSize: 12 }}>✓</Text>
                  : <Text style={[styles.posStatusCount, { color: colors.foreground }]}>{filled}/{total}</Text>
                }
              </View>
            );
          })}
        </View>
      </View>

      {/* Content: pitch top, squad bottom */}
      <View style={styles.body}>
        {/* Pitch (compact) */}
        <View style={styles.pitchSection}>
          <PitchView slots={myTeamSlots} compact />
        </View>

        {/* Squad list OR complete banner */}
        {isDraftComplete ? (
          <View style={styles.completeSection}>
            <Text style={styles.completeEmoji}>🏆</Text>
            <Text style={[styles.completeTitle, { color: colors.primary }]}>Squad Complete!</Text>
            <Text style={[styles.completeSub, { color: colors.mutedForeground }]}>فريقك جاهز للبطولة</Text>
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: colors.primary }]}
              onPress={handleViewTeam}
              activeOpacity={0.85}
            >
              <Ionicons name="people" size={22} color={colors.primaryForeground} />
              <Text style={[styles.startBtnText, { color: colors.primaryForeground }]}>View Your Team →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.squadSection}>
            {/* Squad header */}
            <View style={[styles.squadHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.squadHeaderLeft}>
                <Text style={[styles.squadTitle, { color: colors.foreground }]}>{squadLabel}</Text>
                <Text style={[styles.squadHint, { color: colors.mutedForeground }]}>Tap a player to preview • tap Pick to add</Text>
              </View>
              <TouchableOpacity
                onPress={loadNewSquad}
                style={[styles.shuffleBtn, { backgroundColor: colors.primary + '22', borderColor: colors.primary, borderWidth: 1 }]}
                activeOpacity={0.8}
              >
                <Ionicons name="shuffle" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Player list */}
            <Animated.View style={{ flex: 1, transform: [{ translateY: slideAnim }], opacity: opacityAnim }}>
              <FlatList
                data={currentSquad?.players ?? []}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <SquadPlayerRow
                    player={item}
                    disabled={isPositionTypeFull(item.positionType)}
                    onPress={handleTapPlayer}
                    colors={colors}
                  />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled
              />
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
}

function SquadPlayerRow({ player, disabled, onPress, colors }: {
  player: Player;
  disabled: boolean;
  onPress: (p: Player) => void;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
}) {
  const posColor = POS_TYPE_COLOR[player.positionType];

  const getRatingBg = (r: number) => {
    if (r >= 95) return '#FFD700';
    if (r >= 85) return '#A0A0B0';
    if (r >= 75) return '#CD7F32';
    return '#666';
  };

  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress(player)}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.playerRow,
        {
          backgroundColor: disabled ? colors.muted + '40' : colors.card,
          borderColor: colors.border,
          opacity: disabled ? 0.4 : 1,
        }
      ]}
    >
      {/* Rating circle */}
      <View style={[styles.ratingCircle, { backgroundColor: disabled ? colors.muted : getRatingBg(player.rating) }]}>
        <Text style={styles.ratingNum}>{player.rating}</Text>
      </View>

      {/* Flag + Name */}
      <Text style={styles.playerFlag}>{player.flag}</Text>
      <View style={styles.playerInfo}>
        <Text style={[styles.playerName, { color: disabled ? colors.mutedForeground : colors.foreground }]} numberOfLines={1}>
          {player.name}
        </Text>
        <Text style={[styles.playerNameAr, { color: colors.mutedForeground }]} numberOfLines={1}>
          {player.nameAr}
        </Text>
      </View>

      {/* Year badge */}
      {player.year > 0 && (
        <View style={[styles.yearBadge, { backgroundColor: colors.muted }]}>
          <Text style={[styles.yearText, { color: colors.mutedForeground }]}>{`'${String(player.year).slice(2)}`}</Text>
        </View>
      )}

      {/* Position badge */}
      <View style={[styles.posBadge, { backgroundColor: disabled ? colors.muted : posColor + '22', borderColor: disabled ? colors.border : posColor }]}>
        <Text style={[styles.posText, { color: disabled ? colors.mutedForeground : posColor }]}>{player.position}</Text>
      </View>

      {disabled
        ? <Ionicons name="lock-closed" size={14} color={colors.mutedForeground} style={{ marginLeft: 2 }} />
        : <Ionicons name="chevron-forward" size={14} color={colors.mutedForeground} style={{ marginLeft: 2 }} />
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  titleAr: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  countBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: { fontFamily: 'Inter_700Bold', fontSize: 20, color: '#0A0E1A' },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  slotsStatus: {
    flexDirection: 'row',
    gap: 6,
  },
  posStatus: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  posStatusLabel: { fontFamily: 'Inter_700Bold', fontSize: 9 },
  posStatusCount: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  body: { flex: 1 },
  pitchSection: { paddingHorizontal: 12, paddingVertical: 6 },
  squadSection: { flex: 1, paddingHorizontal: 12 },
  squadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  squadHeaderLeft: { flex: 1, gap: 2 },
  squadTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  squadHint: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  shuffleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: { gap: 6, paddingBottom: 16 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 7,
  },
  ratingCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  ratingNum: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#fff' },
  playerFlag: { fontSize: 17, flexShrink: 0 },
  playerInfo: { flex: 1, gap: 1 },
  playerName: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  playerNameAr: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  yearBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  yearText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  posBadge: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  posText: { fontFamily: 'Inter_700Bold', fontSize: 9 },
  completeSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  completeEmoji: { fontSize: 56 },
  completeTitle: { fontFamily: 'Inter_700Bold', fontSize: 26 },
  completeSub: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 10,
    width: '100%',
    marginTop: 8,
  },
  startBtnText: { fontFamily: 'Inter_700Bold', fontSize: 18 },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  modalRating: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalRatingNum: { fontFamily: 'Inter_700Bold', fontSize: 26, color: '#fff' },
  modalFlag: { fontSize: 36 },
  modalName: { fontFamily: 'Inter_700Bold', fontSize: 20, textAlign: 'center' },
  modalNameAr: { fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center' },
  modalBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  modalBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  modalBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  modalBio: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  modalPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
    width: '100%',
    marginTop: 6,
  },
  modalPickBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff' },
  modalCancelBtn: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  modalCancelText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
});
