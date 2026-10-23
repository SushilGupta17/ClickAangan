import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

import RentalListScreen from '../../screens/RentalListScreen';

const RentPopup = ({
  visible,
  onClose,
  navigation,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>

      <View style={styles.overlay}>

        <View style={styles.container}>

          {/* Handle */}
          <View style={styles.handle} />

          {/* Close */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}>

            <Text style={styles.closeText}>✕</Text>

          </TouchableOpacity>

          <RentalListScreen
            navigation={navigation}
          />

        </View>

      </View>

    </Modal>
  );
};

export default RentPopup;

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.45)',
    justifyContent: 'flex-end',
  },

  container: {
    height: '92%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },

  handle: {
    width: 60,
    height: 6,
    borderRadius: 10,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },

  closeBtn: {
    position: 'absolute',
    right: 15,
    top: 10,
    zIndex: 999,
  },

  closeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

});