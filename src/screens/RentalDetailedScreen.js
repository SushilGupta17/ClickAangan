 
import React, {useMemo,useEffect, useState, useCallback} from 'react';

import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';

import PropertyImageCarousel from '../components/propertydetails/PropertyImageCarousel';
import PropImageRotator from '../components/PropImgRotator';
import RentalTitle from '../components/Rentaldetails/RentalTitle';
import RentalPriceCard from '../components/Rentaldetails/RentalPriceCard';
import RentalDetailsCard from '../components/Rentaldetails/RentalDetailsCard';
import RentalDescription from '../components/Rentaldetails/RentalDescription';
import AmenitiesGrid from '../components/projectdetails/AmenitiesGrid';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VideoSection from '../components/projectdetails/VideoSection';
import StickyBottomBar from '../components/projectdetails/StickyBottomBar';
import {getRentalDetails} from '../services/RentalService';
 import PropertyContactDetails from '../components/propertydetails/PropertyContactDetails';
const API_URL= 'https://savariyaproperty.in';
const API_URL2= 'http://192.168.1.4:7045';

const RentalDetailsScreen = ({route}) => {
  const {project: projectData, id} = route?.params || {};

  // SearchScreen se aane wala id sabse pehle use hoga.
  // ProjectListScreen ke case mein project object se fallback milega.
  const projectId =
    id ||
    projectData?.projectId ||
    projectData?.ProjectId ||
    projectData?.PROJECTID;

  const [project, setProject] = useState(projectData || null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

    const propertyImages = useMemo(() => {
  if (!project?.images) {
    return [];
  }

  return String(project.images)
    .split(',')
    .map(x =>
      `${API_URL}/${x.trim().replace(/\\/g, '/')}`,
    )
    .filter(Boolean);
}, [project?.images]);

console.log('PROPERTY IMAGES:', propertyImages);

  const loadProject = useCallback(async () => {
    if (!projectId) {
      console.log('PROJECT ID NOT FOUND');

      setLoading(false);
      setRefreshing(false);

      return;
    }

    try {
      const response = await getRentalDetails(projectId);
      if (response) {
        setProject(response);
      }
    } catch (e) {
      console.log('PROJECT DETAILS ERROR:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId]);

//   useEffect(() => {
//   if (project) {
//     Alert.alert(
//       'IMAGE DEBUG',
//       'PROJECT OBJECT:\n' +
//         JSON.stringify(project, null, 2) +
//         '\n\n' +
//         'RAW IMAGES:\n' +
//         String(project?.images || '') +
//         '\n\n' +
//         'FINAL IMAGE COUNT:\n' +
//         String(propertyImages.length) +
//         '\n\n' +
//         'FINAL IMAGE URLS:\n' +
//         JSON.stringify(propertyImages, null, 2),
//     );
//   }
// }, [project, propertyImages]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProject();
  }, [loadProject]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <StatusBar
        backgroundColor="#ffffff"
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{paddingBottom: 150}}>

 <PropertyImageCarousel
          property={project}
        />


      


        {/* =================================================
            TITLE
        ================================================= */}

        <RentalTitle
          property={project}
        />

        <RentalPriceCard
          property={project}
        />

        <RentalDetailsCard
          property={project}
        />
        
        <RentalDescription property={project} />

       

        {Array.isArray(project?.amenities) &&
          project.amenities.length > 0 && (
            <AmenitiesGrid
              amenities={project.amenities}
            />
          )}

 <PropertyContactDetails
          property={project}
        /> 

        <VideoSection project={project} />

        </ScrollView>

      <StickyBottomBar project={project} />

      <Footer />
    </SafeAreaView>
  );
};

export default RentalDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
 
