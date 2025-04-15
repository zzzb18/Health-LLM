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
  Keyboard,
  SafeAreaView,
  Button
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { IconSymbol } from '../ui/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getChatCompletion } from '@/services/api';
import * as ImagePicker from 'expo-image-picker';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  image?: string;
}

// TODO: 替换为您的 API token
const API_TOKEN = 'sk-8Jm36nvRw6Ns3MeCsb5km0bliO3qW9XGUhHbCVukvtXJTnAc';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();



  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '权限被拒绝',
          '需要相册权限才能选择图片。请在设置中开启权限。',
          [
            { text: '取消', style: 'cancel' },
            { text: '去设置', onPress: () => Linking.openSettings() }
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

    // 添加用户消息
    const userMessage: Message = {
      type: 'user',
      content: inputText.trim(),
      image: selectedImage || undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);

    // 显示正在输入状态
    setIsTyping(true);

    try {
      // 调用 API 获取回答
      const response = await getChatCompletion(
        selectedImage
          ? `[图片分析请求] ${inputText.trim() || '请分析这张图片'}`
          : inputText.trim(),
        API_TOKEN
      );

      // 添加 AI 消息，但不立即显示内容
      const assistantMessage: Message = {
        type: 'assistant',
        content: '',
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // 使用打字机效果显示回答
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
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
        {!isUser && (
          <Image
            source={require('../../assets/images/doctor.jpeg')}
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

  return (


    <SafeAreaView style={styles.scrollContainer}>

      <View style={styles.header}>
        <Image source={require('../../assets/images/doctor.jpeg')}
          style={styles.avatar}></Image>
        <Text style={styles.headerTitle}>SmartHealth</Text>

      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={[
          styles.messagesContent,
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(keyboardHeight, insets.bottom)
          }
        ]}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.headerTime}>Apr 6, 2025, 9:41 AM</Text>


        {messages.map(renderMessage)}
        {isTyping && (
          <ThemedView style={[styles.messageBubble, styles.assistantMessage]}>
            <ThemedText style={styles.messageText}>正在输入...</ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // iOS 用 padding，Android 用 height
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // 根据需要调整偏移量
      >

        <ThemedView style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 4) }]}>
          {selectedImage && (
            <View style={styles.selectedImageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImagePreview}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <IconSymbol name="chevron.right" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleImagePick}
          >
            <IconSymbol name="plus" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="请输入您的问题..."
            placeholderTextColor="#666"
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() && !selectedImage) && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() && !selectedImage}
          >
            <IconSymbol name="paperplane.fill" size={24} color={inputText.trim() || selectedImage ? "#007AFF" : "#999"} />
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  welcomeContainer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: 'black',
  },
  aiBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  selectedImageContainer: {
    position: 'absolute',
    top: -80,
    left: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 4,
  },
  selectedImagePreview: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
  },
  header: {
    flexDirection: 'row', // 保持水平排列
    alignItems: 'center', // 垂直居中对齐
    justifyContent: 'flex-start', // 靠左对齐
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 20
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeContainer: {
    alignItems: 'center', // 水平居中
    justifyContent: 'center', // 如果需要垂直居中（可选）
  },
  headerTime: {
    fontSize: 16, // 增大字体（之前是 12）
    color: '#888',
    textAlign: 'center', // 文本本身水平居中
  },
  
}); 