import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Linking,
  SafeAreaView,
  Keyboard
} from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { IconSymbol } from '../components/ui/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getChatCompletion } from '@/services/api';
import * as ImagePicker from 'expo-image-picker';

interface Message {
  type: 'user' | 'assistant' | 'function-list';
  content: string;
  image?: string;
}

const API_TOKEN = 'sk-8Jm36nvRw6Ns3MeCsb5km0bliO3qW9XGUhHbCVukvtXJTnAc';

export function ChatInterface() {
  const { title = 'SmartHealth' } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'user',
      content: 'What can you do for me?',
    },
    {
      type: 'assistant',
      content: 'I am a chatbot that helps you manage your diet and exercise.',
    },
    {
      type: 'function-list',
      content: 'Click the function below to start your healthy journey!\n• Real-time sports posture analysis\n• Dietary calorie analysis\n• Fitness data recording',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [chatStartTime] = useState('Apr 6, 2025, 9:41 AM');
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputMarginBottom, setInputMarginBottom] = useState(0); // New state for dynamic marginBottom
  const insets = useSafeAreaInsets();

  // 自定义返回按钮
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.customBackButton}>
              <IconSymbol name="chevron.left" size={24} color="#000" />
            </TouchableOpacity>
            <Image
              source={require('../assets/images/Home/logo.jpg')}
              style={styles.avatar}
            />
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        </SafeAreaView>
      ),
    });
  }, [navigation, router]);


  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '权限被拒绝',
          '需要相册权限才能选择图片。请在设置中开启权限。',
          [
            { text: '取消', style: 'cancel' },
            { text: '去设置', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('错误', '选择图片时出现错误');
      console.error('Error picking image:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage: Message = {
      type: 'user',
      content: inputText.trim(),
      image: selectedImage || undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);

    setIsTyping(true);

    try {
      const response = await getChatCompletion(
        selectedImage
          ? `[图片分析请求] ${inputText.trim() || '请分析这张图片'}`
          : inputText.trim(),
        API_TOKEN
      );

      const assistantMessage: Message = {
        type: 'assistant',
        content: '',
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      for (let i = 0; i < response.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            type: 'assistant',
            content: response.substring(0, i + 1),
          };
          return newMessages;
        });
      }
    } catch (error) {
      Alert.alert('错误', '无法获取回答，请稍后再试。');
      console.error('Error getting chat completion:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    const isFunctionList = message.type === 'function-list';

    if (isFunctionList) {
      return (
        <View style={[styles.messageContainer, styles.aiMessage]}>
          <Image
            source={require('../assets/images/Home/logo.jpg')}
            style={styles.avatar}
          />
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <ThemedText style={styles.messageText}>{message.content}</ThemedText>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
        {!isUser && (
          <Image
            source={require('../assets/images/Home/logo.jpg')}
            style={styles.avatar}
          />
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          {message.image && (
            <Image
              source={{ uri: message.image }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          )}
          <ThemedText style={[styles.messageText, isUser && styles.userMessageText]}>
            {message.content}
          </ThemedText>
        </View>
      </View>
    );
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={[
          styles.messagesContent,
          {
            paddingTop: 0, // 移除 paddingTop，减少顶部间距
            paddingBottom: Math.max(keyboardHeight, insets.bottom),
          },
        ]}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTime}>{chatStartTime}</Text>
        {messages.map((message, index) => (
          <React.Fragment key={index}>{renderMessage(message)}</React.Fragment>
        ))}
        {isTyping && (
          <ThemedView style={[styles.messageBubble, styles.assistantMessage]}>
            <ThemedText style={styles.messageText}>正在输入...</ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={130}
      >
        <ThemedView
          style={[
            styles.inputContainer
          ]}
        >
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message..."
            placeholderTextColor="#666"
            multiline
          />
         
          <TouchableOpacity style={styles.iconButton} onPress={handleImagePick}>
            <IconSymbol name="photo" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleSend}>
            <IconSymbol name="arrow.up" size={24} color="#666" />
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  customBackButton: {
    padding: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerTime: {
    marginTop: 30,
    paddingTop: 0,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 8, // 减小 marginVertical，从 16 改为 8
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#000',
  },
  aiBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9E9EB',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
  },
});

export default ChatInterface;