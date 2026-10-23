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
// RENTAL PRICE CARD
// =========================================================

const RentalPriceCard = ({property}) => {

  // =======================================================
  // MONTHLY RENT
  // =======================================================

  const rent =
    property?.Price ??
    property?.price ??
    0;

  // =======================================================
  // SECURITY AMOUNT
  // =======================================================

  const securityAmount =
    property?.securityAmount ??
    property?.SecurityAmount ??
    property?.securityDeposit ??
    property?.SecurityDeposit ??
    0;

  // =======================================================
  // MAINTENANCE AMOUNT
  // =======================================================

  const maintenanceAmount =
  property?.maintenanceAmount ??
  property?.MaintenanceAmount ??
  0;

  // =======================================================
  // LOCKING PERIOD
  // Default = 6 Months
  // =======================================================

  const lockingPeriod =
    property?.LockingPeriod ??
    property?.lockingPeriod ??
    6;

    // =======================================================
// FAMILY TYPE
// =======================================================
const familyType =
  property?.familyType ??
  property?.FamilyType ??
  'Any One';

  return (
    <View style={styles.card}>

      {/* ===================================================
          HEADING
      =================================================== */}

      <Text style={styles.title}>
        Rental Details
      </Text>

      {/* ===================================================
          MONTHLY RENT
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

          <Text style={styles.rentLabel}>
            Monthly Rent
          </Text>

          <Text style={styles.rent}>
            ₹ {formatAmount(rent)}
            <Text style={styles.month}>
              {' '} / Month
            </Text>
          </Text>

        </View>

      </View>

      {/* ===================================================
          OTHER RENTAL INFORMATION
      =================================================== */}

      <View style={styles.divider} />

      <View style={styles.detailsRow}>

        {/* =================================================
            SECURITY
        ================================================= */}

        <View style={styles.detailItem}>

          <View style={styles.iconCircle}>
            <Icon
              name="shield-check-outline"
              size={21}
              color="#1959A2"
            />
          </View>

          <Text style={styles.detailLabel}>
            Security
          </Text>

          <Text style={styles.detailValue}>
            ₹ {formatAmount(securityAmount)}
          </Text>

        </View>

        {/* =================================================
            MAINTENANCE
        ================================================= */}

        <View style={styles.detailItem}>

          <View style={styles.iconCircle}>
            <Icon
              name="tools"
              size={21}
              color="#E85D04"
            />
          </View>

          <Text style={styles.detailLabel}>
            Maintenance
          </Text>

          <Text style={styles.detailValue}>
            ₹ {formatAmount(maintenanceAmount)}
          </Text>

        </View>

        {/* =================================================
            LOCKING PERIOD
        ================================================= */}

        <View style={styles.detailItem}>

          <View style={styles.iconCircle}>
            <Icon
              name="lock-clock"
              size={21}
              color="#7B1FA2"
            />
          </View>

          <Text style={styles.detailLabel}>
            Locking Period
          </Text>

          <Text style={styles.detailValue}>
            {lockingPeriod} Months
          </Text>

        </View>

      </View>

    </View>
  );
};

export default RentalPriceCard;

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