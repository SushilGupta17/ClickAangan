import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import {formatPrice} from '../../helpers/priceHelper';
import ProjectImageSlider from './ProjectImageSlider';
import PropImageRotator from '../../components/PropImgRotator';

const API_URL = 'https://savariyaproperty.in/';
const API_URL1 = 'http://192.168.1.3:7045';

const ProjectCard = ({item, navigation}) => {
const isVilla =
  item.propertyType?.toLowerCase() === "villa project";

  return (
   
   <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation &&
        navigation.navigate('ProjectDetails', {
          project: item
        })
      }>

<PropImageRotator
  images={ item.images
  ? item.images.split(',').map(x =>
      `${API_URL}/${x.trim().replace(/\\/g, '/')}`
    )
  : []} />
      
      <View style={styles.statusRow}>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.projectStatus} 
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

      <View style={styles.body}>

        <Text
          numberOfLines={1}
          style={styles.projectName}>
          {item.projectName}
        </Text>

        <Text style={styles.builder}>
          By {item.builderName}
        </Text>

        <View style={styles.locationRow}>

          <Icon
            name="map-marker-alt"
            color="#FF5722"
            size={13}
          />

          <Text
            numberOfLines={1}
            style={styles.location}>

            {item.locality}, {item.city}

          </Text>

        </View>

        <View style={styles.priceRow}>

          <Text style={styles.price}>

            ₹ {formatPrice(item.minPrice)}
            {"  "}
            -

            {"  "}
            ₹ {formatPrice(item.maxPrice)}

          </Text>

        </View>

        

       

        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() =>
            navigation.navigate(
              'ProjectDetails',
              {
                project: item,
              },
            )
          }>

          <Text style={styles.detailsText}>
            View Project Details
          </Text>

        </TouchableOpacity>

      </View>

    </TouchableOpacity>

  );

};

export default ProjectCard;

const styles = StyleSheet.create({

  card:{
    margin:12,
    backgroundColor:"#FFF",
    borderRadius:18,
    overflow:"hidden",
    elevation:5
  },

  body:{
    padding:15
  },

  statusRow:{
    position:"absolute",
    top:15,
    left:15,
    right:15,
    flexDirection:"row",
    justifyContent:"space-between"
  },

  statusBadge:{
    backgroundColor:"#28A745",
    paddingHorizontal:12,
    paddingVertical:6,
    borderRadius:20
  },

  statusText:{
    color:"#FFF",
    fontWeight:"700",
    fontSize:12
  },

  reraBadge:{
    flexDirection:"row",
    backgroundColor:"#FFF",
    paddingHorizontal:10,
    paddingVertical:6,
    borderRadius:20,
    alignItems:"center"
  },

  reraText:{
    marginLeft:5,
    fontSize:11,
    fontWeight:"700"
  },

  projectName:{
    fontSize:20,
    fontWeight:"700",
    color:"#222"
  },

  builder:{
    marginTop:4,
    color:"#666",
    fontSize:14
  },

  locationRow:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:10
  },

  location:{
    marginLeft:8,
    color:"#555",
    flex:1
  },

  priceRow:{
    marginTop:14
  },

  price:{
    fontSize:14,
    color:"#555",
    fontWeight:"bold"
  },

  unitRow:{
    marginTop:15
  },

  unitChip:{
    backgroundColor:"#EEF5FF",
    alignSelf:"flex-start",
    paddingHorizontal:14,
    paddingVertical:7,
    borderRadius:20
  },

  unitText:{
    color:"#555",
    fontWeight:"700"
  },

  infoRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:15
  },

  infoBox:{
    width:"31%",
    backgroundColor:"#F8F8F8",
    borderRadius:12,
    padding:12,
    alignItems:"center"
  },

  infoTitle:{
    marginTop:6,
    color:"#777",
    fontSize:12
  },

  infoValue:{
    marginTop:4,
    fontWeight:"350",
    fontSize:12
  },

  actionRow:{
    flexDirection:"row",
    justifyContent:"space-around",
    marginTop:20
  },

  iconBtn:{
    width:46,
    height:46,
    borderRadius:23,
    backgroundColor:"#F4F6F8",
    justifyContent:"center",
    alignItems:"center"
  },

  detailsBtn:{
    marginTop:18,
    backgroundColor:"#102a47",
    paddingVertical:14,
    borderRadius:10
  },

  detailsText:{
    color:"#FFF",
    textAlign:"center",
    fontWeight:"700",
    fontSize:15
  }

});