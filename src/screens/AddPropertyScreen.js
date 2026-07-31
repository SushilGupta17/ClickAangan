import React, {useState, useEffect } from 'react';
import {SafeAreaView, View, Alert} from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

import BasicTab from '../components/BasicTab';
import MediaTabs from '../components/Media/MediaTabs';
import DetailsTab from '../components/Broker/DetailsTab';
import ProjectDetailsTab from '../components/Project/ProjectDetailsTab';
import ImagesTab from '../components/Broker/ImagesTab';
import PropertySummaryTab from '../components/Broker/PropertySummaryTab';
import ProjectSummaryTab from '../components/Project/ProjectSummaryTab';

import styles from '../styles/AddPropertyStyle';

const AddPropertyScreen = ({navigation}) => {

  const [activeTab, setActiveTab] = useState(0);
  
  const [isDirty, setIsDirty] = useState(false);

  const [property, setProperty] = useState({

    listingType: '',

    category: '',

    purpose: '',

    propertyType: '',

    title: '',

    description: '',

    price: '',

    area: '',

    state: '',

    city: '',

    locality: '',

    landmark: '',

    nearBy: '',

    latitude: '',

    longitude: '',

    bedrooms: '',

    bathrooms: '',

    amenities: [],

    ownerName: '',
    ownerMobile: '',
    ownerEmail: '',

    brokerName: '',
    brokerCompany: '',
    brokerMobile: '',
    brokerEmail: '',
    brokerRera: '',

    builderName: '',
    projectName: '',
    projectStatus: '',
    reraNumber: '',
    possessionDate: '',

    images: [],
    coverImage: null,
    apartmentImages: [],
    floorPlans: [],
    masterPlan: null,
    otherImages: [],
    videoUrl: '',
    brochure: null,
});

 const nextTab = () => {

  if (property.listingType === 'Builder') {

    if (activeTab === 0) {
      setActiveTab(2);
      return;
    }

    if (activeTab === 2) {
      setActiveTab(3);
      return;
    }

    if (activeTab === 3) {
      setActiveTab(4);
      return;
    }

    return;
  }

  // Owner/Broker
  switch (activeTab) {
    case 0:
      setActiveTab(1);
      break;

    case 1:
      setActiveTab(3);   // <-- Direct Images
      break;

    case 3:
      setActiveTab(4);
      break;

    default:
      break;
  }
};


const previousTab = () => {

  if (property.listingType === 'Builder') {

    if (activeTab === 2) {
      setActiveTab(0);
      return;
    }

    if (activeTab === 3) {
      setActiveTab(2);
      return;
    }

    if (activeTab === 4) {
      setActiveTab(3);
      return;
    }

    return;
  }

    // Owner / Broker Flow
  switch (activeTab) {

    case 1:
      setActiveTab(0);
      break;

    case 3:
      setActiveTab(1);   // Media -> Details
      break;

    case 4:
      setActiveTab(3);   // Summary -> Media
      break;

    default:
      break;
  }

};

  const updateProperty = (key, value) => {
  setIsDirty(true);

  setProperty(prev => ({
    ...prev,
    [key]: value,
  }));
};

  useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', e => {

    if (!isDirty) {
      return;
    }

    e.preventDefault();

    Alert.alert(
      'Discard Changes?',
      'You have unsaved property details. Do you want to leave this page?',
      [
        {
          text: 'Stay',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => navigation.dispatch(e.data.action),
        },
      ],
    );
  });

  return unsubscribe;
}, [navigation, isDirty]);

  return (

    <SafeAreaView style={styles.container}>

      <Header
        title="Add Property"
        navigation={navigation}
      />

      <View style={{flex:1}}>
      {activeTab === 0 && (
                <BasicTab
                    property={property}
                    setProperty={updateProperty}
                    nextTab={nextTab}
                />
            )}

            {activeTab === 1 && property.listingType !== 'Builder' && (
              <DetailsTab
                property={property}
                setProperty={updateProperty}
                nextTab={nextTab}
                previousTab={previousTab}
              />
          )}

        {activeTab === 2 && property.listingType === 'Builder' && (
            <ProjectDetailsTab
              property={property}
              setProperty={updateProperty}
              nextTab={nextTab}
              previousTab={previousTab}
            />
)}

          {activeTab === 3 && (

            property.listingType === 'Builder' ? (

              <MediaTabs
                property={property}
                setProperty={setProperty}
                nextTab={nextTab}
                previousTab={previousTab}
              />

            ) : (

              <ImagesTab
                property={property}
                setProperty={setProperty}
                nextTab={nextTab}
                previousTab={previousTab}
              />

            )

        )}


           {activeTab === 4 &&
                  (property.listingType === 'Builder' ? (
                    <ProjectSummaryTab
                      property={property}
                      previousTab={previousTab}
                      navigation={navigation}
                      setIsDirty={setIsDirty}
                    />
                  ) : (
                    <PropertySummaryTab
                      property={property}
                      previousTab={previousTab}
                      navigation={navigation}
                      setIsDirty={setIsDirty}
                    />
                  ))
            }

      </View>

      <Footer navigation={navigation} />

    </SafeAreaView>

  );

};

export default AddPropertyScreen;
