import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DraftSlot } from '@/context/GameContext';
import { useColors } from '@/hooks/useColors';

interface PitchViewProps {
  slots: DraftSlot[];
  activeSlotId?: string;
  onSlotPress?: (slot: DraftSlot) => void;
  compact?: boolean;
  showNames?: boolean;
}

export function PitchView({ slots, activeSlotId, onSlotPress, compact = false, showNames = false }: PitchViewProps) {
  const colors = useColors();
  const pitchHeight = compact ? 220 : 340;
  const bubbleSize = compact ? 34 : 44;
  const offset = bubbleSize / 2;

  return (
    <View style={[styles.pitchContainer, { height: pitchHeight, backgroundColor: colors.pitch }]}>
      {/* Pitch markings */}
      <View style={[styles.centerCircle, { borderColor: colors.pitchLine }]} />
      <View style={[styles.centerLine, { backgroundColor: colors.pitchLine }]} />
      <View style={[styles.penaltyAreaTop, { borderColor: colors.pitchLine }]} />
      <View style={[styles.penaltyAreaBottom, { borderColor: colors.pitchLine }]} />
      {/* Center dot */}
      <View style={[styles.centerDot, { backgroundColor: colors.pitchLine }]} />

      {/* Player slots */}
      {slots.map(slot => {
        const isActive = slot.id === activeSlotId;
        const hasPlayer = !!slot.player;

        return (
          <TouchableOpacity
            key={slot.id}
            style={[
              styles.slotContainer,
              {
                left: `${slot.x}%` as any,
                top: `${slot.y}%` as any,
                transform: [{ translateX: -offset }, { translateY: -offset }],
              }
            ]}
            onPress={() => onSlotPress?.(slot)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.playerBubble,
              {
                backgroundColor: hasPlayer
                  ? colors.primary
                  : isActive
                    ? 'rgba(255,215,0,0.3)'
                    : 'rgba(255,255,255,0.15)',
                borderColor: isActive
                  ? colors.primary
                  : hasPlayer
                    ? colors.goldDark
                    : 'rgba(255,255,255,0.4)',
                borderWidth: isActive ? 2.5 : 1.5,
                width: bubbleSize,
                height: bubbleSize,
                borderRadius: bubbleSize / 2,
              }
            ]}>
              {hasPlayer ? (
                <Text style={[styles.playerRating, { fontSize: compact ? 10 : 12 }]}>
                  {slot.player!.rating}
                </Text>
              ) : (
                <Text style={[styles.slotLabel, { fontSize: compact ? 8 : 10, color: isActive ? colors.primary : 'rgba(255,255,255,0.7)' }]}>
                  {slot.label}
                </Text>
              )}
            </View>
            {/* Name below bubble */}
            {hasPlayer && (showNames || !compact) && (
              <View style={styles.playerNameContainer}>
                <Text style={[styles.playerName, { fontSize: compact ? 7 : 9 }]} numberOfLines={1}>
                  {slot.player!.name.split(' ').slice(-1)[0]}
                </Text>
              </View>
            )}
            {/* Flag tag */}
            {hasPlayer && !compact && (
              <Text style={styles.playerFlag}>{slot.player!.flag}</Text>
            )}
            {!hasPlayer && isActive && (
              <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pitchContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  centerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1.5,
    top: '50%',
    opacity: 0.35,
  },
  centerCircle: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    top: '50%',
    left: '50%',
    marginLeft: -32,
    marginTop: -32,
    opacity: 0.35,
  },
  centerDot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    top: '50%',
    left: '50%',
    marginLeft: -2.5,
    marginTop: -2.5,
    opacity: 0.5,
  },
  penaltyAreaTop: {
    position: 'absolute',
    width: '45%',
    height: '16%',
    top: 0,
    left: '27.5%',
    borderWidth: 1.5,
    borderTopWidth: 0,
    opacity: 0.35,
  },
  penaltyAreaBottom: {
    position: 'absolute',
    width: '45%',
    height: '16%',
    bottom: 0,
    left: '27.5%',
    borderWidth: 1.5,
    borderBottomWidth: 0,
    opacity: 0.35,
  },
  slotContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  playerBubble: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerRating: {
    color: '#0A0E1A',
    fontWeight: '800',
    fontFamily: 'Inter_700Bold',
  },
  slotLabel: {
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
  playerNameContainer: {
    marginTop: 2,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
    maxWidth: 52,
  },
  playerName: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  playerFlag: {
    fontSize: 8,
    marginTop: 1,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
});
