import React, {useState} from 'react';
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

import Header from '../components/Header';
import Footer from '../components/Footer';

const SearchScreen = ({navigation}) => {
  const API_URL = 'https://savariyaproperty.in';

  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budgetFrom, setBudgetFrom] = useState('');
  const [budgetTo, setBudgetTo] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searched, setSearched] = useState(false);

  // Search API Function
  const searchProperties = async (
    location,
    proptype,
    budgetfr,
    budgetto,
  ) => {
    try {
      const params = new URLSearchParams();

      if (location) params.append('location', location);
      if (proptype) params.append('proptype', proptype);
      if (budgetfr) params.append('budgetfr', budgetfr.toString());
      if (budgetto) params.append('budgetto', budgetto.toString());

      const url = `https://savariyaproperty.in/api/search/SearchProperty?${params.toString()}`;

      console.log('API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
          return [];
        }

      if (!response.ok) {
        return [];
       // throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search Error:', error);
      return [];
    }
  };

  // Search Button Click

  const handleSearch = async () => {
  const data = await searchProperties(
    location.trim(),
    propertyType.trim(),
    budgetFrom,
    budgetTo,
  );

  setFilteredProperties(data);
  setSearched(true);
};

  return (
    <SafeAreaView style={styles.safeContainer}>

      <Header />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        <View style={styles.searchCard}>
          <Text style={styles.heading}>
            Find Your Dream Property
          </Text>

          <Text style={styles.subHeading}>
            Search properties by location, type and budget.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="📍 Enter Location"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />

          <TextInput
            style={styles.input}
            placeholder="🏠 Property Type"
            placeholderTextColor="#999"
            value={propertyType}
            onChangeText={setPropertyType}
          />

          <TextInput
            style={styles.input}
            placeholder="₹ Budget From"
            keyboardType="numeric"
            placeholderTextColor="#999"
            value={budgetFrom}
            onChangeText={setBudgetFrom}
          />

          <TextInput
            style={styles.input}
            placeholder="₹ Budget To"
            keyboardType="numeric"
            placeholderTextColor="#999"
            value={budgetTo}
            onChangeText={setBudgetTo}
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}>
            <Text style={styles.searchButtonText}>
              Search Properties
            </Text>
          </TouchableOpacity>
        </View>

       <Text style={styles.resultHeading}>
  {searched
    ? `Search Results (${filteredProperties.length})`
    : 'Search Results'}
</Text>
{searched && filteredProperties.length === 0 ? (
  <View style={styles.notFoundContainer}>
    <Text style={styles.notFoundText}>
      No properties found.
    </Text>
  </View>
) : (
  filteredProperties.map(item => (
    <TouchableOpacity
      key={item.id}
      style={styles.propertyCard}
      onPress={() =>
        navigation.navigate('PropertyDetails', {
          property: item,
        })
      }>
      <Image
        source={{ uri: API_URL + item.imageUrl }}
        style={styles.propertyImage}
        resizeMode="cover"
      />

      <View style={styles.propertyContent}>
        <Text style={styles.propertyTitle}>{item.title}</Text>

        <Text style={styles.propertyLocation}>
          📍 {item.location} 
        </Text>

        <Text style={styles.propertyPrice}>
          ₹ {item.price}
        </Text>

        <TouchableOpacity style={styles.detailsButton} onPress={() =>
                  navigation.navigate('PropertyDetails', {
                    property: item,
                    id: item.id,
                  })
                }>
            <Text style={styles.detailsButtonText}>
                View Details
            </Text>
          </TouchableOpacity>


      </View>
    </TouchableOpacity>
  ))
)}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  container: {
    padding: 20,
    paddingBottom: 100,
  },

  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },

  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
  },

  subHeading: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },

  input: {
    height: 55,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222',
    marginBottom: 15,
  },

  searchButton: {
    height: 55,
    backgroundColor: '#0A8754',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  searchButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  resultHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 15,
  },

  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
  },

  propertyImage: {
    width: '100%',
    height: 180,
  },

  propertyContent: {
    padding: 15,
  },

  propertyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },

  propertyPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A8754',
    marginTop: 10,
  },

  detailsButton: {
    backgroundColor: '#0A8754',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 15,
    alignItems: 'center',
  },

  detailsButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});