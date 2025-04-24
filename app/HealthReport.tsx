import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const HealthReportAnalysis = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>

        {/* 上传区域 */}
        <TouchableOpacity style={styles.uploadSection}>
          <Text style={styles.uploadTitle}>Click to upload healthy report</Text>
        </TouchableOpacity>

        {/* 健康评分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Healthy Score</Text>
          <View style={styles.gaugeContainer}>
            {/* 半圆形仪表盘背景 */}
            <View style={styles.gauge}>
              {/* 刻度背景（D到A） */}
              <View style={[styles.gaugeSegment, { backgroundColor: '#FF6F61' }]} />
              <View style={[styles.gaugeSegment, { backgroundColor: '#FFAB91' }]} />
              <View style={[styles.gaugeSegment, { backgroundColor: '#FFD700' }]} />
              <View style={[styles.gaugeSegment, { backgroundColor: '#98FB98' }]} />
              {/* 刻度线 */}
              {[...Array(10)].map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.tick,
                    {
                      transform: [{ rotate: `${-90 + (index * 180) / 9}deg` }],
                    },
                  ]}
                />
              ))}
              {/* 指针 */}
              <View
                style={[
                  styles.pointer,
                  { transform: [{ rotate: `${-90 + (70 / 100) * 180}deg` }] },
                ]}
              />
              {/* 评分文本 */}
              <Text style={styles.gaugeText}>Grade Rating</Text>
              <Text style={styles.scoreText}>70%</Text>
              {/* 等级标签 */}
              <Text style={[styles.gradeLabel, { left: 10 }]}>D</Text>
              <Text style={[styles.gradeLabel, { left: '50%' }]}>B</Text>
              <Text style={[styles.gradeLabel, { right: 10 }]}>A</Text>
            </View>
          </View>
        </View>

        {/* 身体成分图 */}
        <View style={styles.section}>
          <View style={styles.bodyCompositionContainer}>
            {/* 模拟三角形图 */}
            <View style={styles.triangleChart}>
              <View style={styles.triangle} />
              <Text style={styles.chartLabel}>Body Composition Radar Chart</Text>
            </View>
            <Text style={styles.bodyCompositionText}>
              Your muscle mass is within a healthy range, but the body fat mass is slightly higher than what’s considered ideal. This suggests a potential focus area for fat reduction.
            </Text>
          </View>
        </View>

        {/* 建议文本 */}
        <View style={styles.section}>
          <Text style={styles.recommendationText}>
            You have a good balance of muscle mass, but your body fat is slightly above normal. I recommend incorporating a mix of strength training and cardiovascular exercises to help reduce body fat while maintaining or increasing muscle mass. Staying mindful of your nutrition, with a focus on whole foods, can also support your goals.
          </Text>
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
  },
  backButton: {
    fontSize: 24,
    color: '#000',
    marginRight: 10,
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
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 16,
    color: '#1E90FF',
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
    textAlign: 'center',
  },
  gaugeContainer: {
    alignItems: 'center',
  },
  gauge: {
    width: 200,
    height: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  gaugeSegment: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -100,
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: 'currentColor',
    transform: [{ rotate: '-90deg' }],
  },
  tick: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#E0E0E0',
    top: 0,
    left: 99,
    transformOrigin: 'center bottom',
  },
  pointer: {
    position: 'absolute',
    width: 2,
    height: 80,
    backgroundColor: '#1E90FF',
    top: 20,
    left: 99,
    transformOrigin: 'center bottom',
  },
  gaugeText: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  scoreText: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  gradeLabel: {
    position: 'absolute',
    top: 0,
    fontSize: 14,
    color: '#666',
  },
  bodyCompositionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  triangleChart: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderLeftColor: 'transparent',
    borderRightWidth: 50,
    borderRightColor: 'transparent',
    borderBottomWidth: 86.6, // 高度为边长 * √3 / 2
    borderBottomColor: '#98FB98',
  },
  chartLabel: {
    position: 'absolute',
    bottom: -20,
    width: 100,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  bodyCompositionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 14,
    color: '#666',
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default HealthReportAnalysis;