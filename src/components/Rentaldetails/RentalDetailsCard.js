
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

// =========================================================
// RENTAL DETAILS CARD
// ClickAangan
// Professional Magicbricks / Square Yards style
// =========================================================

const RentalDetailsCard = ({property}) => {
  if (!property) {
    return null;
  }

  // =======================================================
  // HELPERS
  // =======================================================

  const getValue = (...keys) => {
    for (const key of keys) {
      const value = property?.[key];

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== '' &&
        String(value).trim().toLowerCase() !== 'null' &&
        String(value).trim().toLowerCase() !== 'undefined'
      ) {
        return value;
      }
    }

    return null;
  };

  const cleanValue = value => {
    if (
      value === undefined ||
      value === null ||
      String(value).trim() === '' ||
      String(value).trim().toLowerCase() === 'null' ||
      String(value).trim().toLowerCase() === 'undefined'
    ) {
      return null;
    }

    return String(value).trim();
  };

  const formatValue = value => {
    const cleaned = cleanValue(value);

    if (!cleaned) {
      return null;
    }

    return cleaned;
  };

  const formatDate = value => {
  if (!value) {
    return null;
  }

  const dateString = String(value).trim();

  if (!dateString) {
    return null;
  }

  // ISO datetime:
  // 2026-09-10T00:00:00
  // 2026-09-10T18:30:00
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  return dateString.substring(0, 10);
};


  // =======================================================
  // PROPERTY VALUES
  // =======================================================

  const propertyType = formatValue(
    getValue(
      'propertyType',
      'PropertyType',
      'proptype',
      'PropType',
      'property_type',
    ),
  );

  const category = formatValue(
    getValue(
      'category',
      'Category',
      'propertyCategory',
      'PropertyCategory',
      'propertycategory',
    ),
  );

  const bhk = formatValue(
    getValue(
      'bhk',
      'BHK',
      'Bhk',
      'bedrooms',
      'Bedrooms',
      'noOfBedrooms',
      'NoOfBedrooms',
    ),
  );

  const bedrooms = formatValue(
    getValue(
      'bedrooms',
      'Bedrooms',
      'bedRoom',
      'BedRoom',
      'noOfBedrooms',
      'NoOfBedrooms',
    ),
  );

  const bathrooms = formatValue(
    getValue(
      'bathrooms',
      'Bathrooms',
      'bathroom',
      'Bathroom',
      'noOfBathrooms',
      'NoOfBathrooms',
    ),
  );

  const balconies = formatValue(
    getValue(
      'balconies',
      'Balconies',
      'balcony',
      'Balcony',
      'noOfBalconies',
      'NoOfBalconies',
    ),
  );

  const builtUpArea = formatValue(
    getValue(
      'builtUpArea',
      'BuiltUpArea',
      'builtupArea',
      'BuiltupArea',
      'built_up_area',
      'area',
      'Area',
    ),
  );

  const carpetArea = formatValue(
    getValue(
      'carpetArea',
      'CarpetArea',
      'carpetarea',
      'Carpetarea',
      'carpet_area',
    ),
  );

  const superArea = formatValue(
    getValue(
      'superArea',
      'SuperArea',
      'superarea',
      'Superarea',
      'super_built_up_area',
    ),
  );

  const plotArea = formatValue(
    getValue(
      'plotArea',
      'PlotArea',
      'plotarea',
      'Plotarea',
    ),
  );

  const furnishing = formatValue(
    getValue(
      'furnishing',
      'Furnishing',
      'propertyFurnished',
      'Property_Furnished',
      'PropertyFurnished',
      'furnished',
      'Furnished',
    ),
  );

  const floor = formatValue(
    getValue(
      'floor',
      'Floor',
      'floorNo',
      'FloorNo',
      'floorNumber',
      'FloorNumber',
    ),
  );

  const totalFloors = formatValue(
    getValue(
      'totalFloors',
      'TotalFloors',
      'totalFloor',
      'TotalFloor',
      'noOfFloors',
      'NoOfFloors',
    ),
  );

  const facing = formatValue(
    getValue(
      'facing',
      'Facing',
      'propertyFacing',
      'PropertyFacing',
    ),
  );

  const propertyAge = formatValue(
    getValue(
      'propertyAge',
      'PropertyAge',
      'ageOfProperty',
      'AgeOfProperty',
      'age',
      'Age',
    ),
  );

//   const constructionStatus = formatValue(
//     getValue(
//       'constructionStatus',
//       'ConstructionStatus',
//       'status',
//       'Status',
//     ),
//   );

  const possession = formatValue(
    getValue(
      'possession',
      'Possession',
      'possessionStatus',
      'PossessionStatus',
    ),
  );

  const availability = formatDate(
    getValue(
      'availableFrom',
      'AvailableFrom',
      'availability',
      'Availability',
      'availableDate',
      'AvailableDate',
    ),
  );

  const tenantPreference = formatValue(
    getValue(
      'preferredTenant',
      'PreferredTenant',
      'tenantPreference',
      'TenantPreference',
      'preferredTenants',
      'PreferredTenants',
    ),
  );

  const parking = formatValue(
    getValue(
      'parking',
      'Parking',
      'parkingType',
      'ParkingType',
      'carParking',
      'CarParking',
    ),
  );

  const waterSupply = formatValue(
    getValue(
      'waterSupply',
      'WaterSupply',
      'water',
      'Water',
    ),
  );

  const powerBackup = formatValue(
    getValue(
      'powerBackup',
      'PowerBackup',
      'powerbackup',
      'Powerbackup',
    ),
  );

  const security = formatValue(
    getValue(
      'security',
      'Security',
      'securityAvailable',
      'SecurityAvailable',
      'securityType',
      'SecurityType',
    ),
  );

  const ownership = formatValue(
    getValue(
      'ownership',
      'Ownership',
      'ownershipType',
      'OwnershipType',
    ),
  );

  const transactionType = formatValue(
    getValue(
      'transactionType',
      'TransactionType',
      'transaction',
      'Transaction',
    ),
  );

  const age = formatValue(
    getValue(
      'age',
      'Age',
      'propertyAge',
      'PropertyAge',
    ),
  );

  const location = formatValue(
    getValue(
      'location',
      'Location',
      'locality',
      'Locality',
      'address',
      'Address',
    ),
  );

  // =======================================================
  // FORMAT AREA
  // =======================================================

  const areaValue = value => {
    if (!value) {
      return null;
    }

    const stringValue = String(value).trim();

    if (
      stringValue.toLowerCase().includes('sq') ||
      stringValue.toLowerCase().includes('acre') ||
      stringValue.toLowerCase().includes('bigha') ||
      stringValue.toLowerCase().includes('yard')
    ) {
      return stringValue;
    }

    return `${stringValue} sq.ft.`;
  };

  // =======================================================
  // DETAIL ITEM
  // =======================================================

  const DetailItem = ({icon, label, value}) => {
    if (!value) {
      return null;
    }

    return (
      <View style={styles.detailItem}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>

        <View style={styles.detailContent}>
          <Text style={styles.detailLabel} numberOfLines={1}>
            {label}
          </Text>

          <Text style={styles.detailValue} numberOfLines={2}>
            {value}
          </Text>
        </View>
      </View>
    );
  };

  // =======================================================
  // DETAILS ARRAY
  // =======================================================

  const details = [
    {
      icon: '🏠',
      label: 'Property Type',
      value: propertyType,
    },
    {
      icon: '🏷️',
      label: 'Category',
      value: category,
    },
    {
      icon: '🛏️',
      label: 'BHK',
      value: bhk,
    },
    {
      icon: '🛁',
      label: 'Bathrooms',
      value: bathrooms,
    },
    {
      icon: '🚿',
      label: 'Bedrooms',
      value: bedrooms,
    },
    {
      icon: '🌤️',
      label: 'Balconies',
      value: balconies,
    },
    {
      icon: '📐',
      label: 'Built-up Area',
      value: areaValue(builtUpArea),
    },
    {
      icon: '📏',
      label: 'Carpet Area',
      value: areaValue(carpetArea),
    },
    {
      icon: '📊',
      label: 'Super Area',
      value: areaValue(superArea),
    },
    {
      icon: '🌳',
      label: 'Plot Area',
      value: areaValue(plotArea),
    },
    {
      icon: '🛋️',
      label: 'Furnishing',
      value: furnishing,
    },
    {
      icon: '🏢',
      label: 'Floor',
      value: floor,
    },
    {
      icon: '🏬',
      label: 'Total Floors',
      value: totalFloors,
    },
    {
      icon: '🧭',
      label: 'Facing',
      value: facing,
    },
    {
      icon: '📅',
      label: 'Property Age',
      value: propertyAge || age,
    },
    // {
    //   icon: '🏗️',
    //   label: 'Construction',
    //   value: constructionStatus,
    // },
    {
      icon: '🔑',
      label: 'Possession',
      value: possession,
    },
    {
      icon: '📆',
      label: 'Available From',
      value: availability,
    },
    {
      icon: '👨‍👩‍👧',
      label: 'Preferred Tenant',
      value: tenantPreference,
    },
    {
      icon: '🚗',
      label: 'Parking',
      value: parking,
    },
    {
      icon: '💧',
      label: 'Water Supply',
      value: waterSupply,
    },
    {
      icon: '⚡',
      label: 'Power Backup',
      value: powerBackup,
    },
    {
      icon: '🛡️',
      label: 'Security',
      value: security,
    },
    {
      icon: '📜',
      label: 'Ownership',
      value: ownership,
    },
    {
      icon: '🔄',
      label: 'Transaction',
      value: transactionType,
    },
  ].filter(item => item.value);

  // =======================================================
  // IF NO DETAILS
  // =======================================================

  if (details.length === 0 && !location) {
    return null;
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <View style={styles.wrapper}>

      {/* ===================================================
          CARD
      =================================================== */}

      <View style={styles.card}>

        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>

          <View style={styles.headerLeft}>

            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>▦</Text>
            </View>

            <View>
              <Text style={styles.title}>
                Property Details
              </Text>

              <Text style={styles.subtitle}>
                Key details about this property
              </Text>
            </View>

          </View>

        </View>

        {/* =================================================
            ORANGE LINE
        ================================================= */}

        <View style={styles.orangeLine} />

        {/* =================================================
            DETAILS GRID
        ================================================= */}

        {details.length > 0 && (
          <View style={styles.detailsGrid}>

            {details.map((item, index) => (
              <DetailItem
                key={`${item.label}-${index}`}
                icon={item.icon}
                label={item.label}
                value={item.value}
              />
            ))}

          </View>
        )}

        {/* =================================================
            LOCATION
        ================================================= */}

        {location && (
          <View style={styles.locationSection}>

            <View style={styles.locationIconBox}>
              <Text style={styles.locationIcon}>
                📍
              </Text>
            </View>

            <View style={styles.locationContent}>

              <Text style={styles.locationLabel}>
                Location
              </Text>

              <Text style={styles.locationValue}>
                {location}
              </Text>

            </View>

          </View>
        )}

      </View>

    </View>
  );
};

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  // =======================================================
  // WRAPPER
  // =======================================================

  wrapper: {
    width: '100%',
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 4,
  },

  // =======================================================
  // CARD
  // =======================================================

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',

    borderWidth: 1,
    borderColor: '#E7EBF0',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,

    elevation: 2,
  },

  // =======================================================
  // HEADER
  // =======================================================

  header: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 13,

    backgroundColor: '#FFFFFF',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,

    backgroundColor: '#EEF4FA',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 11,
  },

  headerIconText: {
    fontSize: 23,
    fontWeight: '700',
    color: '#012353',
  },

  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#012353',
    letterSpacing: 0.1,
  },

  subtitle: {
    marginTop: 0,
    fontSize: 9.5,
    color: '#7A8491',
    fontWeight: '400',
  },

  // =======================================================
  // ORANGE LINE
  // =======================================================

  orangeLine: {
    width: 42,
    height: 3,

    backgroundColor: '#F7941D',

    marginLeft: 15,
    marginBottom: 2,

    borderRadius: 3,
  },

  // =======================================================
  // GRID
  // =======================================================

  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 5,
  },

  // =======================================================
  // DETAIL ITEM
  // =======================================================

  detailItem: {
    width: '50%',

    minHeight: 66,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 7,
    paddingVertical: 8,
  },

  // =======================================================
  // ICON
  // =======================================================

  iconBox: {
    width: 34,
    height: 34,

    borderRadius: 8,

    backgroundColor: '#F7F9FC',

    borderWidth: 1,
    borderColor: '#E8EDF3',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 9,
  },

  iconText: {
    fontSize: 17,
  },

  // =======================================================
  // DETAIL CONTENT
  // =======================================================

  detailContent: {
    flex: 1,
    minWidth: 0,
  },

  detailLabel: {
    fontSize: 10.5,
    color: '#8A929D',

    fontWeight: '500',

    marginBottom: 3,
  },

  detailValue: {
    fontSize: 12,

    color: '#172B43',

    fontWeight: '600',

    lineHeight: 18,
  },

  // =======================================================
  // LOCATION
  // =======================================================

  locationSection: {
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,

    paddingTop: 13,

    borderTopWidth: 1,
    borderTopColor: '#EDF0F4',

    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  locationIconBox: {
    width: 35,
    height: 35,

    borderRadius: 8,

    backgroundColor: '#FFF6EA',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 10,
  },

  locationIcon: {
    fontSize: 17,
  },

  locationContent: {
    flex: 1,
  },

  locationLabel: {
    fontSize: 10.5,
    color: '#8A929D',

    fontWeight: '500',

    marginBottom: 3,
  },

  locationValue: {
    fontSize: 13,

    lineHeight: 19,

    color: '#172B43',

    fontWeight: '600',
  },
});

export default RentalDetailsCard;
 
