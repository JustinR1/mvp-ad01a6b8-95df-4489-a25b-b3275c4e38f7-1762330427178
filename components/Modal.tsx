import React from 'react';
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  contentStyle?: ViewStyle;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  contentStyle,
}: ModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#000000' : '#FFFFFF',
    border: isDark ? '#38383A' : '#E5E5EA',
    text: isDark ? '#FFFFFF' : '#1C1C1E',
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerContent}>
            {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
            {showCloseButton && (
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      </SafeAreaView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});