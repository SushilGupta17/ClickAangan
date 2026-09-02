import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const statusIcons = {
  'Ready to Move': {
    name: 'home-city',
    color: '#2E7D32',
  },
  'Under Construction': {
    name: 'hammer-wrench',
    color: '#F57C00',
  },
  'New Launch': {
    name: 'rocket-launch',
    color: '#1976D2',
  },
  'Upcoming': {
    name: 'clock-outline',
    color: '#7B1FA2',
  },
};
const ProjectStatusCard = ({project}) => {
  const status = project.projectStatus || 'Upcoming';
  const icon = statusIcons[status] || statusIcons['Upcoming'];

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Project Status</Text>

      <View style={styles.content}>

        <View style={styles.iconContainer}>
          <Icon
            name={icon.name}
            size={48}
            color={icon.color}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.status}>{status}</Text>

          <Text style={styles.desc}>
            {status === 'Ready to Move'
              ? 'Ready for immediate possession.'
              : status === 'Under Construction'
              ? 'Construction is currently in progress.'
              : status === 'New Launch'
              ? 'Recently launched project.'
              : 'Project launching soon.'}
          </Text>
        </View>

      </View>
    </View>
  );
};

export default ProjectStatusCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 15,
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    elevation: 3,
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102A47',
    marginBottom: 15,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 50,
    height: 50,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  status: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B6EF6',
  },

  desc: {
    marginTop: 8,
    color: '#666',
    lineHeight: 22,
    fontSize: 14,
  },

  iconContainer: {
  width:60,
  height: 60,
  borderRadius: 35,
  backgroundColor: '#F5F7FA',
  justifyContent: 'center',
  alignItems: 'center',
},

});