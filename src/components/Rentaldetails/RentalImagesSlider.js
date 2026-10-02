import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import ImageViewing from 'react-native-image-viewing';

const {width} = Dimensions.get('window');

const API_URL = 'https://clickaangan.in';
const API_URL1 = 'http://192.168.1.3:7045';
const IMAGE_HEIGHT = 300;

const RentalImagesSlider = ({property}) => {
  const [showAllImages, setShowAllImages] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // =========================================================
  // MEDIA URL
  // =========================================================
  const getMediaUrl = path => {
    alert(path);
    
    if (!path) {
      return '';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
alert(`${API_URL}/${path.replace(/^\/+/, '')}`);

    return `${API_URL}/${path.replace(/^\/+/, '')}`;
  };

  // =========================================================
  // ALL IMAGES
  // =========================================================
  const images = useMemo(() => {
    const sourceImages = Array.isArray(property?.images)
      ? property.images
      : [];

    return sourceImages
      .map(item => {
        const path =
          item?.imageUrl ||
          item?.ImageUrl ||
          item?.imagePath ||
          item?.ImagePath ||
          item?.url ||
          item?.Url ||
          '';

        const uri = getMediaUrl(path);

        if (!uri) {
          return null;
        }

        return {
          uri,
        };
      })
      .filter(Boolean);
  }, [property?.images]);

  // =========================================================
  // DISPLAY IMAGES
  // Initially only 2 images
  // =========================================================
  const displayImages = useMemo(() => {
    if (showAllImages || images.length <= 2) {
      return images;
    }

    return images.slice(0, 2);
  }, [images, showAllImages]);

  // =========================================================
  // READ MORE / READ LESS
  // =========================================================
  const handleToggleImages = () => {
    if (showAllImages) {
      setShowAllImages(false);

      // If user was on an image beyond first 2,
      // reset index so slider remains valid.
      if (currentIndex > 1) {
        setCurrentIndex(0);
      }
    } else {
      setShowAllImages(true);
    }
  };

  // =========================================================
  // IMAGE CLICK
  // =========================================================
  const handleImagePress = index => {
    setCurrentIndex(index);
    setVisible(true);
  };

  // =========================================================
  // NO IMAGES
  // =========================================================
  if (images.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>

      {/* =====================================================
          IMAGE SLIDER
      ===================================================== */}
      <FlatList
        key={showAllImages ? 'all-images' : 'two-images'}
        data={displayImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item, index) => `${item.uri}-${index}`}
        onMomentumScrollEnd={event => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );

          setCurrentIndex(index);
        }}
        renderItem={({item, index}) => (
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => handleImagePress(index)}
            style={styles.imageWrapper}>

            <FastImage
              source={{
                uri: item.uri,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />

      {/* =====================================================
          READ MORE / READ LESS
      ===================================================== */}
      {images.length > 2 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggleImages}
          style={styles.readMoreButton}>

          <Text style={styles.readMoreText}>
            {showAllImages ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}

      {/* =====================================================
          FULL SCREEN IMAGE VIEWER
      ===================================================== */}
      <ImageViewing
        images={images}
        imageIndex={
          currentIndex >= images.length ? 0 : currentIndex
        }
        visible={visible}
        onRequestClose={() => setVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        presentationStyle="overFullScreen"
      />
    </View>
  );
};

export default RentalImagesSlider;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
  },

  imageWrapper: {
    width: width,
    height: IMAGE_HEIGHT,
    backgroundColor: '#f2f2f2',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  readMoreButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#012353',
  },
});