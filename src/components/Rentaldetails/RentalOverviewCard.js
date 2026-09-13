import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import RenderHTML from 'react-native-render-html';

// =========================================================
// RENTAL OVERVIEW CARD
// =========================================================

const RentalOverviewCard = ({property}) => {
  const {width} = useWindowDimensions();

  // =======================================================
  // DESCRIPTION
  // =======================================================

  const description =
    property?.description ||
    property?.Description ||
    property?.overview ||
    property?.Overview ||
    '';

  // =======================================================
  // DON'T RENDER EMPTY SECTION
  // =======================================================

  if (
    !description ||
    !String(description).replace(/<[^>]*>/g, '').trim()
  ) {
    return null;
  }

  return (
    <View style={styles.card}>

      {/* ===================================================
          HEADING
      =================================================== */}

      <Text style={styles.heading}>
        Rental Property Overview
      </Text>

      {/* ===================================================
          HTML DESCRIPTION
      =================================================== */}

      <RenderHTML
        contentWidth={width - 66}
        source={{
          html: String(description),
        }}
        tagsStyles={{

          // =================================================
          // PARAGRAPH
          // =================================================

          p: {
            fontSize: 12,

            color: '#555',

            lineHeight: 24,

            marginTop: 0,

            marginBottom: 8,
          },

          // =================================================
          // STRONG
          // =================================================

          strong: {
            fontWeight: '700',

            color: '#333',
          },

          // =================================================
          // BOLD
          // =================================================

          b: {
            fontWeight: '700',

            color: '#333',
          },

          // =================================================
          // UNORDERED LIST
          // =================================================

          ul: {
            marginTop: 5,

            marginBottom: 8,

            paddingLeft: 5,
          },

          // =================================================
          // ORDERED LIST
          // =================================================

          ol: {
            marginTop: 5,

            marginBottom: 8,

            paddingLeft: 5,
          },

          // =================================================
          // LIST ITEM
          // =================================================

          li: {
            fontSize: 12,

            color: '#555',

            lineHeight: 22,
          },

          // =================================================
          // HEADINGS
          // =================================================

          h1: {
            fontSize: 18,

            fontWeight: '700',

            color: '#222',

            marginTop: 8,

            marginBottom: 8,
          },

          h2: {
            fontSize: 16,

            fontWeight: '700',

            color: '#222',

            marginTop: 8,

            marginBottom: 8,
          },

          h3: {
            fontSize: 14,

            fontWeight: '700',

            color: '#222',

            marginTop: 6,

            marginBottom: 6,
          },

          // =================================================
          // LINK
          // =================================================

          a: {
            color: '#1959A2',

            textDecorationLine: 'underline',
          },

          // =================================================
          // BLOCKQUOTE
          // =================================================

          blockquote: {
            borderLeftWidth: 3,

            borderLeftColor: '#1959A2',

            paddingLeft: 10,

            color: '#666',

            marginVertical: 8,
          },
        }}
      />

    </View>
  );
};

export default RentalOverviewCard;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fff',

    marginHorizontal: 15,

    marginTop: 15,

    marginBottom: 15,

    borderRadius: 15,

    padding: 18,

    elevation: 3,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,

      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 5,
  },

  heading: {
    fontSize: 16,

    fontWeight: '700',

    marginBottom: 10,

    color: '#102A47',
  },
});