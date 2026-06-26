import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Player } from '@/data/players';
import { useColors } from '@/hooks/useColors';

interface PlayerCardProps {
  player: Player;
  onSelect: (player: Player) => void;
  disabled?: boolean;
  selected?: boolean;
}

const POSITION_COLORS: Record<string, string> = {
  GK: '#FF9500',
  CB: '#34C759',
  LB: '#34C759',
  RB: '#34C759',
  CDM: '#007AFF',
  CM: '#007AFF',
  CAM: '#007AFF',
  LW: '#FF2D55',
  RW: '#FF2D55',
  ST: '#FF2D55',
};

export function PlayerCard({ player, onSelect, disabled = false, selected = false }: PlayerCardProps) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const posColor = POSITION_COLORS[player.position] || '#FFD700';

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); });
    onSelect(player);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 95) return '#FFD700';
    if (rating >= 90) return '#C0C0C0';
    if (rating >= 85) return '#CD7F32';
    return colors.mutedForeground;
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.85}
        style={[
          styles.card,
          {
            backgroundColor: selected ? `${posColor}22` : colors.card,
            borderColor: selected ? posColor : disabled ? colors.border : colors.border,
            borderWidth: selected ? 2 : 1,
            opacity: disabled ? 0.5 : 1,
          }
        ]}
      >
        {/* Rating badge */}
        <View style={[styles.ratingBadge, { backgroundColor: posColor }]}>
          <Text style={styles.ratingText}>{player.rating}</Text>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.flag}>{player.flag}</Text>
            <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
              {player.name}
            </Text>
          </View>
          <Text style={[styles.nameAr, { color: colors.mutedForeground }]} numberOfLines={1}>
            {player.nameAr}
          </Text>
          <View style={styles.meta}>
            <View style={[styles.posTag, { backgroundColor: posColor }]}>
              <Text style={styles.posText}>{player.position}</Text>
            </View>
            <Text style={[styles.year, { color: colors.mutedForeground }]}>
              {player.nationality} • {player.year}
            </Text>
          </View>
        </View>

        {/* Rating stars for legends */}
        {player.rating >= 95 && (
          <View style={styles.legendBadge}>
            <Text style={styles.legendText}>LEGEND</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  ratingBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  ratingText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flag: {
    fontSize: 16,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    flex: 1,
  },
  nameAr: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  posTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  posText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
  },
  year: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  legendBadge: {
    backgroundColor: '#FFD70033',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  legendText: {
    color: '#FFD700',
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
  },
});
