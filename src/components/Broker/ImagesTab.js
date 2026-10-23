import React, {useState } from 'react';

import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import Animated,{
FadeInDown,
} from 'react-native-reanimated';

import {
launchImageLibrary,
launchCamera,
} from 'react-native-image-picker';

import styles from '../../styles/AddPropertyStyle';

const ImagesTab=({
property,
setProperty,
updateProperty,
nextTab,
previousTab,
})=>{

const pickGallery=()=>{

launchImageLibrary({

mediaType:'photo',

selectionLimit:0,

quality:0.8,

},response=>{

if(response.didCancel){

return;

}

if(response.assets){

setProperty(prev=>({

...prev,

images:[

...prev.images,

...response.assets,

],

}));

}

});

};

const pickCamera=()=>{

launchCamera({

mediaType:'photo',

quality:0.8,

cameraType:'back',

},response=>{

if(response.didCancel){

return;

}

if(response.assets){

setProperty(prev=>({

...prev,

images:[

...prev.images,

...response.assets,

],

}));

}

});

};

const pickImages=()=>{

Alert.alert(

'Select Images',

'Choose Image Source',

[

{

text:'Camera',

onPress:pickCamera,

},

{

text:'Gallery',

onPress:pickGallery,

},

{

text:'Cancel',

style:'cancel',

},

],

);

};

const removeImage=index=>{

let imgs=[...property.images];

imgs.splice(index,1);

setProperty(prev => ({
  ...prev,
  images: imgs,
}));

};

const setCover=index=>{

setProperty(prev => ({
  ...prev,
  coverImage: index,
}));

};

  const validate = () => {

    if (property.images.length === 0) {
      Alert.alert(
        'Validation',
        'Please select at least one property image.',
      );
      return;
    }

    nextTab();

  };

  const pickBrochure = async () => {

  try {

    const result = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.pdf],
    });

    setProperty(prev => ({
      ...prev,
      brochure: result,
    }));

  } catch (err) {

    if (DocumentPicker.isCancel(err)) {
      return;
    }

    Alert.alert('Error', 'Unable to select brochure.');

  }

};

  return (

    <Animated.ScrollView
      entering={FadeInDown.duration(400)}
      contentContainerStyle={{
        padding:15,
        paddingBottom:150,
      }}>

      {/* Images */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Property Images
        </Text>

        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={pickImages}>

          <Text style={styles.imagePickerText}>
            📷 Add Property Images
          </Text>

        </TouchableOpacity>

        <FlatList
          data={property.images}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item,index)=>index.toString()}
          contentContainerStyle={{
            marginTop:20,
          }}
          renderItem={({item,index})=>(

            <View style={styles.imageBox}>

              <Image
                source={{uri:item.uri}}
                style={styles.previewImage}
              />

              {property.coverImage===index && (

                <View style={styles.coverBadge}>

                  <Text
                    style={styles.coverBadgeText}>
                    Cover
                  </Text>

                </View>

              )}

              <TouchableOpacity
                style={styles.removeImage}
                onPress={()=>
                  removeImage(index)
                }>

                <Text
                  style={styles.removeImageText}>
                  ✕
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.coverButton}
                onPress={()=>
                  setCover(index)
                }>

                <Text
                  style={styles.coverButtonText}>

                  Set Cover

                </Text>

              </TouchableOpacity>

            </View>

          )}
        />

      </View>

    

      {/* Buttons */}

      <View
        style={{
          flexDirection:'row',
          justifyContent:'space-between',
          marginTop:30,
          marginBottom:30,
        }}>

        <TouchableOpacity
          style={styles.previousButton}
          onPress={previousTab}>

          <Text style={styles.previousText}>
            ← Previous
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={validate}>

          <Text style={styles.nextText}>
            Next →
          </Text>

        </TouchableOpacity>

      </View>



    </Animated.ScrollView>

  );

};

export default React.memo(ImagesTab);