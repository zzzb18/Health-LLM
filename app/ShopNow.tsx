import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useEffect } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import { IconSymbol } from '../components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';

// Screen width for dynamic grid item sizing
const screenWidth = Dimensions.get('window').width;

// Updated products array with image URLs instead of base64
const products = [
  { id: '1', name: 'Tomato', price: '$2.99 / lb', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg' },
  { id: '2', name: 'Cucumber', price: '$1.99 / lb', image: 'https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg' },
  { id: '3', name: 'Strawberry', price: '$4.99 / lb', image: 'https://images.pexels.com/photos/533294/pexels-photo-533294.jpeg' },
  { id: '4', name: 'Cherry', price: '$8.99 / lb', image: 'https://images.pexels.com/photos/533293/pexels-photo-533293.jpeg' },
  { id: '5', name: 'Blueberry', price: '$3.99 / lb', image: 'https://images.pexels.com/photos/4022096/pexels-photo-4022096.jpeg' },
  { id: '6', name: 'Cherry Tomato', price: '$2.49 / lb', image: 'https://images.pexels.com/photos/4022087/pexels-photo-4022087.jpeg' },
];

const ShopNow = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const navigation = useNavigation();
  const router = useRouter();

  // Update filtered products when search text changes
  useEffect(() => {
    if (searchText) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchText]);

  // Render individual product item
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </View>
  );

  // Set up navigation header with back button and title
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.customBackButton}>
              <IconSymbol name="chevron.left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Shop Now</Text>
          </View>
        </SafeAreaView>
      ),
    });
  }, [navigation, router]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Product list */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2} // Display 2 products per row
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 0.4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  customBackButton: {
    padding: 8,
  },
  searchBar: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  productCard: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  productImage: {
    width: (screenWidth - 40) / 2, // Dynamic width calculation
    height: (screenWidth - 40) / 2,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});

export default ShopNow;