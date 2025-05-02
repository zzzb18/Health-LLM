import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { IconSymbol } from '../ui/IconSymbol';

interface ExerciseListProps {
  onSelect: (exercise: string) => void;
}

const EXERCISE_TYPES = {
  'Squat': {
    description: 'Fundamental exercise for lower body muscles',
    icon: 'figure.walk',
  },
  'Push-up': {
    description: 'Classic exercise for upper body strength',
    icon: 'figure.arms.open',
  },
  'Plank': {
    description: 'Effective core strength exercise',
    icon: 'figure.core.training',
  },
};

export function ExerciseList({ onSelect }: ExerciseListProps) {
  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.title}>Select Exercise Type</ThemedText>
      {Object.entries(EXERCISE_TYPES).map(([exercise, info]) => (
        <TouchableOpacity
          key={exercise}
          style={styles.exerciseItem}
          onPress={() => onSelect(exercise)}
        >
          <ThemedView style={styles.exerciseContent}>
            <IconSymbol name={info.icon} size={24} color="#007AFF" />
            <View style={styles.exerciseInfo}>
              <ThemedText style={styles.exerciseName}>{exercise}</ThemedText>
              <ThemedText style={styles.exerciseDescription}>
                {info.description}
              </ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </ThemedView>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exerciseItem: {
    marginBottom: 12,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
  },
});