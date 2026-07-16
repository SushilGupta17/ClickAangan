// src/screens/AiSearchScreen.js

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
} from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Animated, {
  SlideInUp
} from 'react-native-reanimated';

const AiSearchScreen = () => {
  const [searchData, setSearchData] = useState({
    category: '', // Residential / Commercial
    purpose: '', // Buy / Rent
    propertyTypes: [], // Multiple
    location: '',
    budget: '',
    bedrooms: '',
  });

  const [loading, setLoading] =
  useState(false);

  const [properties, setProperties] =
  useState([]);

  const [step, setStep] = useState(1);


  const togglePropertyType = type => {
    let types = [...searchData.propertyTypes];

    if (types.includes(type)) {
      types = types.filter(x => x !== type);
    } else {
      types.push(type);
    }

    setSearchData({
      ...searchData,
      propertyTypes: types,
    });
  };

  const searchProperties =
  async () => {
    if (
      !searchData.category
    ) {
      Alert.alert(
        'Please select property category',
      );
      return;
    }

    if (
      !searchData.purpose
    ) {
      Alert.alert(
        'Please select buy or rent',
      );
      return;
    }

    if (
      searchData
        .propertyTypes
        .length === 0
    ) {
      Alert.alert(
        'Please select property type',
      );
      return;
    }

    if (
      !searchData.location
    ) {
      Alert.alert(
        'Please enter location',
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          'https://your-api-url/api/Property/ai-search',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body:
              JSON.stringify(
                searchData,
              ),
          },
        );

      const data =
        await response.json();

      /*
      Expected Response

      {
        "properties":[
          {
            "id":1,
            "title":"3 BHK Flat",
            "location":"Mansarovar",
            "price":"4500000"
          }
        ]
      }
      */

      setProperties(
        data.properties ||
          [],
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Something went wrong',
      );
    }

    setLoading(false);
  };

  const Chip = ({
    label,
    selected,
    onPress,
  }) => (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && styles.selectedChip,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.chipText,
          selected &&
            styles.selectedChipText,
        ]}>
        {selected ? '✅ ' : ''}
        {label}
      </Text>
    </TouchableOpacity>
  );

 return (
  <SafeAreaView style={styles.container}>
    <Header />
  

    {/* Header */}
    <View style={styles.headerCard}>
      <Text style={styles.headerTitle}>
        🤖 Filter Property
      </Text>

      <Text style={styles.headerSubTitle}>
        Question {step} of 7
      </Text>
    </View>

    <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>

        {/* Category */}
        {step >=1 && (
          <Animated.View entering={SlideInUp.springify()}>
          <View style={styles.card}>
            <Text style={styles.title}>
              Property Category
            </Text>

            <View style={styles.rowWrap}>
              <Chip
                label="Residential"
                selected={
                  searchData.category === 'Residential'
                }
                onPress={() => {
                  setSearchData({
                    ...searchData,
                    category: 'Residential',
                  });

                  setStep(2);
                }}
              />

              <Chip
                label="Commercial"
                selected={
                  searchData.category === 'Commercial'
                }
                onPress={() => {
                  setSearchData({
                    ...searchData,
                    category: 'Commercial',
                  });

                  setStep(2);
                }}
              />
            </View>
          </View>
          </Animated.View>

        )}

        {/* Purpose */}
        {step >=2 && (
          <View style={styles.card}>
            <Text style={styles.title}>
              Property For
            </Text>

            <View style={styles.rowWrap}>
              <Chip
                label="Buy"
                selected={
                  searchData.purpose === 'Buy'
                }
                onPress={() => {
                  setSearchData({
                    ...searchData,
                    purpose: 'Buy',
                  });

                  setStep(3);
                }}
              />

              <Chip
                label="Rent"
                selected={
                  searchData.purpose === 'Rent'
                }
                onPress={() => {
                  setSearchData({
                    ...searchData,
                    purpose: 'Rent',
                  });

                  setStep(3);
                }}
              />
            </View>
          </View>
        )}

        {/* Property Type */}
        {step >= 3 && (
          <View style={styles.card}>
            <Text style={styles.title}>
              Property Type
            </Text>

            <View style={styles.rowWrap}>
              {[
                'Flat',
                'Villa',
                'Plot',
                'Office',
                'Shop',
              ].map(item => (
                <Chip
                  key={item}
                  label={item}
                  selected={
                    searchData.propertyTypes[0] === item
                  }
                  onPress={() => {
                    setSearchData({
                      ...searchData,
                      propertyTypes: [item],
                    });

                    setStep(4);
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Location */}
        {step >= 4 && (
          <View style={styles.card}>
            <Text style={styles.title}>
              Location
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Location"
              value={searchData.location}
              onChangeText={text =>
                setSearchData({
                  ...searchData,
                  location: text,
                })
              }
              returnKeyType="done"
              onSubmitEditing={() => {
                if (
                  searchData.location.trim()
                ) {
                  setStep(5);
                }
              }}
            />
          </View>
        )}

        {/* Budget */}
        {step >= 5 && (
          <View style={styles.card}>
            <Text style={styles.title}>
              Budget
            </Text>

            <View style={styles.rowWrap}>
              {[
                'Under ₹25 Lakh',
                '₹25-50 Lakh',
                '₹50L-1 Cr',
                'Above ₹1 Cr',
              ].map(item => (
                <Chip
                  key={item}
                  label={item}
                  selected={
                    searchData.budget === item
                  }
                  onPress={() => {
                    setSearchData({
                      ...searchData,
                      budget: item,
                    });

                    setStep(6);
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Bedrooms */}
        {step >= 6 && (
          <View style={styles.card}>
            <Text style={styles.title}>
              Bedrooms
            </Text>

            <View style={styles.rowWrap}>
              {[
                '1 BHK',
                '2 BHK',
                '3 BHK',
                '4+ BHK',
              ].map(item => (
                <Chip
                  key={item}
                  label={item}
                  selected={
                    searchData.bedrooms === item
                  }
                  onPress={() => {
                    setSearchData({
                      ...searchData,
                      bedrooms: item,
                    });

                    setStep(7);
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Summary */}
        {step >= 7 && (
          <View style={styles.card}>
            <Text style={styles.title}>
              🎯 Your Requirement
            </Text>

            <Text style={styles.summary}>
              Category: {searchData.category}
            </Text>

            <Text style={styles.summary}>
              Purpose: {searchData.purpose}
            </Text>

            <Text style={styles.summary}>
              Property:{' '}
              {searchData.propertyTypes.join(
                ', ',
              )}
            </Text>

            <Text style={styles.summary}>
              Location: {searchData.location}
            </Text>

            <Text style={styles.summary}>
              Budget: {searchData.budget}
            </Text>

            <Text style={styles.summary}>
              Bedrooms: {searchData.bedrooms}
            </Text>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={searchProperties}>
              <Text
                style={
                  styles.searchButtonText
                }>
                🔍 Search Properties
              </Text>
            </TouchableOpacity>
          </View>
        )}


      {loading && (
        <ActivityIndicator
          size="large"
          color="#0A84FF"
          style={{marginTop: 20}}
        />
      )}

    </ScrollView>

    <Footer />
  </SafeAreaView>
);
};

export default AiSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    
  },

  headerCard: {
    backgroundColor: '#0A84FF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  headerSubTitle: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },

  row: {
    flexDirection: 'row',
  },

  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginRight: 10,
    marginBottom: 10,
  },

  selectedChip: {
    backgroundColor: '#0A84FF',
  },

  chipText: {
    color: '#333',
    fontWeight: '600',
  },

  selectedChipText: {
    color: '#fff',
  },

  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    color: '#222',
  },
  summary: {
  fontSize: 15,
  color: '#333',
  marginBottom: 8,
},

searchButton: {
  backgroundColor: '#0A84FF',
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: 'center',
  marginTop: 15,
},

searchButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
},

propertyCard: {
  backgroundColor:
    '#F8F9FA',
  borderRadius: 12,
  padding: 15,
  marginTop: 15,
},

propertyTitle: {
  fontSize: 16,
  fontWeight: '700',
  marginBottom: 10,
},

propertyText: {
  fontSize: 14,
  color: '#444',
  marginBottom: 5,
},

viewButton: {
  backgroundColor:
    '#0A84FF',
  borderRadius: 10,
  paddingVertical: 10,
  alignItems: 'center',
  marginTop: 12,
},

viewButtonText: {
  color: '#fff',
  fontWeight: '700',
},

});
