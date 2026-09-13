import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Video from 'react-native-video';

// =========================================================
// RENTAL VIDEO SECTION
// =========================================================

const RentalVideoSection = ({property}) => {

  // =======================================================
  // VIDEO PATH
  // =======================================================

  const videoPath =
    property?.videoUrl ||
    property?.VideoUrl ||
    '';

  // =======================================================
  // NO VIDEO
  // =======================================================

  if (!videoPath) {
    return null;
  }

  // =======================================================
  // VIDEO URL
  // =======================================================

   const videoUrl = `http://192.168.1.3:7045/${videoPath.replace(/^\/+/, '')}`
   const videoUrl1 = `https://savariyaproperty.in/${videoPath.replace(/^\/+/, '')}`


  // =======================================================
  // RETURN
  // =======================================================

  return (
    <View style={styles.card}>

      {/* =================================================
          HEADING
      ================================================= */}

      <Text style={styles.heading}>
        Video Tour
      </Text>

      {/* =================================================
          VIDEO
      ================================================= */}

      <Video
        source={{
          uri: videoUrl,
        }}
        style={styles.video}
        controls={true}
        resizeMode="contain"
        paused={true}
        onError={error => {
          console.log('RENTAL VIDEO ERROR:', error);
        }}
      />

    </View>
  );
};

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
    marginBottom: 20,

    padding: 18,

    borderRadius: 15,

    borderWidth: 1,
    borderColor: '#E8ECF1',

    elevation: 3,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  // =======================================================
  // HEADING
  // =======================================================

  heading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#012353',

    marginBottom: 12,
  },

  video: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    borderRadius: 12,
  },

});

export default RentalVideoSection;

