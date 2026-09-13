import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const PropertyTabs = ({
  selectedProperty,
  onTabChange,
  navigation,
  setShowProjects,
}) => {
  const [selectedType, setSelectedType] = useState('Buy');

  // Navigation route ke according active tab set karo
  useEffect(() => {
    const routeName =
      navigation?.getState()?.routes?.[
        navigation?.getState()?.index
      ]?.name;

    if (
      routeName === 'RentHome' ||
      routeName === 'RentalList'
    ) {
      setSelectedType('Rent');
    } else if (routeName === 'Home') {
      setSelectedType('Buy');
    }
  }, [navigation]);

  let tabs = [];

  if (selectedType === 'Buy') {
    tabs = [
      'Villa',
      '3 BHK',
      '2 BHK',
      '1 BHK',
      'Plots',
      'Shop',
      'Farm House',
    ];
  } else if (selectedType === 'Rent') {
    tabs = [
      'Apartment',
      'House',
      'Boys PG',
      'Girls PG',
      'Office',
      'Shop',
      'Showroom',
      'Warehouse',
    ];
  } 

  const handleTypeChange = type => {
    setSelectedType(type);

    // Reset selected property
    onTabChange(null);

    if (type === 'Projects') {
      setShowProjects?.(true);
      return;
    }

    if (type === 'Rent') {
        setShowProjects?.(false);

      // IMPORTANT:
      // Ye name exactly Stack.Screen ke name se match hona chahiye
      navigation?.navigate('RentHome');
      return;
    }

    if (type === 'Buy') {
      setShowProjects?.(false);

      // Ye name exactly Stack.Screen ke name se match hona chahiye
      navigation?.navigate('Home');
      return;
    }
  };

  return (
    <View style={styles.wrapper}>

      {/* BUY / RENT / PROJECTS SWITCH */}
      <View style={styles.switchRow}>
        {['Buy', 'Rent', 'Projects'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.switchBtn,
              selectedType === type && styles.activeSwitch,
            ]}
            onPress={() => handleTypeChange(type)}
          >
            <Text
              style={[
                styles.switchText,
                selectedType === type && styles.activeText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PROPERTY TYPE STRIP */}
      <View style={styles.footerStrip}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.item}
              onPress={() => onTabChange(item)}
            >
              <Text style={styles.icon}>
                {item === '3 BHK' ? '🏠' :
                  item === '2 BHK' ? '🏡' :
                  item === '1 BHK' ? '🏘️' :
                  item === 'Villa' ? '🏡' :
                  item === 'House' ? '🏠' :
                  item === 'Plots' ? '📍' :
                  item === 'Farm House' ? '🌳' :
                  item === 'Apartment' ? '🏢' :
                  item === 'Boys PG' ? '👨‍🎓' :
                  item === 'Girls PG' ? '👩‍🎓' :
                  item === 'Office' ? '💼' :
                  item === 'Shop' ? '🏪' :
                  item === 'Showroom' ? '🏬' :
                  item === 'Warehouse' ? '📦' :
                  item === 'Ready to Move' ? '🏠' :
                  item === 'New Launch' ? '🚀' :
                  item === 'Under Construction' ? '🏗️' :
                  '🏢'}
              </Text>

              <Text
                style={[
                  styles.text,
                  selectedProperty === item &&
                    styles.activeTextItem,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

    </View>
  );
};

export default PropertyTabs;

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    backgroundColor: '#F5F5F5',
  },

  switchRow: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    padding: 3,
    marginBottom: 10,
  },

  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },

  activeSwitch: {
    borderWidth: 1,
    borderColor: '#012353',
  },

  switchText: {
    fontWeight: '800',
    color: '#333',
  },

  activeText: {
    color: '#333',
    fontWeight: 'bold',
  },

  footerStrip: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 4,
  },

  item: {
    alignItems: 'center',
    marginHorizontal: 12,
  },

  icon: {
    fontSize: 18,
    marginBottom: 3,
  },

  text: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
  },

  activeTextItem: {
    color: '#0078FF',
    fontWeight: 'bold',
  },
});