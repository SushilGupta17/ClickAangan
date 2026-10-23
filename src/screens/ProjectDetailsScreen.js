 
import React, {useEffect, useState, useCallback} from 'react';

import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';

import ImageCarousel from '../components/projectdetails/ImageCarousel';
import OverviewCard from '../components/projectdetails/OverviewCard';
import PriceCard from '../components/projectdetails/PriceCard';
import UnitTypesCard from '../components/projectdetails/UnitTypesCard';
import AmenitiesGrid from '../components/projectdetails/AmenitiesGrid';
import ProjectTitle from '../components/projectdetails/ProjectTitle';
import ProjectStatusCard from '../components/projectdetails/ProjectStatusCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NearbyPlaces from '../components/projectdetails/NearbyPlaces';
import VideoSection from '../components/projectdetails/VideoSection';
import FloorPlans from '../components/projectdetails/FloorPlans';
import MasterPlan from '../components/projectdetails/MasterPlan';
import PropertyContactDetails from '../components/propertydetails/PropertyContactDetails';
import PropertyAmenities from '../components/propertydetails/PropertyAmenities';


import EnquiryForm from '../components/projectdetails/EnquiryForm';
import StickyBottomBar from '../components/projectdetails/StickyBottomBar';

import {getProjectDetails} from '../services/ProjectService';

const ProjectDetailsScreen = ({route}) => {
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

  const loadProject = useCallback(async () => {
    if (!projectId) {
      console.log('PROJECT ID NOT FOUND');

      setLoading(false);
      setRefreshing(false);

      return;
    }

    try {
      const response = await getProjectDetails(projectId);
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

        <ImageCarousel project={project} />

        <ProjectTitle project={project} />

        <ProjectStatusCard project={project} />

        <PriceCard project={project} />

        {Array.isArray(project?.units) &&
          project.units.length > 0 && (
            <UnitTypesCard units={project.units} />
          )}

        {Array.isArray(project?.amenities) &&
          project.amenities.length > 0 && (
              <PropertyAmenities  amenities={
                project.amenities
              }
            />

          )}

        {project?.masterPlan &&
          project.masterPlan.length > 0 && (
            <MasterPlan
              image={project.masterPlan}
            />
          )}

        {project && (
          <OverviewCard project={project} />
        )}

        <VideoSection project={project} />

        <FloorPlans
          image={project?.FloorPlans || []}
        />

        <NearbyPlaces
          nearby={
            project?.nearby ||
            project?.NearBy ||
            ''
          }
        />

 <PropertyContactDetails
          property={project}
        /> 

        {/*
        <VideoSection project={project} />
        <MapSection project={project} />
        */}
      </ScrollView>

      <StickyBottomBar project={project} />

      <Footer />
    </SafeAreaView>
  );
};

export default ProjectDetailsScreen;

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
 
