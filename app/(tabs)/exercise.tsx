import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraComponent from '@/components/Camera/Camera';

export default function ExerciseScreen() {
  const [feedback, setFeedback] = useState<string>('准备开始运动分析...');
  const [encouragement, setEncouragement] = useState<string>('');

  const handleFeedback = (newFeedback: string) => {
    setFeedback(newFeedback);
  };

  const handleEncouragement = (newEncouragement: string) => {
    setEncouragement(newEncouragement);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraComponent
          onFeedback={handleFeedback}
          onEncouragement={handleEncouragement}
        />
      </View>

      <ThemedView style={styles.feedbackContainer}>
        <ThemedText style={styles.feedbackText}>{feedback}</ThemedText>
        {encouragement && (
          <ThemedText style={styles.encouragementText}>{encouragement}</ThemedText>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  feedbackText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  encouragementText: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 