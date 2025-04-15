import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { IconSymbol } from '../ui/IconSymbol';
import { ExerciseList } from './ExerciseList';
import { ExerciseDetail } from './ExerciseDetail';
import CameraComponent from '../Camera/Camera';
import { AnalysisFeedback } from './AnalysisFeedback';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ExerciseScreen() {
  const insets = useSafeAreaInsets();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [encouragement, setEncouragement] = useState<string>('');

  const handleExerciseSelect = (exercise: string) => {
    setSelectedExercise(exercise);
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setFeedback('');
    setEncouragement('');
  };

  const handleStopAnalysis = () => {
    setIsAnalyzing(false);
    setFeedback('');
    setEncouragement('');
  };

  const handleImageCapture = () => {
    if (selectedExercise && isAnalyzing) {
      // 这里可以添加实际的图像分析逻辑
      const randomFeedback = "动作标准，继续保持！";
      const randomEncouragement = "你做得很好，继续加油！";
      setFeedback(randomFeedback);
      setEncouragement(randomEncouragement);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {!selectedExercise ? (
        <ExerciseList onSelect={handleExerciseSelect} />
      ) : !isAnalyzing ? (
        <ExerciseDetail 
          exercise={selectedExercise}
          onStart={handleStartAnalysis}
          onBack={() => setSelectedExercise(null)}
        />
      ) : (
        <View style={[styles.analysisContainer, { paddingBottom: insets.bottom }]}>
          <CameraComponent
            isAnalyzing={isAnalyzing}
            onImageCapture={handleImageCapture}
          />
          <AnalysisFeedback
            feedback={feedback}
            encouragement={encouragement}
          />
          <TouchableOpacity
            style={[styles.stopButton, { bottom: insets.bottom + 20 }]}
            onPress={handleStopAnalysis}
          >
            <ThemedText style={styles.stopButtonText}>停止分析</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  analysisContainer: {
    flex: 1,
  },
  stopButton: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 