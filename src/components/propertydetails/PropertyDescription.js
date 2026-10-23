import React, {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';

import RenderHTML from 'react-native-render-html';

// =========================================================
// RENTAL DESCRIPTION
// =========================================================

const PropDescription = ({property}) => {
  const {width} = useWindowDimensions();

  const description = property?.description;

  const [expanded, setExpanded] = useState(false);

  // =======================================================
  // DESCRIPTION HTML
  // =======================================================

  const htmlDescription = description ? String(description) : '';

  // =======================================================
  // CHECK DESCRIPTION LENGTH
  // =======================================================

  const plainText = htmlDescription
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

  const isLongDescription = plainText.length > 500;

  // =======================================================
  // NO DESCRIPTION
  // =======================================================

  if (!description) {
    return null;
  }

  // =======================================================
  // RETURN
  // =======================================================

  return (
    <View style={styles.card}>

      {/* =================================================
          HEADING
      ================================================= */}

      <Text style={styles.heading}>
        Property Description
      </Text>

      {/* =================================================
          ORANGE UNDERLINE
      ================================================= */}

      <View style={styles.headingLine} />

      {/* =================================================
          DESCRIPTION AREA
      ================================================= */}

      <View
        style={[
          styles.descriptionContainer,
          !expanded && isLongDescription
            ? styles.collapsedDescription
            : null,
        ]}
      >

        <RenderHTML
          contentWidth={width - 66}
          source={{
            html: htmlDescription,
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
            // STRONG / BOLD
            // =================================================

            strong: {
              fontWeight: '700',
              color: '#012353',
            },

            b: {
              fontWeight: '700',
              color: '#012353',
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
              marginBottom: 3,
            },

            // =================================================
            // HEADINGS
            // =================================================

            h1: {
              fontSize: 18,
              fontWeight: '700',
              color: '#012353',
              marginTop: 5,
              marginBottom: 8,
            },

            h2: {
              fontSize: 16,
              fontWeight: '700',
              color: '#012353',
              marginTop: 5,
              marginBottom: 7,
            },

            h3: {
              fontSize: 14,
              fontWeight: '700',
              color: '#012353',
              marginTop: 5,
              marginBottom: 6,
            },

            h4: {
              fontSize: 13,
              fontWeight: '700',
              color: '#012353',
              marginTop: 5,
              marginBottom: 5,
            },

            // =================================================
            // LINKS
            // =================================================

            a: {
              color: '#1959A2',
              textDecorationLine: 'underline',
            },

            // =================================================
            // DIV
            // =================================================

            div: {
              fontSize: 12,
              color: '#555',
              lineHeight: 24,
            },

            // =================================================
            // SPAN
            // =================================================

            span: {
              color: '#555',
            },
          }}
        />

      </View>

      {/* =====================================================
          READ MORE / READ LESS
      ===================================================== */}

      {isLongDescription && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setExpanded(!expanded)}
          style={styles.readMoreButton}
        >

          <Text style={styles.readMoreText}>
            {expanded ? 'Read Less' : 'Read More'}
          </Text>

          <Text style={styles.readMoreArrow}>
            {expanded ? ' ▲' : ' ▼'}
          </Text>

        </TouchableOpacity>
      )}

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
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingTop: 17,
    paddingBottom: 15,

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
    marginBottom: 7,
  },

  // =======================================================
  // ORANGE LINE
  // =======================================================

  headingLine: {
    width: 38,
    height: 3,
    backgroundColor: '#F7941D',
    borderRadius: 3,
    marginBottom: 12,
  },

  // =======================================================
  // DESCRIPTION CONTAINER
  // =======================================================

  descriptionContainer: {
    overflow: 'hidden',
  },

  // =======================================================
  // COLLAPSED DESCRIPTION
  // =======================================================

  collapsedDescription: {
    maxHeight: 125,
  },

  // =======================================================
  // READ MORE BUTTON
  // =======================================================

  readMoreButton: {
    alignSelf: 'flex-end',

    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 6,
    paddingVertical: 4,
  },

  // =======================================================
  // READ MORE TEXT
  // =======================================================

  readMoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F7941D',
  },

  // =======================================================
  // ARROW
  // =======================================================

  readMoreArrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F7941D',
  },

});

export default PropDescription;
 