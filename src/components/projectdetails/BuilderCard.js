import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BuilderCard = ({project}) => {

  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Builder Details
      </Text>


        <View style={{flex:1}}>

          <Text style={styles.subheading}>
            {project.builderName}
          </Text>


 <View style={styles.infoRow}>
        <Icon name="account" size={22} color="#1565C0" />
        <Text style={styles.label}>Contact Person</Text>
        <Text style={styles.value}>
          {project.contactPerson || '-'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="phone" size={22} color="#2E7D32" />
        <Text style={styles.label}>Mobile</Text>
        <Text style={styles.value}>
          {project.mobile || '-'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="email" size={22} color="#EF6C00" />
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>
          {project.email || '-'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="map-marker" size={22} color="#D32F2F" />
        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>
          {project.city}, {project.state}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="office-building" size={22} color="#6A1B9A" />
        <Text style={styles.label}>Project Status</Text>
        <Text style={styles.value}>
          {project.projectStatus}
        </Text>
      </View>

      </View>

    </View>

  );

};

export default BuilderCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
    elevation: 4,
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 15,
  },

  subheading: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    marginBottom: 15,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
  },

  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },

  builderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  projectName: {
    marginTop: 4,
    color: '#666',
    fontSize: 14,
  },

  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  verifiedText: {
    marginLeft: 5,
    color: '#2E7D32',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  label: {
    width: 120,
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },

  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
});