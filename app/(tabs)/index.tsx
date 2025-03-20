import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInterface } from '@/components/Chat/ChatInterface';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ChatInterface />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});


