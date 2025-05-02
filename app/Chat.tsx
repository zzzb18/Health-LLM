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
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

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
  const [chatStartTime] = useState(() => {
    return new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
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



  // Upload image
  const uploadImage = async (imageUri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);

    const requestConfig = {
      url: 'http://47.107.28.21/upload/', // Confirm correct endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      body: formData,
    };

    console.log('Upload Request:', {
      url: requestConfig.url,
      method: requestConfig.method,
      headers: requestConfig.headers,
      formData: {
        image: {
          uri: imageUri,
          name: 'image.jpg',
          type: 'image/jpeg',
        },
      },
    });

    const uploadResponse = await fetch(requestConfig.url, {
      method: requestConfig.method,
      headers: requestConfig.headers,
      body: formData,
    });

    const rawResponse = await uploadResponse.text();
    console.log('Raw Upload Response:', rawResponse);

    if (!uploadResponse.ok) {
      let errorMessage = `HTTP ${uploadResponse.status}: 上传图片失败`;
      if (uploadResponse.status === 404) {
        errorMessage = '上传端点未找到，请检查服务器配置。';
      } else if (uploadResponse.status === 413) {
        errorMessage = '图片过大，请选择更小的图片。';
      } else {
        try {
          const errorData = JSON.parse(rawResponse);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `HTTP ${uploadResponse.status}: 服务器返回无效响应`;
        }
      }
      throw new Error(errorMessage);
    }

    let uploadData;
    try {
      uploadData = JSON.parse(rawResponse);
    } catch (e) {
      throw new Error('服务器返回无效 JSON 响应: ' + rawResponse);
    }

    if (!uploadData.uri) {
      throw new Error('服务器未返回图片 URI');
    }

    // Verify the URI is accessible
    try {
      const uriResponse = await fetch(uploadData.uri, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
      });
      if (!uriResponse.ok) {
        throw new Error(`图片 URI 无法访问: HTTP ${uriResponse.status}`);
      }
    } catch (e) {
      throw new Error(`无法验证图片 URI: ${e.message}`);
    }

    return uploadData.uri;
  };

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
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);

        // Compress image to under 1MB
        const compressedUri = await compressImageToUnder1MB(imageUri);

        // Upload the compressed image
        const uploadedUri = await uploadImage(compressedUri);
        setUploadedImageUri(uploadedUri);
      }
    } catch (error) {
      Alert.alert('错误', `处理图片失败: ${error.message}`);
      console.error('Error in handleImagePick:', error);
      setSelectedImage(null);
      setUploadedImageUri(null);
    }
  };

  // Compress image to under 1MB
  const compressImageToUnder1MB = async (imageUri: string): Promise<string> => {
    const MAX_SIZE = 1024 * 1024; // 1MB in bytes
    let quality = 0.7; // Initial quality
    let width = 1024; // Initial width
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      // Compress image
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width } }],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Check file size
      const fileInfo = await FileSystem.getInfoAsync(manipResult.uri);
      if (!fileInfo.exists) {
        throw new Error('Failed to get compressed image info');
      }

      const fileSize = fileInfo.size;
      console.log(`Attempt ${attempt + 1}: File size = ${fileSize} bytes, Quality = ${quality}, Width = ${width}`);

      if (fileSize <= MAX_SIZE) {
        return manipResult.uri;
      }

      // Reduce quality and/or width for next attempt
      quality -= 0.2;
      if (attempt === 1) {
        width = Math.max(800, width - 200); // Reduce width on second attempt
      }
      attempt++;
    }

    throw new Error('Unable to compress image to under 1MB. Please select a smaller image.');
  };

  const handleSend = async () => {
    if (!inputText.trim() && !uploadedImageUri) return;
    setSelectedImage(null);
    const userMessage: Message = {
      type: 'user',
      content: inputText.trim(),
      image: selectedImage || undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const requestBody = {
        question: inputText.trim(),
        uid: '59577368',
        image: uploadedImageUri || '',
      };

      const response = await fetch('http://47.107.28.21/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from server');
      }


      const data = await response.json();
      const answer = data.answer;

      const assistantMessage: Message = {
        type: 'assistant',
        content: '',
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      for (let i = 0; i < answer.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            type: 'assistant',
            content: answer.substring(0, i + 1),
          };
          return newMessages;
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to get a response. Please try again later.');
      console.error('Error sending message:', error);
    } finally {
      setUploadedImageUri(null); // 清除上传的 URI
      setIsTyping(false);
    }
  };

  // 修改 handleClearImage 函数，同步清除上传的 URI
  const handleClearImage = () => {
    setSelectedImage(null);
    setUploadedImageUri(null);
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
            <ThemedText style={styles.messageText}>Typing...</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.clearImageButton} onPress={handleClearImage}>
            <IconSymbol name="xmark.circle.fill" size={20} color="#FF0000" />
          </TouchableOpacity>
        </View>
      )}
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
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  imagePreview: {
    left: 20,
    width: 100,
    height: 75,
    borderRadius: 8,
  },
  clearImageButton: {
    position: 'absolute',
    left: 110,
    top: -8,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default ChatInterface;