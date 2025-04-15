import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface AnalysisFeedbackProps {
  feedback: string;
  encouragement: string;
}

export function AnalysisFeedback({ feedback, encouragement }: AnalysisFeedbackProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.feedback}>{feedback}</ThemedText>
      <ThemedText style={styles.encouragement}>{encouragement}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 20,
  },
  feedback: {
    fontSize: 16,
    marginBottom: 8,
  },
  encouragement: {
    fontSize: 14,
    color: '#666',
  },
}); 