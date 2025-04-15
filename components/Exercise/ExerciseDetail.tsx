import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { IconSymbol } from '../ui/IconSymbol';

interface ExerciseDetailProps {
  exercise: string;
  onStart: () => void;
  onBack: () => void;
}

export function ExerciseDetail({ exercise, onStart, onBack }: ExerciseDetailProps) {
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <IconSymbol name="chevron.left" size={24} color="#007AFF" />
        <ThemedText style={styles.backText}>返回</ThemedText>
      </TouchableOpacity>
      
      <ThemedText style={styles.title}>{exercise}</ThemedText>
      <ThemedText style={styles.description}>
        请按照以下步骤进行运动：
        1. 准备姿势
        2. 开始运动
        3. 保持正确姿势
        4. 完成动作
      </ThemedText>
      
      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <ThemedText style={styles.startButtonText}>开始分析</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 