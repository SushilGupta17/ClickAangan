import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const width = Dimensions.get('window').width;

const Slider = () => {
  return (
    <View style={{ height: 220 }}>
      <Swiper autoplay>
        <Image
          source={{
            uri: 'https://via.placeholder.com/500x220',
          }}
          style={{
            width: width,
            height: 220,
          }}
        />

        <Image
          source={{
            uri: 'https://via.placeholder.com/500x220',
          }}
          style={{
            width: width,
            height: 220,
          }}
        />
      </Swiper>
    </View>
  );
};

export default Slider;