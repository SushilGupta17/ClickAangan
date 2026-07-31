import React, {useMemo, useState} from 'react';
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

const {width} = Dimensions.get('window');

const API_URL = 'http://192.168.1.3:7045';

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

  //------------------------------------------------

  const images = useMemo(() => {

  switch (selectedTab) {

    case 'Apartment':

      return [

        ...(project?.coverImage
          ? [{
              uri: `${API_URL}${project.coverImage.replace(/\\/g, '/')}`,
            }]
          : []),

        ...(project?.images || [])
          .filter(x => x.imageType === 'Apartment')
          .map(x => ({
            uri: `${API_URL}${x.imageUrl.replace(/\\/g, '/')}`,
          })),

      ];

    case 'FloorPlan':

      return (project?.images || [])
        .filter(x => x.imageType === 'FloorPlan')
        .map(x => ({
          uri: `${API_URL}${x.imageUrl.replace(/\\/g, '/')}`,
        }));

    case 'MasterPlan':

      return project?.masterPlan
        ? [{
            uri: `${API_URL}${project.masterPlan.replace(/\\/g, '/')}`,
          }]
        : [];

    case 'Other':

      return (project?.images || [])
        .filter(x => x.imageType === 'Other')
        .map(x => ({
          uri: `${API_URL}${x.imageUrl.replace(/\\/g, '/')}`,
        }));

    default:

      return [];

  }

}, [project, selectedTab]);



const onShare = async () => {

  try {

    await Share.open({

      title: project.projectName,

      message:
        `${project.projectName}

${project.builderName}

${project.locality}, ${project.city}

₹ ${project.minPrice?.toLocaleString()} - ₹ ${project.maxPrice?.toLocaleString()}


https://savariyaproperty.in`,

    });

  } catch (e) {

    console.log(e);

  }

};

  //------------------------------------------------

  const renderItem = ({item, index}) => (

    <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => {

            setCurrentIndex(index);

            setVisible(true);

        }}>

        <FastImage
            source={{uri:item.uri}}
            resizeMode={FastImage.resizeMode.cover}
            style={styles.image}
        />

    </TouchableOpacity>

);

  //------------------------------------------------
return (
  <View>

<ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.tabContainer}>

    {/* Tabs */}
{
tabs.map(tab=>{

let count = 0;

switch (tab.id) {

  case 'Apartment':

    count =
      (project?.images || [])
        .filter(x => x.imageType === 'Apartment')
        .length;

    if (project?.coverImage) {
      count++;
    }

    break;

  case 'FloorPlan':

    count =
      (project?.images || [])
        .filter(x => x.imageType === 'FloorPlan')
        .length;

    break;

  case 'MasterPlan':

    count = project?.masterPlan ? 1 : 0;

    break;

  case 'Other':

    count =
      (project?.images || [])
        .filter(x => x.imageType === 'Other')
        .length;

    break;
}

return(

<TouchableOpacity
key={tab.id}
style={[
styles.tab,
selectedTab===tab.id&&styles.activeTab
]}
onPress={()=>{

setSelectedTab(tab.id);

setCurrentIndex(0);

}}>

<Icon

name={tab.icon}

size={18}

color={
selectedTab===tab.id
?"#fff"
:"#444"
}

/>

<Text
style={[
styles.tabText,
selectedTab===tab.id&&styles.activeTabText
]}>

{tab.title} ({count})

</Text>

</TouchableOpacity>

);

})


}


</ScrollView>

    {/* Image Slider */}
                <FlatList
                  key={selectedTab}          
                  data={images}
                  extraData={selectedTab}
                  horizontal
                  pagingEnabled
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(event) => {
                    const index = Math.round(
                      event.nativeEvent.contentOffset.x / width,
                    );
                    setCurrentIndex(index);
                  }}
                />


{/* <View style={styles.typeBadge}>

    <Text style={styles.typeText}>

        {selectedTab === "Apartment"
            ? "Photos"
            : selectedTab === "FloorPlan"
            ? "Floor Plan"
            : selectedTab === "MasterPlan"
            ? "Master Plan"
            : "Other"}

    </Text>

</View> */}


    {/* Gradient Overlay */}
  <LinearGradient
    colors={[
        'transparent',
        'rgba(0,0,0,.15)',
        'rgba(0,0,0,.90)'
    ]}
    style={styles.overlay}>

    <Text style={styles.projectName}>
        {project.projectName}
    </Text>

    <Text style={styles.builder}>
        By {project.builderName}
    </Text>

    <Text style={styles.location}>
        {project.locality}, {project.city}
    </Text>

    <Text style={styles.price}>

        ₹ {project.minPrice?.toLocaleString()}
        {'  -  '}
        ₹ {project.maxPrice?.toLocaleString()}

    </Text>

</LinearGradient>

  <View style={styles.actionContainer}>

    <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setIsFavourite(!isFavourite)}>

        <Icon
            name={isFavourite ? "heart" : "heart-outline"}
            size={24}
            color="#fff"
        />

    </TouchableOpacity>

    <TouchableOpacity
        style={[styles.iconButton,{marginLeft:10}]}
        onPress={onShare}>

        <Icon
            name="share-variant"
            size={24}
            color="#fff"
        />

    </TouchableOpacity>

</View>

    {/* Image Counter */}
    <View style={styles.counter}>
         <Text style={styles.counterText}>
              {
              images.length===0
              ?
              "0 / 0"
              :
              `${currentIndex+1} / ${images.length}`
              }
        </Text>
    </View>

    {/* Dots */}
    <View style={styles.dots}>
      {images.map((item, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentIndex === index && styles.activeDot,
          ]}
        />
      ))}
    </View>

    {/* 👇 सबसे आखिर में */}
    <ImageViewing
      images={images}
      imageIndex={currentIndex}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    />

  </View>
);
};

export default ImageCarousel;

const styles = StyleSheet.create({

  image: {
    width: width,
    height: IMAGE_HEIGHT,
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
    marginTop: 3,
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

  overlay:{
    position:'absolute',
    left:0,
    right:0,
    bottom:25,
    paddingHorizontal:18,
},

projectName:{
    color:'#fff',
    fontSize:22,
    fontWeight:'700',
},

builder:{
    color:'#fff',
    marginTop:5,
},

price:{
    color:'#fff',
    marginTop:8,
    fontSize:18,
    fontWeight:'700',
},



dots:{
    position:'absolute',
    bottom:55,
    alignSelf:'center',
    flexDirection:'row',
},

dot:{
    width:8,
    height:8,
    borderRadius:4,
    backgroundColor:'#ffffff80',
    marginHorizontal:3,
},

activeDot:{
    width:20,
    backgroundColor:'#fff',
},

typeBadge: {
    position: 'absolute',
    top: 20,
    left: 15,
    backgroundColor: '#1959A2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
},

typeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
},

actionContainer: {
    position: 'absolute',
    top: 70,      // pehle 18 tha
    right: 15,
    flexDirection: 'row',
    zIndex: 20,
},

iconButton:{
    width:46,
    height:46,
    borderRadius:23,
    backgroundColor:'rgba(0,0,0,.55)',
    justifyContent:'center',
    alignItems:'center',
},

});
