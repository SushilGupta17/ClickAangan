import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const NearbyPlaces = ({nearby = ''}) => {
  const nearbyText = String(nearby || '').trim();

  if (!nearbyText) {
    return null;
  }

  return (
    <View style={styles.card}>

      <Text style={styles.heading}>
        Nearby Places
      </Text>

      <View style={styles.box}>

        <Text style={styles.icon}>
          📍
        </Text>

        <Text style={styles.description}>
          {nearbyText}
        </Text>

      </View>

    </View>
  );
};

export default NearbyPlaces;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 18,
    borderRadius: 15,
    elevation: 3,
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },

  box: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  icon: {
    fontSize: 20,
    marginRight: 10,
  },

  description: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    lineHeight: 22,
  },
});