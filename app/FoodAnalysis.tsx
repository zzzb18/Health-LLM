import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, StyleSheet, Platform, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { IconSymbol } from '../components/ui/IconSymbol';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
const FoodAnalysisScreen = () => {

  const [image, setImage] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [notes, setNotes] = useState('');

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
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.customBackButton}>
              <IconSymbol name="chevron.left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Food Analysis</Text>
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
            {/* 模块1: 食物图片 */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>1. Food Image</Text>
              <Image
                source={require('../assets/images/test1.jpg')}
                style={styles.analysisImage}
                resizeMode="contain"
              />
            </View>

            {/* 模块2: 营养信息 */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>2. Nutritional Information</Text>
              <View style={styles.nutritionContent}>
                <Text style={styles.nutritionItemTitle}>Vegetable Beef Hot Pot</Text>
                <Text style={styles.nutritionItem}>Calories: 500 kcal</Text>
                <Text style={styles.nutritionItem}>Carbohydrates: 30g</Text>
                <Text style={styles.nutritionItem}>Protein: 40g</Text>
                <Text style={styles.nutritionItem}>Fat: 25g</Text>
                <Text style={styles.nutritionItem}>Fiber: 6g</Text>
                <Text style={styles.nutritionItem}>Sodium: 900mg</Text>

                <Text style={styles.nutritionItemTitle}>Garlic Sprout Stir-fried Shrimp</Text>
                <Text style={styles.nutritionItem}>Calories: 250 kcal</Text>
                <Text style={styles.nutritionItem}>Carbohydrates: 15g</Text>
                <Text style={styles.nutritionItem}>Protein: 15g</Text>
                <Text style={styles.nutritionItem}>Fat: 15g</Text>
                <Text style={styles.nutritionItem}>Fiber: 4g</Text>
                <Text style={styles.nutritionItem}>Sodium: 600mg</Text>

                <Text style={styles.nutritionItemTitle}>White Rice</Text>
                <Text style={styles.nutritionItem}>Calories: 200 kcal</Text>
                <Text style={styles.nutritionItem}>Carbohydrates: 45g</Text>
                <Text style={styles.nutritionItem}>Protein: 4g</Text>
                <Text style={styles.nutritionItem}>Fat: 0.5g</Text>
                <Text style={styles.nutritionItem}>Fiber: 0g</Text>
                <Text style={styles.nutritionItem}>Sodium: 1mg</Text>
              </View>
            </View>

            {/* 模块3: 营养分布图片 */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>3.Nutrient Distribution</Text>
              <Image
                source={require('../assets/images/test2.jpg')} // 请替换为你的图片路径
                style={styles.chartImage}
                resizeMode="contain"
              />
            </View>
          </View>
        )}

        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  sectionTitle: {
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
});

export default FoodAnalysisScreen;