import React from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';

import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import styles from '../../../styles/AddPropertyStyle';

const SingleImagePicker = ({
  title,
  image,
  propertyKey,
  setProperty,
}) => {

  const pickGallery = () => {

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      response => {

        if (response.didCancel) return;

        if (response.assets?.length > 0) {

          setProperty(prev => ({
            ...prev,
            [propertyKey]: response.assets[0],
          }));

        }

      },
    );

  };

  const pickCamera = () => {

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {

        if (response.didCancel) return;

        if (response.assets?.length > 0) {

          setProperty(prev => ({
            ...prev,
            [propertyKey]: response.assets[0],
          }));

        }

      },
    );

  };

  const chooseImage = () => {

    Alert.alert(
      title,
      'Choose Image Source',
      [
        {
          text: 'Camera',
          onPress: pickCamera,
        },
        {
          text: 'Gallery',
          onPress: pickGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );

  };

  return (

    <View style={styles.card}>

      <Text style={styles.title}>
        {title}
      </Text>

      <TouchableOpacity
        style={styles.imagePickerButton}
        onPress={chooseImage}>

        <Text style={styles.imagePickerText}>
          Upload {title}
        </Text>

      </TouchableOpacity>

      {image && (

        <View
          style={{
            marginTop:20,
            alignItems:'center',
          }}>

          <Image
            source={{uri:image.uri}}
            style={{
              width:180,
              height:120,
              borderRadius:10,
            }}
          />

          <TouchableOpacity
            onPress={() =>
              setProperty(prev => ({
                ...prev,
                [propertyKey]: null,
              }))
            }>

            <Text
              style={{
                color:'red',
                marginTop:10,
                fontWeight:'600',
              }}>

              Remove

            </Text>

          </TouchableOpacity>

        </View>

      )}

    </View>

  );

};

export default React.memo(SingleImagePicker);