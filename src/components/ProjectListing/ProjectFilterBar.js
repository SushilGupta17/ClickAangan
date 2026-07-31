import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

const filters = [
  {
    id: 1,
    title: 'All',
    icon: 'th-large',
  },
  {
    id: 2,
    title: 'New Launch',
    icon: 'rocket',
  },
  {
    id: 3,
    title: 'Under Construction',
    icon: 'hard-hat',
  },
  {
    id: 4,
    title: 'Ready to Move',
    icon: 'check-circle',
  },
  {
    id: 5,
    title: 'Luxury',
    icon: 'gem',
  },
];

const ProjectFilterBar = ({
  selectedStatus,
  onStatusChange,
}) => {

  return (

    <View style={styles.container}>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}>

        {filters.map(item => {

          const selected =
            selectedStatus === item.title;

          return (

            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() =>
                onStatusChange(item.title)
              }
              style={[
                styles.chip,

                selected && styles.selectedChip,
              ]}>

              <Icon
                name={item.icon}
                size={13}
                color={
                  selected
                    ? '#FFF'
                    : '#1959A2'
                }
              />

              <Text
                style={[
                  styles.text,

                  selected &&
                    styles.selectedText,
                ]}>

                {item.title}

              </Text>

            </TouchableOpacity>

          );

        })}

      </ScrollView>

    </View>

  );

};

export default ProjectFilterBar;

const styles = StyleSheet.create({

  container: {

    paddingVertical: 12,

    backgroundColor: '#F5F7FA',

  },

  chip: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FFF',

    marginLeft: 12,

    paddingHorizontal: 18,

    paddingVertical: 11,

    borderRadius: 24,

    borderWidth: 1,

    borderColor: '#E2E8F0',

    elevation: 2,

  },

  selectedChip: {

    backgroundColor: '#1959A2',

    borderColor: '#1959A2',

  },

  text: {

    marginLeft: 8,

    fontWeight: '600',

    color: '#1959A2',

    fontSize: 13,

  },

  selectedText: {

    color: '#FFF',

  },

});