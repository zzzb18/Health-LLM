import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { IconSymbol } from '../ui/IconSymbol';

interface CameraProps {
  onFeedback?: (feedback: string) => void;
  onEncouragement?: (encouragement: string) => void;
}

export default function CameraComponent({ onFeedback, onEncouragement }: CameraProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isStreaming, setIsStreaming] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const initWebSocket = () => {
    wsRef.current = new WebSocket("ws://localhost:8000/ws/exercise-analysis/");
    setIsStreaming(true);
    
    wsRef.current.onopen = () => {
      console.log("WebSocket 连接已建立");
      // 连接建立后立即开始发送帧
      captureFrame();
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.feedback && onFeedback) {
          onFeedback(data.feedback);
        }
        if (data.encouragement && onEncouragement) {
          onEncouragement(data.encouragement);
        }
      } catch (error) {
        console.error("解析消息错误:", error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket 错误:", error);
      setIsStreaming(false);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket 连接已关闭");
      setIsStreaming(false);
    };
  };

  const captureFrame = async () => {
    if (cameraRef.current && isStreaming) {
      try {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && data.base64) {
          wsRef.current.send(
            JSON.stringify({
              type: "exercise_frame",
              frame: data.base64,
            })
          );
        }

        // 继续捕获下一帧
        setTimeout(captureFrame, 200); // 每200ms捕获一帧
      } catch (error) {
        console.error("捕获帧错误:", error);
      }
    }
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const toggleStreaming = () => {
    if (isStreaming) {
      stopStreaming();
    } else {
      initWebSocket();
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>需要相机权限来分析运动姿势</Text>
        <Button onPress={requestPermission} title="授予权限" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera}
        type={facing}
      >
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
            <IconSymbol name="camera.rotate" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controlButton,
              isStreaming ? styles.stopButton : styles.startButton
            ]}
            onPress={toggleStreaming}
          >
            <IconSymbol 
              name={isStreaming ? "stop.fill" : "play.fill"} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  startButton: {
    backgroundColor: 'rgba(0,122,255,0.8)',
  },
  stopButton: {
    backgroundColor: 'rgba(255,59,48,0.8)',
  },
});
