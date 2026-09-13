import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Video from 'react-native-video';

const VideoSection = ({project}) => {
  const videoPath = project?.videoUrl || project?.VideoUrl || '';

  if (!videoPath) {
    return null;
  }

  const videoUrl = videoPath.startsWith('http')
    ? videoPath
    : `https://savariyaproperty.in/${videoPath}`;

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>
        Video Tour
      </Text>

      <Video
        source={{uri: videoUrl}}
        style={styles.video}
        controls={true}
        resizeMode="contain"
        paused={true}
        onError={error => {
          console.log('VIDEO ERROR:', error);
        }}
      />
    </View>
  );
};

export default VideoSection;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 18,
    borderRadius: 15,
    elevation: 3,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 15,
  },

  video: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    borderRadius: 12,
  },
});