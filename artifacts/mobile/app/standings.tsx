import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GroupTeam, useGame } from '@/context/GameContext';
import { useColors } from '@/hooks/useColors';

const GROUP_LETTERS = ['A', 'B', 'C', 'D'];

export default function StandingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { groups, knockoutTeams } = useGame();

  const handleGoKnockout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.replace('/bracket');
  };

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
          <Text style={[styles.title, { color: colors.foreground }]}>Final Standings</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>الجدول النهائي</Text>
        </View>

        {groups.map((group, gIdx) => {
          const sorted = [...group].sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return (b.gf - b.ga) - (a.gf - a.ga);
          });
          return (
            <View key={gIdx} style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.groupHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.groupLetter, { color: colors.primary }]}>Group {GROUP_LETTERS[gIdx]}</Text>
              </View>

              {/* Table header */}
              <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.colTeam, { color: colors.mutedForeground }]}>Team</Text>
                <Text style={[styles.col, { color: colors.mutedForeground }]}>P</Text>
                <Text style={[styles.col, { color: colors.mutedForeground }]}>W</Text>
                <Text style={[styles.col, { color: colors.mutedForeground }]}>D</Text>
                <Text style={[styles.col, { color: colors.mutedForeground }]}>L</Text>
                <Text style={[styles.col, { color: colors.mutedForeground }]}>GD</Text>
                <Text style={[styles.colPts, { color: colors.mutedForeground }]}>Pts</Text>
              </View>

              {sorted.map((team, i) => {
                const qualified = i < 2;
                const gd = team.gf - team.ga;
                return (
                  <View
                    key={team.id}
                    style={[
                      styles.teamRow,
                      { backgroundColor: qualified ? `${colors.success}11` : 'transparent' }
                    ]}
                  >
                    <View style={[styles.qualBadge, { backgroundColor: qualified ? colors.success : 'transparent' }]}>
                      <Text style={[styles.pos, { color: qualified ? '#fff' : colors.mutedForeground }]}>{i + 1}</Text>
                    </View>
                    <Text style={styles.flag}>{team.flag}</Text>
                    <Text style={[styles.colTeamName, { color: colors.foreground }]} numberOfLines={1}>
                      {team.name.split(' ').slice(-2).join(' ')}
                    </Text>
                    <Text style={[styles.col, { color: colors.mutedForeground }]}>{team.played}</Text>
                    <Text style={[styles.col, { color: colors.foreground }]}>{team.won}</Text>
                    <Text style={[styles.col, { color: colors.foreground }]}>{team.drawn}</Text>
                    <Text style={[styles.col, { color: colors.foreground }]}>{team.lost}</Text>
                    <Text style={[styles.col, { color: gd >= 0 ? colors.success : colors.destructive }]}>
                      {gd > 0 ? `+${gd}` : gd}
                    </Text>
                    <Text style={[styles.colPts, { color: colors.primary }]}>{team.points}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Qualified teams */}
        {knockoutTeams.length > 0 && (
          <View style={[styles.qualCard, { backgroundColor: colors.card, borderColor: colors.success }]}>
            <Text style={[styles.qualTitle, { color: colors.success }]}>Quarter-Finalists</Text>
            <View style={styles.qualGrid}>
              {knockoutTeams.map(team => (
                <View key={team.id} style={[styles.qualTeam, { backgroundColor: colors.muted }]}>
                  <Text style={styles.qualFlag}>{team.flag}</Text>
                  <Text style={[styles.qualName, { color: colors.foreground }]} numberOfLines={1}>
                    {team.name.split(' ').slice(-1)[0]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: colors.primary }]}
          onPress={handleGoKnockout}
          activeOpacity={0.85}
        >
          <Ionicons name="git-network" size={22} color={colors.primaryForeground} />
          <Text style={[styles.nextBtnText, { color: colors.primaryForeground }]}>
            View Knockout Bracket
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  header: { gap: 4 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  groupCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  groupHeader: {
    padding: 12,
    borderBottomWidth: 1,
  },
  groupLetter: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  colTeam: { flex: 3, fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.5 },
  col: { width: 24, textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 11 },
  colPts: { width: 30, textAlign: 'center', fontFamily: 'Inter_700Bold', fontSize: 12 },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 4,
  },
  qualBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pos: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  flag: { fontSize: 16, marginLeft: 2 },
  colTeamName: { flex: 3, fontFamily: 'Inter_500Medium', fontSize: 12, marginLeft: 4 },
  qualCard: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  qualTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  qualGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  qualTeam: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  qualFlag: { fontSize: 18 },
  qualName: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  nextBtnText: { fontFamily: 'Inter_700Bold', fontSize: 17 },
});
