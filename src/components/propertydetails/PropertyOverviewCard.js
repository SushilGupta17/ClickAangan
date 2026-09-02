import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PropertyOverviewCard = ({property}) => {

  const items = [
    {
      icon: 'bed-outline',
      value: property?.bhk || '-',
      label: 'Bedrooms',
    },

    {
      icon: 'shower',
      value: property?.bathrooms || '-',
      label: 'Bathrooms',
    },

    {
      icon: 'floor-plan',
      value: property?.area || '-',
      label: 'Area',
    },

    {
      icon: 'balcony',
      value: property?.balconies || '-',
      label: 'Balconies',
    },
  ];

  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Property Overview
      </Text>

      <View style={styles.grid}>

        {items.map((item, index) => (

          <View
            key={index}
            style={styles.item}>

            <View style={styles.iconContainer}>

              <Icon
                name={item.icon}
                size={22}
                color="#1959A2"
              />

            </View>

            <Text
              style={styles.value}
              numberOfLines={1}>

              {item.value}

            </Text>

            <Text style={styles.label}>
              {item.label}
            </Text>

          </View>

        ))}

      </View>

    </View>

  );
};

export default PropertyOverviewCard;


const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    padding: 18,
    borderRadius: 15,
    elevation: 3,
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102A47',
    marginBottom: 15,
  },

  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },

  value: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102A47',
  },

  label: {
    marginTop: 3,
    fontSize: 10,
    color: '#777',
    textAlign: 'center',
  },

});