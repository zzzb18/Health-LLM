import React from 'react';
import { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

import { IconSymbol } from '../components/ui/IconSymbol';


const FoodAnalysis = () => {
  const router = useRouter();

  // 模拟营养分布数据
  const nutritionalData = [
    { key: '蛋白质', value: 30, color: '#FF6F61' },
    { key: '碳水化合物', value: 40, color: '#FFD700' },
    { key: '脂肪', value: 20, color: '#87CEEB' },
    { key: '纤维', value: 10, color: '#98FB98' },
  ];

  // 模拟成就计划数据
  const achievementData = [
    { axis: '蛋白质', value: 80 },
    { axis: '碳水化合物', value: 60 },
    { axis: '脂肪', value: 70 },
    { axis: '纤维', value: 50 },
  ];
  const navigation = useNavigation();
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
     
      <TouchableOpacity style={styles.uploadSection}>
          <IconSymbol name="plus" size={24} color="#007AFF" />
          <Text style={styles.uploadTitle}>Click to upload food image</Text>
        </TouchableOpacity>

        {/* 营养分布图 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutritional distribution</Text>
          <View style={styles.chartContainer}>
            {/* 模拟饼图 */}
            <View style={styles.pieChart}>
              <View style={styles.innerCircle}>
                <Text style={styles.kcalText}>950 kcal</Text>
              </View>
              {nutritionalData.map((item, index) => (
                <View
                  key={item.key}
                  style={[
                    styles.pieSlice,
                    {
                      backgroundColor: item.color,
                      transform: [
                        { rotate: `${(index * 90)}deg` },
                        { translateY: -75 },
                      ],
                      width: `${item.value * 2}%`,
                    },
                  ]}
                />
              ))}
            </View>
            {/* 图例 */}
            <View style={styles.legend}>
              {nutritionalData.map((item) => (
                <View key={item.key} style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: item.color }]}
                  />
                  <Text style={styles.legendText}>
                    {item.key}: {item.value}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 食物详情 */}
        <View style={styles.section}>
          <Text style={styles.foodTitle}>1. Beef brisket noodle soup (approx. 400g)</Text>
          <Text style={styles.foodDetail}>Calories: 700 calories</Text>
          <Text style={styles.foodDetail}>Carbohydrates: 60g</Text>
          <Text style={styles.foodDetail}>Protein: 40g</Text>
          <Text style={styles.foodDetail}>Fat: 30g</Text>
          <Text style={styles.foodDetail}>Fiber: 5g</Text>
          <Text style={styles.foodDetail}>Sodium: 1200mg</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>添加</Text>
          </TouchableOpacity>
        </View>

        {/* 成就计划图 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievement Plan</Text>
          <View style={styles.radarChart}>
            {/* 模拟雷达图背景网格 */}
            <View style={styles.radarBackground}>
              {achievementData.map((item, index) => (
                <View
                  key={item.axis}
                  style={[
                    styles.radarAxis,
                    { transform: [{ rotate: `${index * 90}deg` }] },
                  ]}
                >
                  <Text
                    style={[
                      styles.radarLabel,
                      {
                        transform: [
                          { rotate: `-${index * 90}deg` },
                          { translateY: -110 },
                        ],
                      },
                    ]}
                  >
                    {item.axis}
                  </Text>
                </View>
              ))}
              {/* 模拟数据区域 */}
              <View style={styles.radarData}>
                {achievementData.map((item, index) => (
                  <View
                    key={item.axis}
                    style={[
                      styles.radarPoint,
                      {
                        backgroundColor: '#87CEEB',
                        transform: [
                          { rotate: `${index * 90}deg` },
                          { translateY: -item.value / 2 },
                        ],
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
          {/* 图例 */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#87CEEB' }]} />
              <Text style={styles.legendText}>目标热量 vs 推荐热量</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFD700' }]} />
              <Text style={styles.legendText}>目标热量: 2000kcal, 47%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor:'white',
    borderBottomWidth:0.4,
  },
  backButton: {
    fontSize: 24,
    color: '#000',
    marginRight: 10,
  },
  customBackButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  uploadSection: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent:'center',
    height:200,
    borderLeftColor:'#87CEFA',
    borderRightColor:'#87CEFA',
    borderTopColor:'#87CEFA',
    borderBottomColor:'#87CEFA'
  },
  uploadTitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    height: 150,
    width: 150,
    borderRadius: 75,
    backgroundColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  innerCircle: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kcalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  pieSlice: {
    position: 'absolute',
    top: 75,
    left: 0,
    height: 150,
    borderRadius: 75,
    transformOrigin: 'center',
  },
  radarChart: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarBackground: {
    height: 150,
    width: 150,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 75,
  },
  radarAxis: {
    position: 'absolute',
    top: 75,
    left: 0,
    width: 150,
    height: 1,
    backgroundColor: '#E0E0E0',
    transformOrigin: 'center',
  },
  radarLabel: {
    position: 'absolute',
    top: 75,
    left: 75,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  radarData: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 150,
    height: 150,
  },
  radarPoint: {
    position: 'absolute',
    top: 75,
    left: 75,
    width: 8,
    height: 8,
    borderRadius: 4,
    transformOrigin: 'center',
  },
  legend: {
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  foodDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FF0000',
  },
});

export default FoodAnalysis;