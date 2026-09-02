import React, {useMemo, useState} from 'react';

import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewing from 'react-native-image-viewing';
import Share from 'react-native-share';

const {width} = Dimensions.get('window');

const API_URL = 'https://savariyaproperty.in';

const IMAGE_HEIGHT = 300;


const PropertyImageCarousel = ({property}) => {

  const [visible, setVisible] = useState(false);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [isFavourite, setIsFavourite] =
    useState(false);


  /* ================================================= */
  /* IMAGES */
  /* ================================================= */

  const images = useMemo(() => {

    const result = [];

    /*
     * Cover / Main Image
     */

    const coverImage =
      property?.imageUrl ||
      property?.coverImage ||
      property?.image;

    if (coverImage) {

      result.push({
        uri: getImageUrl(coverImage),
      });

    }


    /*
     * Property Images
     */

    if (Array.isArray(property?.images)) {

      property.images.forEach(item => {

        const image =
          item?.imageUrl ||
          item?.imagePath ||
          item?.url ||
          item;

        if (image) {

          const uri = getImageUrl(image);

          /*
           * Duplicate image avoid
           */

          if (
            !result.some(
              x => x.uri === uri,
            )
          ) {

            result.push({
              uri,
            });

          }

        }

      });

    }


    return result;

  }, [property]);


  /* ================================================= */
  /* IMAGE URL */
  /* ================================================= */

  function getImageUrl(image) {

    if (!image) {
      return '';
    }

    /*
     * Already complete URL
     */

    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {

      return image;

    }


    /*
     * Windows slash fix
     */

    const cleanPath =
      image.replace(/\\/g, '/');


    /*
     * Avoid double slash
     */

    if (cleanPath.startsWith('/')) {

      return `${API_URL}${cleanPath}`;

    }

    return `${API_URL}/${cleanPath}`;

  }


  /* ================================================= */
  /* SHARE */
  /* ================================================= */

  const onShare = async () => {

    try {

      await Share.open({

        title:
          property?.title ||
          'Property',

        message:
          `${property?.title || 'Property'}

📍 ${property?.location || ''}

💰 Price: ₹ ${
  property?.price || ''
}

${API_URL}`,

      });

    } catch (error) {

      console.log(
        'Share Error =>',
        error,
      );

    }

  };


  /* ================================================= */
  /* RENDER IMAGE */
  /* ================================================= */

  const renderItem = ({
    item,
    index,
  }) => (

    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => {

        setCurrentIndex(index);

        setVisible(true);

      }}>

      <FastImage
        source={{
          uri: item.uri,
          priority:
            FastImage.priority.high,
        }}

        resizeMode={
          FastImage.resizeMode.cover
        }

        style={styles.image}

      />

    </TouchableOpacity>

  );


  /* ================================================= */
  /* EMPTY IMAGE */
  /* ================================================= */

  if (images.length === 0) {

    return (

      <View style={styles.emptyContainer}>

        <Icon
          name="image-off-outline"
          size={55}
          color="#999"
        />

        <Text style={styles.emptyText}>
          No Property Images
        </Text>

      </View>

    );

  }


  /* ================================================= */
  /* UI */
  /* ================================================= */

  return (

    <View style={styles.container}>

      {/* ============================================= */}
      {/* IMAGE SLIDER */}
      {/* ============================================= */}

      <FlatList
        data={images}

        horizontal

        pagingEnabled

        showsHorizontalScrollIndicator={false}

        keyExtractor={(_, index) =>
          index.toString()
        }

        renderItem={renderItem}

        onMomentumScrollEnd={event => {

          const index =
            Math.round(
              event.nativeEvent.contentOffset.x /
              width,
            );

          setCurrentIndex(index);

        }}

      />


      {/* ============================================= */}
      {/* GRADIENT */}
      {/* ============================================= */}

      <LinearGradient
        colors={[
          'transparent',
          'rgba(0,0,0,0.15)',
          'rgba(0,0,0,0.90)',
        ]}

        style={styles.overlay}>

        <Text
          style={styles.propertyTitle}
          numberOfLines={2}>

          {property?.title ||
            'Property'}

        </Text>


        <Text style={styles.location}>

          {property?.location
            ? `📍 ${property.location}`
            : ''}

        </Text>


        {property?.price ? (

          <Text style={styles.price}>

            ₹ {formatPrice(property.price)}

          </Text>

        ) : null}

      </LinearGradient>


      {/* ============================================= */}
      {/* FAVOURITE + SHARE */}
      {/* ============================================= */}

      <View style={styles.actionContainer}>

        <TouchableOpacity
          style={styles.iconButton}

          onPress={() =>
            setIsFavourite(
              !isFavourite,
            )
          }>

          <Icon
            name={
              isFavourite
                ? 'heart'
                : 'heart-outline'
            }

            size={25}

            color={
              isFavourite
                ? '#FF5252'
                : '#fff'
            }

          />

        </TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              marginLeft: 10,
            },
          ]}

          onPress={onShare}>

          <Icon
            name="share-variant"
            size={23}
            color="#fff"
          />

        </TouchableOpacity>

      </View>


      {/* ============================================= */}
      {/* IMAGE COUNTER */}
      {/* ============================================= */}

      <View style={styles.counter}>

        <Icon
          name="image-multiple-outline"
          size={15}
          color="#fff"
        />

        <Text style={styles.counterText}>

          {currentIndex + 1}
          {' / '}
          {images.length}

        </Text>

      </View>


      {/* ============================================= */}
      {/* DOTS */}
      {/* ============================================= */}

      {images.length > 1 ? (

        <View style={styles.dots}>

          {images.map((_, index) => (

            <View
              key={index}

              style={[
                styles.dot,

                currentIndex === index &&
                  styles.activeDot,
              ]}

            />

          ))}

        </View>

      ) : null}


      {/* ============================================= */}
      {/* FULL SCREEN IMAGE */}
      {/* ============================================= */}

      <ImageViewing
        images={images}

        imageIndex={currentIndex}

        visible={visible}

        onRequestClose={() =>
          setVisible(false)
        }

      />

    </View>

  );

};


/* ================================================= */
/* PRICE FORMAT */
/* ================================================= */

const formatPrice = value => {

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {

    return '';

  }

  /*
   * Agar already string hai
   */

  const number =
    Number(
      String(value)
        .replace(/,/g, ''),
    );


  if (Number.isNaN(number)) {

    return value;

  }


  return number.toLocaleString(
    'en-IN',
    {
      maximumFractionDigits: 0,
    },
  );

};


export default PropertyImageCarousel;


/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({

  container: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#ddd',
  },

  image: {
    width: width,
    height: IMAGE_HEIGHT,
  },

  /* EMPTY */

  emptyContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#EEF1F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 8,
    color: '#777',
    fontSize: 13,
  },

  /* GRADIENT */

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 145,
    paddingHorizontal: 18,
    paddingTop: 55,
    justifyContent: 'flex-end',
    paddingBottom: 22,
  },

  propertyTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  location: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
  },

  price: {
    color: '#fff',
    marginTop: 7,
    fontSize: 18,
    fontWeight: '700',
  },

  /* ACTION */

  actionContainer: {
    position: 'absolute',
    top: 18,
    right: 15,
    flexDirection: 'row',
    zIndex: 20,
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor:
      'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* COUNTER */

  counter: {
    position: 'absolute',
    bottom: 55,
    right: 15,
    backgroundColor:
      'rgba(0,0,0,0.70)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  counterText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 5,
  },

  /* DOTS */

  dots: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      'rgba(255,255,255,0.50)',
    marginHorizontal: 3,
  },

  activeDot: {
    width: 20,
    backgroundColor: '#fff',
  },

});