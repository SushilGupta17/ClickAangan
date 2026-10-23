import React, {useMemo, useState, useEffect, useRef} from 'react';

import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewing from 'react-native-image-viewing';
import Share from 'react-native-share';
import Video from 'react-native-video';

import {formatPrice} from '../../helpers/priceHelper';

const {width} = Dimensions.get('window');

const API_URL = 'https://savariyaproperty.in';
const IMAGE_HEIGHT = 300;

// ============================================================
// PROPERTY IMAGE CAROUSEL
// ClickAangan
// Common Images - No Tabs
// Auto Slide + Manual Swipe
// ============================================================

const PropertyImageCarousel = ({property}) => {
  const [visible, setVisible] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ==========================================================
  // AUTO SLIDE REF
  // ==========================================================

  const flatListRef = useRef(null);

  // ==========================================================
  // BUILD IMAGE URL
  // ==========================================================

  const buildImageUrl = path => {
    if (!path || typeof path !== 'string') {
      return null;
    }

    // Already complete URL
    if (
      path.startsWith('http://') ||
      path.startsWith('https://')
    ) {
      return path;
    }

    const cleanPath = path
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');

    return `${API_URL}/${cleanPath}`;
  };

  // ==========================================================
  // VIDEO URL
  // ==========================================================

  const videoPath =
    property?.videoUrl ||
    property?.VideoUrl ||
    property?.videoPath ||
    property?.VideoPath ||
    '';

  const videoUrl = useMemo(() => {
    return buildImageUrl(videoPath);
  }, [videoPath]);

  const hasVideo = !!videoUrl;

  // ==========================================================
  // ALL COMMON IMAGES
  // Cover Image + All propertyImages
  // NO imageType FILTER
  // ==========================================================

  const images = useMemo(() => {
    const result = [];

    // --------------------------------------------------------
    // COVER IMAGE
    // --------------------------------------------------------

    if (property?.coverImage) {
      const coverUrl = buildImageUrl(property.coverImage);

      if (coverUrl) {
        result.push({
          uri: coverUrl,
        });
      }
    }

    // --------------------------------------------------------
    // ALL IMAGES
    // --------------------------------------------------------

    if (Array.isArray(property?.propertyImages)) {
      property.propertyImages.forEach(item => {
        if (!item) {
          return;
        }

        const imagePath =
          item?.imageUrl ||
          item?.ImageUrl ||
          item?.imagePath ||
          item?.ImagePath ||
          '';

        const imageUrl = buildImageUrl(imagePath);

        if (imageUrl) {
          result.push({
            uri: imageUrl,
          });
        }
      });
    }

    // --------------------------------------------------------
    // REMOVE EMPTY + DUPLICATE IMAGES
    // --------------------------------------------------------

    const uniqueImages = result.filter(
      (item, index, self) =>
        item?.uri &&
        self.findIndex(x => x.uri === item.uri) === index,
    );

    return uniqueImages;
  }, [property]);

  // ==========================================================
  // HAS IMAGES
  // ==========================================================

  const hasAnyImages = images.length > 0;

  // ==========================================================
  // RESET INDEX WHEN PROPERTY / IMAGES CHANGE
  // ==========================================================

  useEffect(() => {
    setCurrentIndex(0);

    if (flatListRef.current && images.length > 0) {
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: false,
      });
    }
  }, [images]);

  // ==========================================================
  // AUTO SLIDE
  // 5 SECONDS
  // ==========================================================

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const autoSlide = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex =
          prevIndex + 1 >= images.length
            ? 0
            : prevIndex + 1;

        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }

        return nextIndex;
      });
    }, 5000);

    return () => {
      clearInterval(autoSlide);
    };
  }, [images.length]);

  // ==========================================================
  // SHARE
  // ==========================================================

  const onShare = async () => {
    try {
      await Share.open({
        title: property?.projectName || '',

        message: `${property?.projectName || ''}

${property?.builderName || ''}

${property?.locality || ''}, ${property?.city || ''}

₹ ${formatPrice(property?.minPrice)} - ₹ ${formatPrice(
          property?.maxPrice,
        )}

https://savariyaproperty.in`,
      });
    } catch (e) {
      console.log('SHARE ERROR:', e);
    }
  };

  // ==========================================================
  // IMAGE ITEM
  // ==========================================================

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => {
          setCurrentIndex(index);
          setVisible(true);
        }}>
        <FastImage
          source={{
            uri: item.uri,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
          onError={error => {
            console.log(
              'IMAGE LOAD ERROR:',
              item.uri,
              JSON.stringify(error),
            );
          }}
        />
      </TouchableOpacity>
    );
  };

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <View>

      {/* ======================================================
          IMAGE SLIDER
          Auto Slide + Manual Swipe
      ====================================================== */}

      {hasAnyImages && (
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) =>
            `${item.uri}-${index}`
          }
          renderItem={renderItem}

          // ---------------------------------------------------
          // MANUAL SWIPE
          // ---------------------------------------------------

          onMomentumScrollEnd={event => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width,
            );

            setCurrentIndex(index);
          }}

          // ---------------------------------------------------
          // PREVENT scrollToIndex warning
          // ---------------------------------------------------

          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      )}

      {/* ======================================================
          VIDEO
          ONLY WHEN NO IMAGE EXISTS
      ====================================================== */}

      {!hasAnyImages && hasVideo && (
        <Video
          source={{
            uri: videoUrl,
          }}
          style={styles.headerVideo}
          controls={true}
          resizeMode="cover"
          paused={true}
          repeat={false}
          onError={error => {
            console.log(
              'HEADER VIDEO ERROR:',
              JSON.stringify(error),
            );
          }}
        />
      )}

      {/* ======================================================
          NO MEDIA
      ====================================================== */}

      {!hasAnyImages && !hasVideo && (
        <View style={styles.noMedia}>
          <Icon
            name="image-off-outline"
            size={50}
            color="#999"
          />

          <Text style={styles.noMediaText}>
            No Media Available
          </Text>
        </View>
      )}

      {/* ======================================================
    GRADIENT OVERLAY
    Click → Full Screen Image
====================================================== */}

{(hasAnyImages || hasVideo) && (
  <TouchableOpacity
    activeOpacity={1}
    style={styles.overlay}
    onPress={() => {
      if (hasAnyImages) {
        setVisible(true);
      }
    }}>

    <LinearGradient
      colors={[
        'transparent',
        'rgba(0,0,0,.15)',
        'rgba(0,0,0,.90)',
      ]}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
    <Text style={styles.fullScreenHint}>
      Tap to view full screen
    </Text>
  </TouchableOpacity>
)}

    

      {/* ======================================================
          FAVORITE + SHARE
      ====================================================== */}

      {/* <View style={styles.actionContainer}>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            setIsFavourite(!isFavourite);
          }}>

          <Icon
            name={
              isFavourite
                ? 'heart'
                : 'heart-outline'
            }
            size={24}
            color="#fff"
          />

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              marginLeft: 10,
            },
          ]}
          onPress={onShare}>

          <Icon
            name="share-variant"
            size={24}
            color="#fff"
          />

        </TouchableOpacity>

      </View> */}

      {/* ======================================================
          IMAGE COUNTER
      ====================================================== */}

      {hasAnyImages && (
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      )}

      {/* ======================================================
          IMAGE DOTS
      ====================================================== */}

      {hasAnyImages && images.length > 1 && (
        <View style={styles.dots}>

          {images.map((item, index) => (
            <View
              key={`${item.uri}-${index}`}
              style={[
                styles.dot,
                currentIndex === index &&
                  styles.activeDot,
              ]}
            />
          ))}

        </View>
      )}

      {/* ======================================================
          FULL SCREEN IMAGE VIEWER
      ====================================================== */}

      {images.length > 0 && (
        <ImageViewing
          images={images}
          imageIndex={currentIndex}
          visible={visible}
          onRequestClose={() => {
            setVisible(false);
          }}
        />
      )}

    </View>
  );
};

export default PropertyImageCarousel;

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

  // ----------------------------------------------------------
  // IMAGE
  // ----------------------------------------------------------

  image: {
    width: width,
    height: IMAGE_HEIGHT,
    backgroundColor: '#eee',
  },

  // ----------------------------------------------------------
  // VIDEO
  // ----------------------------------------------------------

  headerVideo: {
    width: width,
    height: IMAGE_HEIGHT,
    backgroundColor: '#000',
  },

  // ----------------------------------------------------------
  // NO MEDIA
  // ----------------------------------------------------------

  noMedia: {
    width: width,
    height: IMAGE_HEIGHT,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noMediaText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  },

  // ----------------------------------------------------------
  // GRADIENT OVERLAY
  // ----------------------------------------------------------

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 25,
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 10,
  },

  projectName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  builder: {
    color: '#fff',
    marginTop: 5,
    fontSize: 14,
  },

  location: {
    color: '#fff',
    marginTop: 4,
    fontSize: 13,
  },

  price: {
    color: '#fff',
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
  },

  // ----------------------------------------------------------
  // ACTION BUTTONS
  // ----------------------------------------------------------

  actionContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    zIndex: 20,
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0,0,0,.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ----------------------------------------------------------
  // COUNTER
  // ----------------------------------------------------------

  counter: {
    position: 'absolute',
    bottom: 55,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  counterText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  // ----------------------------------------------------------
  // DOTS
  // ----------------------------------------------------------

  dots: {
    position: 'absolute',
    bottom: 55,
    alignSelf: 'center',
    flexDirection: 'row',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff80',
    marginHorizontal: 3,
  },

  activeDot: {
    width: 20,
    backgroundColor: '#fff',
  },

fullScreenHint: {
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  textAlign: 'center',
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
  textShadowColor: 'rgba(0,0,0,0.8)',
  textShadowOffset: {width: 1, height: 1},
  textShadowRadius: 3,
},

});