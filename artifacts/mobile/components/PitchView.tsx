import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DraftSlot } from '@/context/GameContext';
import { useColors } from '@/hooks/useColors';

interface PitchViewProps {
  slots: DraftSlot[];
  activeSlotId?: string;
  onSlotPress?: (slot: DraftSlot) => void;
  compact?: boolean;
}

export function PitchView({ slots, activeSlotId, onSlotPress, compact = false }: PitchViewProps) {
  const colors = useColors();
  const pitchHeight = compact ? 220 : 340;

  return (
    <View style={[styles.pitchContainer, { height: pitchHeight, backgroundColor: colors.pitch }]}>
      {/* Pitch markings */}
      <View style={[styles.centerCircle, { borderColor: colors.pitchLine }]} />
      <View style={[styles.centerLine, { backgroundColor: colors.pitchLine }]} />
      <View style={[styles.penaltyAreaTop, { borderColor: colors.pitchLine }]} />
      <View style={[styles.penaltyAreaBottom, { borderColor: colors.pitchLine }]} />

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
                width: compact ? 34 : 44,
                height: compact ? 34 : 44,
                borderRadius: compact ? 17 : 22,
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
            {hasPlayer && !compact && (
              <View style={styles.playerNameContainer}>
                <Text style={styles.playerName} numberOfLines={1}>
                  {slot.player!.name.split(' ').slice(-1)[0]}
                </Text>
                <Text style={styles.playerFlag}>{slot.player!.flag}</Text>
              </View>
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
    opacity: 0.4,
  },
  centerCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1.5,
    top: '50%',
    left: '50%',
    marginLeft: -35,
    marginTop: -35,
    opacity: 0.4,
  },
  penaltyAreaTop: {
    position: 'absolute',
    width: '50%',
    height: '18%',
    top: 0,
    left: '25%',
    borderWidth: 1.5,
    borderTopWidth: 0,
    opacity: 0.4,
  },
  penaltyAreaBottom: {
    position: 'absolute',
    width: '50%',
    height: '18%',
    bottom: 0,
    left: '25%',
    borderWidth: 1.5,
    borderBottomWidth: 0,
    opacity: 0.4,
  },
  slotContainer: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -22 }, { translateY: -22 }],
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    maxWidth: 50,
  },
  playerFlag: {
    fontSize: 9,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
});
