import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';

const ImageRotator = () => {
  return (
    <View style={styles.container}>
      <Swiper
        autoplay={true}
        autoplayTimeout={3}
        showsPagination={true}
        loop={true}>
        
        <Image
          source={{
            uri: 'https://savariyaproperty.in/assets/img/banner/banner2.jpg',
          }}
          style={styles.image}
        />

        <Image
          source={{
            uri: 'https://savariyaproperty.in/assets/img/banner/banner.png',
          }}
          style={styles.image}
        />

        <Image
          source={{
            uri: 'https://savariyaproperty.in/assets/img/banner/banner1.jpg',
          }}
          style={styles.image}
        />

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
export default ImageRotator;
