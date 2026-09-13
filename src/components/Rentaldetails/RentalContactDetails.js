import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

// =========================================================
// RENTAL CONTACT DETAILS
// =========================================================

const RentalContactDetails = ({property}) => {
  if (!property) return null;

  // =======================================================
  // GET VALUE HELPER
  // =======================================================

  const getValue = (...keys) => {
    for (const key of keys) {
      const value = property?.[key];

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ''
      ) {
        return value;
      }
    }

    return null;
  };

  // =======================================================
  // CONTACT DATA
  // =======================================================

  const ownerName = getValue(
    'ownerName',
    'OwnerName',
    'owner',
    'Owner',
    'ContactPerson',
    'contactPerson',
    'ContactPerson',
    'contactName',
    'ContactName',
  );

  const mobile = getValue(
    'mobile',
    'Mobile',
    'ownerMobile',
    'OwnerMobile',
    'contactMobile',
    'ContactMobile',
    'contactmobile',

    'phone',
    'Phone',
  );

  const email = getValue(
    'email',
    'Email',
    'ownerEmail',
    'OwnerEmail',
    'contactEmail',
    'ContactEmail',
  );

  const designation = getValue(
    'designation',
    'Designation',
    'ownerDesignation',
    'OwnerDesignation',
  );

  // =======================================================
  // IF NOTHING AVAILABLE
  // =======================================================

  if (!ownerName && !mobile && !email && !designation) {
    return null;
  }

  // =======================================================
  // NORMALIZE MOBILE
  // =======================================================

  const cleanMobile = mobile
    ? String(mobile).replace(/[^\d+]/g, '')
    : null;

  // =======================================================
  // CALL
  // =======================================================

  const handleCall = async () => {
    if (!cleanMobile) return;

    try {
      const url = `tel:${cleanMobile}`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Unable to Call', 'Calling is not supported on this device.');
      }
    } catch (error) {
      console.log('Call Error:', error);
      Alert.alert('Error', 'Unable to make the call.');
    }
  };

  // =======================================================
  // WHATSAPP
  // =======================================================

  const handleWhatsApp = async () => {
    if (!cleanMobile) return;

    try {
      const whatsappNumber = cleanMobile.replace('+', '');

      const url = `whatsapp://send?phone=${whatsappNumber}`;

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'WhatsApp Not Available',
          'WhatsApp is not installed on this device.',
        );
      }
    } catch (error) {
      console.log('WhatsApp Error:', error);
      Alert.alert('Error', 'Unable to open WhatsApp.');
    }
  };

  // =======================================================
  // EMAIL
  // =======================================================

  const handleEmail = async () => {
    if (!email) return;

    try {
      const url = `mailto:${email}`;

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Email Not Available',
          'No email application is available on this device.',
        );
      }
    } catch (error) {
      console.log('Email Error:', error);
      Alert.alert('Error', 'Unable to open email application.');
    }
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <View style={styles.card}>

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.headerRow}>

        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>👤</Text>
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.heading}>
            Contact Details
          </Text>

          <Text style={styles.subHeading}>
            Property owner / contact person
          </Text>
        </View>

      </View>

      {/* =================================================
          ORANGE LINE
      ================================================= */}

      <View style={styles.headingLine} />

      {/* =================================================
          OWNER / CONTACT PERSON
      ================================================= */}

      {ownerName && (
        <View style={styles.infoRow}>

          <View style={styles.iconBox}>
            <Text style={styles.iconText}>👤</Text>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>
              Contact Person
            </Text>

            <Text style={styles.value}>
              {String(ownerName)}
            </Text>

            {designation && (
              <Text style={styles.secondaryValue}>
                {String(designation)}
              </Text>
            )}
          </View>

        </View>
      )}

      {/* =================================================
          MOBILE
      ================================================= */}

      {mobile && (
        <View style={styles.infoRow}>

          <View style={styles.iconBox}>
            <Text style={styles.iconText}>📞</Text>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>
              Mobile Number
            </Text>

            <Text style={styles.value}>
              {String(mobile)}
            </Text>
          </View>

        </View>
      )}

      {/* =================================================
          EMAIL
      ================================================= */}

      {email && (
        <View style={styles.infoRow}>

          <View style={styles.iconBox}>
            <Text style={styles.iconText}>✉️</Text>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>
              Email Address
            </Text>

            <Text style={styles.value}>
              {String(email)}
            </Text>
          </View>

        </View>
      )}

      {/* =================================================
          ACTION BUTTONS
      ================================================= */}

      {(mobile || email) && (
        <View style={styles.actionRow}>

          {/* CALL */}

          {mobile && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.actionButton,
                styles.callButton,
                !email && styles.fullButton,
              ]}
              onPress={handleCall}>

              <Text style={styles.actionIcon}>
                📞
              </Text>

              <Text style={styles.callButtonText}>
                Call
              </Text>

            </TouchableOpacity>
          )}

          {/* WHATSAPP */}

          {mobile && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.actionButton,
                styles.whatsappButton,
                !email && styles.fullButton,
              ]}
              onPress={handleWhatsApp}>

              <Text style={styles.actionIcon}>
                💬
              </Text>

              <Text style={styles.whatsappButtonText}>
                WhatsApp
              </Text>

            </TouchableOpacity>
          )}

          {/* EMAIL */}

          {email && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.actionButton,
                styles.emailButton,
                !mobile && styles.fullButton,
              ]}
              onPress={handleEmail}>

              <Text style={styles.actionIcon}>
                ✉️
              </Text>

              <Text style={styles.emailButtonText}>
                Email
              </Text>

            </TouchableOpacity>
          )}

        </View>
      )}

      {/* =================================================
          FOOTER NOTE
      ================================================= */}

      <View style={styles.safeNote}>

        <Text style={styles.safeIcon}>
          🔒
        </Text>

        <Text style={styles.safeText}>
          Contact details are provided for property enquiries.
        </Text>

      </View>

    </View>
  );
};

export default RentalContactDetails;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  // =======================================================
  // CARD
  // =======================================================

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 15,
    padding: 18,

    borderWidth: 1,
    borderColor: '#E7EBF0',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 3,
  },

  // =======================================================
  // HEADER
  // =======================================================

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF4FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  headerIconText: {
    fontSize: 22,
  },

  headerTextContainer: {
    flex: 1,
  },

  heading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#012353',
  },

  subHeading: {
    marginTop: 3,
    fontSize: 11,
    color: '#7A8491',
  },

  // =======================================================
  // HEADING LINE
  // =======================================================

  headingLine: {
    width: 42,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#F7941D',
    marginTop: 10,
    marginBottom: 15,
  },

  // =======================================================
  // INFORMATION ROW
  // =======================================================

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F6F8FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 18,
  },

  infoContent: {
    flex: 1,
  },

  label: {
    fontSize: 10,
    color: '#8A939E',
    marginBottom: 3,
    fontWeight: '500',
  },

  value: {
    fontSize: 13,
    color: '#202B38',
    fontWeight: '600',
  },

  secondaryValue: {
    fontSize: 11,
    color: '#7A8491',
    marginTop: 2,
  },

  // =======================================================
  // ACTION BUTTONS
  // =======================================================

  actionRow: {
    flexDirection: 'row',
    marginTop: 17,
    gap: 8,
  },

  actionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },

  fullButton: {
    flex: 1,
  },

  actionIcon: {
    fontSize: 15,
    marginRight: 5,
  },

  // =======================================================
  // CALL BUTTON
  // =======================================================

  callButton: {
    backgroundColor: '#012353',
  },

  callButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // =======================================================
  // WHATSAPP BUTTON
  // =======================================================

  whatsappButton: {
    backgroundColor: '#F2F8F4',
    borderWidth: 1,
    borderColor: '#D8EBDD',
  },

  whatsappButtonText: {
    color: '#218838',
    fontSize: 12,
    fontWeight: '700',
  },

  // =======================================================
  // EMAIL BUTTON
  // =======================================================

  emailButton: {
    backgroundColor: '#FFF5E9',
    borderWidth: 1,
    borderColor: '#F6D7AE',
  },

  emailButtonText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },

  // =======================================================
  // SAFE NOTE
  // =======================================================

  safeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },

  safeIcon: {
    fontSize: 12,
    marginRight: 6,
  },

  safeText: {
    flex: 1,
    fontSize: 10,
    color: '#8A939E',
    lineHeight: 15,
  },
});