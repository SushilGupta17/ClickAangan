import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  StatusBar
} from 'react-native';


import Header from '../components/Header';
import Footer from '../components/Footer';

import Animated, {
  FadeInDown,
} from 'react-native-reanimated';

import {launchImageLibrary} from 'react-native-image-picker';

const AddPropertyScreen = () => {

  const API_URL = 'https://savariyaproperty.in';
  

  const [loading, setLoading] = useState(false);

  // 0 = Basic
  // 1 = Details
  // 2 = Images
  // 3 = Summary
  const [activeTab, setActiveTab] = useState(0);

  const [property, setProperty] = useState({
    category: '',
    purpose: '',
    propertyType: '',
    title: '',
    description: '',
    location: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    images: [],
  });

  //-----------------------------------
  // Amenities
  //-----------------------------------

  const formatPrice = (price) => {

  const value = Number(price);

  if (isNaN(value)) return price;

  if (value >= 10000000) {
    return (value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 2) + " Cr";
  }

  if (value >= 100000) {
    return (value / 100000).toFixed(value % 100000 === 0 ? 0 : 2) + " L";
  }

  if (value >= 1000) {
    return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 2) + " K";
  }

  return value.toString();
};

  const toggleAmenity = amenity => {

    let list = [...property.amenities];

    if (list.includes(amenity)) {
      list = list.filter(x => x !== amenity);
    } else {
      list.push(amenity);
    }

    setProperty({
      ...property,
      amenities: list,
    });

  };

  //-----------------------------------
  // Image Picker
  //-----------------------------------

  const pickImages = () => {

    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0,
        quality: 0.8,
      },
      response => {

        if (response.didCancel) return;

        if (response.errorCode) {

          Alert.alert(response.errorMessage);

          return;
        }

        if (response.assets) {

          setProperty(prev => ({
            ...prev,
            images: response.assets,
          }));

        }

      },
    );

  };

  //-----------------------------------
  // Remove Image
  //-----------------------------------

  const removeImage = index => {

    const images = property.images.filter(
      (_, i) => i !== index,
    );

    setProperty({
      ...property,
      images,
    });

  };

  //-----------------------------------
  // Next
  //-----------------------------------

  const nextTab = () => {

    if (activeTab < 3) {
      setActiveTab(activeTab + 1);
    }

  };

  //-----------------------------------
  // Previous
  //-----------------------------------

  const previousTab = () => {

    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }

  };

  //-----------------------------------
  // Submit
  //-----------------------------------

  const submitProperty = async () => {

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append('Category', property.category);
      formData.append('Purpose', property.purpose);
      formData.append('PropertyType', property.propertyType);
      formData.append('Title', property.title);
      formData.append('Description', property.description);
      formData.append('Location', property.location);
      formData.append('Price', property.price);
      formData.append('Area', property.area);
      formData.append('Bedrooms', property.bedrooms);
      formData.append('Bathrooms', property.bathrooms);

      formData.append(
        'Amenities',
        JSON.stringify(property.amenities),
      );

      property.images.forEach((image, index) => {

        formData.append('Images', {
          uri: image.uri,
          name: image.fileName || `image_${index}.jpg`,
          type: image.type || 'image/jpeg',
        });

      });
      console.log(formData);
      const response = await fetch(
        'https://savariyaproperty.in/api/property',
        {
          method: 'POST',
          body: formData,
        },
      );
      const data = await response.json();
      console.log(data);
      Alert.alert(
        'Success',
        'Property Added Successfully',
      );
    } catch (e) {
      Alert.alert(
        'Error',
        'Something went wrong',
      );
    }
    setLoading(false);
  };

  //-----------------------------------
  // Chip Component
  //-----------------------------------

  const Chip = ({
    label,
    selected,
    onPress,
  }) => (

    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.selectedChip,
      ]}>

      <Text
        style={[
          styles.chipText,
          selected &&
            styles.selectedChipText,
        ]}>
        {label}
      </Text>

    </TouchableOpacity>

  );

  //-----------------------------------
  // Start UI
  //-----------------------------------

  return (

    <SafeAreaView style={styles.container} >
        
      <Header />
      <View style={styles.headerCard}>

        <Text style={styles.headerTitle}>
          🏠 Add Property
        </Text>

        <Text style={styles.headerSubTitle}>
          Complete your property details
        </Text>

      </View>

      {/* Tabs */}

      <View style={styles.tabContainer}>

        {[
          'Basic',
          'Details',
          'Images',
          'Summary',
        ].map((item, index) => (

          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              activeTab === index &&
                styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab(index)
            }>

            <Text
              style={[
                styles.tabText,
                activeTab === index &&
                  styles.activeTabText,
              ]}>
              {item}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

      <ScrollView
        contentContainerStyle={{
          padding:15,
          paddingBottom:160,
        }}
        keyboardShouldPersistTaps="handled">

      {/* PART 2 STARTS HERE */}
      {/* ==========================================
          TAB 1 : BASIC INFORMATION
      =========================================== */}

      {activeTab === 0 && (

          <Animated.View entering={FadeInDown.duration(400)}>

          <View style={styles.card}>

            <Text style={styles.title}>
              Property Category
            </Text>

            <View style={styles.rowWrap}>

              <Chip
                label="Residential"
                selected={
                  property.category ===
                  'Residential'
                }
                onPress={() =>
                  setProperty({
                    ...property,
                    category: 'Residential',
                  })
                }
              />

              <Chip
                label="Commercial"
                selected={
                  property.category ===
                  'Commercial'
                }
                onPress={() =>
                  setProperty({
                    ...property,
                    category: 'Commercial',
                  })
                }
              />

            </View>

          </View>

          <View style={styles.card}>

            <Text style={styles.title}>
              Property Purpose
            </Text>

            <View style={styles.rowWrap}>

              <Chip
                label="Buy"
                selected={
                  property.purpose === 'Buy'
                }
                onPress={() =>
                  setProperty({
                    ...property,
                    purpose: 'Buy',
                  })
                }
              />

              <Chip
                label="Rent"
                selected={
                  property.purpose === 'Rent'
                }
                onPress={() =>
                  setProperty({
                    ...property,
                    purpose: 'Rent',
                  })
                }
              />

            </View>

          </View>

          <View style={styles.card}>

            <Text style={styles.title}>
              Property Type
            </Text>

            <View style={styles.rowWrap}>

              {[
                 '5 BHK',
                 '4 BHK',
                 '3 BHK',
                 '2 BHK',
                 '1 BHK',
                'Villa',
                'Plot',
                'Office',
                'Shop',
                'Warehouse',
                'Farm House',
              ].map(item => (

                <Chip
                  key={item}
                  label={item}
                  selected={
                    property.propertyType === item
                  }
                  onPress={() =>
                    setProperty({
                      ...property,
                      propertyType: item,
                    })
                  }
                />

              ))}

            </View>

          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={nextTab}>

            <Text style={styles.nextText}>
              Next →
            </Text>

          </TouchableOpacity>

        </Animated.View>

      )}

      {/* ==========================================
          TAB 2 : PROPERTY DETAILS
      =========================================== */}

      {activeTab === 1 && (

             <Animated.View entering={FadeInDown.duration(400)}>

          <View style={styles.card}>

            <Text style={styles.title}>
              Property Title
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter title"
              value={property.title}
              onChangeText={text =>
                setProperty({
                  ...property,
                  title: text,
                })
              }
            />

          </View>

          <View style={styles.card}>

            <Text style={styles.title}>
              Description
            </Text>

            <TextInput
              multiline
              style={[
                styles.input,
                {
                  height:120,
                  textAlignVertical:'top',
                },
              ]}
              placeholder="Property Description"
              value={property.description}
              onChangeText={text =>
                setProperty({
                  ...property,
                  description:text,
                })
              }
            />

          </View>

          <View style={styles.card}>

            <Text style={styles.title}>
              Location
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Location"
              value={property.location}
              onChangeText={text =>
                setProperty({
                  ...property,
                  location:text,
                })
              }
            />

          </View>

          <View style={styles.card}>

            <Text style={styles.title}>
              Price
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter Price"
              value={property.price}
              onChangeText={text =>
                setProperty({
                  ...property,
                  price:text,
                })
              }
            />

          </View>

          <View style={styles.card}>

            <Text style={styles.title}>
              Area (Sqft)
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter Area"
              value={property.area}
              onChangeText={text =>
                setProperty({
                  ...property,
                  area:text,
                })
              }
            />

          </View>

          <View style={styles.card}>

            <Text style={styles.title}>
              Bedrooms
            </Text>

            <View style={styles.rowWrap}>

              {[
                '1',
                '2',
                '3',
                '4',
                '5+',
              ].map(item => (

                <Chip
                  key={item}
                  label={item}
                  selected={
                    property.bedrooms === item
                  }
                  onPress={() =>
                    setProperty({
                      ...property,
                      bedrooms:item,
                    })
                  }
                />

              ))}

            </View>

          </View>

          <View style={styles.card}>

            <Text style={styles.title}>
              Bathrooms
            </Text>

            <View style={styles.rowWrap}>

              {[
                '1',
                '2',
                '3',
                '4+',
              ].map(item => (

                <Chip
                  key={item}
                  label={item}
                  selected={
                    property.bathrooms === item
                  }
                  onPress={() =>
                    setProperty({
                      ...property,
                      bathrooms:item,
                    })
                  }
                />

              ))}

            </View>

          </View>

          <View style={styles.card}>

            <Text style={styles.title}>
              Amenities
            </Text>

            <View style={styles.rowWrap}>

              {[
                'Parking',
                'Lift',
                'Gym',
                'Garden',
                'Swimming Pool',
                'Security',
              ].map(item => (

                <Chip
                  key={item}
                  label={item}
                  selected={
                    property.amenities.includes(item)
                  }
                  onPress={() =>
                    toggleAmenity(item)
                  }
                />

              ))}

            </View>

          </View>

          <View
            style={{
              flexDirection:'row',
              justifyContent:'space-between',
            }}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={previousTab}>

              <Text style={styles.nextText}>
                ← Back
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={nextTab}>

              <Text style={styles.nextText}>
                Next →
              </Text>

            </TouchableOpacity>

          </View>

        </Animated.View>

      )}
      
            {/* ==========================================
          TAB 3 : PROPERTY IMAGES
      ========================================== */}

      {activeTab === 2 && (

            <Animated.View entering={FadeInDown.duration(400)}>

          <View style={styles.card}>

            <Text style={styles.title}>
              Property Images
            </Text>

            <TouchableOpacity
              style={styles.imagePicker}
              onPress={pickImages}>

              <Text style={styles.imagePickerText}>
                📷 Select Images
              </Text>

            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginTop:20}}>

              {property.images.map((item,index)=>(
                <View
                  key={index}
                  style={{marginRight:15}}>

                  <Image
                    source={{uri:item.uri}}
                    style={styles.previewImage}
                  />

                  <TouchableOpacity
                    style={styles.removeImage}
                    onPress={()=>removeImage(index)}>

                    <Text style={styles.removeImageText}>
                      ✕
                    </Text>

                  </TouchableOpacity>

                </View>
              ))}

            </ScrollView>

          </View>

          <View
            style={{
              flexDirection:'row',
              justifyContent:'space-between',
            }}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={previousTab}>

              <Text style={styles.nextText}>
                ← Back
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={nextTab}>

              <Text style={styles.nextText}>
                Next →
              </Text>

            </TouchableOpacity>

          </View>

        </Animated.View>

      )}

      {/* ==========================================
          TAB 4 : SUMMARY
      ========================================== */}

      {activeTab === 3 && (

            <Animated.View entering={FadeInDown.duration(400)}>

          <View style={styles.card}>

            <Text style={styles.summaryTitle}>
              🎯 Property Summary
            </Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Category
              </Text>

              <Text style={styles.summaryValue}>
                {property.category}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Purpose
              </Text>

              <Text style={styles.summaryValue}>
                {property.purpose}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Property Type
              </Text>

              <Text style={styles.summaryValue}>
                {property.propertyType}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Title
              </Text>

              <Text style={styles.summaryValue}>
                {property.title}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Description
              </Text>

              <Text
                style={[
                  styles.summaryValue,
                  {flex:1},
                ]}>
                {property.description}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Location
              </Text>

              <Text style={styles.summaryValue}>
                {property.location}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Price
              </Text>

            <Text style={styles.summaryValue}>
                ₹ {formatPrice(property.price)}
            </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Area
              </Text>

              <Text style={styles.summaryValue}>
                {property.area} Sqft
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Bedrooms
              </Text>

              <Text style={styles.summaryValue}>
                {property.bedrooms}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Bathrooms
              </Text>

              <Text style={styles.summaryValue}>
                {property.bathrooms}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Amenities
              </Text>

              <Text
                style={[
                  styles.summaryValue,
                  {flex:1},
                ]}>
                {property.amenities.join(', ')}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Images
              </Text>

              <Text style={styles.summaryValue}>
                {property.images.length}
              </Text>
            </View>

          </View>

          <View
            style={{
              flexDirection:'row',
              justifyContent:'space-between',
            }}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={previousTab}>

              <Text style={styles.nextText}>
                ← Back
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitProperty}>

              <Text style={styles.submitButtonText}>
                🚀 Submit Property
              </Text>

            </TouchableOpacity>

          </View>

        </Animated.View>

      )}
      </ScrollView>

{loading && (
  <View style={styles.loaderOverlay}>
    <ActivityIndicator size="large" color="#fff" />
  </View>
)}
      <Footer />

    </SafeAreaView>

  );

};

export default AddPropertyScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  headerCard: {
    backgroundColor: '#0A84FF',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 18,
    padding: 20,
    elevation: 5,
  },

  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },

  headerSubTitle: {
    color: '#EAF4FF',
    marginTop: 5,
    fontSize: 14,
  },

  //----------------------------
  // Tabs
  //----------------------------

  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    elevation: 3,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },

  activeTab: {
    backgroundColor: '#0A84FF',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },

  activeTabText: {
    color: '#fff',
  },

  //----------------------------
  // Card
  //----------------------------

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 15,
  },

  //----------------------------
  // Input
  //----------------------------

  input: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
    fontSize: 15,
    color: '#222',
    borderWidth: 1,
    borderColor: '#E4E7EC',
  },

  //----------------------------
  // Chips
  //----------------------------

  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chip: {
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },

  selectedChip: {
    backgroundColor: '#0A84FF',
  },

  chipText: {
    color: '#444',
    fontWeight: '600',
  },

  selectedChipText: {
    color: '#fff',
  },

  //----------------------------
  // Buttons
  //----------------------------

  nextButton: {
    backgroundColor: '#0A84FF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 130,
  },

  backButton: {
    backgroundColor: '#9AA0A6',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 130,
  },

  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  submitButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#00A651',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  //----------------------------
  // Image Picker
  //----------------------------

  imagePicker: {
    backgroundColor: '#0A84FF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  imagePickerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  previewImage: {
    width: 110,
    height: 110,
    borderRadius: 15,
  },

  removeImage: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: '#FF3B30',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeImageText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  //----------------------------
  // Summary
  //----------------------------

  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 18,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },

  summaryLabel: {
    color: '#666',
    fontWeight: '600',
    width: 110,
  },

  summaryValue: {
    color: '#111',
    fontWeight: '700',
    textAlign: 'right',
  },

  loaderOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
},

});