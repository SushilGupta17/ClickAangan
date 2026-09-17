
import React, {useEffect, useMemo, useState} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Header from '../components/Header';
import Footer from '../components/Footer';
import {formatPrice} from '../helpers/priceHelper';

const API_URL = 'https://savariyaproperty.in';

const WishlistScreen = ({navigation}) => {
  const [wishlist, setWishlist] = useState([]);

  // ==========================================
  // MEDIA URL
  // ==========================================

  const getMediaUrl = path => {
    if (!path) {
      return '';
    }

    const cleanPath = String(path)
      .replace(/\\/g, '/')
      .trim();

    if (
      cleanPath.startsWith('http://') ||
      cleanPath.startsWith('https://')
    ) {
      return cleanPath;
    }

    return `${API_URL}/${cleanPath.replace(/^\/+/, '')}`;
  };

  // ==========================================
  // LOAD WISHLIST
  // ==========================================

  const loadWishlist = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem('wishlist');

      console.log('================================');
      console.log('WISHLIST RAW:', savedWishlist);
      console.log('================================');

      if (!savedWishlist) {
        setWishlist([]);
        return;
      }

      const parsedWishlist = JSON.parse(savedWishlist);

      if (Array.isArray(parsedWishlist)) {
        setWishlist(parsedWishlist);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.log('WISHLIST LOAD ERROR:', error);
      setWishlist([]);
    }
  };

  // ==========================================
  // SCREEN FOCUS
  // ==========================================

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWishlist();
    });

    return unsubscribe;
  }, [navigation]);

  // ==========================================
  // REMOVE
  // ==========================================

  const removeFromWishlist = async id => {
    try {
      const updatedWishlist = wishlist.filter(
        item => String(item?.id) !== String(id),
      );

      await AsyncStorage.setItem(
        'wishlist',
        JSON.stringify(updatedWishlist),
      );

      setWishlist(updatedWishlist);

      console.log('REMOVED FROM WISHLIST:', id);
    } catch (error) {
      console.log('REMOVE WISHLIST ERROR:', error);

      Alert.alert(
        'Error',
        'Unable to remove property from wishlist.',
      );
    }
  };

  // ==========================================
  // CONFIRM REMOVE
  // ==========================================

  const confirmRemove = item => {
    const title =
      item?.propertyTitle ||
      item?.PropertyTitle ||
      item?.title ||
      item?.Title ||
      item?.propertyName ||
      item?.PropertyName ||
      'this property';

    Alert.alert(
      'Remove from Wishlist',
      `Remove "${title}" from your wishlist?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromWishlist(item?.id),
        },
      ],
    );
  };

  // ==========================================
  // OPEN PROPERTY
  // ==========================================

  const openProperty = item => {
    navigation.navigate('PropertyDetails', {
      property: item,
      id: item?.id,
    });
  };

  // ==========================================
  // PROPERTY IMAGES
  // ProjectCard style handling
  // ==========================================

  const getPropertyImages = item => {
    let images = [];

    // ------------------------------------------
    // 1. images
    // ------------------------------------------

    if (item?.images) {
      if (typeof item.images === 'string') {
        images = item.images
          .split(',')
          .map(x => x.trim())
          .filter(Boolean);
      }

      if (Array.isArray(item.images)) {
        images = item.images
          .map(x => {
            if (typeof x === 'string') {
              return x;
            }

            return (
              x?.imageUrl ||
              x?.ImageUrl ||
              x?.url ||
              x?.Url ||
              x?.path ||
              x?.Path ||
              ''
            );
          })
          .filter(Boolean);
      }
    }

    // ------------------------------------------
    // 2. cover image
    // ------------------------------------------

    if (images.length === 0) {
      const coverImage =
        item?.coverImage ||
        item?.CoverImage ||
        item?.coverImagePath ||
        item?.CoverImagePath ||
        item?.propertyImage ||
        item?.PropertyImage ||
        item?.imageUrl ||
        item?.ImageUrl ||
        item?.image ||
        item?.Image ||
        '';

      if (coverImage) {
        images.push(coverImage);
      }
    }

    // ------------------------------------------
    // FINAL URL
    // ------------------------------------------

    const finalImages = images
      .map(x => getMediaUrl(x))
      .filter(Boolean);

    console.log('================================');
    console.log('PROPERTY:', item?.propertyTitle || item?.title);
    console.log('IMAGE PATHS:', images);
    console.log('FINAL IMAGE URLS:', finalImages);
    console.log('================================');

    return finalImages;
  };

  // ==========================================
  // PROPERTY TITLE
  // ==========================================

  const getPropertyTitle = item => {
    return (
      item?.propertyTitle ||
      item?.PropertyTitle ||
      item?.title ||
      item?.Title ||
      item?.propertyName ||
      item?.PropertyName ||
      'Property'
    );
  };

  // ==========================================
  // LOCATION
  // ==========================================

  const getLocation = item => {
    const locality =
      item?.locality ||
      item?.Locality ||
      '';

    const city =
      item?.city ||
      item?.City ||
      '';

    if (locality && city) {
      return `${locality}, ${city}`;
    }

    return (
      locality ||
      city ||
      item?.location ||
      item?.Location ||
      'Location not available'
    );
  };

  // ==========================================
  // PRICE
  // ==========================================

  const getPrice = item => {
    const price =
      item?.price ??
      item?.Price ??
      item?.minPrice ??
      item?.MinPrice ??
      0;

    return formatPrice(price);
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = item => {
    return (
      item?.propertyStatus ||
      item?.PropertyStatus ||
      item?.status ||
      item?.Status ||
      item?.listingType ||
      item?.ListingType ||
      'Available'
    );
  };

  // ==========================================
  // OWNER / BUILDER
  // ==========================================

  const getOwner = item => {
    return (
      item?.builderName ||
      item?.BuilderName ||
      item?.ownerName ||
      item?.OwnerName ||
      item?.postedBy ||
      item?.PostedBy ||
      ''
    );
  };

  // ==========================================
  // EMPTY
  // ==========================================

  if (wishlist.length === 0) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <Header />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}>

          <View style={styles.headingCard}>
            <Text style={styles.heading}>
              My Wishlist
            </Text>

            <Text style={styles.subHeading}>
              Your favourite properties are saved here.
            </Text>
          </View>

          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Icon
                name="heart"
                size={38}
                color="#E53935"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Favourite Properties
            </Text>

            <Text style={styles.emptyText}>
              Save your favourite properties and they
              {'\n'}
              will appear here.
            </Text>

            <TouchableOpacity
              style={styles.exploreButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Home')}>

              <Icon
                name="search"
                size={14}
                color="#FFF"
              />

              <Text style={styles.exploreButtonText}>
                Explore Properties
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Footer />
      </SafeAreaView>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>

        {/* ======================================
            HEADER
        ====================================== */}

        <View style={styles.headingCard}>
          <Text style={styles.heading}>
            My Wishlist
          </Text>

          <Text style={styles.subHeading}>
            Your favourite properties are saved here.
          </Text>

          <View style={styles.countRow}>
            <Icon
              name="heart"
              size={13}
              color="#E53935"
            />

            <Text style={styles.countText}>
              {wishlist.length}{' '}
              {wishlist.length === 1
                ? 'Favourite Property'
                : 'Favourite Properties'}
            </Text>
          </View>
        </View>

        {/* ======================================
            WISHLIST CARDS
        ====================================== */}

        {wishlist.map((item, index) => {
          const images = getPropertyImages(item);

          const title = getPropertyTitle(item);
          const location = getLocation(item);
          const price = getPrice(item);
          const status = getStatus(item);
          const owner = getOwner(item);

          const imageUrl =
            images.length > 0
              ? images[0]
              : '';

          return (
            <View
              key={`${item?.id}-${index}`}
              style={styles.card}>

              {/* ==================================
                  MEDIA
              ================================== */}

              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => openProperty(item)}>

                {imageUrl ? (
                  <Image
                    source={{uri: imageUrl}}
                    style={styles.propertyImage}
                    resizeMode="cover"

                    onLoad={() => {
                      console.log(
                        'WISHLIST IMAGE LOADED:',
                        imageUrl,
                      );
                    }}

                    onError={error => {
                      console.log(
                        '================================',
                      );

                      console.log(
                        'WISHLIST IMAGE ERROR',
                      );

                      console.log(
                        'IMAGE URL:',
                        imageUrl,
                      );

                      console.log(
                        'ERROR:',
                        error?.nativeEvent,
                      );

                      console.log(
                        '================================',
                      );
                    }}
                  />
                ) : (
                  <View style={styles.noMedia}>
                    <Icon
                      name="image"
                      size={35}
                      color="#999"
                    />

                    <Text style={styles.noMediaText}>
                      No Image Available
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* ==================================
                  STATUS BADGES
              ================================== */}

              <View style={styles.statusRow}>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {status}
                  </Text>
                </View>

                <View style={styles.reraBadge}>
                  <Icon
                    name="check-circle"
                    color="#28A745"
                    size={12}
                  />

                  <Text style={styles.reraText}>
                    Verified
                  </Text>
                </View>

              </View>

              {/* ==================================
                  BODY
              ================================== */}

              <View style={styles.body}>

                {/* PROPERTY NAME */}

                <Text
                  numberOfLines={1}
                  style={styles.propertyName}>

                  {title}

                </Text>

                {/* OWNER */}

                {owner ? (
                  <Text
                    numberOfLines={1}
                    style={styles.builder}>

                    By {owner}

                  </Text>
                ) : null}

                {/* LOCATION */}

                <View style={styles.locationRow}>

                  <Icon
                    name="map-marker-alt"
                    color="#FF5722"
                    size={13}
                  />

                  <Text
                    numberOfLines={1}
                    style={styles.location}>

                    {location}

                  </Text>

                </View>

                {/* PRICE */}

                <View style={styles.priceRow}>

                  <Text style={styles.price}>
                    ₹ {price}
                  </Text>

                </View>

                {/* ==================================
                    BUTTONS
                ================================== */}

                <View style={styles.buttonRow}>

                  {/* VIEW DETAILS */}

                  <TouchableOpacity
                    style={styles.detailsBtn}
                    activeOpacity={0.8}
                    onPress={() => openProperty(item)}>

                    <Icon
                      name="eye"
                      size={13}
                      color="#FFF"
                    />

                    <Text style={styles.detailsText}>
                      View Details
                    </Text>

                  </TouchableOpacity>

                  {/* REMOVE */}

                  <TouchableOpacity
                    style={styles.removeBtn}
                    activeOpacity={0.8}
                    onPress={() => confirmRemove(item)}>

                    <Icon
                      name="heart-broken"
                      size={13}
                      color="#FFF"
                    />

                    <Text style={styles.removeText}>
                      Remove
                    </Text>

                  </TouchableOpacity>

                </View>

              </View>
            </View>
          );
        })}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

export default WishlistScreen;


// ==========================================
// STYLES
// Same ProjectCard Theme
// ==========================================

const styles = StyleSheet.create({

  // ========================================
  // SAFE CONTAINER
  // ========================================

  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // ========================================
  // CONTAINER
  // ========================================

  container: {
    padding: 12,
    paddingBottom: 110,
  },

  // ========================================
  // HEADING CARD
  // ========================================

  headingCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 8,
    elevation: 4,
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  subHeading: {
    marginTop: 6,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  countRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#E53935',
    fontWeight: '700',
  },

  // ========================================
  // CARD
  // ========================================

  card: {
    marginVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 5,
  },

  // ========================================
  // IMAGE
  // ========================================

  propertyImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#F2F2F2',
  },

  // ========================================
  // NO MEDIA
  // ========================================

  noMedia: {
    width: '100%',
    height: 220,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noMediaText: {
    marginTop: 8,
    color: '#999',
    fontSize: 13,
  },

  // ========================================
  // STATUS
  // ========================================

  statusRow: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  statusBadge: {
    backgroundColor: '#28A745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },

  reraBadge: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },

  reraText: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: '700',
  },

  // ========================================
  // BODY
  // ========================================

  body: {
    padding: 15,
  },

  // ========================================
  // PROPERTY NAME
  // ========================================

  propertyName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
  },

  // ========================================
  // BUILDER
  // ========================================

  builder: {
    marginTop: 4,
    color: '#666',
    fontSize: 14,
  },

  // ========================================
  // LOCATION
  // ========================================

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  location: {
    marginLeft: 8,
    color: '#555',
    flex: 1,
    fontSize: 12,
  },

  // ========================================
  // PRICE
  // ========================================

  priceRow: {
    marginTop: 14,
  },

  price: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },

  // ========================================
  // BUTTON ROW
  // ========================================

  buttonRow: {
    flexDirection: 'row',
    marginTop: 18,
  },

  // ========================================
  // DETAILS
  // ========================================

  detailsBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#102A47',
    paddingVertical: 14,
    borderRadius: 10,
    marginRight: 6,
  },

  detailsText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 7,
  },

  // ========================================
  // REMOVE
  // ========================================

  removeBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingVertical: 14,
    borderRadius: 10,
    marginLeft: 6,
  },

  removeText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 7,
  },

  // ========================================
  // EMPTY
  // ========================================

  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 40,
    alignItems: 'center',
    elevation: 4,
    marginTop: 8,
  },

  emptyIconCircle: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 21,
    fontWeight: '700',
    color: '#222',
  },

  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  exploreButton: {
    marginTop: 25,
    backgroundColor: '#0A8754',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  exploreButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});

