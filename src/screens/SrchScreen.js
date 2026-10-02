
import React, {useMemo, useState} from 'react';

import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import Header from '../components/Header';
import Footer from '../components/Footer';
import {formatPrice} from '../helpers/priceHelper';

const API_URL = 'https://clickaangan.in';

const SearchScreen = ({navigation}) => {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budgetFrom, setBudgetFrom] = useState('');
  const [budgetTo, setBudgetTo] = useState('');

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // MEDIA URL
  // =========================================================

const getMediaUrl = path => {
  if (!path) {
    return '';
  }

  let cleanPath = String(path)
    .trim()
    .replace(/\\/g, '/');

  if (!cleanPath) {
    return '';
  }

  // Already full URL
  if (
    cleanPath.startsWith('http://') ||
    cleanPath.startsWith('https://')
  ) {
    return cleanPath;
  }

  // Remove starting slash
  cleanPath = cleanPath.replace(/^\/+/, '');

  // Remove duplicate domain if accidentally present
  cleanPath = cleanPath.replace(
    /^savariyaproperty\.in\//,
    '',
  );

  const finalUrl = `${API_URL}/${cleanPath}`;

  console.log('MEDIA URL:', finalUrl);

  return finalUrl;
};

  // =========================================================
  // PROPERTY IMAGES
  // Same logic as WishlistScreen
  // =========================================================

// =========================================================
// PROPERTY IMAGES
// =========================================================

const getPropertyImages = item => {
  try {
    let images = [];

    console.log('====================================');
    console.log('SEARCH PROPERTY RAW ITEM:');
    console.log(JSON.stringify(item, null, 2));
    console.log('====================================');

    // ==========================================
    // 1. DIRECT IMAGE ARRAY / STRING
    // ==========================================

    const imageFields = [
      item?.images,
      item?.Images,
      item?.propertyImages,
      item?.PropertyImages,
      item?.galleryImages,
      item?.GalleryImages,
      item?.imagePaths,
      item?.ImagePaths,
    ];

    imageFields.forEach(field => {
      if (!field) return;

      // STRING
      if (typeof field === 'string') {
        // JSON string array
        if (field.trim().startsWith('[')) {
          try {
            const parsed = JSON.parse(field);

            if (Array.isArray(parsed)) {
              parsed.forEach(x => {
                if (typeof x === 'string') {
                  images.push(x);
                } else if (x) {
                  images.push(
                    x?.imageUrl ||
                      x?.ImageUrl ||
                      x?.url ||
                      x?.Url ||
                      x?.path ||
                      x?.Path ||
                      x?.imagePath ||
                      x?.ImagePath ||
                      x?.filePath ||
                      x?.FilePath ||
                      '',
                  );
                }
              });
            }
          } catch (e) {
            images.push(field);
          }
        } else {
          // Comma separated
          field
            .split(',')
            .map(x => x.trim())
            .filter(Boolean)
            .forEach(x => images.push(x));
        }
      }

      // ARRAY
      if (Array.isArray(field)) {
        field.forEach(x => {
          if (typeof x === 'string') {
            images.push(x);
          } else if (x) {
            images.push(
              x?.imageUrl ||
                x?.ImageUrl ||
                x?.url ||
                x?.Url ||
                x?.path ||
                x?.Path ||
                x?.imagePath ||
                x?.ImagePath ||
                x?.filePath ||
                x?.FilePath ||
                x?.propertyImage ||
                x?.PropertyImage ||
                '',
            );
          }
        });
      }
    });

    // ==========================================
    // 2. FALLBACK SINGLE IMAGE
    // ==========================================

    if (images.length === 0) {
      const fallbackImage =
        item?.coverImage ||
        item?.CoverImage ||
        item?.coverImagePath ||
        item?.CoverImagePath ||
        item?.propertyImage ||
        item?.PropertyImage ||
        item?.propertyImagePath ||
        item?.PropertyImagePath ||
        item?.imageUrl ||
        item?.ImageUrl ||
        item?.imagePath ||
        item?.ImagePath ||
        item?.filePath ||
        item?.FilePath ||
        item?.image ||
        item?.Image ||
        item?.thumbnail ||
        item?.Thumbnail ||
        '';

      if (fallbackImage) {
        images.push(fallbackImage);
      }
    }

    // ==========================================
    // 3. CLEAN + CREATE FULL URL
    // ==========================================

    const finalImages = [
      ...new Set(
        images
          .filter(Boolean)
          .map(x => getMediaUrl(x))
          .filter(Boolean),
      ),
    ];

    console.log('====================================');
    console.log('SEARCH IMAGE PATHS:', images);
    console.log('SEARCH FINAL IMAGE URLS:', finalImages);
    console.log('====================================');

    return finalImages;
  } catch (error) {
    console.log('GET PROPERTY IMAGE ERROR:', error);
    return [];
  }
};

  // =========================================================
  // SEARCH API
  // =========================================================

  const searchProperties = async (
    locationValue,
    proptype,
    budgetfr,
    budgetto,
  ) => {
    try {
      const params = new URLSearchParams();

      if (locationValue) {
        params.append('location', locationValue);
      }

      if (proptype) {
        params.append('proptype', proptype);
      }

      if (budgetfr) {
        params.append('budgetfr', budgetfr.toString());
      }

      if (budgetto) {
        params.append('budgetto', budgetto.toString());
      }

      const url =
        `${API_URL}/api/search/SearchProperty?${params.toString()}`;

      console.log('=================================');
      console.log('SEARCH API URL:', url);
      console.log('=================================');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('SEARCH STATUS:', response.status);

      if (response.status === 404) {
        return [];
      }

      if (!response.ok) {
        console.log('SEARCH HTTP ERROR:', response.status);
        return [];
      }

      const data = await response.json();

      console.log(
        'SEARCH RESULT:',
        JSON.stringify(data, null, 2),
      );

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      if (Array.isArray(data?.result)) {
        return data.result;
      }

      if (Array.isArray(data?.properties)) {
        return data.properties;
      }

      return [];
    } catch (error) {
      console.error('Search Error:', error);
      return [];
    }
  };

  // =========================================================
  // SEARCH BUTTON
  // =========================================================

  const handleSearch = async () => {
    setLoading(true);

    const data = await searchProperties(
      location.trim(),
      propertyType.trim(),
      budgetFrom,
      budgetTo,
    );

    setFilteredProperties(data);
    setSearched(true);
    setLoading(false);
  };

  // =========================================================
  // OPEN PROPERTY
  // =========================================================

  const openProperty = item => {
    navigation.navigate('PropertyDetails', {
      property: item,
      id: item?.id || item?.Id,
    });
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

  // =========================================================
  // PRICE
  // =========================================================

  const getPrice = item => {
    const price =
      item?.price ??
      item?.Price ??
      item?.minPrice ??
      item?.MinPrice ??
      0;

    return formatPrice(price);
  };

  // =========================================================
  // STATUS
  // =========================================================

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

  // =========================================================
  // OWNER / BUILDER
  // =========================================================

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

  // =========================================================
  // PROPERTY TYPE
  // =========================================================

  const getPropertyType = item => {
    return (
      item?.propertyType ||
      item?.PropertyType ||
      item?.propType ||
      item?.PropType ||
      ''
    );
  };

  // =========================================================
  // PROPERTY CARD
  // Same design as WishlistScreen
  // =========================================================

  const PropertyCard = ({item}) => {
    const images = useMemo(
      () => getPropertyImages(item),
      [item],
    );

    const title = getPropertyTitle(item);
    const locationText = getLocation(item);
    const price = getPrice(item);
    const status = getStatus(item);
    const owner = getOwner(item);
    const propertyTypeText = getPropertyType(item);

    const imageUrl =
      images.length > 0
        ? images[0]
        : '';

    return (
      <View style={styles.card}>

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
                  'SEARCH IMAGE LOADED:',
                  imageUrl,
                );
              }}
              onError={error => {
                console.log(
                  '================================',
                );

                console.log(
                  'SEARCH IMAGE ERROR',
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

          {/* PROPERTY TYPE */}

          {propertyTypeText ? (
            <Text
              numberOfLines={1}
              style={styles.propertyType}>

              {propertyTypeText}

            </Text>
          ) : null}

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

              {locationText}

            </Text>

          </View>

          {/* PRICE */}

          <View style={styles.priceRow}>

            <Text style={styles.price}>
              ₹ {price}
            </Text>

          </View>

          {/* ==================================
              VIEW DETAILS
          ================================== */}

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

        </View>

      </View>
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <SafeAreaView style={styles.safeContainer}>

      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">

        {/* =========================================
            SEARCH CARD
        ========================================= */}

        <View style={styles.searchCard}>

          <View style={styles.searchIconCircle}>

            <Icon
              name="search"
              size={22}
              color="#102A47"
            />

          </View>

          <Text style={styles.heading}>
            Find Your Dream Property
          </Text>

          <Text style={styles.subHeading}>
            Search properties by location, type and budget.
          </Text>

          {/* LOCATION */}

          <View style={styles.inputWrapper}>

            <Icon
              name="map-marker-alt"
              size={15}
              color="#FF5722"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter Location"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />

          </View>

          {/* PROPERTY TYPE */}

          <View style={styles.inputWrapper}>

            <Icon
              name="home"
              size={15}
              color="#102A47"
            />

            <TextInput
              style={styles.input}
              placeholder="Property Type"
              placeholderTextColor="#999"
              value={propertyType}
              onChangeText={setPropertyType}
            />

          </View>

          {/* BUDGET FROM */}

          <View style={styles.inputWrapper}>

            <Icon
              name="rupee-sign"
              size={15}
              color="#28A745"
            />

            <TextInput
              style={styles.input}
              placeholder="Budget From"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={budgetFrom}
              onChangeText={setBudgetFrom}
            />

          </View>

          {/* BUDGET TO */}

          <View style={styles.inputWrapper}>

            <Icon
              name="rupee-sign"
              size={15}
              color="#28A745"
            />

            <TextInput
              style={styles.input}
              placeholder="Budget To"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={budgetTo}
              onChangeText={setBudgetTo}
            />

          </View>

          {/* SEARCH BUTTON */}

          <TouchableOpacity
            style={[
              styles.searchButton,
              loading && styles.searchButtonDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleSearch}
            disabled={loading}>

            <Icon
              name="search"
              size={16}
              color="#FFF"
            />

            <Text style={styles.searchButtonText}>
              {loading
                ? 'Searching...'
                : 'Search Properties'}
            </Text>

          </TouchableOpacity>

        </View>

        {/* =========================================
            RESULT HEADER
        ========================================= */}

        <View style={styles.resultHeader}>

          <Text style={styles.resultHeading}>

            {searched
              ? `Search Results (${filteredProperties.length})`
              : 'Search Results'}

          </Text>

          {searched &&
            filteredProperties.length > 0 ? (
            <View style={styles.resultCountBadge}>

              <Text style={styles.resultCountText}>
                {filteredProperties.length}
              </Text>

            </View>
          ) : null}

        </View>

        {/* =========================================
            NO RESULTS
        ========================================= */}

        {searched &&
        filteredProperties.length === 0 ? (

          <View style={styles.notFoundContainer}>

            <View style={styles.notFoundIcon}>

              <Icon
                name="search"
                size={30}
                color="#999"
              />

            </View>

            <Text style={styles.notFoundText}>
              No properties found.
            </Text>

            <Text style={styles.notFoundSubText}>
              Try changing your location, property type
              or budget.
            </Text>

          </View>

        ) : (

          /* =========================================
             SEARCH RESULTS
          ========================================= */

          filteredProperties.map((item, index) => (

            <PropertyCard
              key={
                item?.id ||
                item?.Id ||
                index
              }
              item={item}
            />

          ))

        )}

      </ScrollView>

      <Footer />

    </SafeAreaView>
  );
};

export default SearchScreen;


// =========================================================
// STYLES
// WishlistScreen ke same theme
// =========================================================

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
  // SEARCH CARD
  // ========================================

  searchCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    elevation: 5,
  },

  searchIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF3F8',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  subHeading: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },

  inputWrapper: {
    height: 52,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 11,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  input: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 15,
    color: '#222',
  },

  searchButton: {
    height: 52,
    backgroundColor: '#102A47',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },

  searchButtonDisabled: {
    opacity: 0.65,
  },

  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 9,
  },

  // ========================================
  // RESULT HEADER
  // ========================================

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 3,
  },

  resultHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },

  resultCountBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#102A47',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  resultCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // ========================================
  // PROPERTY CARD
  // Same as Wishlist
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
    color: '#222',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },

  // ========================================
  // PROPERTY TYPE
  // ========================================

  propertyType: {
    marginTop: 4,
    color: '#666',
    fontSize: 14,
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
    fontSize: 13,
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
  // DETAILS BUTTON
  // ========================================

  detailsBtn: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#102A47',
    paddingVertical: 14,
    borderRadius: 10,
  },

  detailsText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 7,
  },

  // ========================================
  // NOT FOUND
  // ========================================

  notFoundContainer: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 3,
    marginTop: 5,
  },

  notFoundIcon: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  notFoundText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#444',
  },

  notFoundSubText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 20,
    textAlign: 'center',
  },
});
 
