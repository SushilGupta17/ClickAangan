import React, {useState } from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';

import styles from '../../styles/AddPropertyStyle';

const VideoUrl = ({property, setProperty}) => {

  const updateVideoUrl = text => {
    setProperty(prev => ({
      ...prev,
      videoUrl: text,
    }));
  };

  return (
    <View style={styles.card}>

      <Text style={styles.title}>
        Project Video
      </Text>

      <TextInput
        style={styles.input}
        placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
        placeholderTextColor="#999"
        value={property?.videoUrl || ''}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        onChangeText={updateVideoUrl}
      />

      <Text
        style={{
          marginTop: 8,
          fontSize: 12,
          color: '#666',
        }}>
        Paste YouTube, Vimeo or any public video URL.
      </Text>

    </View>
  );
};

export default React.memo(VideoUrl);