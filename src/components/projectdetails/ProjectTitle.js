import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatPrice} from '../../helpers/priceHelper';

const ProjectTitle = ({project}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.projectName}>
        {project.projectName}
      </Text>

      <View style={styles.row}>
        <Icon
          name="shield-check"
          size={18}
          color="#2E7D32"
        />

        <Text style={styles.rera}>
          RERA No : {project.reraNumber || 'Not Available'}
        </Text>
      </View>

    </View>
  );
};

export default ProjectTitle;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 18,
    elevation: 3,
  },

  projectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#102A47',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  rera: {
    marginLeft: 8,
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
  },

  price: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '700',
    color: '#0B8A3E',
  },
});