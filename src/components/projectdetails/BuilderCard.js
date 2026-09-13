import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RentalContactDetails = ({property}) => {
  if (!property) return null;

  // =========================================================
  // GET VALUE - SUPPORT LOWERCASE + PASCALCASE
  // =========================================================

  const getValue = (...keys) => {
    for (const key of keys) {
      if (
        property?.[key] !== undefined &&
        property?.[key] !== null &&
        String(property[key]).trim() !== ''
      ) {
        return property[key];
      }
    }

    return null;
  };

  // =========================================================
  // CONTACT DATA
  // =========================================================

  const contactPerson = getValue(
    'contactPerson',
    'ContactPerson',
    'ownerName',
    'OwnerName',
    'owner',
    'Owner',
  );

  const mobile = getValue(
    'mobile',
    'Mobile',
    'contactMobile',
    'ContactMobile',
    'ownerMobile',
    'OwnerMobile',
    'phone',
    'Phone',
  );

  const email = getValue(
    'email',
    'Email',
    'contactEmail',
    'ContactEmail',
    'ownerEmail',
    'OwnerEmail',
  );

  const location = getValue(
    'location',
    'Location',
  );

  const city = getValue(
    'city',
    'City',
  );

  const state = getValue(
    'state',
    'State',
  );

  const propertyType = getValue(
    'propertyType',
    'PropertyType',
    'propertytype',
  );

  // =========================================================
  // LOCATION TEXT
  // =========================================================

  let locationText = '';

  if (location) {
    locationText = String(location);
  } else if (city || state) {
    locationText = [city, state]
      .filter(Boolean)
      .join(', ');
  }

  // =========================================================
  // CALL
  // =========================================================

  const handleCall = () => {
    if (!mobile) return;

    const phoneNumber = String(mobile).replace(/[^\d+]/g, '');

    Linking.openURL(`tel:${phoneNumber}`).catch(error => {
      console.log('Call Error:', error);
    });
  };

  // =========================================================
  // WHATSAPP
  // =========================================================

  const handleWhatsApp = () => {
    if (!mobile) return;

    const phoneNumber = String(mobile).replace(/[^\d]/g, '');

    Linking.openURL(`https://wa.me/${phoneNumber}`).catch(error => {
      console.log('WhatsApp Error:', error);
    });
  };

  // =========================================================
  // EMAIL
  // =========================================================

  const handleEmail = () => {
    if (!email) return;

    Linking.openURL(`mailto:${email}`).catch(error => {
      console.log('Email Error:', error);
    });
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <View style={styles.card}>

      {/* =====================================================
          HEADING
      ===================================================== */}

      <Text style={styles.heading}>
        Contact Details
      </Text>

      {/* =====================================================
          CONTACT PERSON
      ===================================================== */}

      <View style={styles.infoRow}>
        <Icon
          name="account"
          size={22}
          color="#1565C0"
        />

        <Text style={styles.label}>
          Contact Person
        </Text>

        <Text style={styles.value}>
          {contactPerson || '-'}
        </Text>
      </View>

      {/* =====================================================
          MOBILE
      ===================================================== */}

      <View style={styles.infoRow}>
        <Icon
          name="phone"
          size={22}
          color="#2E7D32"
        />

        <Text style={styles.label}>
          Mobile
        </Text>

        <Text style={styles.value}>
          {mobile || '-'}
        </Text>
      </View>

      {/* =====================================================
          EMAIL
      ===================================================== */}

      <View style={styles.infoRow}>
        <Icon
          name="email"
          size={22}
          color="#EF6C00"
        />

        <Text style={styles.label}>
          Email
        </Text>

        <Text
          style={styles.value}
          numberOfLines={2}>
          {email || '-'}
        </Text>
      </View>

      {/* =====================================================
          LOCATION
      ===================================================== */}

      <View style={styles.infoRow}>
        <Icon
          name="map-marker"
          size={22}
          color="#D32F2F"
        />

        <Text style={styles.label}>
          Location
        </Text>

        <Text style={styles.value}>
          {locationText || '-'}
        </Text>
      </View>

      {/* =====================================================
          PROPERTY TYPE
      ===================================================== */}

      <View style={styles.infoRow}>
        <Icon
          name="home-city-outline"
          size={22}
          color="#6A1B9A"
        />

        <Text style={styles.label}>
          Property Type
        </Text>

        <Text style={styles.value}>
          {propertyType || '-'}
        </Text>
      </View>

      {/* =====================================================
          DIVIDER
      ===================================================== */}

      {(mobile || email) && (
        <View style={styles.divider} />
      )}

      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      {(mobile || email) && (
        <View style={styles.buttonRow}>

          {/* CALL */}

          {mobile && (
            <TouchableOpacity
              style={styles.callButton}
              activeOpacity={0.8}
              onPress={handleCall}>

              <Icon
                name="phone"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.callText}>
                Call
              </Text>
            </TouchableOpacity>
          )}

          {/* WHATSAPP */}

          {mobile && (
            <TouchableOpacity
              style={styles.whatsappButton}
              activeOpacity={0.8}
              onPress={handleWhatsApp}>

              <Icon
                name="whatsapp"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.whatsappText}>
                WhatsApp
              </Text>
            </TouchableOpacity>
          )}

          {/* EMAIL */}

          {email && (
            <TouchableOpacity
              style={styles.emailButton}
              activeOpacity={0.8}
              onPress={handleEmail}>

              <Icon
                name="email"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.emailText}>
                Email
              </Text>
            </TouchableOpacity>
          )}

        </View>
      )}

    </View>
  );
};

export default RentalContactDetails;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,

    elevation: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    borderWidth: 1,
    borderColor: '#EEF0F3',
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
    minHeight: 24,
  },

  label: {
    width: 115,
    marginLeft: 10,
    fontSize: 13,
    color: '#666',
  },

  value: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 5,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  callButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#012353',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  callText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },

  whatsappButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  whatsappText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },

  emailButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#EF6C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emailText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },
});