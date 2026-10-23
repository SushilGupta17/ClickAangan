import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Header from '../components/Header';
import Footer from '../components/Footer';
import {formatPrice} from '../helpers/priceHelper';
import {useAppAlert} from '../utils/AppAlert';

const API_URL = 'https://savariyaproperty.in';

const WishlistScreen = ({navigation}) => {
  const {error} = useAppAlert();

  const [wishlist, setWishlist] = useState([]);

  // REMOVE CONFIRMATION MODAL
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [selectedWishlistItem, setSelectedWishlistItem] = useState(null);

  // =========================================================
  // MEDIA URL
  // =========================================================
  const getMediaUrl = url => {
    if (!url) {
      return null;
    }

    const value = String(url).trim();

    if (!value) {
      return null;
    }

    if (
      value.startsWith('http://') ||
      value.startsWith('https://')
    ) {
      return value;
    }

    if (value.startsWith('/')) {
      return `${API_URL}${value}`;
    }

    return `${API_URL}/${value}`;
  };

  // =========================================================
  // LOAD WISHLIST
  // =========================================================
  const loadWishlist = async () => {
    try {
      const storedWishlist = await AsyncStorage.getItem('wishlist');

      if (!storedWishlist) {
        setWishlist([]);
        return;
      }

      const parsedWishlist = JSON.parse(storedWishlist);

      if (Array.isArray(parsedWishlist)) {
        setWishlist(parsedWishlist);
      } else {
        setWishlist([]);
      }
    } catch (err) {
      console.log('LOAD WISHLIST ERROR:', err);
      setWishlist([]);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    loadWishlist();
  }, []);

  // =========================================================
  // RELOAD WHEN SCREEN GETS FOCUS
  // =========================================================
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWishlist();
    });

    return unsubscribe;
  }, [navigation]);

  // =========================================================
  // REMOVE FROM WISHLIST
  // =========================================================
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

      return true;
    } catch (err) {
      console.log('REMOVE WISHLIST ERROR:', err);

      error(
        'Error',
        'Unable to remove property from wishlist.',
      );

      return false;
    }
  };

  // =========================================================
  // OPEN REMOVE CONFIRMATION
  // =========================================================
  const confirmRemove = item => {
    console.log('REMOVE BUTTON CLICKED:', item);

    setSelectedWishlistItem(item);
    setShowRemoveConfirm(true);
  };

  // =========================================================
  // PERFORM REMOVE
  // =========================================================
  const performRemove = async () => {
    if (!selectedWishlistItem?.id) {
      setShowRemoveConfirm(false);
      setSelectedWishlistItem(null);
      return;
    }

    const removed = await removeFromWishlist(
      selectedWishlistItem.id,
    );

    if (removed) {
      setShowRemoveConfirm(false);
      setSelectedWishlistItem(null);
    }
  };

  // =========================================================
  // OPEN PROPERTY
  // =========================================================
  const openProperty = item => {
    navigation.navigate('PropertyDetails', {
      property: item,
      id: item?.id,
    });
  };

  // =========================================================
  // GET PROPERTY IMAGES
  // =========================================================
  const getPropertyImages = item => {
    let images = [];

    // Images string
    if (typeof item?.images === 'string') {
      images = item.images
        .split(',')
        .map(x => x.trim())
        .filter(Boolean);
    }

    // Images array
    if (Array.isArray(item?.images)) {
      images = item.images;
    }

    // Other possible fields
    if (!images.length && item?.coverImage) {
      images = [item.coverImage];
    }

    if (!images.length && item?.CoverImage) {
      images = [item.CoverImage];
    }

    if (!images.length && item?.image) {
      images = [item.image];
    }

    if (!images.length && item?.Image) {
      images = [item.Image];
    }

    return images
      .map(image => {
        if (typeof image === 'object') {
          return (
            image?.imageUrl ||
            image?.ImageUrl ||
            image?.url ||
            image?.Url ||
            null
          );
        }

        return image;
      })
      .filter(Boolean)
      .slice(0, 5)
      .map(getMediaUrl)
      .filter(Boolean);
  };

  // =========================================================
  // PROPERTY TITLE
  // =========================================================
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

  // =========================================================
  // LOCATION
  // =========================================================
  const getLocation = item => {
    return (
      item?.location ||
      item?.Location ||
      item?.locality ||
      item?.Locality ||
      item?.city ||
      item?.City ||
      'Location not available'
    );
  };

  // =========================================================
  // PRICE
  // =========================================================
  const getPrice = item => {
    const price =
      item?.price ??
      item?.Price ??
      item?.propertyPrice ??
      item?.PropertyPrice ??
      0;

    if (!price) {
      return 'Price on Request';
    }

    try {
      return formatPrice(price);
    } catch (err) {
      return String(price);
    }
  };

  // =========================================================
  // STATUS
  // =========================================================
  const getStatus = item => {
    return (
      item?.status ||
      item?.Status ||
      item?.purpose ||
      item?.Purpose ||
      'SALE'
    );
  };

  // =========================================================
  // OWNER
  // =========================================================
  const getOwner = item => {
    return (
      item?.ownerName ||
      item?.OwnerName ||
      item?.name ||
      item?.Name ||
      'Property Owner'
    );
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        
        {/* =====================================================
            HEADER
        ====================================================== */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>My Wishlist</Text>

            <Text style={styles.pageSubtitle}>
              Properties you have saved
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Icon
              name="heart"
              size={13}
              color="#F58220"
            />

            <Text style={styles.countText}>
              {wishlist.length}
            </Text>
          </View>
        </View>

        {/* =====================================================
            EMPTY WISHLIST
        ====================================================== */}
        {wishlist.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Icon
                name="heart"
                size={34}
                color="#F58220"
              />
            </View>

            <Text style={styles.emptyTitle}>
              Your Wishlist is Empty
            </Text>

            <Text style={styles.emptyText}>
              Save properties you like and easily find them
              here later.
            </Text>

            <TouchableOpacity
              style={styles.browseButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Home')}>
              <Icon
                name="search"
                size={13}
                color="#FFFFFF"
              />

              <Text style={styles.browseButtonText}>
                Browse Properties
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ===================================================
             WISHLIST LIST
          ==================================================== */
          <View style={styles.listContainer}>
            {wishlist.map((item, index) => {
              const images = getPropertyImages(item);
              const title = getPropertyTitle(item);
              const location = getLocation(item);
              const price = getPrice(item);
              const status = getStatus(item);
              const owner = getOwner(item);

              const imageUrl =
                images.length > 0 ? images[0] : null;

              return (
                <TouchableOpacity
                  key={`${item?.id || 'property'}-${index}`}
                  style={styles.propertyCard}
                  activeOpacity={0.92}
                  onPress={() => openProperty(item)}>

                  {/* =================================================
                      IMAGE
                  ================================================== */}
                  <View style={styles.imageContainer}>
                    {imageUrl ? (
                      <Image
                        source={{uri: imageUrl}}
                        style={styles.propertyImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.noImage}>
                        <Icon
                          name="home"
                          size={32}
                          color="#B8C4D1"
                        />

                        <Text style={styles.noImageText}>
                          No Image
                        </Text>
                      </View>
                    )}

                    {/* STATUS */}
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>
                        {String(status).toUpperCase()}
                      </Text>
                    </View>

                    {/* IMAGE COUNT */}
                    {images.length > 1 && (
                      <View style={styles.imageCount}>
                        <Icon
                          name="images"
                          size={11}
                          color="#FFFFFF"
                        />

                        <Text style={styles.imageCountText}>
                          {images.length}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* =================================================
                      DETAILS
                  ================================================== */}
                  <View style={styles.detailsContainer}>
                    <Text
                      style={styles.propertyTitle}
                      numberOfLines={2}>
                      {title}
                    </Text>

                    <View style={styles.locationRow}>
                      <Icon
                        name="map-marker-alt"
                        size={12}
                        color="#F58220"
                      />

                      <Text
                        style={styles.locationText}
                        numberOfLines={1}>
                        {location}
                      </Text>
                    </View>

                    <Text style={styles.priceText}>
                      {price}
                    </Text>

                    <View style={styles.ownerRow}>
                      <Icon
                        name="user"
                        size={11}
                        color="#7A8795"
                      />

                      <Text
                        style={styles.ownerText}
                        numberOfLines={1}>
                        {owner}
                      </Text>
                    </View>

                    {/* REMOVE BUTTON */}
                    <TouchableOpacity
                      style={styles.removeBtn}
                      activeOpacity={0.8}
                      onPress={e => {
                        e.stopPropagation();
                        confirmRemove(item);
                      }}>
                      <Icon
                        name="heart-broken"
                        size={13}
                        color="#FFFFFF"
                      />

                      <Text style={styles.removeText}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      <Footer />

      {/* =========================================================
          REMOVE CONFIRMATION MODAL
      ========================================================== */}
      {showRemoveConfirm && (
        <View style={styles.removeOverlay}>
          <View style={styles.removeDialog}>

            {/* ICON */}
            <View style={styles.removeIcon}>
              <Icon
                name="heart-broken"
                size={22}
                color="#E53935"
              />
            </View>

            {/* TITLE */}
            <Text style={styles.removeTitle}>
              Remove from Wishlist
            </Text>

            {/* MESSAGE */}
            <Text style={styles.removeMessage}>
              Remove "
              {selectedWishlistItem
                ? getPropertyTitle(selectedWishlistItem)
                : 'this property'}
              " from your wishlist?
            </Text>

            {/* ACTION BUTTONS */}
            <View style={styles.removeActions}>

              {/* CANCEL */}
              <TouchableOpacity
                style={styles.cancelRemoveBtn}
                activeOpacity={0.8}
                onPress={() => {
                  setShowRemoveConfirm(false);
                  setSelectedWishlistItem(null);
                }}>
                <Text style={styles.cancelRemoveText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* REMOVE */}
              <TouchableOpacity
                style={styles.confirmRemoveBtn}
                activeOpacity={0.8}
                onPress={performRemove}>
                <Icon
                  name="heart-broken"
                  size={12}
                  color="#FFFFFF"
                />

                <Text style={styles.confirmRemoveText}>
                  Remove
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default WishlistScreen;

// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  // ===========================================================
  // PAGE HEADER
  // ===========================================================

  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#012353',
  },

  pageSubtitle: {
    fontSize: 13,
    color: '#7A8795',
    marginTop: 3,
  },

  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  countText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#012353',
  },

  // ===========================================================
  // LIST
  // ===========================================================

  listContainer: {
    width: '100%',
  },

  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  // ===========================================================
  // IMAGE
  // ===========================================================

  imageContainer: {
    width: 125,
    height: 155,
    backgroundColor: '#EEF2F6',
    position: 'relative',
  },

  propertyImage: {
    width: '100%',
    height: '100%',
  },

  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noImageText: {
    marginTop: 5,
    fontSize: 11,
    color: '#9AA5B1',
  },

  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#012353',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  imageCount: {
    position: 'absolute',
    right: 7,
    bottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.60)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 5,
  },

  imageCountText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 4,
  },

  // ===========================================================
  // DETAILS
  // ===========================================================

  detailsContainer: {
    flex: 1,
    padding: 12,
  },

  propertyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#012353',
    lineHeight: 21,
    marginBottom: 7,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  locationText: {
    flex: 1,
    marginLeft: 5,
    fontSize: 12,
    color: '#6B7280',
  },

  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F58220',
    marginBottom: 6,
  },

  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  ownerText: {
    flex: 1,
    marginLeft: 5,
    fontSize: 11,
    color: '#7A8795',
  },

  // ===========================================================
  // REMOVE BUTTON
  // ===========================================================

  removeBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E53935',
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 6,
  },

  removeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
  },

  // ===========================================================
  // EMPTY STATE
  // ===========================================================

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 25,
    paddingVertical: 45,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#012353',
    textAlign: 'center',
    marginBottom: 7,
  },

  emptyText: {
    fontSize: 13,
    color: '#7A8795',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
    marginBottom: 20,
  },

  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#012353',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 7,
  },

  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 7,
  },

  bottomSpace: {
    height: 130,
  },

  // ===========================================================
  // REMOVE MODAL
  // ===========================================================

  removeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(0,0,0,0.35)',

    justifyContent: 'flex-start',
    alignItems: 'center',

    zIndex: 999999,
    elevation: 999999,
  },

  removeDialog: {
    width: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,

    marginTop: 85,

    padding: 20,

    elevation: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },

  removeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,

    backgroundColor: '#FFF0F0',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'center',

    marginBottom: 12,
  },

  removeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#012353',

    textAlign: 'center',

    marginBottom: 7,
  },

  removeMessage: {
    fontSize: 14,
    color: '#6B7280',

    textAlign: 'center',

    lineHeight: 21,

    marginBottom: 20,
  },

  removeActions: {
    flexDirection: 'row',

    justifyContent: 'flex-end',

    alignItems: 'center',
  },

  cancelRemoveBtn: {
    minWidth: 80,

    paddingVertical: 9,
    paddingHorizontal: 18,

    borderRadius: 7,

    borderWidth: 1,
    borderColor: '#D1D5DB',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  cancelRemoveText: {
    color: '#6B7280',

    fontSize: 13,

    fontWeight: '700',
  },

  confirmRemoveBtn: {
    minWidth: 90,

    paddingVertical: 9,
    paddingHorizontal: 18,

    borderRadius: 7,

    backgroundColor: '#E53935',

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmRemoveText: {
    color: '#FFFFFF',

    fontSize: 13,

    fontWeight: '700',

    marginLeft: 6,
  },
});