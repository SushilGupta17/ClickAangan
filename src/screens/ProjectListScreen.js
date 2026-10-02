import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import PropImageRotator from '../components/PropImgRotator';
import ImageRotator from '../components/ImageRotator';
import ProjectHeader from '../components/Project/ProjectHeader';
import ProjectSearchBar from '../components/ProjectListing/ProjectSearchBar';
import ProjectFilterBar from '../components/ProjectListing/ProjectFilterBar';
import ProjectCard from '../components/ProjectListing/ProjectCard';

import {getProjects} from '../services/ProjectService';

const API_URL1 = 'http://192.168.1.3:7045';
const API_URL = 'https://clickaangan.in';

const ProjectListScreen = ({navigation}) => {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  //---------------------------------------------------------
  // Load Projects
  //---------------------------------------------------------

  const loadProjects = async () => {

    try {

   
      const data = await getProjects();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }

    } catch (e) {

      console.log(e);

      setProjects([]);

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };

  //---------------------------------------------------------

  useEffect(() => {

    loadProjects();

  }, []);

  //---------------------------------------------------------

  const onRefresh = useCallback(() => {

    setRefreshing(true);

    loadProjects();

  }, []);

  //---------------------------------------------------------
  // Search + Filter
  //---------------------------------------------------------

  const filteredProjects = useMemo(() => {

    let data = [...projects];

    if (search.trim() !== '') {

      const txt = search.toLowerCase();

      data = data.filter(x =>

        x.projectName?.toLowerCase().includes(txt) ||

        x.builderName?.toLowerCase().includes(txt) ||

        x.city?.toLowerCase().includes(txt) ||

        x.locality?.toLowerCase().includes(txt)

      );

    }

    if (status !== 'All') {

      data = data.filter(

        x => x.projectStatus === status

      );

    }

    return data;

  }, [projects, search, status]);

  //---------------------------------------------------------

  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="#0A66C2"
        />

      </View>

    );

  }

  //---------------------------------------------------------

  return (

    <SafeAreaView style={styles.container}>

<ProjectFilterBar
    selectedStatus={status}
    onStatusChange={setStatus}
  />

      <FlatList

        data={filteredProjects}

        keyExtractor={(item) => item.projectId.toString()}

        renderItem={({item}) => (
          <ProjectCard  item={item}

            navigation={navigation}
          />
        )}

        showsVerticalScrollIndicator={false}

        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={onRefresh}

          />

        }


        ListEmptyComponent={

          <View style={styles.emptyContainer}>

            <Text style={styles.emptyText}>

              No Projects Available

            </Text>

          </View>

        }

        contentContainerStyle={{

          paddingBottom:40,

        }}

      />

    </SafeAreaView>

  );

};

export default ProjectListScreen;

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:'#F5F7FA',
  },

  loader:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },

  emptyContainer:{
    paddingVertical:80,
    alignItems:'center',
  },

  emptyText:{
    fontSize:16,
    color:'#777',
    fontWeight:'600',
  },

});