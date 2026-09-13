import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// =========================================================
// RENTAL STATUS CONFIG
// =========================================================

const statusIcons = {
  Available: {
    name: 'home-check',
    color: '#2E7D32',
    description: 'This property is currently available for rent.',
  },

  Approved: {
    name: 'check-decagram',
    color: '#2E7D32',
    description: 'This rental property has been approved and is available.',
  },

  Rented: {
    name: 'home-lock',
    color: '#C62828',
    description: 'This property is currently rented out.',
  },

  Pending: {
    name: 'clock-outline',
    color: '#F57C00',
    description: 'This rental property is currently under verification.',
  },

  Inactive: {
    name: 'home-off',
    color: '#757575',
    description: 'This rental property is currently inactive.',
  },
};

// =========================================================
// RENTAL STATUS CARD
// =========================================================

const RentalStatusCard = ({property}) => {
  const rawStatus =
    property?.status ||
    property?.Status ||
    property?.propertyStatus ||
    property?.PropertyStatus ||
    'Available';

  // =======================================================
  // NORMALIZE STATUS
  // =======================================================

  const status = String(rawStatus).trim();

  const icon =
    statusIcons[status] ||
    statusIcons.Available;

  // =======================================================
  // FALLBACK DESCRIPTION
  // =======================================================

  const description =
    icon.description ||
    'This rental property is currently available.';

  return (
    <View style={styles.card}>

      {/* ===================================================
          HEADING
      =================================================== */}

      <Text style={styles.heading}>
        Rental Property Status
      </Text>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <View style={styles.content}>

        {/* =================================================
            ICON
        ================================================= */}

        <View
          style={[
            styles.iconContainer,
            {
              borderColor: `${icon.color}25`,
            },
          ]}>
          <Icon
            name={icon.name}
            size={42}
            color={icon.color}
          />
        </View>

        {/* =================================================
            STATUS INFO
        ================================================= */}

        <View style={styles.info}>

          <Text
            style={[
              styles.status,
              {
                color: icon.color,
              },
            ]}>
            {status}
          </Text>

          <Text style={styles.desc}>
            {description}
          </Text>

        </View>
      </View>
    </View>
  );
};

export default RentalStatusCard;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 15,

    marginTop: 15,

    backgroundColor: '#fff',

    borderRadius: 15,

    padding: 16,

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
  // HEADING
  // =======================================================

  heading: {
    fontSize: 16,

    fontWeight: '700',

    color: '#102A47',

    marginBottom: 15,
  },

  // =======================================================
  // CONTENT
  // =======================================================

  content: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  // =======================================================
  // ICON
  // =======================================================

  iconContainer: {
    width: 62,

    height: 62,

    borderRadius: 31,

    backgroundColor: '#F5F7FA',

    justifyContent: 'center',

    alignItems: 'center',

    borderWidth: 1,
  },

  // =======================================================
  // INFO
  // =======================================================

  info: {
    flex: 1,

    marginLeft: 15,
  },

  // =======================================================
  // STATUS
  // =======================================================

  status: {
    fontSize: 18,

    fontWeight: '700',
  },

  // =======================================================
  // DESCRIPTION
  // =======================================================

  desc: {
    marginTop: 7,

    color: '#666',

    lineHeight: 20,

    fontSize: 13,
  },
});