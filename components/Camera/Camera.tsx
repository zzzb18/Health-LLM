import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { IconSymbol } from '../ui/IconSymbol';

interface CameraProps {
  isAnalyzing?: boolean;
  onImageCapture?: () => void;
  onFeedback?: (feedback: string) => void;
  onEncouragement?: (encouragement: string) => void;
}

export default function CameraComponent({ 
  isAnalyzing = false,
  onImageCapture,
  onFeedback,
  onEncouragement 
}: CameraProps) {
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>需要相机权限来分析运动姿势</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>授予权限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isCameraActive ? (
        <View style={styles.startContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setIsCameraActive(true)}
          >
            <IconSymbol name="play.fill" size={24} color="#fff" />
            <Text style={styles.startButtonText}>Open the camera</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            >
              <IconSymbol name="camera.rotate" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={() => setIsCameraActive(false)}
            >
              <IconSymbol name="stop.fill" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,122,255,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  message: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: 'rgba(0,122,255,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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
  stopButton: {
    backgroundColor: 'rgba(255,59,48,0.8)',
  },
});
