import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const PropImageRotator = ({ images }) => {

  if (!images || images.length === 0) {
    return null;
  }
  // Single Image
  if (images.length === 1) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: images[0] }}
          style={styles.image}
        />
      </View>
    );
  }

  // Multiple Images
  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={3}
        loop
        showsPagination
      >
        {images.map((item, index) => (
          <Image
            key={index}
            source={{ uri: item }}
            style={styles.image}
          />
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
});

export default PropImageRotator;