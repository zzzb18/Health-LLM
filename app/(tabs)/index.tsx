import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInterface } from '@/app/Chat';
import Home from '@/components/Home/Home';


export default function HomeScreen() {
  return (
    
      <Home></Home>
   
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});


