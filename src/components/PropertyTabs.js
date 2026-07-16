import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';

const PropertyTabs = ({
  selectedProperty,
  onTabChange,
}) => {
  const [selectedType, setSelectedType] = useState('Buy');

  const tabs =
    selectedType === 'Buy'
      ? ['3 BHK', '2 BHK', '1 BHK', 'Villa', 'Plots', 'Shop']
      : ['Flat', 'House', 'Boys PG', 'Girls PG', 'Shop', 'Marriage Garden'];

  return (
    <View style={styles.wrapper}>

      {/* BUY / RENT SWITCH */}
      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[
            styles.switchBtn,
            selectedType === 'Buy' && styles.activeSwitch,
          ]}
          onPress={() => setSelectedType('Buy')}>
          <Text
            style={[
              styles.switchText,
              selectedType === 'Buy' && styles.activeText,
            ]}>
            Buy 1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.switchBtn,
            selectedType === 'Rent' && styles.activeSwitch,
          ]}
          onPress={() => setSelectedType('Rent')}>
          <Text
            style={[
              styles.switchText,
              selectedType === 'Rent' && styles.activeText,
            ]}>
            Rent
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER STYLE STRIP */}
      <View style={styles.footerStrip}>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>

          {tabs.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.item}
              onPress={() => onTabChange(item)}
            >

              {/* ICON */}
              <Text style={styles.icon}>
                {item === '3 BHK' ? '🏠' :
                 item === '2 BHK' ? '🏡' :
                 item === '1 BHK' ? '🏘️' :
                 item === 'House' ? '🏠' :
                 item === 'Plots' ? '📍' :
                 item === 'Shop' ? '🏪' :
                 item === 'Boys PG' ? '👨‍🎓' :
                 item === 'Girls PG' ? '👩‍🎓' :
                 item === 'Marriage Garden' ? '💒' : '🏢'}
              </Text>

              {/* LABEL */}
              <Text
                style={[
                  styles.text,
                  selectedProperty === item && styles.activeTextItem,
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

  // BUY / RENT SWITCH
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

  // FOOTER STRIP
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