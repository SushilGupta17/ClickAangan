
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Video from 'react-native-video';

import {formatPrice} from '../../helpers/priceHelper';
import PropImageRotator from '../../components/PropImgRotator';

const API_URL = 'https://clickaangan.in';

/*
==================================================
STATIC VIDEO URL
==================================================

Testing ke liye abhi static video laga hua hai.

IMPORTANT:
Is URL par actual MP4 video available hona chahiye.
Baad mein API wala URL yahan laga denge.
*/



const ProjectCard = ({item, navigation}) => {

  const [videoPaused, setVideoPaused] = useState(true);
  // ==========================================
  // IMAGE URL HELPER
  // ==========================================

  const getMediaUrl = path => {
    if (!path) {
      return '';
    }

    const cleanPath = String(path)
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');

    if (
      cleanPath.startsWith('http://') ||
      cleanPath.startsWith('https://')
    ) {
      return cleanPath;
    }

    return `${API_URL}/${cleanPath}`;
  };


  // ==========================================
  // VIDEO URL HELPER
  // ==========================================

  const getVideoUrl = path => {
    if (!path) {
      return '';
    }

    const cleanPath = String(path)
      .replace(/\\/g, '/')
      .trim();

    if (
      cleanPath.startsWith('http://') ||
      cleanPath.startsWith('https://')
    ) {
      return cleanPath;
    }

    return `${API_URL}/${cleanPath.replace(/^\/+/, '')}`;
  };


  // ==========================================
  // PROJECT IMAGES
  // ==========================================

  const projectImages = useMemo(() => {

    if (!item?.images) {
      return [];
    }

    // ------------------------------------------
    // COMMA SEPARATED STRING
    // ------------------------------------------

    if (typeof item.images === 'string') {
      return item.images
        .split(',')
        .map(x => x.trim())
        .filter(Boolean)
        .map(x => getMediaUrl(x))
        .filter(Boolean);
    }


    // ------------------------------------------
    // ARRAY
    // ------------------------------------------

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


  // ==========================================
  // VIDEO PATH FROM API
  // ==========================================

 const videoPath =
  item?.videoUrl ||
  item?.VideoUrl ||
  item?.videoPath ||
  item?.VideoPath ||
  item?.video ||
  item?.Video ||
  '';

const videoUrl = useMemo(() => {
  return getVideoUrl(videoPath);
}, [videoPath]);




  // ==========================================
  // CONDITIONS
  // ==========================================

  const hasImages = projectImages.length > 0;

  /*
  Abhi STATIC VIDEO testing ke liye
  API videoPath ko use nahi kar rahe.

  Jab static video confirm ho jayega,
  tab isko API URL par wapas kar denge.
  */

  const hasVideo =
    typeof videoUrl === 'string' &&
    videoUrl.trim() !== '';


  // ==========================================
  // OPEN PROJECT
  // ==========================================

  const openProject = () => {
    navigation?.navigate('ProjectDetails', {
      project: item,
    });
  };


  // ==========================================
  // RETURN
  // ==========================================

  return (
    <View style={styles.card}>

      {/* ======================================
          MEDIA SECTION

          Priority:
          1. Images
          2. Video
          3. No Media

          IMPORTANT:
          Ye section NON-CLICKABLE hai.
      ====================================== */}

      <View style={styles.mediaSection}>
{hasImages ? (
  <PropImageRotator
    images={projectImages}
  />
) : hasVideo ? (
<View style={styles.videoContainer}>

  <Video
    source={{
      uri: videoUrl,
    }}
    style={styles.video}
    resizeMode="cover"

    // ==========================================
    // VIDEO STARTS PAUSED
    // ==========================================
    paused={videoPaused}

    muted={true}

    repeat={false}

    controls={false}

    playInBackground={false}
    playWhenInactive={false}

    ignoreSilentSwitch="ignore"

    // ==========================================
    // VIDEO LOADED
    // ==========================================
    onLoad={data => {
      console.log('================================');
      console.log('PROJECT VIDEO LOADED');
      console.log(
        'PROJECT:',
        item?.projectName,
      );
      console.log(
        'VIDEO URL:',
        videoUrl,
      );
      console.log(
        'DURATION:',
        data?.duration,
      );
      console.log('================================');
    }}

    // ==========================================
    // READY
    // ==========================================
    onReadyForDisplay={() => {
      console.log(
        'PROJECT VIDEO READY:',
        videoUrl,
      );
    }}

    // ==========================================
    // VIDEO END
    // ==========================================
    onEnd={() => {
      console.log(
        'PROJECT VIDEO ENDED:',
        videoUrl,
      );

      // Video end hone ke baad pause
      setVideoPaused(true);
    }}

    // ==========================================
    // ERROR
    // ==========================================
    onError={error => {
      console.log('================================');
      console.log('PROJECT VIDEO ERROR');
      console.log(
        'PROJECT:',
        item?.projectName,
      );
      console.log(
        'VIDEO URL:',
        videoUrl,
      );
      console.log(
        'ERROR:',
        JSON.stringify(
          error,
          null,
          2,
        ),
      );
      console.log('================================');
    }}
  />

  {/* ==========================================
      VIDEO CLICK AREA

      IMPORTANT:
      Video ke upar full clickable layer
  ========================================== */}

  <TouchableOpacity
    activeOpacity={0.95}
    style={styles.videoTouchArea}
    onPress={() => {
      console.log(
        'PROJECT VIDEO CLICKED:',
        videoUrl,
      );

      setVideoPaused(prev => !prev);
    }}
  />

  {/* ==========================================
      PLAY ICON
  ========================================== */}

  {videoPaused && (
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

  {/* ==========================================
      PAUSE ICON
  ========================================== */}

  {!videoPaused && (
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

) : (
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


      {/* ======================================
          STATUS BADGES
      ====================================== */}

      <View style={styles.statusRow}>

        <View style={styles.statusBadge}>

          <Text style={styles.statusText}>
            {item?.projectStatus}
          </Text>

        </View>


        <View style={styles.reraBadge}>

          <Icon
            name="check-circle"
            color="#28A745"
            size={12}
          />

          <Text style={styles.reraText}>
            Verified
          </Text>

        </View>

      </View>


      {/* ======================================
          BODY

          ONLY THIS AREA IS CLICKABLE
      ====================================== */}

      <View style={styles.body}>

        {/* PROJECT NAME */}

        <Text
          numberOfLines={1}
          style={styles.projectName}
        >
          {item?.projectName}
        </Text>


        {/* BUILDER */}

        <Text style={styles.builder}>
          By {item?.builderName}
        </Text>


        {/* LOCATION */}

        <View style={styles.locationRow}>

          <Icon
            name="map-marker-alt"
            color="#FF5722"
            size={13}
          />

          <Text
            numberOfLines={1}
            style={styles.location}
          >
            {item?.locality}, {item?.city}
          </Text>

        </View>


        {/* PRICE */}

        <View style={styles.priceRow}>

          <Text style={styles.price}>
            ₹ {formatPrice(item?.minPrice)}
            {'  -  '}
            ₹ {formatPrice(item?.maxPrice)}
          </Text>

        </View>


        {/* ==================================
            VIEW PROJECT DETAILS BUTTON

            ONLY CLICKABLE AREA
        ================================== */}

        <TouchableOpacity
          style={styles.detailsBtn}
          activeOpacity={0.8}
          onPress={openProject}
        >

          <Text style={styles.detailsText}>
            View Project Details
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
};

export default ProjectCard;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  // ========================================
  // CARD
  // ========================================

  card: {
    margin: 12,
    backgroundColor: '#FFF',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 5,
  },


  // ========================================
  // MEDIA SECTION
  // ========================================

  mediaSection: {
    width: '100%',
    height: 220,
  },


  // ========================================
  // VIDEO
  // ========================================

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


  // ========================================
  // PLAY BUTTON
  // ========================================

  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.55)',
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


  // ========================================
  // NO MEDIA
  // ========================================

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


  // ========================================
  // BODY
  // ========================================

  body: {
    padding: 15,
  },


  // ========================================
  // STATUS
  // ========================================

  statusRow: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  statusBadge: {
    backgroundColor: '#28A745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },

  reraBadge: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },

  reraText: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: '700',
  },


  // ========================================
  // TEXT
  // ========================================

  projectName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },

  builder: {
    marginTop: 4,
    color: '#666',
    fontSize: 14,
  },


  // ========================================
  // LOCATION
  // ========================================

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  location: {
    marginLeft: 8,
    color: '#555',
    flex: 1,
  },


  // ========================================
  // PRICE
  // ========================================

  priceRow: {
    marginTop: 14,
  },

  price: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },


  // ========================================
  // BUTTON
  // ========================================

  detailsBtn: {
    marginTop: 18,
    backgroundColor: '#102a47',
    paddingVertical: 14,
    borderRadius: 10,
  },

  detailsText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },

  videoTouchArea: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 5,
},

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

});

