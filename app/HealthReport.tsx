import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, StyleSheet, Platform, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { IconSymbol } from '../components/ui/IconSymbol';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { BarChart, LineChart, PieChart, PopulationPyramid, RadarChart } from "react-native-gifted-charts";
import { blue } from 'react-native-reanimated/lib/typescript/Colors';
import { LinearGradient } from 'expo-linear-gradient';


const HealthReportAnalysis = () => {

  const [image, setImage] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [notes, setNotes] = useState('');

  // ...
  const barData = [{ value: 15 }, { value: 30 }, { value: 26 }, { value: 40 }];

  const reportData = {
    healthyScore: 78, // Overall health score (e.g., out of 100)
    weight: {
      value: 58.5, // Current weight in kg
      change: 0.3, // Change from last measurement in kg
      min: 50, // Minimum normal range
      max: 65, // Maximum normal range
      unit: 'kg', // Unit of measurement
    },
    muscleMass: {
      value: 24.7, // Current muscle mass in kg
      change: -0.8, // Change from last measurement in kg
      min: 22, // Minimum normal range
      max: 30, // Maximum normal range
      unit: 'kg', // Unit of measurement
    },
    bodyFatMass: {
      value: 15.2, // Current body fat mass in kg
      change: 0.5, // Change from last measurement in kg
      min: 10, // Minimum normal range
      max: 18, // Maximum normal range
      unit: 'kg', // Unit of measurement
    },
    cid: [
      {
        label: 'Weight',
        value: 58.5, // Same as weight value
        min: 50, // Minimum normal range
        max: 65, // Maximum normal range
        unit: 'kg', // Unit of measurement
      },
      {
        label: 'Muscle Mass',
        value: 24.7, // Same as muscle mass value
        min: 22, // Minimum normal range
        max: 30, // Maximum normal range
        unit: 'kg', // Unit of measurement
      },
      {
        label: 'Body Fat Mass',
        value: 15.2, // Same as body fat mass value
        min: 10, // Minimum normal range
        max: 18, // Maximum normal range
        unit: 'kg', // Unit of measurement
      },
    ],
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowAnalysis(false);
    }
  };

  const clearImage = () => {
    setImage("");
    setShowAnalysis(false);
  };

  const analyzeFood = () => {
    setShowAnalysis(true);
  };
  const navigation = useNavigation();
  const router = useRouter();

  const renderProgressBar = (value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return (
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={['#4CAF50', '#81C784']}
          style={[styles.progressBar, { width: `${Math.min(percentage, 100)}%` }]}
        />
      </View>
    );
  };
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.customBackButton}>
              <IconSymbol name="chevron.left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Healthy Report Analysis</Text>
          </View>
        </SafeAreaView>
      ),
    });
  }, [navigation, router]);


  return (
    <View style={styles.container}>

      {/* 主内容区域 - 可滚动 */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 上传区域 */}
        <View style={styles.uploadSection}>
          {!image ? (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>click to upload</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Image source={{ uri: image }} style={styles.foodImage} />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={clearImage}>
                  <Text style={styles.buttonText}>Reupload</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.analyzeButton]} onPress={analyzeFood}>
                  <Text style={styles.buttonText}>Analyse</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* 分析结果区域 */}
        {showAnalysis && (
          <View style={styles.analysisSection}>
            <View style={styles.metric}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Weight</Text>
                <Text style={[styles.metricChange, { color: reportData.weight.change < 0 ? '#FF0000' : '#4CAF50' }]}>
                  {reportData.weight.change > 0 ? '+' : ''}{reportData.weight.change} {reportData.weight.unit}
                </Text>
              </View>
              <Text style={styles.metricValue}>{reportData.weight.value} {reportData.weight.unit}</Text>
              {renderProgressBar(reportData.weight.value, reportData.weight.min, reportData.weight.max)}
              <View style={styles.rangeLabels}>
                <Text style={styles.rangeLabel}>Underweight</Text>
                <Text style={styles.rangeLabel}>Normal</Text>
                <Text style={styles.rangeLabel}>Overweight</Text>
              </View>
            </View>Í
            {/* 模块1: 食物图片 */}
            {/* <View style={styles.card}>
              <Text style={styles.sectionTitle}>Healthy Score</Text>
              <View style={styles.pieChartContainer}><BarChart data={barData} />;</View>
            </View> */}
            {/* Muscle Mass */}
            <View style={styles.metric}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Muscle Mass</Text>
                <Text style={[styles.metricChange, { color: reportData.muscleMass.change < 0 ? '#FF0000' : '#4CAF50' }]}>
                  {reportData.muscleMass.change > 0 ? '+' : ''}{reportData.muscleMass.change} {reportData.muscleMass.unit}
                </Text>
              </View>
              <Text style={styles.metricValue}>{reportData.muscleMass.value} {reportData.muscleMass.unit}</Text>
              {renderProgressBar(reportData.muscleMass.value, reportData.muscleMass.min, reportData.muscleMass.max)}
              <View style={styles.rangeLabels}>
                <Text style={styles.rangeLabel}>Low</Text>
                <Text style={styles.rangeLabel}>Normal</Text>
                <Text style={styles.rangeLabel}>High</Text>
              </View>
            </View>

            {/* Body Fat Mass */}
            <View style={styles.metric}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Body Fat Mass</Text>
                <Text style={[styles.metricChange, { color: reportData.bodyFatMass.change < 0 ? '#FF0000' : '#4CAF50' }]}>
                  {reportData.bodyFatMass.change > 0 ? '+' : ''}{reportData.bodyFatMass.change} {reportData.bodyFatMass.unit}
                </Text>
              </View>
              <Text style={styles.metricValue}>{reportData.bodyFatMass.value} {reportData.bodyFatMass.unit}</Text>
              {renderProgressBar(reportData.bodyFatMass.value, reportData.bodyFatMass.min, reportData.bodyFatMass.max)}
              <View style={styles.rangeLabels}>
                <Text style={styles.rangeLabel}>Low</Text>
                <Text style={styles.rangeLabel}>Normal</Text>
                <Text style={styles.rangeLabel}>High</Text>
              </View>
            </View>

            {/* Body Composition Index (CID) */}
            <View style={styles.cidSection}>
              <Text style={styles.sectionTitle}>Body Composition Index (Normal Range)</Text>
              {reportData.cid.map((item, index) => (
                <View key={index} style={styles.cidItem}>
                  <Text style={styles.cidLabel}>{item.label}</Text>
                  {renderProgressBar(item.value, item.min, item.max)}
                </View>
              ))}
            </View>

          </View>)}

        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  metric: {
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  metricChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // 吸顶标题栏样式
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 0.4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // 滚动容器样式
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80, // 给底部输入栏留出空间
  },
  // 上传区域样式
  uploadSection: {
    marginBottom: 20,
  },
  uploadButton: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 10,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#666',
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  actionButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  analyzeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // 分析结果区域样式
  analysisSection: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  sectionTitle: {
    textAlign: 'center', // 文字水平居中
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  analysisImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  nutritionContent: {
    paddingHorizontal: 5,
  },
  nutritionItemTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#444',
  },
  nutritionItem: {
    marginBottom: 3,
    color: '#666',
  },
  chartImage: {
    width: '100%',
    height: 200,
  },
  bottomSpacer: {
    height: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  customBackButton: {
    padding: 8,
  },
  progressContainer: {
    height: 8, // Define a fixed height for the container
    backgroundColor: '#E0E0E0', // Background to show the unfilled portion
    borderRadius: 4,
    overflow: 'hidden', // Ensures the gradient doesn't overflow
  },
  progressBar: {
    height: '100%', // Fill the container height
    borderRadius: 4, // Match container's border radius
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#666',
  },
  cidSection: {
    marginTop: 12,
  },
  cidItem: {
    marginBottom: 12,
  },
  cidLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
});

export default HealthReportAnalysis;