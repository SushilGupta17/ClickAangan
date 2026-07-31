import React from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import styles from '../../../styles/AddPropertyStyle';

const MultiImagePicker = ({
  title,
  images,
  propertyKey,
  setProperty,
}) => {

  const updateImages = data => {
    setProperty(prev => ({
      ...prev,
      [propertyKey]: data,
    }));
  };

  const pickGallery = () => {

    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0,
        quality: 0.8,
      },
      response => {

        if (response.didCancel) return;

        if (response.assets) {

          updateImages([
            ...images,
            ...response.assets,
          ]);

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

        if (response.assets) {

          updateImages([
            ...images,
            ...response.assets,
          ]);

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

  const removeImage = index => {

    const data = [...images];

    data.splice(index, 1);

    updateImages(data);

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
          + Add {title}
        </Text>

      </TouchableOpacity>

      <FlatList
        data={images}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item,index)=>index.toString()}
        contentContainerStyle={{
          marginTop:15,
        }}
        renderItem={({item,index})=>(

          <View style={styles.imageBox}>

            <Image
              source={{uri:item.uri}}
              style={styles.previewImage}
            />

            <TouchableOpacity
              style={styles.removeImage}
              onPress={() => removeImage(index)}>

              <Text style={styles.removeImageText}>
                ✕
              </Text>

            </TouchableOpacity>

          </View>

        )}
      />

    </View>

  );

};

export default React.memo(MultiImagePicker);