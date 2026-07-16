import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';


  const PropertyTabs =  ({ selectedProperty, onTabChange,showTopFilters = true}) => {

  const [selectedType, setSelectedType] =             useState('Buy');
  const [selectedCommercial, setSelectedCommercial] = useState('Shop');
  const [selectedCategory, setSelectedCategory] =     useState('Residential');
  
  return (
    <View style={styles.container}>

      {/* Buy / Rent */}
      <View style={styles.row}>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedType === 'Buy' &&
              styles.activeTabButton,
          ]}
          onPress={() => setSelectedType('Buy')}>
          <Text
            style={[
              styles.tabText,
              selectedType === 'Buy' &&
                styles.activeTabText,
            ]}>
            Buy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedType === 'Rent' &&
              styles.activeTabButton,
          ]}
          onPress={() => setSelectedType('Rent')}>
          <Text
            style={[
              styles.tabText,
              selectedType === 'Rent' &&
                styles.activeTabText,
            ]}>
            Rent
          </Text>
        </TouchableOpacity>

      </View>

      {/* Buy Options */}
      {selectedType === 'Buy' && (
        <>
          <View style={styles.row}>

            <TouchableOpacity
              style={[
                styles.subTabButton,
                selectedCategory ===
                  'Residential' &&
                  styles.activeSubTab,
              ]}
              onPress={() =>
                setSelectedCategory(
                  'Residential',
                )
              }>
              <Text
                style={[
                  styles.subTabText,
                  selectedCategory ===
                    'Residential' &&
                    styles.activeSubTabText,
                ]}>
                Residential
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.subTabButton,
                selectedCategory ===
                  'Commercial' &&
                  styles.activeSubTab,
              ]}
              onPress={() =>
                setSelectedCategory(
                  'Commercial',
                )
              }>
              <Text
                style={[
                  styles.subTabText,
                  selectedCategory ===
                    'Commercial' &&
                    styles.activeSubTabText,
                ]}>
                Commercial
              </Text>
            </TouchableOpacity>

          </View>

          {/* Residential */}
          {selectedCategory ===
            'Residential' && (
            <View style={styles.row}>
              {[
                '3 BHK',
                '2 BHK',
                '1 BHK',
                'House',
                'Plots',
              ].map(item => (
                <TouchableOpacity
                      key={item}
                      style={[
                        styles.smallButton,
                        selectedProperty === item &&
                          styles.activeSmallButton,
                      ]}
                     onPress={() => onTabChange(item)}>
                  <Text style={styles.smallButtonText}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Commercial */}
         {selectedCategory === 'Commercial' && (
            <View style={styles.row}>
              {['Shop', 'Land', 'Office', 'Showroom', 'Warehouse'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.smallButton,
                    selectedCommercial === item && styles.activeSmallButton,
                  ]}
                  onPress={() => setSelectedCommercial(item)}
                >
                <Text
                  style={[
                    styles.smallButtonText,
                    selectedCommercial === item && styles.activeSmallButtonText,
                  ]}
                >
                    {item}
                </Text>
                </TouchableOpacity>
              ))}
            </View>
            )}
        </>
      )}

      {/* Rent Options */}
      {selectedType === 'Rent' && (
        <View style={styles.row}>
          {[
            'Flat',
            'House',
            'PG',
          ].map(item => (
          <TouchableOpacity
              key={item}
              style={[
                styles.smallButton,
                selectedProperty === item &&
                  styles.activeSmallButton,
              ]}
              onPress={() => onTabChange(item)}>
              <Text
                  style={[
                    styles.smallButtonText,
                    selectedProperty === item &&
                      styles.activeSmallButtonText,
                  ]}>
                  {item}
                </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

    </View>
  );
};

export default PropertyTabs;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  
  row: {
  flexDirection: 'row',
  backgroundColor: '#E9ECEF',
  borderRadius: 12,
  padding: 2,
  marginBottom: 3,
},

tabButton: {
  width: '25%',
  paddingVertical: 10,
  marginHorizontal: 0,
  borderRadius: 10,
  alignItems: 'center',
},

activeTabButton: {
  backgroundColor: '#012353',
  borderRadius: 10,
},

  tabText: {
    color: '#333',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  subTabButton: {
  width: '35%',
  paddingVertical: 10,
  marginRight: 2,
  borderRadius: 8,
  backgroundColor: '#FFFFFF',
  alignItems: 'center',
  justifyContent: 'center',
},

  activeSubTab: {
    backgroundColor: '#28A745',
    borderColor: '#28A745',
  },

  subTabText: {
    color: '#333',
    fontWeight: '600',
  },

  activeSubTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  smallButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },

  smallButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  activeSmallButton: {
  backgroundColor: '#012353',
  borderColor: '#012353',
},

activeSmallButtonText: {
  color: '#FFF',
  fontWeight: 'bold',
},
});