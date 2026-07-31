import React from 'react';
import {
  TouchableOpacity,
  Text,
} from 'react-native';

import styles from '../styles/AddPropertyStyle';

const Chip = ({
  label,
  selected = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.selectedChip,
        style,
      ]}>

      <Text
        style={[
          styles.chipText,
          selected && styles.selectedChipText,
        ]}>
        {label}
      </Text>

    </TouchableOpacity>
  );
};

export default React.memo(Chip);
