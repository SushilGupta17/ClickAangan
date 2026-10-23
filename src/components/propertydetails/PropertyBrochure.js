import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const API_URL = 'https://savariyaproperty.in';

const PropertyBrochure = ({property}) => {

  const brochure =
    property?.brochurePath ||
    property?.brochure ||
    property?.brochureUrl;

  if (!brochure) {
    return null;
  }

  const download = () => {

    const url = brochure.startsWith('http')
      ? brochure
      : `${API_URL}${brochure}`;

    Linking.openURL(url);

  };

  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Property Brochure
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={download}>

        <View style={styles.iconContainer}>

          <Icon
            name="file-pdf-box"
            size={28}
            color="#D32F2F"
          />

        </View>

        <View style={styles.info}>

          <Text style={styles.text}>
            Download Brochure
          </Text>

          <Text style={styles.subText}>
            View property brochure PDF
          </Text>

        </View>

        <Icon
          name="chevron-right"
          size={24}
          color="#777"
        />

      </TouchableOpacity>

    </View>

  );

};

export default PropertyBrochure;


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
    fontWeight: '700',
    fontSize: 16,
    color: '#102A47',
    marginBottom: 15,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  text: {
    fontWeight: '600',
    fontSize: 14,
    color: '#222',
  },

  subText: {
    marginTop: 4,
    fontSize: 11,
    color: '#777',
  },

});