import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
const Home = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/Home/logo.jpg')} // 替换为实际的logo路径
            style={styles.logo}
          />
          <View>
            <Text style={styles.title}>SmartHealth</Text>
            <Text style={styles.subtitle}>Live a healthy life every day.</Text>
          </View>
        </View>

        {/* Chat Module */}
        <Link href={"/Chat"} push asChild>
          <TouchableOpacity style={styles.module}>
            <ImageBackground
              source={require('../../assets/images/Home/banner.png')} // 替换为实际的聊天模块背景图
              style={styles.moduleBackground}
              imageStyle={styles.moduleImage}
            >
              <View style={styles.chatBubbleLeft}>
                <Text style={styles.chatText}>Diet?</Text>
              </View>

            </ImageBackground>
          </TouchableOpacity>
        </Link>

        {/* Middle Modules (2x2 Grid) */}
        <View style={styles.grid}>
          {/* Food Analysis */}
          <Link href={"/FoodAnalysis"} asChild>
            <TouchableOpacity style={styles.gridItem}>

              <ImageBackground
                source={require('../../assets/images/Home/Food Analysis.png')}
                style={styles.gridBackground}
                imageStyle={styles.gridImage}
              >

              </ImageBackground>


            </TouchableOpacity>
          </Link>


          {/* Health Report Analysis */}
          <Link href={"/HealthReport"} asChild>
            <TouchableOpacity style={styles.gridItem}>
              <ImageBackground
                source={require('../../assets/images/Home/Health Report.png')}
                style={styles.gridBackground}
                imageStyle={styles.gridImage}
              >

              </ImageBackground>
            </TouchableOpacity>
          </Link>

          {/* Shop Now */}
          <Link href={"/ShopNow"} asChild>
            <TouchableOpacity style={styles.gridItem}>
              <ImageBackground
                source={require('../../assets/images/Home/Shop Now.png')}
                style={styles.gridBackground}
                imageStyle={styles.gridImage}
              >

              </ImageBackground>
            </TouchableOpacity>
          </Link>

          {/* Fitness Record */}
          <Link href={"/FoodAnalysis"} asChild>
            <TouchableOpacity style={styles.gridItem}>
              <ImageBackground
                source={require('../../assets/images/Home/Fitness Record.png')}
                style={styles.gridBackground}
                imageStyle={styles.gridImage}
              >

              </ImageBackground>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Daily/Weekly Summary */}
        <TouchableOpacity style={styles.module}>
          <ImageBackground
            source={require('../../assets/images/Home/Daily Summary.png')} // 替换为实际图片路径
            style={styles.moduleBackground}
            imageStyle={styles.moduleImage}
          >

          </ImageBackground>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', // 背景颜色与 ScrollView 一致，确保安全区域的背景颜色统一
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  module: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  moduleBackground: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleImage: {
    borderRadius: 10,
  },
  chatBubbleLeft: {
    position: 'absolute',
    top: 10,
    left: 20,
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 10,
  },
  chatBubbleRight: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 10,
  },
  chatText: {
    fontSize: 14,
    color: '#000',
  },
  robotImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  moduleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  gridItem: {
    width: '48%', // 留出间隙
    aspectRatio: 1, // 正方形
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gridBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridImage: {
    borderRadius: 10,
  },
  gridText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
});

export default Home;