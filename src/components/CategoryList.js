import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const categories = [
  {
    id: 1,
    name: 'Headphones',
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 2,
    name: 'Mobile',
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 3,
    name: 'Laptop',
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 4,
    name: 'Watch',
    image: 'https://via.placeholder.com/80',
  },
];

const CategoryList = () => {

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <Text style={styles.title}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        Categories
      </Text>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 15,
  },

  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 15,
  },

  card: {
    width: 100,
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  title: {
    marginTop: 10,
    fontWeight: '600',
  },
});