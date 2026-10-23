import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// =========================================================
// PRICE FORMAT
// Example:
// 15000 => 15,000
// 250000 => 2,50,000
// =========================================================

const formatAmount = amount => {
  if (
    amount === null ||
    amount === undefined ||
    amount === '' ||
    isNaN(Number(amount))
  ) {
    return '0';
  }

  return Number(amount).toLocaleString('en-IN');
};

// =========================================================
// PRICE CARD
// =========================================================

const PropertyPriceCard = ({property}) => {

  const rent =
    property?.Price ??
    property?.price ??
    0;

  return (
    <View style={styles.card}>

      {/* ===================================================
          HEADING
      =================================================== */}

      <Text style={styles.title}>
        Price 
      </Text>

      {/* ===================================================
          Price
      =================================================== */}

      <View style={styles.rentBox}>
        <View style={styles.rentIcon}>
          <Icon
            name="currency-inr"
            size={24}
            color="#2E7D32"
          />
        </View>

        <View style={styles.rentInfo}>
          <Text style={styles.rent}>
            ₹ {formatAmount(rent)}
            <Text style={styles.month}>
              {' '}  
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};
export default PropertyPriceCard;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  // =======================================================
  // CARD
  // =======================================================

  card: {
    backgroundColor: '#fff',

    marginHorizontal: 15,

    marginTop: 15,

    marginBottom: 15,

    padding: 18,

    borderRadius: 15,

    elevation: 3,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 5,
  },

  // =======================================================
  // TITLE
  // =======================================================

  title: {
    fontWeight: '600',

    fontSize: 12,

    color: '#102A47',

    marginBottom: 8,
  },

  // =======================================================
  // RENT BOX
  // =======================================================

  rentBox: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#F5FAF6',

    borderRadius: 12,

    padding: 13,
  },

  // =======================================================
  // RENT ICON
  // =======================================================

  rentIcon: {
    width: 46,

    height: 46,

    borderRadius: 23,

    backgroundColor: '#E8F5E9',

    justifyContent: 'center',

    alignItems: 'center',
  },

  // =======================================================
  // RENT INFO
  // =======================================================

  rentInfo: {
    marginLeft: 12,

    flex: 1,
  },

  rentLabel: {
    fontSize: 12,

    color: '#666',

    fontWeight: '500',
  },

  rent: {
    marginTop: 3,

    fontSize: 14,

    fontWeight: '700',

    color: '#2E7D32',
  },

  month: {
    fontSize: 12,

    fontWeight: '600',

    color: '#666',
  },

  // =======================================================
  // DIVIDER
  // =======================================================

  divider: {
    height: 0,

    backgroundColor: '#E5E7EB',

    marginVertical: 10,
  },

  // =======================================================
  // DETAILS ROW
  // =======================================================

  detailsRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  // =======================================================
  // DETAIL ITEM
  // =======================================================

  detailItem: {
    flex: 1,

    alignItems: 'center',

    paddingHorizontal: 3,
  },

  // =======================================================
  // ICON CIRCLE
  // =======================================================

  iconCircle: {
    width: 40,

    height: 40,

    borderRadius: 20,

    backgroundColor: '#F5F7FA',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 7,
  },

  // =======================================================
  // LABEL
  // =======================================================

  detailLabel: {
    fontSize: 10,

    color: '#777',

    textAlign: 'center',

    fontWeight: '500',
  },

  // =======================================================
  // VALUE
  // =======================================================

  detailValue: {
    marginTop: 3,

    fontSize: 12,

    color: '#102A47',

    fontWeight: '700',

    textAlign: 'center',
  },
});