import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';



import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactOwnerScreen = () => {
  const phoneNumber = '9314630866'; 

  const callOwner = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
        <SafeAreaView style={styles.safeContainer} >
  <Header />
    <View style={styles.container}>
  <Text style={styles.screenTitle}>Contact Property Owner </Text>

  <View style={styles.card}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>SG</Text>
    </View>

    <Text style={styles.ownerName}>Sushil Gupta</Text>
    <Text style={styles.ownerType}>Property Owner</Text>

    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>Mobile Number</Text>
      <Text style={styles.infoValue}>{phoneNumber}</Text>
    </View>

    <TouchableOpacity style={styles.callButton} onPress={callOwner}>
      <Text style={styles.callButtonText}>📞 Call Owner</Text>
    </TouchableOpacity>
  </View>
</View>
      <Footer />
</SafeAreaView>

  );
};

export default ContactOwnerScreen;
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  container: {
    flex: 1,
    padding: 20,
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  ownerName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  ownerType: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
    marginBottom: 25,
  },

  infoRow: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
  },

  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },

  callButton: {
    width: '100%',
    backgroundColor: '#28A745',
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 3,
  },

  callButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
  },
});
