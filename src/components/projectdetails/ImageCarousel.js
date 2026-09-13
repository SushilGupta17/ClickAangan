
import React, {useMemo, useState, useEffect} from 'react';

import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewing from 'react-native-image-viewing';
import Share from 'react-native-share';
import Video from 'react-native-video';

import {formatPrice} from '../../helpers/priceHelper';

const {width} = Dimensions.get('window');

const API_URL = 'https://savariyaproperty.in';
const IMAGE_HEIGHT = 300;

const tabs = [
  {
    id: 'Apartment',
    title: 'Photos',
    icon: 'image-multiple',
  },
  {
    id: 'FloorPlan',
    title: 'Floor Plan',
    icon: 'floor-plan',
  },
  {
    id: 'MasterPlan',
    title: 'Master Plan',
    icon: 'map',
  },
  {
    id: 'Other',
    title: 'Other',
    icon: 'image',
  },
];

const ImageCarousel = ({project}) => {
  const [selectedTab, setSelectedTab] = useState('Apartment');
  const [visible, setVisible] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ==========================================
  // VIDEO URL
  // ==========================================

  const videoPath =
    project?.videoUrl ||
    project?.VideoUrl ||
    project?.videoPath ||
    project?.VideoPath ||
    '';

  const videoUrl = useMemo(() => {
    if (!videoPath) {
      return '';
    }

    if (videoPath.startsWith('http')) {
      return videoPath;
    }

    const cleanPath = videoPath
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');

    return `${API_URL}/${cleanPath}`;
  }, [videoPath]);

  const hasVideo = !!videoUrl;

  // ==========================================
  // TAB COUNTS
  // ==========================================

  const tabCounts = useMemo(() => {
    const apartmentCount =
      (project?.images || []).filter(
        x => x.imageType === 'Apartment',
      ).length + (project?.coverImage ? 1 : 0);

    const floorPlanCount = (project?.images || []).filter(
      x => x.imageType === 'FloorPlan',
    ).length;

    const masterPlanCount = project?.masterPlan ? 1 : 0;

    const otherCount = (project?.images || []).filter(
      x => x.imageType === 'Other',
    ).length;

    return {
      Apartment: apartmentCount,
      FloorPlan: floorPlanCount,
      MasterPlan: masterPlanCount,
      Other: otherCount,
    };
  }, [project]);

  // ==========================================
  // AVAILABLE TABS ONLY
  // ==========================================

  const availableTabs = useMemo(() => {
    return tabs.filter(tab => tabCounts[tab.id] > 0);
  }, [tabCounts]);

  // ==========================================
  // CHECK ANY IMAGE EXISTS
  // ==========================================

  const hasAnyImages = availableTabs.length > 0;

  // ==========================================
  // AUTO SELECT FIRST AVAILABLE TAB
  // ==========================================

  useEffect(() => {
    if (
      availableTabs.length > 0 &&
      !availableTabs.find(tab => tab.id === selectedTab)
    ) {
      setSelectedTab(availableTabs[0].id);
      setCurrentIndex(0);
    }
  }, [availableTabs, selectedTab]);

  // ==========================================
  // GET IMAGES
  // ==========================================

  const images = useMemo(() => {
    switch (selectedTab) {
      case 'Apartment':
        return [
          ...(project?.coverImage
            ? [
                {
                  uri: `${API_URL}${project.coverImage
                    .replace(/\\/g, '/')
                    .replace(/^\/+/, '/')}`,
                },
              ]
            : []),

          ...(project?.images || [])
            .filter(x => x.imageType === 'Apartment')
            .map(x => ({
              uri: `${API_URL}${x.imageUrl
                .replace(/\\/g, '/')
                .replace(/^\/+/, '/')}`,
            })),
        ];

      case 'FloorPlan':
        return (project?.images || [])
          .filter(x => x.imageType === 'FloorPlan')
          .map(x => ({
            uri: `${API_URL}${x.imageUrl
              .replace(/\\/g, '/')
              .replace(/^\/+/, '/')}`,
          }));

      case 'MasterPlan':
        return project?.masterPlan
          ? [
              {
                uri: `${API_URL}${project.masterPlan
                  .replace(/\\/g, '/')
                  .replace(/^\/+/, '/')}`,
              },
            ]
          : [];

      case 'Other':
        return (project?.images || [])
          .filter(x => x.imageType === 'Other')
          .map(x => ({
            uri: `${API_URL}${x.imageUrl
              .replace(/\\/g, '/')
              .replace(/^\/+/, '/')}`,
          }));

      default:
        return [];
    }
  }, [project, selectedTab]);

  // ==========================================
  // SHARE
  // ==========================================

  const onShare = async () => {
    try {
      await Share.open({
        title: project?.projectName || '',

        message: `${project?.projectName || ''}

${project?.builderName || ''}

${project?.locality || ''}, ${project?.city || ''}

₹ ${formatPrice(project?.minPrice)} - ₹ ${formatPrice(
          project?.maxPrice,
        )}

https://savariyaproperty.in`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // ==========================================
  // IMAGE CLICK
  // ==========================================

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => {
        setCurrentIndex(index);
        setVisible(true);
      }}>
      <FastImage
        source={{uri: item.uri}}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />
    </TouchableOpacity>
  );

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <View>

      {/* ======================================
          IMAGE TABS
          Only show if images exist
      ====================================== */}

      {hasAnyImages && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}>
          {availableTabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && styles.activeTab,
              ]}
              onPress={() => {
                setSelectedTab(tab.id);
                setCurrentIndex(0);
              }}>
              <Icon
                name={tab.icon}
                size={18}
                color={
                  selectedTab === tab.id
                    ? '#fff'
                    : '#444'
                }
              />

              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.id &&
                    styles.activeTabText,
                ]}>
                {tab.title} ({tabCounts[tab.id]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ======================================
          IMAGE SLIDER
          If images available
      ====================================== */}

      {hasAnyImages && images.length > 0 && (
        <FlatList
          key={selectedTab}
          data={images}
          horizontal
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={event => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width,
            );

            setCurrentIndex(index);
          }}
        />
      )}

      {/* ======================================
          VIDEO HEADER
          Only if NO IMAGES + VIDEO exists
      ====================================== */}

      {!hasAnyImages && hasVideo && (
        <Video
          source={{uri: videoUrl}}
          style={styles.headerVideo}
          controls={true}
          resizeMode="cover"
          paused={true}
          repeat={false}
          onError={error => {
            console.log(
              'HEADER VIDEO ERROR:',
              JSON.stringify(error),
            );
          }}
        />
      )}

      {/* ======================================
          NO MEDIA
      ====================================== */}

      {!hasAnyImages && !hasVideo && (
        <View style={styles.noMedia}>
          <Icon
            name="image-off-outline"
            size={50}
            color="#999"
          />

          <Text style={styles.noMediaText}>
            No Media Available
          </Text>
        </View>
      )}

      {/* ======================================
          GRADIENT OVERLAY
      ====================================== */}

      {(hasAnyImages || hasVideo) && (
        <LinearGradient
          colors={[
            'transparent',
            'rgba(0,0,0,.15)',
            'rgba(0,0,0,.90)',
          ]}
          style={styles.overlay}>
          <Text style={styles.projectName}>
            {project?.projectName}
          </Text>

          <Text style={styles.builder}>
            By {project?.builderName}
          </Text>

          <Text style={styles.location}>
            {project?.locality}, {project?.city}
          </Text>

          <Text style={styles.price}>
            ₹ {formatPrice(project?.minPrice)} - ₹{' '}
            {formatPrice(project?.maxPrice)}
          </Text>
        </LinearGradient>
      )}

      {/* ======================================
          FAVORITE + SHARE
      ====================================== */}

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            setIsFavourite(!isFavourite)
          }>
          <Icon
            name={
              isFavourite
                ? 'heart'
                : 'heart-outline'
            }
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconButton,
            {marginLeft: 10},
          ]}
          onPress={onShare}>
          <Icon
            name="share-variant"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* ======================================
          IMAGE COUNTER
      ====================================== */}

      {hasAnyImages && images.length > 0 && (
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      )}

      {/* ======================================
          IMAGE DOTS
      ====================================== */}

      {hasAnyImages && images.length > 1 && (
        <View style={styles.dots}>
          {images.map((item, index) => (
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
      )}

      {/* ======================================
          FULL SCREEN IMAGE VIEWER
      ====================================== */}

      {images.length > 0 && (
        <ImageViewing
          images={images}
          imageIndex={currentIndex}
          visible={visible}
          onRequestClose={() => setVisible(false)}
        />
      )}

    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  image: {
    width: width,
    height: IMAGE_HEIGHT,
  },

  headerVideo: {
    width: width,
    height: IMAGE_HEIGHT,
    backgroundColor: '#000',
  },

  noMedia: {
    width: width,
    height: IMAGE_HEIGHT,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noMediaText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  },

  tabContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  activeTab: {
    backgroundColor: '#1959A2',
    borderColor: '#1959A2',
  },

  tabText: {
    marginLeft: 5,
    fontSize: 11,
    color: '#444',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#fff',
  },

  counter: {
    position: 'absolute',
    bottom: 55,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  counterText: {
    color: '#fff',
    fontWeight: '700',
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 25,
    paddingHorizontal: 18,
  },

  projectName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  builder: {
    color: '#fff',
    marginTop: 5,
  },

  location: {
    color: '#fff',
    marginTop: 4,
  },

  price: {
    color: '#fff',
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
  },

  dots: {
    position: 'absolute',
    bottom: 55,
    alignSelf: 'center',
    flexDirection: 'row',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff80',
    marginHorizontal: 3,
  },

  activeDot: {
    width: 20,
    backgroundColor: '#fff',
  },

  actionContainer: {
    position: 'absolute',
    top: 70,
    right: 15,
    flexDirection: 'row',
    zIndex: 20,
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0,0,0,.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
