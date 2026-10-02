import React, {useMemo, useState} from 'react';

import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import Header from '../components/Header';
import Footer from '../components/Footer';
import PropImageRotator from '../components/PropImgRotator';
import {formatPrice} from '../helpers/priceHelper';

const API_URL = 'https://clickaangan.in';
const API_URL2 = 'http://192.168.1.3:7045';


// ============================================================
// PROPERTY TYPES
// ============================================================

const RESIDENTIAL_TYPES = [
  '1 BHK Flat',
  '2 BHK Flat',
  '3 BHK Flat',
  '4 BHK Flat',
  'Villa',
  'Plot',
];

const COMMERCIAL_TYPES = [
  'Shop',
  'Office',
  'Showroom',
  'Marriage Garden',
];


// ============================================================
// MEDIA URL
// ============================================================

const getMediaUrl = path => {
  if (!path) return '';

  let cleanPath = String(path)
    .trim()
    .replace(/\\\\/g, '/');

  if (!cleanPath) return '';

  if (
    cleanPath.startsWith('http://') ||
    cleanPath.startsWith('https://')
  ) {
    return cleanPath;
  }

  cleanPath = cleanPath.replace(/^\/+/, '');

  return `${API_URL}/${cleanPath}`;
};


// ============================================================
// PROPERTY IMAGES
// ============================================================

const getPropertyImages = item => {
  try {
    let images = [];

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
        const value = field.trim();

        // JSON ARRAY
        if (value.startsWith('[')) {
          try {
            const parsed = JSON.parse(value);

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
          } catch (error) {
            images.push(value);
          }
        } else {
          // COMMA SEPARATED
          value
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
                '',
            );
          }
        });
      }
    });

    // FALLBACK IMAGE
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

    const finalImages = [
      ...new Set(
        images
          .filter(Boolean)
          .map(x => getMediaUrl(x))
          .filter(Boolean),
      ),
    ];

    console.log(
      'PROPERTY:',
      item?.propertyTitle || item?.title,
    );

    console.log('IMAGE PATHS:', images);

    console.log(
      'FINAL IMAGE URLS:',
      finalImages,
    );

    return finalImages;
  } catch (error) {
    console.log('IMAGE ERROR:', error);
    return [];
  }
};


// ============================================================
// PROPERTY CARD
// ============================================================

const PropertyCard = ({item, openProperty, listingType}) => {
  const propertyImages = useMemo(
    () => getPropertyImages(item),
    [item],
  );

  const title =
    item?.propertyTitle ||
    item?.PropertyTitle ||
    item?.title ||
    item?.Title ||
    item?.propertyName ||
    item?.PropertyName ||
    'Property';

  const locality =
    item?.locality ||
    item?.Locality ||
    '';

  const city =
    item?.city ||
    item?.City ||
    '';

  const locationText =
    locality && city
      ? `${locality}, ${city}`
      : locality ||
        city ||
        item?.location ||
        item?.Location ||
        'Location not available';

  const propertyTypeText =
    item?.propertyType ||
    item?.PropertyType ||
    item?.propType ||
    item?.PropType ||
    '';

  const status =
    item?.propertyStatus ||
    item?.PropertyStatus ||
    item?.status ||
    item?.Status ||
    'Available';

  const price =
    item?.price ??
    item?.Price ??
    item?.minPrice ??
    item?.MinPrice ??
    0;

  const area =
    item?.area ||
    item?.Area ||
    item?.builtUpArea ||
    item?.BuiltUpArea ||
    '';

  const bedroom =
    item?.bedroom ||
    item?.Bedroom ||
    item?.bedrooms ||
    item?.Bedrooms ||
    item?.bhk ||
    item?.BHK ||
    '';

  return (
    <View style={styles.propertyCard}>

      {/* IMAGE */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => openProperty(item)}
      >
        <View style={styles.mediaSection}>

          {propertyImages.length > 0 ? (
            <PropImageRotator
              images={propertyImages}
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

          <View style={styles.statusRow}>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {propertyTypeText}
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
        </View>
      </TouchableOpacity>


      {/* CONTENT */}
      <View style={styles.propertyContent}>

        <Text
          numberOfLines={1}
          style={styles.propertyTitle}
        >
          {title}
        </Text>

        <View style={styles.locationRow}>
          <Icon
            name="map-marker-alt"
            color="#FF5722"
            size={13}
          />

          <Text
            numberOfLines={1}
            style={styles.propertyLocation}
          >
            {locationText}
          </Text>

        </View>

 <View style={styles.priceRow}>
  <Text style={styles.price}>
    {Number(item?.price ?? item?.Price ?? 0) > 0
      ? formatPrice(item?.price ?? item?.Price)
      : Number(item?.minPrice ?? item?.MinPrice ?? 0) > 0 ||
        Number(item?.maxPrice ?? item?.MaxPrice ?? 0) > 0
      ? `${formatPrice(item?.minPrice ?? item?.MinPrice ?? 0)} - ${formatPrice(
          item?.maxPrice ?? item?.MaxPrice ?? 0,
        )}`
      : 'Price on Request'}
  </Text>
</View>

        <TouchableOpacity
  style={styles.detailsButton}
  activeOpacity={0.85}
  onPress={() => openProperty(item)}
>
  <Icon
    name="eye"
    size={14}
    color="#FFF"
  />

  <Text style={styles.detailsButtonText}>
    {listingType === 'PROJECT'
      ? 'View Project Details'
      : listingType === 'RENT'
      ? 'View Rent Details'
      : 'View Property Details'}
  </Text>
</TouchableOpacity>

      </View>
    </View>
  );
};


// ============================================================
// FILTER MODAL
// ============================================================

const FilterModal = ({
  visible,
  onClose,

  listingType,
  setListingType,

  location,
  setLocation,

  category,
  setCategory,

  propertyType,
  setPropertyType,

  budgetFrom,
  setBudgetFrom,

  budgetTo,
  setBudgetTo,

  onReset,
  onSearch,
}) => {
const propertyTypes =
  listingType === 'PROJECT'
    ? category === 'RESIDENTIAL'
      ? [
          'Residential Project',
          'Villa Project',
          'Plot Project'
        ]
      : [
          'Plot Project',
          'Shops Project',
        ]
    : category === 'RESIDENTIAL'
    ? RESIDENTIAL_TYPES
    : COMMERCIAL_TYPES;


const quickBudgets =
  listingType === 'RENT'
    ? [
        {
          label: 'Under ₹10K',
          from: '0',
          to: '10000',
        },
        {
          label: '₹10K - ₹20K',
          from: '10000',
          to: '20000',
        },
        {
          label: '₹20K - ₹30K',
          from: '20000',
          to: '30000',
        },
        {
          label: '₹30K - ₹50K',
          from: '30000',
          to: '50000',
        },
        {
          label: '₹50K+',
          from: '50000',
          to: '',
        },
      ]
    : [
        {
          label: 'Under 20L',
          from: '0',
          to: '2000000',
        },
        {
          label: '20L - 50L',
          from: '2000000',
          to: '5000000',
        },
        {
          label: '50L - 1Cr',
          from: '5000000',
          to: '10000000',
        },
        {
          label: '1Cr - 2Cr',
          from: '10000000',
          to: '20000000',
        },
        {
          label: '2Cr+',
          from: '20000000',
          to: '',
        },
      ];


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >

      <View style={styles.modalOverlay}>

        <View style={styles.bottomSheet}>

          {/* HANDLE */}
          <View style={styles.dragHandle} />


          {/* HEADER */}
          <View style={styles.modalHeader}>

            <View>

              <Text style={styles.modalTitle}>
                Search Properties
              </Text>

              <Text style={styles.modalSubTitle}>
                Find your perfect property
              </Text>

            </View>


            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Icon
                name="times"
                size={18}
                color="#333"
              />
            </TouchableOpacity>

          </View>


          {/* SCROLL */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.modalScrollContent
            }
          >

            {/* LOOKING FOR */}
            <Text style={styles.filterLabel}>
              Looking For
            </Text>

            <View style={styles.tabRow}>

              {['BUY', 'RENT', 'PROJECT'].map(item => (

                <TouchableOpacity
                  key={item}
                  style={[
                    styles.tabButton,
                    listingType === item &&
                      styles.tabButtonActive,
                  ]}
                  onPress={() =>
                    setListingType(item)
                  }
                >

                  <Text
                    style={[
                      styles.tabText,
                      listingType === item &&
                        styles.tabTextActive,
                    ]}
                  >
                    {item === 'PROJECT'
                      ? 'Projects'
                      : item}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>


            {/* LOCATION */}
            <Text style={styles.filterLabel}>
              Location
            </Text>

            <View style={styles.modalInputWrapper}>

              <Icon
                name="map-marker-alt"
                size={15}
                color="#FF5722"
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Search City or Locality"
                placeholderTextColor="#999"
                value={location}
                onChangeText={setLocation}
                autoCorrect={false}
                autoCapitalize="words"
                returnKeyType="done"
              />

            </View>


            {/* CATEGORY */}
            <Text style={styles.filterLabel}>
              Property Category
            </Text>

            <View style={styles.categoryRow}>

              {[
                'RESIDENTIAL',
                'COMMERCIAL',
              ].map(item => (

                <TouchableOpacity
                  key={item}
                  style={[
                    styles.categoryButton,
                    category === item &&
                      styles.categoryButtonActive,
                  ]}
                  onPress={() => {
                    setCategory(item);
                    setPropertyType('');
                  }}
                >

                  <Icon
                    name={
                      item === 'RESIDENTIAL'
                        ? 'home'
                        : 'building'
                    }
                    size={14}
                    color={
                      category === item
                        ? '#FFF'
                        : '#102A47'
                    }
                  />

                  <Text
                    style={[
                      styles.categoryText,
                      category === item &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {item === 'RESIDENTIAL'
                      ? 'Residential'
                      : 'Commercial'}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>


            {/* PROPERTY TYPE */}
            <Text style={styles.filterLabel}>
              Property Type
            </Text>

            <View style={styles.chipsContainer}>

              {propertyTypes.map(type => (

                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    propertyType === type &&
                      styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setPropertyType(type)
                  }
                >

                  <Text
                    style={[
                      styles.filterChipText,
                      propertyType === type &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    {type}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>


            {/* BUDGET */}
            <Text style={styles.filterLabel}>
              Budget Range
            </Text>

            <View style={styles.budgetRow}>

              {/* FROM */}
              <View style={styles.budgetInputWrapper}>

                <Icon
                  name="rupee-sign"
                  size={14}
                  color="#28A745"
                />

                <TextInput
                  style={styles.budgetInput}
                  placeholder="Min Budget"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={budgetFrom}
                  onChangeText={setBudgetFrom}
                />

              </View>


              <View style={styles.budgetDivider}>

                <Text style={styles.budgetDividerText}>
                  TO
                </Text>

              </View>


              {/* TO */}
              <View style={styles.budgetInputWrapper}>

                <Icon
                  name="rupee-sign"
                  size={14}
                  color="#28A745"
                />

                <TextInput
                  style={styles.budgetInput}
                  placeholder="Max Budget"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={budgetTo}
                  onChangeText={setBudgetTo}
                />

              </View>

            </View>


            {/* QUICK BUDGET */}
            <Text style={styles.quickBudgetLabel}>
              Quick Budget
            </Text>

            <View style={styles.chipsContainer}>

              {
              quickBudgets.map(item => (

                <TouchableOpacity
                  key={item.label}
                  style={styles.quickBudgetChip}
                  onPress={() => {
                    setBudgetFrom(item.from);
                    setBudgetTo(item.to);
                  }}
                >

                  <Text style={styles.quickBudgetText}>
                    {item.label}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>

          </ScrollView>


          {/* FOOTER */}
          <View style={styles.modalFooter}>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={onReset}
            >

              <Icon
                name="redo"
                size={14}
                color="#102A47"
              />

              <Text style={styles.resetButtonText}>
                Reset
              </Text>

            </TouchableOpacity>


            <TouchableOpacity
              style={styles.applyButton}
              onPress={onSearch}
            >

              <Icon
                name="search"
                size={15}
                color="#FFF"
              />

              <Text style={styles.applyButtonText}>
                Search Properties
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </View>

    </Modal>
  );
};


// ============================================================
// MAIN SCREEN
// ============================================================

const SearchScreen = ({navigation}) => {

  const [
    filterModalVisible,
    setFilterModalVisible,
  ] = useState(false);

  const [location, setLocation] = useState('');

  const [
    listingType,
    setListingType,
  ] = useState('BUY');

  const [
    category,
    setCategory,
  ] = useState('RESIDENTIAL');

  const [
    propertyType,
    setPropertyType,
  ] = useState('');

  const [
    budgetFrom,
    setBudgetFrom,
  ] = useState('');

  const [
    budgetTo,
    setBudgetTo,
  ] = useState('');

  const [
    filteredProperties,
    setFilteredProperties,
  ] = useState([]);

  const [searched, setSearched] = useState(false);

  const [loading, setLoading] = useState(false);


  // ==========================================================
  // API SEARCH
  // ==========================================================

  const searchProperties = async (
    locationValue,
    proptype,
    budgetfr,
    budgetto,
  ) => {

    try {

      const params = new URLSearchParams();

      // BUY / RENT / PROJECT
if (listingType) {
  params.append(
    'purpose',
    listingType,
  );
}


if (locationValue) {
  params.append(
    'location',
    locationValue,
  );
}

// RESIDENTIAL / COMMERCIAL
if (category) {
  params.append(
    'category',
    category,
  );
}

if (proptype) {
  params.append(
    'proptype',
    proptype,
  );
}

if (budgetfr) {
  params.append(
    'budgetfr',
    budgetfr.toString(),
  );
}

if (budgetto) {
  params.append(
    'budgetto',
    budgetto.toString(),
  );
}

const url =
  `${API_URL}/api/search/SearchProperty?` +
  params.toString();

console.log('SEARCH API URL:', url);


      const response = await fetch(url, {
        method: 'GET',

        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });


      console.log(
        'SEARCH STATUS:',
        response.status,
      );


      if (!response.ok) {
        return [];
      }


      const data = await response.json();


      console.log(
        'SEARCH RESULT:',
        JSON.stringify(
          data,
          null,
          2,
        ),
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

      console.error(
        'SEARCH ERROR:',
        error,
      );

      return [];
    }
  };


  // ==========================================================
  // HANDLE SEARCH
  // ==========================================================

  const handleSearch = async () => {

    setLoading(true);

    setFilterModalVisible(false);


    const data =
      await searchProperties(
        location.trim(),
        propertyType.trim(),
        budgetFrom,
        budgetTo,
      );


    setFilteredProperties(data);

    setSearched(true);

    setLoading(false);
  };


  // ==========================================================
  // RESET
  // ==========================================================

  const resetFilters = () => {

    setLocation('');

    setListingType('BUY');

    setCategory('RESIDENTIAL');

    setPropertyType('');

    setBudgetFrom('');

    setBudgetTo('');
  };


  // ==========================================================
  // OPEN PROPERTY
  // ==========================================================

const openProperty = item => {
  const propertyId =
    item?.id ||
    item?.Id;

  // PROJECT
  if (listingType === 'PROJECT') {
    navigation.navigate('ProjectDetails', {
      project: item,
      id: propertyId,
    });
    return;
  }

  // RENT
  if (listingType === 'RENT') {
    navigation.navigate('RentDetails', {
      property: item,
      id: propertyId,
    });
    return;
  }

  // BUY - Default
  navigation.navigate('PropertyDetails', {
    property: item,
    id: propertyId,
  });
};


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <SafeAreaView
      style={styles.safeContainer}
    >

      <Header />


      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >

        {/* HERO */}
        <View style={styles.searchHero}>

          <View style={styles.heroIcon}>

            <Icon
              name="search"
              size={22}
              color="#102A47"
            />

          </View>


          <View
            style={
              styles.heroTextContainer
            }
          >

            <Text style={styles.heroTitle}>
              Find Your Dream Property
            </Text>

            <Text
              style={styles.heroSubTitle}
            >
              Search properties by
              location, type & budget
            </Text>

          </View>

        </View>


        {/* OPEN SEARCH */}
        <TouchableOpacity
          style={
            styles.openSearchButton
          }
          activeOpacity={0.85}
          onPress={() =>
            setFilterModalVisible(true)
          }
        >

          <View
            style={
              styles.openSearchIcon
            }
          >

            <Icon
              name="search"
              size={17}
              color="#FF5722"
            />

          </View>


          <View
            style={
              styles.openSearchTextContainer
            }
          >

            <Text
              style={
                styles.openSearchTitle
              }
            >
              Search Properties
            </Text>

            <Text
              style={
                styles.openSearchSubTitle
              }
            >
              Tap to select location &
              filters
            </Text>

          </View>


          <Icon
            name="sliders-h"
            size={18}
            color="#102A47"
          />

        </TouchableOpacity>


        {/* SELECTED FILTER */}
        {(location ||
          propertyType ||
          budgetFrom ||
          budgetTo) && (

          <View
            style={
              styles.selectedFilterCard
            }
          >

            <Icon
              name="filter"
              size={13}
              color="#102A47"
            />

            <Text
              numberOfLines={1}
              style={
                styles.selectedFilterText
              }
            >
              {[
                location,
                propertyType,
                budgetFrom
                  ? `₹${formatPrice(
                      budgetFrom,
                    )}`
                  : '',
                budgetTo
                  ? `₹${formatPrice(
                      budgetTo,
                    )}`
                  : '',
              ]
                .filter(Boolean)
                .join(' • ')}
            </Text>

          </View>

        )}


        {/* RESULT HEADER */}
        <View
          style={
            styles.resultHeader
          }
        >

          <Text
            style={
              styles.resultHeading
            }
          >
            {searched
              ? `Search Results (${filteredProperties.length})`
              : 'Search Properties'}
          </Text>


          {searched &&
          filteredProperties.length >
            0 ? (

            <View
              style={
                styles.resultCountBadge
              }
            >

              <Text
                style={
                  styles.resultCountText
                }
              >
                {filteredProperties.length}
              </Text>

            </View>

          ) : null}

        </View>


        {/* LOADING */}
        {loading ? (

          <View
            style={
              styles.loadingContainer
            }
          >

            <ActivityIndicator
              size="large"
              color="#102A47"
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Finding best properties
              for you...
            </Text>

          </View>

        ) : null}


        {/* INITIAL */}
        {!searched &&
        !loading ? (

          <View
            style={
              styles.initialState
            }
          >

            <View
              style={
                styles.initialIconCircle
              }
            >

              <Icon
                name="home"
                size={38}
                color="#102A47"
              />

            </View>


            <Text
              style={
                styles.initialTitle
              }
            >
              Start Your Property Search
            </Text>


            <Text
              style={
                styles.initialText
              }
            >
              Select your preferred
              location, property type
              and budget to discover
              the best properties.
            </Text>


            <TouchableOpacity
              style={
                styles.initialButton
              }
              onPress={() =>
                setFilterModalVisible(true)
              }
            >

              <Icon
                name="search"
                size={14}
                color="#FFF"
              />

              <Text
                style={
                  styles.initialButtonText
                }
              >
                Start Searching
              </Text>

            </TouchableOpacity>

          </View>

        ) : null}


        {/* NO RESULT */}
        {searched &&
        !loading &&
        filteredProperties.length ===
          0 ? (

          <View
            style={
              styles.notFoundContainer
            }
          >

            <View
              style={
                styles.notFoundIcon
              }
            >

              <Icon
                name="search"
                size={30}
                color="#999"
              />

            </View>


            <Text
              style={
                styles.notFoundText
              }
            >
              No properties found
            </Text>


            <Text
              style={
                styles.notFoundSubText
              }
            >
              Try changing your
              location, property type
              or budget.
            </Text>


            <TouchableOpacity
              style={
                styles.modifySearchButton
              }
              onPress={() =>
                setFilterModalVisible(true)
              }
            >

              <Text
                style={
                  styles.modifySearchText
                }
              >
                Modify Search
              </Text>

            </TouchableOpacity>

          </View>

        ) : null}


        {/* RESULTS */}
        {searched &&
          !loading &&
          filteredProperties.map(
            (item, index) => (

              <PropertyCard
                key={
                  item?.id ||
                  item?.Id ||
                  index
                }
                item={item}
                openProperty={
                  openProperty
                }
              />

            ),
          )}

      </ScrollView>


      <Footer />


      {/* IMPORTANT:
          FilterModal is OUTSIDE SearchScreen component
          so it will not remount on every state change.
      */}
      <FilterModal
        visible={
          filterModalVisible
        }
        onClose={() =>
          setFilterModalVisible(false)
        }

        listingType={
          listingType
        }
        setListingType={
          setListingType
        }

        location={
          location
        }
        setLocation={
          setLocation
        }

        category={
          category
        }
        setCategory={
          setCategory
        }

        propertyType={
          propertyType
        }
        setPropertyType={
          setPropertyType
        }

        budgetFrom={
          budgetFrom
        }
        setBudgetFrom={
          setBudgetFrom
        }

        budgetTo={
          budgetTo
        }
        setBudgetTo={
          setBudgetTo
        }

        onReset={
          resetFilters
        }

        onSearch={
          handleSearch
        }
      />

    </SafeAreaView>
  );
};


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  container: {
    padding: 15,
    paddingBottom: 30,
  },


  // ==========================================================
  // HERO
  // ==========================================================

  searchHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,

    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EEF3F8',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  heroTextContainer: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#102A47',
  },

  heroSubTitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#777',
  },


  // ==========================================================
  // OPEN SEARCH
  // ==========================================================

  openSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF',

    borderRadius: 14,

    padding: 13,

    marginBottom: 14,

    borderWidth: 1,
    borderColor: '#E4E8ED',

    elevation: 2,
  },

  openSearchIcon: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: '#FFF4EF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 11,
  },

  openSearchTextContainer: {
    flex: 1,
  },

  openSearchTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102A47',
  },

  openSearchSubTitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 3,
  },


  // ==========================================================
  // SELECTED FILTER
  // ==========================================================

  selectedFilterCard: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#EEF3F8',

    borderRadius: 10,

    paddingHorizontal: 12,
    paddingVertical: 9,

    marginBottom: 14,
  },

  selectedFilterText: {
    flex: 1,

    marginLeft: 8,

    fontSize: 12,

    color: '#102A47',

    fontWeight: '600',
  },


  // ==========================================================
  // RESULTS
  // ==========================================================

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 12,
  },

  resultHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#102A47',
  },

  resultCountBadge: {
    minWidth: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor: '#102A47',

    alignItems: 'center',
    justifyContent: 'center',
  },

  resultCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },


  // ==========================================================
  // LOADING
  // ==========================================================

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#666',
  },


  // ==========================================================
  // INITIAL
  // ==========================================================

  initialState: {
    backgroundColor: '#FFF',

    borderRadius: 18,

    padding: 25,

    alignItems: 'center',

    marginTop: 5,

    elevation: 2,
  },

  initialIconCircle: {
    width: 75,
    height: 75,

    borderRadius: 38,

    backgroundColor: '#EEF3F8',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 14,
  },

  initialTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#102A47',

    textAlign: 'center',
  },

  initialText: {
    fontSize: 13,
    color: '#777',

    textAlign: 'center',

    lineHeight: 20,

    marginTop: 8,
  },

  initialButton: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#102A47',

    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 10,

    marginTop: 18,
  },

  initialButtonText: {
    color: '#FFF',

    fontSize: 13,

    fontWeight: '700',

    marginLeft: 8,
  },


  // ==========================================================
  // NO RESULT
  // ==========================================================

  notFoundContainer: {
    backgroundColor: '#FFF',

    borderRadius: 18,

    padding: 28,

    alignItems: 'center',
  },

  notFoundIcon: {
    width: 65,
    height: 65,

    borderRadius: 33,

    backgroundColor: '#F1F1F1',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 12,
  },

  notFoundText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#333',
  },

  notFoundSubText: {
    fontSize: 12,
    color: '#777',

    textAlign: 'center',

    marginTop: 7,
  },

  modifySearchButton: {
    backgroundColor: '#102A47',

    paddingHorizontal: 20,
    paddingVertical: 11,

    borderRadius: 9,

    marginTop: 16,
  },

  modifySearchText: {
    color: '#FFF',

    fontSize: 13,

    fontWeight: '700',
  },


  // ==========================================================
  // PROPERTY CARD
  // ==========================================================

  propertyCard: {
    backgroundColor: '#FFF',

    borderRadius: 16,

    overflow: 'hidden',

    marginBottom: 15,

    elevation: 3,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 5,
  },

  mediaSection: {
    height: 210,

    backgroundColor: '#EEE',

    position: 'relative',
  },

  noMedia: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },

  noMediaText: {
    marginTop: 7,

    color: '#999',

    fontSize: 12,
  },

  statusRow: {
    position: 'absolute',

    top: 10,
    left: 10,
    right: 10,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  statusBadge: {
    backgroundColor: '#102A47',

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 7,
  },

  statusText: {
    color: '#FFF',

    fontSize: 10,

    fontWeight: '700',
  },

  reraBadge: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FFF',

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 7,
  },

  reraText: {
    marginLeft: 4,

    fontSize: 10,

    color: '#333',

    fontWeight: '700',
  },

  propertyContent: {
    padding: 14,
  },

  propertyTitle: {
    fontSize: 13,

    fontWeight: '800',

    color: '#102A47',
  },

  propertyType: {
    fontSize: 12,

    color: '#FF5722',

    fontWeight: '700',

    marginTop: 4,
  },

  locationRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 8,
  },

  propertyLocation: {
    flex: 1,

    marginLeft: 6,

    fontSize: 12,

    color: '#666',
  },

  infoRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 10,
  },

  infoItem: {
    flexDirection: 'row',

    alignItems: 'center',

    marginRight: 18,
  },

  infoText: {
    fontSize: 11,

    color: '#666',

    marginLeft: 5,
  },

  priceRow: {
    marginTop: 12,
  },

  price: {
    fontSize: 12,

    fontWeight: '700',

    color: '#102A47',
  },

  detailsButton: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#102A47',

    borderRadius: 9,

    paddingVertical: 11,

    marginTop: 12,
  },

  detailsButtonText: {
    color: '#FFF',

    fontSize: 12,

    fontWeight: '700',

    marginLeft: 7,
  },


  // ==========================================================
  // MODAL
  // ==========================================================

  modalOverlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.45)',

    justifyContent: 'flex-end',
  },

  bottomSheet: {
    backgroundColor: '#FFF',

    borderTopLeftRadius: 24,

    borderTopRightRadius: 24,

    maxHeight: '90%',

    overflow: 'hidden',
  },

  dragHandle: {
    width: 45,
    height: 5,

    borderRadius: 3,

    backgroundColor: '#D5D5D5',

    alignSelf: 'center',

    marginTop: 9,
  },

  modalHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingHorizontal: 18,

    paddingTop: 14,

    paddingBottom: 12,
  },

  modalTitle: {
    fontSize: 19,

    fontWeight: '800',

    color: '#102A47',
  },

  modalSubTitle: {
    fontSize: 11,

    color: '#888',

    marginTop: 3,
  },

  closeButton: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: '#F1F1F1',

    alignItems: 'center',
    justifyContent: 'center',
  },

  modalScrollContent: {
    paddingHorizontal: 18,

    paddingBottom: 20,
  },

  filterLabel: {
    fontSize: 13,

    fontWeight: '800',

    color: '#102A47',

    marginTop: 13,

    marginBottom: 8,
  },


  // ==========================================================
  // TABS
  // ==========================================================

  tabRow: {
    flexDirection: 'row',

    backgroundColor: '#F2F4F7',

    borderRadius: 10,

    padding: 4,
  },

  tabButton: {
    flex: 1,

    paddingVertical: 10,

    borderRadius: 8,

    alignItems: 'center',
  },

  tabButtonActive: {
    backgroundColor: '#102A47',

    elevation: 2,
  },

  tabText: {
    fontSize: 12,

    fontWeight: '700',

    color: '#666',
  },

  tabTextActive: {
    color: '#FFF',
  },


  // ==========================================================
  // LOCATION INPUT
  // ==========================================================

  modalInputWrapper: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#F8F9FA',

    borderWidth: 1,

    borderColor: '#E0E4E8',

    borderRadius: 10,

    paddingHorizontal: 12,

    minHeight: 48,
  },

  modalInput: {
    flex: 1,

    height: 46,

    marginLeft: 8,

    color: '#222',

    fontSize: 13,

    paddingVertical: 0,
  },


  // ==========================================================
  // CATEGORY
  // ==========================================================

  categoryRow: {
    flexDirection: 'row',

    gap: 10,
  },

  categoryButton: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor: '#DCE2E8',

    borderRadius: 10,

    paddingVertical: 11,

    backgroundColor: '#FFF',
  },

  categoryButtonActive: {
    backgroundColor: '#102A47',

    borderColor: '#102A47',
  },

  categoryText: {
    marginLeft: 7,

    fontSize: 12,

    color: '#102A47',

    fontWeight: '700',
  },

  categoryTextActive: {
    color: '#FFF',
  },


  // ==========================================================
  // CHIPS
  // ==========================================================

  chipsContainer: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 8,
  },

  filterChip: {
    borderWidth: 1,

    borderColor: '#DCE2E8',

    backgroundColor: '#FFF',

    borderRadius: 20,

    paddingHorizontal: 12,

    paddingVertical: 8,
  },

  filterChipActive: {
    backgroundColor: '#102A47',

    borderColor: '#102A47',
  },

  filterChipText: {
    fontSize: 11,

    color: '#555',

    fontWeight: '600',
  },

  filterChipTextActive: {
    color: '#FFF',
  },


  // ==========================================================
  // BUDGET
  // ==========================================================

  budgetRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  budgetInputWrapper: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#F8F9FA',

    borderWidth: 1,

    borderColor: '#E0E4E8',

    borderRadius: 10,

    paddingHorizontal: 10,

    height: 48,
  },

  budgetInput: {
    flex: 1,

    marginLeft: 7,

    color: '#222',

    fontSize: 12,

    paddingVertical: 0,
  },

  budgetDivider: {
    width: 40,

    alignItems: 'center',
  },

  budgetDividerText: {
    fontSize: 10,

    color: '#999',

    fontWeight: '800',
  },

  quickBudgetLabel: {
    fontSize: 12,

    color: '#666',

    fontWeight: '700',

    marginTop: 14,

    marginBottom: 8,
  },

  quickBudgetChip: {
    borderWidth: 1,

    borderColor: '#DCE2E8',

    backgroundColor: '#FFF',

    borderRadius: 20,

    paddingHorizontal: 11,

    paddingVertical: 8,
  },

  quickBudgetText: {
    fontSize: 11,

    color: '#102A47',

    fontWeight: '700',
  },


  // ==========================================================
  // MODAL FOOTER
  // ==========================================================

  modalFooter: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 18,

    paddingTop: 10,

    paddingBottom: 15,

    borderTopWidth: 1,

    borderTopColor: '#ECECEC',

    backgroundColor: '#FFF',
  },

  resetButton: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    width: 90,

    height: 46,

    borderRadius: 10,

    backgroundColor: '#F0F3F6',

    marginRight: 10,
  },

  resetButtonText: {
    marginLeft: 6,

    color: '#102A47',

    fontSize: 12,

    fontWeight: '800',
  },

  applyButton: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    height: 46,

    borderRadius: 10,

    backgroundColor: '#102A47',
  },

  applyButtonText: {
    marginLeft: 7,

    color: '#FFF',

    fontSize: 13,

    fontWeight: '800',
  },

});


export default SearchScreen;