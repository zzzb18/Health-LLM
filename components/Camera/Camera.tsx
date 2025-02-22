import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isStreaming, setIsStreaming] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    initWebSocket();
    return () => {
      stopStreaming();
    };
  }, []);
  const initWebSocket = () => {
    wsRef.current = new WebSocket("ws://localhost:8000/ws/video-stream/"); // 替换为你的 WebSocket 地址
    setIsStreaming(true);
    wsRef.current.onopen = () => {
      console.log("WebSocket 连接已建立");
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket 错误:", error);
    };
  };

  const captureFrame = async () => {
    if (cameraRef.current && isStreaming) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options); // 捕获视频帧
      console.log("捕获视频帧:", data);

      // 发送 Base64 编码的视频帧
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log(data?.base64);


        // 发送 Base64 数据
        wsRef.current.send(
          JSON.stringify({
            // 将 Base64 数据包装为 JSON
            type: "video_frame",
            frame: data?.base64,
          })
        );
      }

      // 继续捕获下一帧
      setTimeout(captureFrame, 5000); // 每 5000 毫秒捕获一帧
    }
  };
  // 停止传输视频帧
  const stopStreaming = () => {
    setIsStreaming(false);
    if (wsRef.current) {
      wsRef.current.close();
      console.log("WebSocket 连接已关闭");
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef}></CameraView>
      <Button title="Start" onPress={captureFrame}></Button>
      <Button title="End" onPress={stopStreaming}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
