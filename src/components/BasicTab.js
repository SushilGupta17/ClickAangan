import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import Animated, {
  FadeInDown,
} from 'react-native-reanimated';

import Chip from './Chip';
import styles from '../styles/AddPropertyStyle';

const propertyTypes = [
  'Apartment',
  'Villa',
  'Independent House',
  'Plot',
  'Farm House',
  'Office',
  'Shop',
  'Showroom',
  'Warehouse',
];

const builderProjectTypes = [
  'Residential Project',
  'Commercial Project',
  'Township',
  'Villa Project',
  'Plots Project',
];

const BasicTab = ({
  property,
  setProperty,
  nextTab,
}) => {

  const update = (key, value) => {
  setProperty(key, value);
};


  const validate = () => {

    if (!property.listingType) {
      alert('Please select Listing Type');
      return;
    }

    if (!property.category) {
      alert('Please select Category');
      return;
    }

    if (!property.purpose) {
      alert('Please select Purpose');
      return;
    }

    if (!property.propertyType) {
      alert('Please select Property Type');
      return;
    }

    nextTab();
  };

  return (

    <Animated.ScrollView
      entering={FadeInDown.duration(400)}
      contentContainerStyle={{
        padding:15,
        paddingBottom:150,
      }}>

      {/* Listing Type */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Who are you?
        </Text>

     <View style={styles.rowWrap}>
  <Chip
    label="🏠 Owner"
    selected={property.listingType === "Owner"}
    onPress={() => update("listingType", "Owner")}
  />

  <Chip
    label="🤝 Broker"
    selected={property.listingType === "Broker"}
    onPress={() => update("listingType", "Broker")}
  />

  <Chip
    label="🏗️ Builder"
    selected={property.listingType === "Builder"}
    onPress={() => update("listingType", "Builder")}
  />
</View>

      </View>

      {/* Category */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Property Category
        </Text>

        <View style={styles.rowWrap}>

          <Chip
            label="Residential"
            selected={
              property.category==="Residential"
            }
            onPress={()=>
              update(
                'category',
                'Residential'
              )
            }
          />

          <Chip
            label="Commercial"
            selected={
              property.category==="Commercial"
            }
            onPress={()=>
              update(
                'category',
                'Commercial'
              )
            }
          />

        </View>

      </View>

      {/* Purpose */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Property Purpose
        </Text>

        <View style={styles.rowWrap}>

         <Chip
              label="Sale"
              selected={property.purpose === "Sale"}
              onPress={() => update("purpose", "Sale")}
            />

          <Chip
            label="Rent"
            selected={property.purpose === "Rent"}
            onPress={() => update("purpose", "Rent")}
          />

          {property.listingType === "Builder" && (
            <Chip
              label="Project"
              selected={property.purpose === "Project"}
              onPress={() => update("purpose", "Project")}
            />
          )}

        </View>

      </View>

      {/* Property Type */}
            <View style={styles.card}>

        <Text style={styles.title}>
          Property Type
        </Text>

        <View style={styles.rowWrap}>

      {(property.listingType === "Builder"
  ? builderProjectTypes
  : propertyTypes
).map(item => (
  <Chip
    key={item}
    label={item}
    selected={property.propertyType === item}
    onPress={() => update("propertyType", item)}
  />
))}

        </View>

      </View>

   

      {/* Broker Information */}

      {property.listingType === 'Broker' && (

        <View style={styles.card}>

          <Text style={styles.title}>
            Broker Information
          </Text>

          <Text
            style={{
              color:'#666',
              lineHeight:22,
              fontSize:13,
            }}>

            In the next step you will enter:

            {'\n'}• Broker Name

            {'\n'}• Company Name

            {'\n'}• Mobile Number

            {'\n'}• Email

            {'\n'}• RERA Number

          </Text>

        </View>

      )}

      {/* Owner Information */}

      {property.listingType === 'Owner' && (

        <View style={styles.card}>

          <Text style={styles.title}>
            Owner Information
          </Text>

          <Text
            style={{
              color:'#666',
              lineHeight:22,
              fontSize:13,
            }}>

            In the next step you will enter:

            {'\n'}• Owner Name

            {'\n'}• Mobile Number

            {'\n'}• Email Address

          </Text>

        </View>

      )}

{property.listingType === 'Builder' && (

  <View style={styles.card}>

    <Text style={styles.title}>
      Builder Information
    </Text>

    <Text
      style={{
        color: '#666',
        lineHeight: 22,
        fontSize: 13,
      }}>

      In the next step you will enter:

      {'\n'}• Builder Name

      {'\n'}• Company Name

      {'\n'}• Project Name

      {'\n'}• RERA Number

      {'\n'}• Contact Person

      {'\n'}• Mobile Number

      {'\n'}• Email Address

    </Text>

  </View>

)}

      <TouchableOpacity
        style={styles.nextButton}
        activeOpacity={0.8}
        onPress={validate}>

        <Text style={styles.nextText}>
          Next →
        </Text>

      </TouchableOpacity>

    </Animated.ScrollView>

  );

};

export default React.memo(BasicTab);