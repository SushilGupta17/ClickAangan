import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';

const API_URL = 'https://savariyaproperty.in/';
const API_URL1 = 'http://192.168.1.3:7045';

const FloorPlan = ({ images = [] }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Floor Plans</Text>

      <FlatList
        horizontal
        data={images}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `${API_URL}${item}` }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />
    </View>
  );
};

export default FloorPlan;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 10,
    borderRadius: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  image: {
    width: 280,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
});