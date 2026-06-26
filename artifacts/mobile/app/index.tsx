import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { playerName, setPlayerName, setGameMode, startGame, generateRoomCode, resetGame } = useGame();
  const [localName, setLocalName] = useState(playerName);
  const [mode, setMode] = useState<'choose' | 'join'>('choose');
  const [joinCode, setJoinCode] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleStart = (gameMode: 'vsAI' | 'vsPlayer') => {
    if (!localName.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlayerName(localName.trim());
    setGameMode(gameMode);
    resetGame();
    if (gameMode === 'vsAI') {
      startGame();
      router.push('/draft');
    } else {
      router.push('/lobby');
    }
  };

  const handleCreateRoom = () => {
    if (!localName.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlayerName(localName.trim());
    setGameMode('vsPlayer');
    generateRoomCode();
    resetGame();
    router.push('/lobby');
  };

  const handleJoinRoom = () => {
    if (!localName.trim() || joinCode.length < 6) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlayerName(localName.trim());
    setGameMode('vsPlayer');
    resetGame();
    router.push('/lobby');
  };

  const isNameValid = localName.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { backgroundColor: colors.navyDeep }]}>
        <LinearGradient
          colors={['#1a2a1a', '#0A0E1A', '#0A0E1A']}
          style={StyleSheet.absoluteFill}
        />

        <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 20), paddingBottom: insets.bottom + 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.trophy}>🏆</Text>
            <Text style={styles.title}>World Cup{'\n'}Fantasy Manager</Text>
            <Text style={styles.subtitle}>مدير كأس العالم الخيالي</Text>
          </View>

          {/* Name Input */}
          <View style={[styles.inputSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="person" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Enter your name..."
              placeholderTextColor={colors.mutedForeground}
              value={localName}
              onChangeText={setLocalName}
              maxLength={20}
              returnKeyType="done"
            />
          </View>

          {/* Mode Select */}
          {mode === 'choose' ? (
            <View style={styles.modeContainer}>
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>CHOOSE MODE</Text>

              <TouchableOpacity
                style={[styles.modeBtn, { backgroundColor: colors.primary, opacity: isNameValid ? 1 : 0.5 }]}
                onPress={() => handleStart('vsAI')}
                disabled={!isNameValid}
                activeOpacity={0.8}
              >
                <Ionicons name="game-controller" size={24} color={colors.primaryForeground} />
                <View style={styles.modeBtnText}>
                  <Text style={[styles.modeBtnTitle, { color: colors.primaryForeground }]}>Play vs AI</Text>
                  <Text style={[styles.modeBtnSub, { color: colors.primaryForeground }]}>العب ضد الذكاء الاصطناعي</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.primaryForeground} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, opacity: isNameValid ? 1 : 0.5 }]}
                onPress={() => isNameValid && setMode('join')}
                activeOpacity={0.8}
              >
                <Ionicons name="people" size={24} color={colors.foreground} />
                <View style={styles.modeBtnText}>
                  <Text style={[styles.modeBtnTitle, { color: colors.foreground }]}>Multiplayer</Text>
                  <Text style={[styles.modeBtnSub, { color: colors.mutedForeground }]}>متعدد اللاعبين</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.modeContainer}>
              <TouchableOpacity onPress={() => setMode('choose')} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={20} color={colors.primary} />
                <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeBtn, { backgroundColor: colors.primary, opacity: isNameValid ? 1 : 0.5 }]}
                onPress={handleCreateRoom}
                disabled={!isNameValid}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle" size={24} color={colors.primaryForeground} />
                <View style={styles.modeBtnText}>
                  <Text style={[styles.modeBtnTitle, { color: colors.primaryForeground }]}>Create Room</Text>
                  <Text style={[styles.modeBtnSub, { color: colors.primaryForeground }]}>إنشاء غرفة</Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.joinSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.joinLabel, { color: colors.mutedForeground }]}>Join with code</Text>
                <View style={styles.joinRow}>
                  <TextInput
                    style={[styles.codeInput, { color: colors.foreground, borderColor: colors.border }]}
                    placeholder="WC4829"
                    placeholderTextColor={colors.mutedForeground}
                    value={joinCode}
                    onChangeText={t => setJoinCode(t.toUpperCase())}
                    maxLength={6}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    style={[styles.joinBtn, { backgroundColor: joinCode.length >= 6 && isNameValid ? colors.accent : colors.muted }]}
                    onPress={handleJoinRoom}
                    disabled={joinCode.length < 6 || !isNameValid}
                  >
                    <Ionicons name="enter" size={22} color={colors.foreground} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Footer */}
          <Text style={[styles.footer, { color: colors.mutedForeground }]}>
            World Cup 1930–2026 • 100+ Legends
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, justifyContent: 'center', gap: 20 },
  header: { alignItems: 'center', gap: 8 },
  trophy: { fontSize: 56 },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#FFD700',
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,215,0,0.6)',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
  modeContainer: { gap: 12 },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 1,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 12,
  },
  modeBtnText: { flex: 1, gap: 2 },
  modeBtnTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  modeBtnSub: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  joinSection: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  joinLabel: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  joinRow: { flexDirection: 'row', gap: 10 },
  codeInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: 4,
    textAlign: 'center',
  },
  joinBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
});
