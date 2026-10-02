import React, {useMemo, useState, useEffect} from 'react';

import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewing from 'react-native-image-viewing';
import Share from 'react-native-share';
import Video from 'react-native-video';

const {width} = Dimensions.get('window');

const API_URL = 'https://clickaangan.in';

const IMAGE_HEIGHT = 300;

// =========================================================
// RENTAL IMAGE TABS
// =========================================================

const tabs = [
  {
    id: 'Property',
    title: 'Photos',
    icon: 'image-multiple',
  },
  {
    id: 'FloorPlan',
    title: 'Floor Plan',
    icon: 'floor-plan',
  },
  {
    id: 'Other',
    title: 'Other',
    icon: 'image',
  },
];

// =========================================================
// PRICE FORMAT
// Example: 15000 => 15,000
// =========================================================

const formatRentalPrice = price => {
  if (
    price === null ||
    price === undefined ||
    price === '' ||
    isNaN(Number(price))
  ) {
    return '0';
  }

  return Number(price).toLocaleString('en-IN');
};

// =========================================================
// IMAGE URL HELPER
// =========================================================

const getMediaUrl = path => {
  if (!path) {
    return '';
  }

  if (typeof path !== 'string') {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');

  return `${API_URL}/${cleanPath}`;
};

// =========================================================
// RENTAL IMAGE CAROUSEL
// =========================================================

const RentalImageCarousel = ({property}) => {
  const [selectedTab, setSelectedTab] = useState('Property');

  const [visible, setVisible] = useState(false);

  const [isFavourite, setIsFavourite] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  // =========================================================
  // VIDEO URL
  // Supports multiple possible API field names
  // =========================================================

  const videoPath =
    property?.videoUrl ||
    property?.VideoUrl ||
    property?.videoPath ||
    property?.VideoPath ||
    '';

  const videoUrl = useMemo(() => {
    return getMediaUrl(videoPath);
  }, [videoPath]);

  const hasVideo = !!videoUrl;

  // =========================================================
  // PROPERTY TYPE
  // =========================================================

  const propertyType =
    property?.propertyType ||
    property?.PropertyType ||
    '';

  const subCategory =
    property?.subCategory ||
    property?.SubCategory ||
    '';

  // =========================================================
  // TAB COUNTS
  // =========================================================

  const tabCounts = useMemo(() => {
    const rentalImages = Array.isArray(property?.images)
      ? property.images
      : [];

    // -------------------------------------------------------
    // Property Photos
    // Supports:
    // Property
    // Apartment
    // PROPERTY
    // property
    // -------------------------------------------------------

    const propertyCount = rentalImages.filter(item => {
      const type =
        item?.imageType ||
        item?.ImageType ||
        '';

      return (
        type === 'Property' ||
        type === 'Apartment' ||
        type === 'PROPERTY' ||
        type === 'property'
      );
    }).length;

    // -------------------------------------------------------
    // Floor Plan
    // -------------------------------------------------------

    const floorPlanCount = rentalImages.filter(item => {
      const type =
        item?.imageType ||
        item?.ImageType ||
        '';

      return type === 'FloorPlan';
    }).length;

    // -------------------------------------------------------
    // Other
    // -------------------------------------------------------

    const otherCount = rentalImages.filter(item => {
      const type =
        item?.imageType ||
        item?.ImageType ||
        '';

      return type === 'Other';
    }).length;

    return {
      Property: propertyCount,
      FloorPlan: floorPlanCount,
      Other: otherCount,
    };
  }, [property]);

  // =========================================================
  // AVAILABLE TABS ONLY
  // =========================================================

  const availableTabs = useMemo(() => {
    return tabs.filter(tab => tabCounts[tab.id] > 0);
  }, [tabCounts]);

  // =========================================================
  // CHECK ANY IMAGE EXISTS
  // =========================================================

  const hasAnyImages = availableTabs.length > 0;

  // =========================================================
  // AUTO SELECT FIRST AVAILABLE TAB
  // =========================================================

  useEffect(() => {
    if (
      availableTabs.length > 0 &&
      !availableTabs.find(tab => tab.id === selectedTab)
    ) {
      setSelectedTab(availableTabs[0].id);
      setCurrentIndex(0);
    }
  }, [availableTabs, selectedTab]);

  // =========================================================
  // GET IMAGES
  // =========================================================

  const images = useMemo(() => {
    const rentalImages = Array.isArray(property?.images)
      ? property.images
      : [];

    switch (selectedTab) {
      // =====================================================
      // PROPERTY PHOTOS
      // =====================================================

      case 'Property':
        return rentalImages
          .filter(item => {
            const type =
              item?.imageType ||
              item?.ImageType ||
              '';

            return (
              type === 'Property' ||
              type === 'Apartment' ||
              type === 'PROPERTY' ||
              type === 'property'
            );
          })
          .map(item => {
            const imagePath =
              item?.imageUrl ||
              item?.ImageUrl ||
              item?.imagePath ||
              item?.ImagePath ||
              '';

            return {
              uri: getMediaUrl(imagePath),
            };
          })
          .filter(item => item.uri);

      // =====================================================
      // FLOOR PLAN
      // =====================================================

      case 'FloorPlan':
        return rentalImages
          .filter(item => {
            const type =
              item?.imageType ||
              item?.ImageType ||
              '';

            return type === 'FloorPlan';
          })
          .map(item => {
            const imagePath =
              item?.imageUrl ||
              item?.ImageUrl ||
              item?.imagePath ||
              item?.ImagePath ||
              '';

            return {
              uri: getMediaUrl(imagePath),
            };
          })
          .filter(item => item.uri);

      // =====================================================
      // OTHER
      // =====================================================

      case 'Other':
        return rentalImages
          .filter(item => {
            const type =
              item?.imageType ||
              item?.ImageType ||
              '';

            return type === 'Other';
          })
          .map(item => {
            const imagePath =
              item?.imageUrl ||
              item?.ImageUrl ||
              item?.imagePath ||
              item?.ImagePath ||
              '';

            return {
              uri: getMediaUrl(imagePath),
            };
          })
          .filter(item => item.uri);

      default:
        return [];
    }
  }, [property, selectedTab]);

  // =========================================================
  // SHARE
  // =========================================================

  const onShare = async () => {
    try {
      const title =
        property?.title ||
        property?.propertyTitle ||
        property?.propertyName ||
        'Rental Property';

      const location =
        property?.location ||
        property?.locality ||
        '';

      const city =
        property?.city ||
        '';

      const price =
        property?.price ||
        property?.rent ||
        property?.monthlyRent ||
        0;

      await Share.open({
        title,
        message: `${title}

${propertyType}${subCategory ? ` - ${subCategory}` : ''}

${location}${city ? `, ${city}` : ''}

₹ ${formatRentalPrice(price)} / Month

https://clickaangan.in`,
      });
    } catch (e) {
      console.log('RENTAL SHARE ERROR:', e);
    }
  };

  // =========================================================
  // IMAGE CLICK
  // =========================================================

  const renderItem = ({item, index}) => (
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
      />
    </TouchableOpacity>
  );

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <View>
      {/* =====================================================
          IMAGE TABS
          Only show if images exist
      ===================================================== */}

      {hasAnyImages && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}>
          {availableTabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && styles.activeTab,
              ]}
              onPress={() => {
                setSelectedTab(tab.id);
                setCurrentIndex(0);
              }}>
              <Icon
                name={tab.icon}
                size={18}
                color={
                  selectedTab === tab.id
                    ? '#fff'
                    : '#444'
                }
              />

              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.id &&
                    styles.activeTabText,
                ]}>
                {tab.title} ({tabCounts[tab.id]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* =====================================================
          IMAGE SLIDER
          If images available
      ===================================================== */}

      {hasAnyImages && images.length > 0 && (
        <FlatList
          key={selectedTab}
          data={images}
          horizontal
          pagingEnabled
          keyExtractor={(item, index) =>
            `${selectedTab}-${index}`
          }
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={event => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width,
            );

            setCurrentIndex(index);
          }}
        />
      )}

      {/* =====================================================
          VIDEO HEADER
          Only if NO IMAGES + VIDEO exists
      ===================================================== */}

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
              'RENTAL HEADER VIDEO ERROR:',
              JSON.stringify(error),
            );
          }}
        />
      )}

      {/* =====================================================
          NO MEDIA
      ===================================================== */}

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

      {/* =====================================================
          GRADIENT OVERLAY
      ===================================================== */}

      {(hasAnyImages || hasVideo) && (
        <LinearGradient
          colors={[
            'transparent',
            'rgba(0,0,0,.15)',
            'rgba(0,0,0,.90)',
          ]}
          style={styles.overlay}>
          <Text style={styles.propertyName}>
            {property?.title ||
              property?.propertyTitle ||
              property?.propertyName ||
              'Rental Property'}
          </Text>

          <Text style={styles.propertyType}>
            {propertyType}
            {subCategory
              ? ` • ${subCategory}`
              : ''}
          </Text>

          <Text style={styles.location}>
            {property?.location ||
              property?.locality ||
              ''}
            {property?.city
              ? `, ${property.city}`
              : ''}
          </Text>

          <Text style={styles.price}>
            ₹{' '}
            {formatRentalPrice(
              property?.price ||
                property?.rent ||
                property?.monthlyRent ||
                0,
            )}{' '}
            / Month
          </Text>
        </LinearGradient>
      )}

      {/* =====================================================
          FAVORITE + SHARE
      ===================================================== */}

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            setIsFavourite(!isFavourite)
          }>
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
            {marginLeft: 10},
          ]}
          onPress={onShare}>
          <Icon
            name="share-variant"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* =====================================================
          IMAGE COUNTER
      ===================================================== */}

      {hasAnyImages && images.length > 0 && (
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      )}

      {/* =====================================================
          IMAGE DOTS
      ===================================================== */}

      {hasAnyImages && images.length > 1 && (
        <View style={styles.dots}>
          {images.map((item, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index &&
                  styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}

      {/* =====================================================
          FULL SCREEN IMAGE VIEWER
      ===================================================== */}

      {images.length > 0 && (
        <ImageViewing
          images={images}
          imageIndex={currentIndex}
          visible={visible}
          onRequestClose={() =>
            setVisible(false)
          }
        />
      )}
    </View>
  );
};

export default RentalImageCarousel;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  image: {
    width: width,
    height: IMAGE_HEIGHT,
  },

  headerVideo: {
    width: width,
    height: IMAGE_HEIGHT,
    backgroundColor: '#000',
  },

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
    fontWeight: '500',
  },

  // =======================================================
  // TABS
  // =======================================================

  tabContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#fff',

    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 25,

    marginRight: 10,

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  activeTab: {
    backgroundColor: '#1959A2',
    borderColor: '#1959A2',
  },

  tabText: {
    marginLeft: 5,
    fontSize: 11,
    color: '#444',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#fff',
  },

  // =======================================================
  // COUNTER
  // =======================================================

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

  // =======================================================
  // GRADIENT OVERLAY
  // =======================================================

  overlay: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: 25,

    paddingHorizontal: 18,

    paddingTop: 45,
    paddingBottom: 10,
  },

  propertyName: {
    color: '#fff',

    fontSize: 22,

    fontWeight: '700',

    maxWidth: width - 90,
  },

  propertyType: {
    color: '#fff',

    marginTop: 5,

    fontSize: 13,

    fontWeight: '600',
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

  // =======================================================
  // ACTION BUTTONS
  // =======================================================

  actionContainer: {
    position: 'absolute',

    top: 70,
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

  // =======================================================
  // DOTS
  // =======================================================

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
});