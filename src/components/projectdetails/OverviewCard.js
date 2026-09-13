import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';

const OverviewCard = ({project}) => {
  const {width} = useWindowDimensions();

  const description = project?.description;

  if (!description) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>
        Project Overview
      </Text>

      <RenderHTML
        contentWidth={width - 66}
        source={{html: description}}
        tagsStyles={{
          p: {
            fontSize: 12,
            color: '#555',
            lineHeight: 24,
            marginTop: 0,
            marginBottom: 8,
          },

          strong: {
            fontWeight: '700',
            color: '#333',
          },

          b: {
            fontWeight: '700',
            color: '#333',
          },

          ul: {
            marginTop: 5,
            marginBottom: 8,
          },

          ol: {
            marginTop: 5,
            marginBottom: 8,
          },

          li: {
            fontSize: 12,
            color: '#555',
            lineHeight: 22,
          },

          h1: {
            fontSize: 18,
            fontWeight: '700',
            color: '#222',
          },

          h2: {
            fontSize: 16,
            fontWeight: '700',
            color: '#222',
          },

          h3: {
            fontSize: 14,
            fontWeight: '700',
            color: '#222',
          },
        }}
      />
    </View>
  );
};

export default OverviewCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    padding: 18,
    elevation: 3,
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
  },
});