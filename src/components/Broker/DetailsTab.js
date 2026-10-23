import React, {useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';


import Animated, {
  FadeInDown,
} from 'react-native-reanimated';

import Chip from '../../components/Chip';
import styles from '../../styles/AddPropertyStyle';
import { formatPrice } from '../../helpers/priceHelper';

import AsyncStorage from '@react-native-async-storage/async-storage';

const bedroomList = [
  '1 RK',
  '1 BHK',
  '2 BHK',
  '3 BHK',
  '4 BHK',
  '5+ BHK',
];

const bathroomList = [
  '1',
  '2',
  '3',
  '4',
  '5+',
];

const balconyList = [
  '0',
  '1',
  '2',
  '3',
  '4+',
];

const defaultDescription = `This property is located in a prime location with excellent connectivity. It offers modern amenities, ample parking, nearby schools, hospitals, shopping malls, and public transport. Contact us for more details or to schedule a site visit.`;

const DetailsTab = ({
  property,
  setProperty,
  nextTab,
  previousTab,
  setIsDirty,
}) => {

  const isResidentialWithRooms =
  property.listingType !== 'Builder' &&
  property.category === 'Residential' &&
  [
    'Apartment',
    'Villa',
    'Independent House',
    'Farm House',
  ].includes(property.propertyType);

  const update = (key, value) => {
  setProperty(key, value);
};

useEffect(() => {
  const loadOwnerDetails = async () => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      const userMobile = await AsyncStorage.getItem('userMobile');
      const userEmail = await AsyncStorage.getItem('userEmail');

      // Sirf Owner listing ke liye auto-fill
      if (property.listingType === 'Owner') {
        if (userName && !property.ownerName) {
          update('ownerName', userName);
        }

        if (userMobile && !property.ownerMobile) {
          update('ownerMobile', userMobile);
        }

        if (userEmail && !property.ownerEmail) {
          update('ownerEmail', userEmail);
        }
      }

       // =========================
      // PARTNER
      // =========================
      if (property.listingType === 'Partner') {
        if (userName && !property.brokerName) {
          update('brokerName', userName);
        }

        if (userMobile && !property.brokerMobile) {
          update('brokerMobile', userMobile);
        }
      }

    } catch (error) {
      console.log('Error loading owner details:', error);
    }
  };

  loadOwnerDetails();
}, [property.listingType]);


  const validate = () => {

  if (!property.title.trim()) {
    alert('Enter Property Title');
    return;
  }

  if (!property.price.trim()) {
    alert('Enter Price');
    return;
  }

  nextTab();
};

  return (

    <KeyboardAvoidingView
  style={{flex: 1}}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}>
    <Animated.ScrollView
      entering={FadeInDown.duration(350)}
      contentContainerStyle={{
        padding:15,
        paddingBottom:150,
      }}>

      {/* Property Title */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Property Title
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex. Luxury 3 BHK Apartment"
          value={property.title}
          onChangeText={text =>
            update('title', text)
          }
        />

      </View>

      {/* Description */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Description
        </Text>

       <TextInput
            multiline
            numberOfLines={5}
            style={[
              styles.input,
              {
                height: 120,
                textAlignVertical: 'top',
              },
            ]}
            value={property.description || defaultDescription}
            onChangeText={text => update('description', text)}
          />  
      </View>

    {/* Price & Rental Details */}
{property.listingType !== 'Builder' && (
<View style={styles.card}>

  {/* Price / Rent Amount */}
  <Text style={styles.title}>
    {property.purpose === 'Rent' ? 'Rent Amount' : 'Price'}
  </Text>

  <TextInput
    style={styles.input}
    keyboardType="numeric"
    placeholder={
      property.purpose === 'Rent'
        ? 'Enter Rent Amount'
        : 'Enter Price'
    }
    value={property.price}
    onChangeText={text => update('price', text)}
  />

  {property.price ? (
    <Text
      style={{
        marginTop: 8,
        color: '#0A7C3B',
        fontSize: 12,
        fontWeight: '600',
      }}>
      ₹ {formatPrice(property.price)}
      {property.purpose === 'Rent' ? ' / Month' : ''}
    </Text>
  ) : null}

  {property.purpose === 'Rent' && (
    <>
      {/* Maintenance Amount */}
      <Text style={[styles.title, {marginTop: 18}]}>
        Maintenance Amount
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter Maintenance Amount"
        value={property.maintenanceAmount}
        onChangeText={text => update('maintenanceAmount', text)}
      />

      {property.maintenanceAmount ? (
        <Text
          style={{
            marginTop: 8,
            color: '#0A7C3B',
            fontSize: 12,
            fontWeight: '600',
          }}>
          ₹ {formatPrice(property.maintenanceAmount)}
        </Text>
      ) : null}

      {/* Security Amount */}
      <Text style={[styles.title, {marginTop: 18}]}>
        Security Amount
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter Security Amount"
        value={property.securityAmount}
        onChangeText={text => update('securityAmount', text)}
      />

      {property.securityAmount ? (
        <Text
          style={{
            marginTop: 8,
            color: '#0A7C3B',
            fontSize: 12,
            fontWeight: '600',
          }}>
          ₹ {formatPrice(property.securityAmount)}
        </Text>
      ) : null}

      {/* Locking Period */}
      <Text style={[styles.title, {marginTop: 18}]}>
        Locking Period
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter Locking Period (Months)"
        value={property.lockingPeriod}
        onChangeText={text => update('lockingPeriod', text)}
      />

      {property.lockingPeriod ? (
        <Text
          style={{
            marginTop: 8,
            color: '#0A7C3B',
            fontSize: 12,
            fontWeight: '600',
          }}>
          {property.lockingPeriod} Months
        </Text>
      ) : null}

      {/* Family Type */}
<Text style={[styles.title, {marginTop: 18}]}>
  Family Type
</Text>

<View style={styles.chipContainer}>

  {['Only Family', 'Only Students', 'Any One'].map(type => (
    <TouchableOpacity
      key={type}
      style={[
        styles.chip,
        property.familyType === type && styles.chipSelected,
      ]}
      onPress={() => update('familyType', type)}
      activeOpacity={0.8}>
      <Text
        style={[
          styles.chipText,
          property.familyType === type && styles.chipTextSelected,
        ]}>
        {type === 'Any One'
          ? 'Any One (Family & Students)'
          : type}
      </Text>
    </TouchableOpacity>
  ))}

</View>

<Text style={[styles.title, {marginTop: 18}]}>
  Available From
</Text>

<TextInput
  style={styles.input}
  placeholder="DD/MM/YYYY"
  value={property.availableFrom || ''}
  onChangeText={text => update('availableFrom', text)}
/>

    </>
  )}

</View>
)}


{/* =======================================================
    FURNISHING TYPE
======================================================= */}
<View style={styles.card}>
<Text style={[styles.title, {marginTop: 18}]}>
  Furnishing Type
</Text>

<View style={styles.chipContainer}>
  {['Full Furnished', 'Semi Furnished', 'Non Furnished'].map(type => (
    <TouchableOpacity
      key={type}
      style={[
        styles.chip,
        property.furnishingType === type &&
          styles.chipSelected,
      ]}
      onPress={() =>
        update('furnishingType', type)
      }
      activeOpacity={0.8}>

      <Text
        style={[
          styles.chipText,
          property.furnishingType === type &&
            styles.chipTextSelected,
        ]}>
        {type}
      </Text>

    </TouchableOpacity>
  ))}
</View>
 </View>

{/* SALE ONLY DETAILS */}
{property.purpose === 'Sale' && property.listingType !== 'Builder' && (
  <View style={styles.card}>

    {/* JDA Approved */}
    <Text style={styles.title}>
      JDA Approved
    </Text>

    <View style={styles.chipContainer}>
      {['Yes', 'No'].map(item => (
        <TouchableOpacity
          key={item}
          style={[
            styles.chip,
            property.jdaApproved === item && styles.chipSelected,
          ]}
          onPress={() => update('jdaApproved', item)}
        >
          <Text
            style={[
              styles.chipText,
              property.jdaApproved === item &&
                styles.chipTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Facing */}
    <Text style={[styles.title, {marginTop: 18}]}>
      Facing
    </Text>

    <View style={styles.chipContainer}>
      {['East', 'West', 'North', 'South'].map(item => (
        <TouchableOpacity
          key={item}
          style={[
            styles.chip,
            property.facing === item && styles.chipSelected,
          ]}
          onPress={() => update('facing', item)}
        >
          <Text
            style={[
              styles.chipText,
              property.facing === item &&
                styles.chipTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

  </View>
)}


      {/* Area */}

      {/* Area Details */}
{property.listingType !== 'Builder' && (
<View style={styles.card}>

  <Text style={styles.title}>
    Area Details
  </Text>

  {/* Area */}

  <TextInput
    style={styles.input}
    keyboardType="numeric"
    placeholder="Area (Sq.Ft.)"
    placeholderTextColor="#999"
    value={property.area}
    onChangeText={text => update('area', text)}
  />

</View>
)}


      {/* Residential Only */}

    {isResidentialWithRooms && (
        <View style={styles.card}>
          <Text style={styles.title}>
            Bedrooms
          </Text>

          <View style={styles.rowWrap}>

            {bedroomList.map(item => (

              <Chip
                key={item}
                label={item}
                selected={
                  property.bedrooms === item
                }
                onPress={() =>
                  update(
                    'bedrooms',
                    item,
                  )
                }
              />

            ))}

          </View>

          <Text
            style={[
              styles.title,
              {
                marginTop:20,
              },
            ]}>
            Bathrooms
          </Text>

          <View style={styles.rowWrap}>

            {bathroomList.map(item => (

              <Chip
                key={item}
                label={item}
                selected={
                  property.bathrooms === item
                }
                onPress={() =>
                  update(
                    'bathrooms',
                    item,
                  )
                }
              />

            ))}

          </View>

<Text
  style={[
    styles.title,
    {
      marginTop: 20,
    },
  ]}>
  Balconies
</Text>

<View style={styles.rowWrap}>
  {balconyList.map(item => (
    <Chip
      key={item}
      label={item}
      selected={property.balconies === item}
      onPress={() => update('balconies', item)}
    />
  ))}
</View>

        </View>

      )}

      {/* Part-2 Starts From Here */}
            {/* Location Details */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Property Location
        </Text>

        <TextInput
          style={styles.input}
          placeholder="State"
          placeholderTextColor="#999"
          value={property.state}
          onChangeText={text =>
            update('state', text)
          }
        />

        <TextInput
          style={[
            styles.input,
            {marginTop:15},
          ]}
          placeholder="City"
          placeholderTextColor="#999"
          value={property.city}
          onChangeText={text =>
            update('city', text)
          }
        />

        <TextInput
          style={[
            styles.input,
            {marginTop:15},
          ]}
          placeholder="Locality / Area"
          placeholderTextColor="#999"
          value={property.locality}
          onChangeText={text =>
            update('locality', text)
          }
        />

        <TextInput
          style={[
            styles.input,
            {marginTop:15},
          ]}
          placeholder="Landmark"
          placeholderTextColor="#999"
          value={property.landmark}
          onChangeText={text =>
            update('landmark', text)
          }
        />

        <TextInput
          multiline
          numberOfLines={3}
          style={[
            styles.input,
            {
              marginTop:15,
              height:90,
              textAlignVertical:'top',
            },
          ]}
          placeholder="Nearby Places (School, Hospital, Metro, Mall...)"
          placeholderTextColor="#999"
          value={property.nearBy}
          onChangeText={text =>
            update('nearBy', text)
          }
        />

      </View>

      {/* Amenities */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Amenities
        </Text>

        <View style={styles.rowWrap}>

          {[
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
          ].map(item => (

            <Chip
              key={item}
              label={item}
              selected={
                property.amenities.includes(item)
              }
              onPress={() => {

                let amenities = [
                  ...property.amenities,
                ];

                if (
                  amenities.includes(item)
                ) {

                  amenities =
                    amenities.filter(
                      x => x !== item,
                    );

                } else {

                  amenities.push(item);

                }

                update(
                  'amenities',
                  amenities,
                );

              }}
            />

          ))}

        </View>

      </View>

   

      {/* Part-3 Starts Here */}
            {/* Owner Details */}

      {property.listingType === 'Owner' && (

  <View style={styles.card}>

    <Text style={styles.title}>
     Owner Information
     </Text>

    <TextInput
      style={styles.input}
      placeholder="Owner Name"
      placeholderTextColor="#999"
      value={property.ownerName}
      onChangeText={text =>
        update('ownerName', text)
      }
    />

    <TextInput
      style={[styles.input, {marginTop: 15}]}
      placeholder="Mobile Number"
      placeholderTextColor="#999"
      keyboardType="phone-pad"
      value={property.ownerMobile}
      onChangeText={text =>
        update('ownerMobile', text)
      }
    />

    <TextInput
      style={[styles.input, {marginTop: 15}]}
      placeholder="Email Address"
      placeholderTextColor="#999"
      keyboardType="email-address"
      value={property.ownerEmail}
      onChangeText={text =>
        update('ownerEmail', text)
      }
    />

  </View>
)}

      {/* Partner Details */}

      {property.listingType === 'Partner' && (

        <View style={styles.card}>

          <Text style={styles.title}>
             Partner Information
          </Text>

          <TextInput
           style={[ styles.input, {
                                    backgroundColor: '#7c7d85',
                                    color: '#FFFFFF',
                                  },
                                ]}
            placeholder="Partner Name"
            placeholderTextColor="#999"
            value={property.brokerName}
            editable={false}
          />
          <TextInput
             style={[ styles.input, {
                                    backgroundColor: '#7c7d85',
                                    color: '#FFFFFF',
                                  },
                                ]}
            placeholder="Mobile Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={property.brokerMobile}
            editable={false}
          />
        

        </View>

      )}

      {/* Ask Question to partner for sharing owner informaiton */}

  {/* ASK A QUESTION TO PARTNER */}
{property.listingType === 'Partner' && (
  <View style={styles.card}>

    <Text style={styles.title}>
      Ask a Question to Partner
    </Text>

    <Text style={{fontSize: 13, marginBottom: 10}}>
      Share Property Owner's Information ?
    </Text>

    <View style={styles.chipContainer}>
      {['Yes', 'No'].map(item => (
        <TouchableOpacity
          key={item}
          style={[
            styles.chip,
            property.shareOwnerNumber === item &&
              styles.chipSelected,
          ]}
          onPress={() =>
            update('shareOwnerNumber', item)
          }
          activeOpacity={0.8}>

          <Text
            style={[
              styles.chipText,
              property.shareOwnerNumber === item &&
                styles.chipTextSelected,
            ]}>
            {item}
          </Text>

        </TouchableOpacity>
      ))}
    </View>

    {/* OWNER DETAILS */}
    {property.shareOwnerNumber === 'Yes' && (
      <>
        <Text style={[styles.title, {marginTop: 18}]}>
          Owner Details
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Owner Name"
          placeholderTextColor="#999"
          value={property.partnerOwnerName || ''}
          onChangeText={text =>
            update('partnerOwnerName', text)
          }
        />

        <TextInput
          style={[
            styles.input,
            {marginTop: 15},
          ]}
          placeholder="Owner Mobile Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={property.partnerOwnerMobile || ''}
          onChangeText={text =>
            update('partnerOwnerMobile', text)
          }
        />
      </>
    )}

  </View>
)}



      {/* Bottom Buttons */}

     {/* =======================================================
    BOTTOM BUTTONS
======================================================= */}
<View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    paddingBottom: 30,
  }}>

  {/* PREVIOUS */}
  <TouchableOpacity
    style={styles.previousButton}
    onPress={previousTab}
    activeOpacity={0.8}>

    <Text style={styles.previousText}>
      ← Previous
    </Text>

  </TouchableOpacity>

  {/* NEXT */}
  <TouchableOpacity
    style={styles.nextButton}
    onPress={validate}
    activeOpacity={0.8}>

    <Text style={styles.nextText}>
      Next →
    </Text>

  </TouchableOpacity>

</View>

    </Animated.ScrollView>
</KeyboardAvoidingView>
  );

};

export default React.memo(DetailsTab);