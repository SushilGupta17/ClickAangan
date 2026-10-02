import React, {useMemo, useState} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Video from 'react-native-video';

import {formatRentalPrice} from '../../helpers/formatRentalPrice';
import PropImageRotator from '../../components/PropImgRotator';

const API_URL = 'https://clickaangan.in';

// ==================================================
// RENTAL CARD
// ==================================================

const RentalCard = ({
  item,
  navigation,
  checkLogin,
}) => {

  // ==================================================
  // MEDIA URL HELPER
  // ==================================================

  const getMediaUrl = path => {

    if (!path) {
      return '';
    }

    const cleanPath = String(path)
      .replace(/\\/g, '/')
      .trim()
      .replace(/^\/+/, '');

    if (
      cleanPath.startsWith('http://') ||
      cleanPath.startsWith('https://')
    ) {
      return cleanPath;
    }

    return `${API_URL}/${cleanPath}`;
  };

  // ==================================================
  // PROPERTY IMAGES
  // ==================================================

  const propertyImages = useMemo(() => {

    if (!item?.images) {
      return [];
    }

    // ----------------------------------------------
    // STRING
    // ----------------------------------------------

    if (typeof item.images === 'string') {

      return item.images
        .split(',')
        .map(x => x.trim())
        .filter(Boolean)
        .map(x => getMediaUrl(x))
        .filter(Boolean);

    }

    // ----------------------------------------------
    // ARRAY
    // ----------------------------------------------

    if (Array.isArray(item.images)) {

      return item.images
        .map(x => {

          const imagePath =
            x?.imageUrl ||
            x?.ImageUrl ||
            x?.url ||
            x?.Url ||
            x;

          if (!imagePath) {
            return null;
          }

          return getMediaUrl(imagePath);
        })
        .filter(Boolean);

    }

    return [];

  }, [item?.images]);

  // ==================================================
  // VIDEO PATH
  // ==================================================

  const videoPath =
    item?.videoUrl ||
    item?.VideoUrl ||
    item?.videoPath ||
    item?.VideoPath ||
    item?.video ||
    item?.Video ||
    '';

  // ==================================================
  // VIDEO URL
  // ==================================================

  const videoUrl = useMemo(() => {

    return getMediaUrl(videoPath);

  }, [videoPath]);

  // ==================================================
  // MEDIA CONDITIONS
  // ==================================================

  const hasImages =
    propertyImages.length > 0;

  const hasVideo =
    typeof videoUrl === 'string' &&
    videoUrl.trim() !== '';

  // ==================================================
  // OPEN PROPERTY
  // ==================================================

  const openProperty = () => {

    navigation?.navigate(
      'PropertyDetails',
      {
        property: item,
        id: item?.id,
      },
    );

  };

  // ==================================================
  // RENDER
  // ==================================================

  return (

    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={openProperty}
    >

      {/* ==================================================
          MEDIA SECTION

          PRIORITY:

          1. IMAGES
          2. VIDEO
          3. NO MEDIA
      ================================================== */}

      <View style={styles.mediaSection}>

        {/* ==================================================
            IMAGES
        ================================================== */}

        {hasImages ? (

          <PropImageRotator
            images={propertyImages}
          />

        ) : hasVideo ? (

          /* ==================================================
              VIDEO
          ================================================== */

          <RentalVideo
            videoUrl={videoUrl}
            propertyTitle={item?.title}
          />

        ) : (

          /* ==================================================
              NO MEDIA
          ================================================== */

          <View style={styles.noMedia}>

            <Icon
              name="image"
              size={35}
              color="#999"
            />

            <Text style={styles.noMediaText}>
              No Media Available
            </Text>

          </View>

        )}

      </View>

      {/* ==================================================
          PROPERTY TYPE BADGE
      ================================================== */}

      <View style={styles.badgeContainer}>

        <Text style={styles.badge}>
          {item?.subCategory}
        </Text>

      </View>

      {/* ==================================================
          PROPERTY INFO
      ================================================== */}

      <View style={styles.info}>

        {/* ==================================================
            PRICE
        ================================================== */}

        <View style={styles.priceRow}>

          <Text style={styles.price}>
            ₹ {formatRentalPrice(item?.price)}
          </Text>

        </View>

        {/* ==================================================
            TITLE
        ================================================== */}

        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {item?.title}
        </Text>

        {/* ==================================================
            LOCATION
        ================================================== */}

        <View style={styles.locationRow}>

          <Icon
            name="map-marker-alt"
            size={13}
            color="#C62828"
          />

          <Text
            style={styles.location}
            numberOfLines={1}
          >
            {item?.location}
          </Text>

        </View>

        {/* ==================================================
            BUTTONS
        ================================================== */}

        <View style={styles.buttonRow}>

          {/* ==================================================
              CONTACT
          ================================================== */}

          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() =>
              checkLogin(() =>
                navigation?.navigate(
                  'ContactOwner',
                  {
                    property: item,
                  },
                ),
              )
            }
          >

            <Icon
              name="phone"
              size={12}
              color="#C62828"
            />

            <Text style={styles.contactBtnText}>
              Contact
            </Text>

          </TouchableOpacity>

          {/* ==================================================
              VIEW DETAILS
          ================================================== */}

          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() =>
              checkLogin(() =>
                navigation?.navigate(
                  'RentDetails',
                  {
                    property: item,
                    id: item?.id,
                  },
                ),
              )
            }
          >

            <Text style={styles.detailsBtnText}>
              View Details
            </Text>

            <Icon
              name="arrow-right"
              size={11}
              color="#fff"
            />

          </TouchableOpacity>

          {/* ==================================================
              ENQUIRY
          ================================================== */}

          <TouchableOpacity
            style={styles.enquiryBtn}
            onPress={() =>
              checkLogin(() =>
                navigation?.navigate(
                  'EnquiryScreen',
                  {
                    property: item,
                  },
                ),
              )
            }
          >

            <Icon
              name="comment-dots"
              size={12}
              color="#fff"
            />

            <Text style={styles.enquiryBtnText}>
              Enquiry
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </TouchableOpacity>
  );
};


// ==================================================
// RENTAL VIDEO
// ==================================================

 
const RentalVideo = ({
  videoUrl,
  propertyTitle,
}) => {
  const [paused, setPaused] = useState(true);

  const toggleVideo = () => {
    console.log('================================');
    console.log('RENTAL VIDEO CLICKED');
    console.log('PROPERTY:', propertyTitle);
    console.log('VIDEO URL:', videoUrl);
    console.log('CURRENT PAUSED:', paused);
    console.log('================================');

    setPaused(prev => !prev);
  };

  return (
    <View style={styles.videoContainer}>

      <Video
        source={{
          uri: videoUrl,
        }}
        style={styles.video}
        resizeMode="cover"

        paused={paused}

        muted={true}

        repeat={false}

        controls={false}

        playInBackground={false}
        playWhenInactive={false}

        ignoreSilentSwitch="ignore"

        onLoad={data => {
          console.log('--------------------------------');
          console.log('RENTAL VIDEO LOADED');
          console.log('PROPERTY:', propertyTitle);
          console.log('URL:', videoUrl);
          console.log('DURATION:', data?.duration);
          console.log('--------------------------------');
        }}

        onReadyForDisplay={() => {
          console.log(
            'RENTAL VIDEO READY:',
            videoUrl,
          );
        }}

        onProgress={data => {
          console.log(
            'RENTAL VIDEO PROGRESS:',
            data?.currentTime,
          );
        }}

        onEnd={() => {
          console.log(
            'RENTAL VIDEO ENDED:',
            videoUrl,
          );

          setPaused(true);
        }}

        onError={error => {
          console.log('================================');
          console.log('RENTAL VIDEO ERROR');
          console.log('PROPERTY:', propertyTitle);
          console.log('URL:', videoUrl);
          console.log(
            JSON.stringify(
              error,
              null,
              2,
            ),
          );
          console.log('================================');
        }}
      />

      {/* CLICK AREA */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.videoTouchArea}
        onPress={toggleVideo}
      />

      {/* PLAY ICON */}
      {paused && (
        <View
          pointerEvents="none"
          style={styles.playButton}
        >
          <Icon
            name="play"
            size={22}
            color="#fff"
          />
        </View>
      )}

      {/* PAUSE ICON */}
      {!paused && (
        <View
          pointerEvents="none"
          style={styles.pauseButton}
        >
          <Icon
            name="pause"
            size={20}
            color="#fff"
          />
        </View>
      )}

    </View>
  );
};
 





export default RentalCard;


// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  // ==================================================
  // CARD
  // ==================================================

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
  },

  // ==================================================
  // MEDIA
  // ==================================================

  mediaSection: {
    width: '100%',
    height: 220,
  },

  // ==================================================
  // VIDEO CONTAINER
  // ==================================================

  videoContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    position: 'relative',
  },

  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },

  // ==================================================
  // PLAY BUTTON
  // ==================================================

  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.60)',
    justifyContent: 'center',
    alignItems: 'center',

    transform: [
      {
        translateX: -27.5,
      },
      {
        translateY: -27.5,
      },
    ],
  },

  // ==================================================
  // PAUSE BUTTON
  // ==================================================

  pauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.50)',
    justifyContent: 'center',
    alignItems: 'center',

    transform: [
      {
        translateX: -25,
      },
      {
        translateY: -25,
      },
    ],
  },

  // ==================================================
  // NO MEDIA
  // ==================================================

  noMedia: {
    width: '100%',
    height: 220,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noMediaText: {
    marginTop: 8,
    color: '#999',
    fontSize: 13,
  },

  // ==================================================
  // BADGE
  // ==================================================

  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
  },

  badge: {
    backgroundColor: '#28A745',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: '700',
    fontSize: 12,
  },

  // ==================================================
  // INFO
  // ==================================================

  info: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },

  // ==================================================
  // PRICE
  // ==================================================

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },

  price: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1959A2',
  },

  // ==================================================
  // TITLE
  // ==================================================

  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
    marginBottom: 5,
  },

  // ==================================================
  // LOCATION
  // ==================================================

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  location: {
    flex: 1,
    fontSize: 12,
    color: '#1959A2',
    marginLeft: 5,
    fontWeight: '600',
  },

  // ==================================================
  // DESCRIPTION
  // ==================================================

  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 11,
  },

  // ==================================================
  // BUTTON ROW
  // ==================================================

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  // ==================================================
  // CONTACT
  // ==================================================

  contactBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1959A2',
    backgroundColor: '#F4F8FD',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  contactBtnText: {
    color: '#1959A2',
    fontSize: 11,
    fontWeight: '700',
  },

  // ==================================================
  // DETAILS
  // ==================================================

  detailsBtn: {
    flex: 1.15,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1959A2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    elevation: 2,
  },

  detailsBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  // ==================================================
  // ENQUIRY
  // ==================================================

  enquiryBtn: {
    flex: 0.9,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#0A8754',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    elevation: 2,
  },

  enquiryBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  videoTouchArea: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 5,
},

});
