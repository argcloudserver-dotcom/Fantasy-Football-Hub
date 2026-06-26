import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Platform,
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

export default function DraftScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    myTeamSlots,
    selectNextPlayerByPosition,
    isPositionTypeFull,
    getFilledCountByType,
    getTotalSlotsByType,
    generateAITeam,
    setupTournament,
  } = useGame();

  const [currentSquad, setCurrentSquad] = useState<Squad | null>(null);
  const [isDraftComplete, setIsDraftComplete] = useState(false);
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const filledCount = myTeamSlots.filter(s => s.player).length;
  const allFull = filledCount === 11;

  // Check if ALL positions are full → draft complete
  useEffect(() => {
    if (allFull) {
      setIsDraftComplete(true);
    }
  }, [allFull]);

  // Load initial squad on mount
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

  function handleSelectPlayer(player: Player) {
    if (isPositionTypeFull(player.positionType)) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = selectNextPlayerByPosition(player);
    if (success) {
      // Auto-load next squad after pick
      setTimeout(() => loadNewSquad(), 300);
    }
  }

  function handleStartTournament() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    generateAITeam();
    setupTournament();
    router.replace('/draw');
  }

  const squadLabel = currentSquad
    ? currentSquad.year > 0
      ? `${currentSquad.flag} ${currentSquad.nationality} ${currentSquad.year}`
      : `${currentSquad.flag} ${currentSquad.nationality}`
    : '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Draft Your Team</Text>
            <Text style={[styles.titleAr, { color: colors.mutedForeground }]}>اختر فريقك</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.countText, { color: colors.primaryForeground }]}>{filledCount}<Text style={{ fontSize: 14 }}>/11</Text></Text>
          </View>
        </View>

        {/* Position slots status */}
        <View style={styles.slotsStatus}>
          {ALL_POS_TYPES.map(pt => {
            const filled = getFilledCountByType(pt);
            const total = getTotalSlotsByType(pt);
            const full = filled === total;
            return (
              <View key={pt} style={[styles.posStatus, { backgroundColor: full ? POS_TYPE_COLOR[pt] + '33' : colors.muted, borderColor: full ? POS_TYPE_COLOR[pt] : colors.border }]}>
                <Text style={[styles.posStatusLabel, { color: full ? POS_TYPE_COLOR[pt] : colors.mutedForeground }]}>{pt}</Text>
                <Text style={[styles.posStatusCount, { color: full ? POS_TYPE_COLOR[pt] : colors.foreground }]}>{filled}/{total}</Text>
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

        {/* Squad list */}
        {isDraftComplete ? (
          <View style={styles.completeSection}>
            <Text style={styles.completeEmoji}>🏆</Text>
            <Text style={[styles.completeTitle, { color: colors.primary }]}>Squad Complete!</Text>
            <Text style={[styles.completeSub, { color: colors.mutedForeground }]}>فريقك جاهز للبطولة</Text>
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: colors.primary }]}
              onPress={handleStartTournament}
              activeOpacity={0.85}
            >
              <Ionicons name="trophy" size={22} color={colors.primaryForeground} />
              <Text style={[styles.startBtnText, { color: colors.primaryForeground }]}>Start Tournament</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.squadSection}>
            {/* Squad header */}
            <View style={[styles.squadHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.squadHeaderLeft}>
                <Text style={[styles.squadTitle, { color: colors.foreground }]}>{squadLabel}</Text>
                <Text style={[styles.squadHint, { color: colors.mutedForeground }]}>Pick any player — position auto-fills</Text>
              </View>
              <TouchableOpacity
                onPress={loadNewSquad}
                style={[styles.shuffleBtn, { backgroundColor: colors.muted }]}
                activeOpacity={0.8}
              >
                <Ionicons name="shuffle" size={18} color={colors.mutedForeground} />
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
                    onPress={handleSelectPlayer}
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

  const getRatingColor = (r: number) => {
    if (r >= 95) return '#FFD700';
    if (r >= 90) return '#C0C0C0';
    if (r >= 85) return '#CD7F32';
    return colors.mutedForeground;
  };

  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress(player)}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.playerRow,
        {
          backgroundColor: disabled ? colors.muted + '50' : colors.card,
          borderColor: disabled ? colors.border : colors.border,
          opacity: disabled ? 0.45 : 1,
        }
      ]}
    >
      {/* Rating */}
      <View style={[styles.ratingCircle, { backgroundColor: disabled ? colors.muted : posColor }]}>
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

      {/* Position badge */}
      <View style={[styles.posBadge, { backgroundColor: disabled ? colors.muted : posColor + '33', borderColor: disabled ? colors.border : posColor }]}>
        <Text style={[styles.posText, { color: disabled ? colors.mutedForeground : posColor }]}>{player.position}</Text>
      </View>

      {disabled ? (
        <Ionicons name="lock-closed" size={14} color={colors.mutedForeground} style={{ marginLeft: 4 }} />
      ) : (
        <Ionicons name="add-circle" size={20} color={posColor} style={{ marginLeft: 4 }} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
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
  countText: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  slotsStatus: {
    flexDirection: 'row',
    gap: 8,
  },
  posStatus: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  posStatusLabel: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  posStatusCount: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  body: { flex: 1 },
  pitchSection: { paddingHorizontal: 12, paddingVertical: 8 },
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
  squadHint: { fontFamily: 'Inter_400Regular', fontSize: 11 },
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
    gap: 8,
  },
  ratingCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  ratingNum: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#fff' },
  playerFlag: { fontSize: 18, flexShrink: 0 },
  playerInfo: { flex: 1, gap: 1 },
  playerName: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  playerNameAr: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  posBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  posText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
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
});
