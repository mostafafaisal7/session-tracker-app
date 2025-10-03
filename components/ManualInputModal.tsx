import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { AnimatedButton } from './AnimatedButton';

interface ManualInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (sessionsUsed: number, daysPassed: number) => void;
  currentSessionsUsed: number;
  currentDaysPassed: number;
}

export const ManualInputModal = ({
  visible,
  onClose,
  onSubmit,
  currentSessionsUsed,
  currentDaysPassed,
}: ManualInputModalProps) => {
  const [sessionsUsed, setSessionsUsed] = useState(currentSessionsUsed.toString());
  const [daysPassed, setDaysPassed] = useState(currentDaysPassed.toString());

  const handleSubmit = () => {
    const sessions = parseInt(sessionsUsed, 10) || 0;
    const days = parseInt(daysPassed, 10) || 1;
    onSubmit(sessions, days);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View
            entering={SlideInDown.springify()}
            style={styles.modalContent}
          >
            <Pressable>
              <Text style={styles.title}>Manual Input</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sessions Used</Text>
                <TextInput
                  style={styles.input}
                  value={sessionsUsed}
                  onChangeText={setSessionsUsed}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="0"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Days Passed</Text>
                <TextInput
                  style={styles.input}
                  value={daysPassed}
                  onChangeText={setDaysPassed}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="1"
                />
              </View>

              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <AnimatedButton
                    title="Cancel"
                    onPress={onClose}
                    variant="secondary"
                  />
                </View>
                <View style={styles.button}>
                  <AnimatedButton title="Save" onPress={handleSubmit} />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
  },
});
