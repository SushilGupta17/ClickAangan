import React, {useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import Animated, {
  FadeInDown,
} from 'react-native-reanimated';

import CoverImage from '../Media/CoverImage';
import ApartmentImages from '../Media/ApartmentImages';
import FloorPlans from '../Media/FloorPlans';
 import MasterPlan from '../Media/MasterPlan';
import OtherImages from '../Media/OtherImages';
import VideoUrl from '../Media/VideoUrl';

import styles from '../../styles/AddPropertyStyle';

const MediaTabs = ({
  property,
  setProperty,
  previousTab,
  nextTab,
}) => {

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}>

      <ScrollView
  showsVerticalScrollIndicator={true}
  contentContainerStyle={{
    paddingBottom: 150,
    flexGrow: 1,
  }}>

        <CoverImage
          property={property}
          setProperty={setProperty}
        />

        <ApartmentImages
          property={property}
          setProperty={setProperty}
        />

        <FloorPlans
          property={property}
          setProperty={setProperty}
        />

        <MasterPlan
          property={property}
          setProperty={setProperty}
        />

        <OtherImages
          property={property}
          setProperty={setProperty}
        />

        <VideoUrl
          property={property}
          setProperty={setProperty}
        /> 

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 25,
          }}>

          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: '#6c757d',
                width: '48%',
              },
            ]}
            onPress={previousTab}>

            <Text style={styles.nextButtonText}>
              Previous
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                width: '48%',
              },
            ]}
            onPress={nextTab}>

            <Text style={styles.nextButtonText}>
              Next
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </Animated.View>
  );

};

export default React.memo(MediaTabs);