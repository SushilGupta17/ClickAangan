// src/screens/AiSearchScreen.js

import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {  } from 'react-native-safe-area-context';




import Header from '../components/Header';
import Footer from '../components/Footer';

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
    <SafeAreaView style={styles.container} >
      <Header/>
          {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>
            🤖 Savariya AI Assistant
          </Text>

          <Text style={styles.headerSubTitle}>
            Aap kis type ki property
            dhoondh rahe hain?
          </Text>
        </View>
      <ScrollView
        contentContainerStyle={{
          padding: 15,
        }}>

    

        {/* Category */}
        <View style={styles.card}>
          <Text style={styles.title}>
            Property Category
          </Text>

          <View style={styles.row}>
            <Chip
              label="Residential"
              selected={
                searchData.category ===
                'Residential'
              }
              onPress={() =>
                setSearchData({
                  ...searchData,
                  category:
                    'Residential',
                })
              }
            />

            <Chip
              label="Commercial"
              selected={
                searchData.category ===
                'Commercial'
              }
              onPress={() =>
                setSearchData({
                  ...searchData,
                  category:
                    'Commercial',
                })
              }
            />
          </View>
        </View>

        {/* Purpose */}
        <View style={styles.card}>
          <Text style={styles.title}>
            Property For
          </Text>

          <View style={styles.row}>
            <Chip
              label="Buy"
              selected={
                searchData.purpose ===
                'Buy'
              }
              onPress={() =>
                setSearchData({
                  ...searchData,
                  purpose: 'Buy',
                })
              }
            />

            <Chip
              label="Rent"
              selected={
                searchData.purpose ===
                'Rent'
              }
              onPress={() =>
                setSearchData({
                  ...searchData,
                  purpose: 'Rent',
                })
              }
            />
          </View>
        </View>

        {/* Property Type */}
        <View style={styles.card}>
          <Text style={styles.title}>
            Property Type
          </Text>

          <View style={styles.rowWrap}>
            <Chip
              label="Flat"
              selected={searchData.propertyTypes.includes(
                'Flat',
              )}
              onPress={() =>
                togglePropertyType(
                  'Flat',
                )
              }
            />

            <Chip
              label="Villa"
              selected={searchData.propertyTypes.includes(
                'Villa',
              )}
              onPress={() =>
                togglePropertyType(
                  'Villa',
                )
              }
            />

            <Chip
              label="Plot"
              selected={searchData.propertyTypes.includes(
                'Plot',
              )}
              onPress={() =>
                togglePropertyType(
                  'Plot',
                )
              }
            />

            <Chip
              label="Office"
              selected={searchData.propertyTypes.includes(
                'Office',
              )}
              onPress={() =>
                togglePropertyType(
                  'Office',
                )
              }
            />

            <Chip
              label="Shop"
              selected={searchData.propertyTypes.includes(
                'Shop',
              )}
              onPress={() =>
                togglePropertyType(
                  'Shop',
                )
              }
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <Text style={styles.title}>
            Location
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Location"
            placeholderTextColor="#999"
            value={
              searchData.location
            }
            onChangeText={text =>
              setSearchData({
                ...searchData,
                location: text,
              })
            }
          />
            </View>
          {/* Budget */}
<View style={styles.card}>
  <Text style={styles.title}>
    Budget
  </Text>

  <View style={styles.rowWrap}>
    <Chip
      label="Under ₹25 Lakh"
      selected={
        searchData.budget ===
        'Under ₹25 Lakh'
      }
      onPress={() =>
        setSearchData({
          ...searchData,
          budget:
            'Under ₹25 Lakh',
        })
      }
    />

    <Chip
      label="₹25-50 Lakh"
      selected={
        searchData.budget ===
        '₹25-50 Lakh'
      }
      onPress={() =>
        setSearchData({
          ...searchData,
          budget:
            '₹25-50 Lakh',
        })
      }
    />

    <Chip
      label="₹50L-1 Cr"
      selected={
        searchData.budget ===
        '₹50L-1 Cr'
      }
      onPress={() =>
        setSearchData({
          ...searchData,
          budget:
            '₹50L-1 Cr',
        })
      }
    />

    <Chip
      label="Above ₹1 Cr"
      selected={
        searchData.budget ===
        'Above ₹1 Cr'
      }
      onPress={() =>
        setSearchData({
          ...searchData,
          budget:
            'Above ₹1 Cr',
        })
      }
    />
  </View>
</View>

{/* Bedrooms */}
<View style={styles.card}>
  <Text style={styles.title}>
    Bedrooms
  </Text>

  <View style={styles.rowWrap}>
    <Chip
      label="1 BHK"
      selected={
        searchData.bedrooms ===
        '1 BHK'
      }
      onPress={() =>
        setSearchData({
          ...searchData,
          bedrooms:
            '1 BHK',
        })
      }
    />

    <Chip
      label="2 BHK"
      selected={
        searchData.bedrooms ===
        '2 BHK'
      }
      onPress={() =>
        setSearchData({
          ...searchData,
          bedrooms:
            '2 BHK',
        })
      }
    />

    <Chip
      label="3 BHK"
      selected={
        searchData.bedrooms ===
        '3 BHK'
      }
      onPress={() =>
        setSearchData({
          ...searchData,
          bedrooms:
            '3 BHK',
        })
      }
    />

    <Chip
      label="4+ BHK"
      selected={
        searchData.bedrooms ===
        '4+ BHK'
      }
      onPress={() =>
        setSearchData({
          ...searchData,
          bedrooms:
            '4+ BHK',
        })
      }
    />
  </View>
</View>

{/* Summary */}
<View style={styles.card}>
  <Text style={styles.title}>
    🎯 Your Requirement
  </Text>

  <Text style={styles.summary}>
    Category :
    {' '}
    {searchData.category ||
      '-'}
  </Text>

  <Text style={styles.summary}>
    Purpose :
    {' '}
    {searchData.purpose ||
      '-'}
  </Text>

  <Text style={styles.summary}>
    Property :
    {' '}
    {searchData
      .propertyTypes.length
      ? searchData.propertyTypes.join(
          ', ',
        )
      : '-'}
  </Text>

  <Text style={styles.summary}>
    Location :
    {' '}
    {searchData.location ||
      '-'}
  </Text>

  <Text style={styles.summary}>
    Budget :
    {' '}
    {searchData.budget ||
      '-'}
  </Text>

  <Text style={styles.summary}>
    Bedrooms :
    {' '}
    {searchData.bedrooms ||
      '-'}
  </Text>

  <TouchableOpacity
    style={styles.searchButton}
    onPress={searchProperties}
>
   
    <Text
      style={
        styles.searchButtonText
      }>
      🔍 Search Properties
    </Text>
  </TouchableOpacity>
</View>
{loading && (
  <ActivityIndicator
    size="large"
    color="#0A84FF"
    style={{
      marginTop: 20,
    }}
  />
)}
{properties.length > 0 && (
  <View
    style={styles.card}>
    <Text
      style={styles.title}>
      🏠 Properties
    </Text>

    {properties.map(
      item => (
        <View
          key={item.id}
          style={
            styles.propertyCard
          }>
          <Text
            style={
              styles.propertyTitle
            }>
            🏠 {item.title}
          </Text>

          <Text
            style={
              styles.propertyText
            }>
            📍
            {' '}
            {
              item.location
            }
          </Text>

          <Text
            style={
              styles.propertyText
            }>
            💰 ₹
            {item.price}
          </Text>

          <TouchableOpacity
            style={
              styles.viewButton
            }>
            <Text
              style={
                styles.viewButtonText
              }>
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      ),
    )}
  </View>
)}

      

      </ScrollView>
      <Footer/>
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
