import React, { useEffect, useState, useCallback } from 'react';

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
import Header from '../components/Header';
import Footer from '../components/Footer';

import MapSection from '../components/projectdetails/MapSection';
import NearbyPlaces from '../components/projectdetails/NearbyPlaces';
import BuilderCard from '../components/projectdetails/BuilderCard';
import BrochureSection from '../components/projectdetails/BrochureSection';
import VideoSection from '../components/projectdetails/VideoSection';
import FloorPlans from '../components/projectdetails/FloorPlans';
import MasterPlan from '../components/projectdetails/MasterPlan';
import EnquiryForm from '../components/projectdetails/EnquiryForm';
import StickyBottomBar from '../components/projectdetails/StickyBottomBar';

import { getProjectDetails } from '../services/ProjectService';


const ProjectDetailsScreen = ({ route }) => {

    const { projectId, project: projectData } = route.params;

    const [project, setProject] = useState(projectData);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const loadProject = async () => {

        try {

            const response = await getProjectDetails(projectId);
debugger;
            setProject(response);

        } catch (e) {

            console.log(e);

        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    };

    useEffect(() => {

        loadProject();

    }, []);

    const onRefresh = useCallback(() => {

        setRefreshing(true);

        loadProject();

    }, []);

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
                contentContainerStyle={{ paddingBottom: 90 }}
            >

                <ImageCarousel project={project} />

                 <OverviewCard project={project} />

                <PriceCard project={project} />

                <UnitTypesCard units={project?.units || []} />

                <AmenitiesGrid amenities={project?.amenities || []} />

                <FloorPlans floorPlans={project?.floorPlans || []} />

                <MasterPlan image={project?.masterPlan || []} />

                {/* <EnquiryForm projectId={project?.projectId} /> 


                <NearbyPlaces nearby={project?.nearby || []} />

                <BuilderCard project={project} />

                <MapSection project={project} />

                <BrochureSection project={project} />

                <VideoSection project={project} /> */}

                
            </ScrollView>

            <StickyBottomBar project={project} />
<Footer />
        </SafeAreaView>

    );

};

export default ProjectDetailsScreen;

const styles = StyleSheet.create({

    container: {

        flex:1,

        backgroundColor:'#F5F6FA',

    },

    loaderContainer:{

        flex:1,

        justifyContent:'center',

        alignItems:'center',

        backgroundColor:'#fff',

    }

});