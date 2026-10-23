import React, {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AvailableUnits from './AvailableUnits';
import Chip from '../Chip';
import styles from '../../styles/AddPropertyStyle';

const projectStatus = [
  'Ready to Move',
  'New Launch',
  'Under Construction',
];

const unitTypes = [
  '1 BHK',
  '2 BHK',
  '3 BHK',
  '4 BHK',
  'Villa',
  'Plot',
  'Office',
  'Shop',
];

const amenitiesList = [
  'Parking',
            'Lift',
            'Power Backup',
            'Security',
            'CCTV',
            'Garden',
            'Gym',
            'Swimming Pool',
            'Club House',
            'Kids Play Area',
            'Temple',
            'Park',
            'Visitor Parking',
            'WiFi',
            'Intercom',
            'Rain Water Harvesting',
];

const ProjectDetailsTab = ({
  property,
  setProperty,
  nextTab,
  previousTab,
}) => {

  const update = (key, value) => {
    setProperty(key, value);
  };

  const toggleAmenity = item => {

    let data = [...property.amenities];

    if (data.includes(item)) {
      data = data.filter(x => x !== item);
    } else {
      data.push(item);
    }

    update('amenities', data);
  };

  useEffect(() => {
  const loadBuilderDetails = async () => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      const userMobile = await AsyncStorage.getItem('userMobile');
      const userEmail = await AsyncStorage.getItem('userEmail');

      if (property.listingType === 'Builder') {
        if (userName && !property.contactPerson) {
          update('contactPerson', userName);
        }

        if (userMobile && !property.contactMobile) {
          update('contactMobile', userMobile);
        }

        if (userEmail && !property.contactEmail) {
          update('contactEmail', userEmail);
        }
      }
    } catch (error) {
      console.log('Error loading builder details:', error);
    }
  };

  loadBuilderDetails();
}, [property.listingType]);


  const validate = () => {

    if (!property.projectName?.trim()) {
      alert('Enter Project Name');
      return;
    }

    if (!property.projectStatus) {
      alert('Select Project Status');
      return;
    }

    nextTab();
  };

  return (

    <Animated.ScrollView
      entering={FadeInDown.duration(350)}
      contentContainerStyle={{
        padding:15,
        paddingBottom:150,
      }}>


      {/* Project Information */}

      <View style={styles.card}>

  <Text style={styles.title}>
    Project Information
  </Text>

<TextInput
    style={styles.input}
    placeholder="Project Name (Heading / Title)"
    placeholderTextColor="#999"
    value={property.projectName}
    onChangeText={text => update('projectName', text)}
  />

  <TextInput
    
    style={[styles.input,{marginTop:15}]}
    placeholder="Builder Name"
    placeholderTextColor="#999"
    value={property.builderName}
    onChangeText={text => update('builderName', text)}
  />

  <TextInput
    style={[styles.input,{marginTop:15}]}
    placeholder="RERA Number"
    placeholderTextColor="#999"
    value={property.reraNumber}
    onChangeText={text => update('reraNumber', text)}
  />

  <TextInput
    style={[styles.input,{marginTop:15}]}
    placeholder="Contact Person"
    placeholderTextColor="#999"
    value={property.contactPerson}
    onChangeText={text => update('contactPerson', text)}
  />

  <TextInput
    style={[styles.input,{marginTop:15}]}
    placeholder="Mobile Number"
    placeholderTextColor="#999"
    keyboardType="phone-pad"
    maxLength={10}
    value={property.contactMobile}
    onChangeText={text => update('contactMobile', text)}
  />

  <TextInput
    style={[styles.input,{marginTop:15}]}
    placeholder="Email Address"
    placeholderTextColor="#999"
    keyboardType="email-address"
    autoCapitalize="none"
    value={property.contactEmail}
    onChangeText={text => update('contactEmail', text)}
  />

</View>

{property.listingType !== 'Builder' && (
      <View style={styles.card}>

        <Text style={styles.title}>
          Project Information
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Project Name"
          placeholderTextColor="#999"
          value={property.projectName}
          onChangeText={text => update('projectName', text)}
        />

        <TextInput
          style={[styles.input,{marginTop:15}]}
          placeholder="Builder Name"
          placeholderTextColor="#999"
          value={property.builderName}
          onChangeText={text => update('builderName', text)}
        />

        <TextInput
          style={[styles.input,{marginTop:15}]}
          placeholder="RERA Number"
          placeholderTextColor="#999"
          value={property.builderRera}
          onChangeText={text => update('builderRera', text)}
        />

      </View>
)}

      {/* Project Status */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Project Status
        </Text>

        <View style={styles.rowWrap}>

          {projectStatus.map(item => (

            <Chip
              key={item}
              label={item}
              selected={property.projectStatus === item}
              onPress={() => update('projectStatus', item)}
            />

          ))}

        </View>

      </View>

      {/* Project Size */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Project Details
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Project Area (Acres)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={property.projectArea}
          onChangeText={text => update('projectArea', text)}
        />
      <TextInput
          style={[styles.input, {marginTop: 15}]}
          placeholder="Minimum Price"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={property.minPrice}
          onChangeText={text =>
            update('minPrice', text.replace(/[^0-9]/g, ''))
          }
        />

        <TextInput
          style={[styles.input, {marginTop: 15}]}
          placeholder="Maximum Price"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={property.maxPrice}
          onChangeText={text =>
            update('maxPrice', text.replace(/[^0-9]/g, ''))
          }
        />

{property.propertyType === 'Apartment Project' && (
  <>
    <TextInput
      style={[styles.input, {marginTop: 15}]}
      placeholder="Total Towers"
      placeholderTextColor="#999"
      keyboardType="numeric"
      value={property.totalTowers}
      onChangeText={text => update('totalTowers', text)}
    />

    <TextInput
      style={[styles.input, {marginTop: 15}]}
      placeholder="Total Floors"
      placeholderTextColor="#999"
      keyboardType="numeric"
      value={property.totalFloors}
      onChangeText={text => update('totalFloors', text)}
    />

    <TextInput
      style={[styles.input, {marginTop: 15}]}
      placeholder="Total Units"
      placeholderTextColor="#999"
      keyboardType="numeric"
      value={property.totalUnits}
      onChangeText={text => update('totalUnits', text)}
    />

    <TextInput
      style={[styles.input, {marginTop: 15}]}
      placeholder="Possession Date"
      placeholderTextColor="#999"
      value={property.possessionDate}
      onChangeText={text => update('possessionDate', text)}
    />
  </>
)}

      </View>

    

     {/* Unit Types */}

{property.propertyType === 'Apartment Project' && (
  <View style={styles.card}>
    <Text style={styles.title}>
      Available Unit Types
    </Text>

    <View style={styles.card}>
      <AvailableUnits
        property={property}
        setProperty={setProperty}
      />
    </View>
  </View>
)}

      {/* Amenities */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Project Amenities
        </Text>

        <View style={styles.rowWrap}>

          {amenitiesList.map(item => (

            <Chip
              key={item}
              label={item}
              selected={property.amenities.includes(item)}
              onPress={() => toggleAmenity(item)}
            />

          ))}

        </View>

      </View>

{/* Project Location */}

<View style={styles.card}>

  <Text style={styles.title}>
    Project Location
  </Text>

  <TextInput
    style={styles.input}
    placeholder="State"
    placeholderTextColor="#999"
    value={property.state}
    onChangeText={text => update('state', text)}
  />

  <TextInput
    style={[styles.input, {marginTop: 15}]}
    placeholder="City"
    placeholderTextColor="#999"
    value={property.city}
    onChangeText={text => update('city', text)}
  />

  <TextInput
    style={[styles.input, {marginTop: 15}]}
    placeholder="Locality / Area"
    placeholderTextColor="#999"
    value={property.locality}
    onChangeText={text => update('locality', text)}
  />

  <TextInput
    style={[styles.input, {marginTop: 15}]}
    placeholder="Nearby Landmark"
    placeholderTextColor="#999"
    value={property.nearBy}
    onChangeText={text => update('nearBy', text)}
  />

  <TextInput
    style={[styles.input, {marginTop: 15}]}
    placeholder="Project Address"
    placeholderTextColor="#999"
    multiline
    numberOfLines={3}
    value={property.address}
    onChangeText={text => update('address', text)}
  />

</View>

      {/* Description */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Project Highlights
        </Text>

        <TextInput
          multiline
          numberOfLines={5}
          style={[
            styles.input,
            {
              height:120,
              textAlignVertical:'top',
            },
          ]}
          placeholder="Write Project Highlights..."
          placeholderTextColor="#999"
          value={property.projectHighlights}
          onChangeText={text => update('projectHighlights', text)}
        />

      </View>

      {/* Buttons */}

      <View
        style={{
          flexDirection:'row',
          justifyContent:'space-between',
          marginTop:25,
          marginBottom:40,
        }}>

        <TouchableOpacity
          style={styles.previousButton}
          onPress={previousTab}>

          <Text style={styles.previousText}>
            ← Previous
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={validate}>

          <Text style={styles.nextText}>
            Next →
          </Text>

        </TouchableOpacity>

      </View>

    </Animated.ScrollView>

  );

};

export default React.memo(ProjectDetailsTab);