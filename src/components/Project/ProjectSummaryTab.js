import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import { formatPrice } from '../../helpers/priceHelper';

import {addProject} from '../../services/ProjectService';
import styles from '../../styles/AddPropertyStyle';

const SummaryCard = ({title, children}) => (
  <View
    style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 18,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: {width: 0, height: 2},
      elevation: 4,
    }}>
    <Text
      style={{
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 15,
      }}>
      {title}
    </Text>

    {children}
  </View>
);

const Row = ({label, value}) => {
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      }}>
      <Text
        style={{
          flex: 1,
          color: '#64748B',
          fontSize: 15,
        }}>
        {label}
      </Text>

      <Text
        style={{
          flex: 1,
          textAlign: 'right',
          color: '#0F172A',
          fontWeight: '600',
          fontSize: 15,
        }}>
        {Array.isArray(value) ? value.join(', ') : value}
      </Text>
    </View>
  );
};

const ProjectSummaryTab = ({
  property,
  previousTab,
}) => {

  const [loading, setLoading] = useState(false);

  const submitProject = async () => {

  try {

    setLoading(true);

    const formData = new FormData();

    //==============================
    // BASIC INFORMATION
    //==============================

    formData.append("ListingType", property.listingType || "");
    formData.append("Category", property.category || "");
    formData.append("Purpose", property.purpose || "");
    formData.append("PropertyType", property.propertyType || "");


    //==============================
    // BUILDER INFORMATION
    //==============================

    formData.append("ProjectName", property.projectName || "");
    formData.append("BuilderName", property.builderName || "");
    formData.append("CompanyName", property.companyName || "");
    formData.append("ReraNumber", property.reraNumber || "");

    formData.append("ContactPerson", property.contactPerson || "");
    formData.append("ContactMobile", property.contactMobile || "");
    formData.append("ContactEmail", property.contactEmail || "");

    //==============================
    // PROJECT DETAILS
    //==============================

    formData.append("ProjectStatus", property.projectStatus || "");
    formData.append("ProjectArea", property.projectArea || "");
    formData.append("TotalTowers", property.totalTowers || "");
    formData.append("TotalFloors", property.totalFloors || "");
    formData.append("TotalUnits", property.totalUnits || "");
    formData.append("PossessionDate", property.possessionDate || "");
    formData.append("MinPrice", property.minPrice || "");
    formData.append("MaxPrice", property.maxPrice || "");

    //==============================
    // LOCATION
    //==============================

    formData.append("State", property.state || "");
    formData.append("City", property.city || "");
    formData.append("Locality", property.locality || "");
    formData.append("NearBy", property.nearBy || "");
    formData.append("Address", property.address || "");

    formData.append("Latitude", property.latitude || "");
    formData.append("Longitude", property.longitude || "");

    //==============================
    // PROJECT HIGHLIGHTS
    //==============================

    formData.append(
      "ProjectHighlights",
      property.projectHighlights || ""
    );

    // //==============================
    // // VIDEO
    // //==============================

    // formData.append(
    //   "VideoUrl",
    //   property.videoUrl || ""
    // );

    //==============================
    // AMENITIES
    //==============================

    if (property.amenities) {

      property.amenities.forEach(item => {

        formData.append("Amenities", item);

      });

    }

    //==============================
    // AVAILABLE UNITS
    //==============================

    if (property.availableUnits) {

      property.availableUnits.forEach((unit, index) => {

        formData.append(
          `AvailableUnits[${index}].UnitType`,
          unit.unitType
        );

        formData.append(
          `AvailableUnits[${index}].Area`,
          unit.area
        );

        formData.append(
          `AvailableUnits[${index}].Price`,
          unit.price
        );

      });

    }

    //==============================
    // COVER IMAGE
    //==============================

    if (property.coverImage) {

      formData.append("CoverImage", {
        uri: property.coverImage.uri,
        name: property.coverImage.fileName || "cover.jpg",
        type: property.coverImage.type || "image/jpeg",
      });

    }

    //==============================
    // APARTMENT IMAGES
    //==============================

    if (property.apartmentImages?.length > 0) {

      property.apartmentImages.forEach((img, index) => {

        formData.append("ApartmentImages", {
          uri: img.uri,
          name: img.fileName || `apartment_${index}.jpg`,
          type: img.type || "image/jpeg",
        });

      });

    }

    //==============================
    // FLOOR PLANS
    //==============================

    if (property.floorPlans?.length > 0) {

      property.floorPlans.forEach((img, index) => {

        formData.append("FloorPlans", {
          uri: img.uri,
          name: img.fileName || `floorplan_${index}.jpg`,
          type: img.type || "image/jpeg",
        });

      });

    }

    //==============================
    // MASTER PLAN
    //==============================

    if (property.masterPlan) {

      formData.append("MasterPlan", {
        uri: property.masterPlan.uri,
        name: property.masterPlan.fileName || "masterplan.jpg",
        type: property.masterPlan.type || "image/jpeg",
      });

    }

    //==============================
    // OTHER IMAGES
    //==============================

    if (property.otherImages?.length > 0) {

      property.otherImages.forEach((img, index) => {

        formData.append("OtherImages", {
          uri: img.uri,
          name: img.fileName || `other_${index}.jpg`,
          type: img.type || "image/jpeg",
        });

      });

    }

    //==============================
    // BROCHURE
    //==============================

    if (property.brochure) {

      formData.append("Brochure", {
        uri: property.brochure.uri,
        name: property.brochure.name || "brochure.pdf",
        type: property.brochure.type || "application/pdf",
      });

    }

    //==============================
    // VIDEO URL
    //==============================

    formData.append("VideoUrl", property.videoUrl || "");

    //==============================
    // DEBUG (Optional)
    //==============================

    console.log("Submitting Project...");

    for (let pair of formData._parts) {
      console.log(pair[0], pair[1]);
    }

    //==============================
    // API CALL
    //==============================

    await addProject(formData);

    Alert.alert(
      "Success",
      "Project Added Successfully"
    );

  } catch (e) {

    console.log(e);

    Alert.alert(
      "Error",
      e.message || "Something went wrong"
    );

  } finally {

    setLoading(false);

  }

};

  return (
     <SafeAreaView style={{flex:1, backgroundColor:'#F5F7FA'}}>
    <ScrollView
      contentContainerStyle={{
        padding:16,
        paddingBottom:110,
        flexGrow:1,
      }}>


      <Animated.View entering={FadeInDown.duration(500)}>

        {/* Header */}

        <View
          style={{
            backgroundColor:'#0F766E',
            borderRadius:18,
            padding:20,
            marginBottom:20,
          }}>

          <Text
            style={{
              color:'#fff',
              fontSize:24,
              fontWeight:'700',
            }}>
            Project Summary
          </Text>

          <Text
            style={{
              color:'#D1FAE5',
              marginTop:5,
            }}>
            Please review all project details before submitting.
          </Text>

        </View>

        {/* Project Information */}

        <SummaryCard title="🏗️ Project Information">

          <Row label="Project Name" value={property.projectName} />
          <Row label="Builder Name" value={property.builderName} />
          <Row label="Project Status" value={property.projectStatus} />
          <Row label="RERA Number" value={property.reraNumber} />
          <Row label="Category" value={property.category} />
          <Row label="Property Type" value={property.propertyType} />
          <Row label="Min Price" value={property.minPrice} />
          <Row label="Max Price" value={property.maxPrice} />


        </SummaryCard>

        {/* Location */}

        <SummaryCard title="📍 Project Location">

  <Row label="State" value={property.state} />

  <Row label="City" value={property.city} />

  <Row label="Locality / Area" value={property.locality} />

  <Row label="Nearby Landmark" value={property.nearBy} />

  <Row
    label="Project Address"
    value={property.address}
  />

</SummaryCard>

        {/* Pricing */}

      <SummaryCard title="💰 Available Units">

  {property.availableUnits?.map((unit, index) => (
    <View
      key={index}
      style={{
        paddingVertical: 12,
        borderBottomWidth:
          index === property.availableUnits.length - 1 ? 0 : 1,
        borderBottomColor: '#E5E7EB',
      }}>

      <Row label="Unit Type" value={unit.unitType} />
      <Row label="Area" value={unit.area} />
      <Row label="Price" value={formatPrice(unit.price)} />

    </View>
  ))}

</SummaryCard>
        {/* Media */}

        <SummaryCard title="📷 Media Information">

          <Row
            label="Cover Image"
            value={property.coverImage ? "Selected" : "Not Selected"}
          />

          <Row
            label="Apartment Images"
            value={
              property.apartmentImages?.length
                ? `${property.apartmentImages.length} Selected`
                : "Not Selected"
            }
          />

          <Row
            label="Floor Plans"
            value={
              property.floorPlans?.length
                ? `${property.floorPlans.length} Selected`
                : "Not Selected"
            }
          />

          <Row
            label="Master Plan"
            value={property.masterPlan ? "Selected" : "Not Selected"}
          />

          <Row
            label="Other Images"
            value={
              property.otherImages?.length
                ? `${property.otherImages.length} Selected`
                : "Not Selected"
            }
          />

          <Row
            label="Video URL"
            value={property.videoUrl ? "Added" : "Not Added"}
          />

        </SummaryCard>

        {/* Buttons */}

        <View
          style={{
            flexDirection:'row',
            justifyContent:'space-between',
            marginTop:20,
            marginBottom:30,
          }}>

          <TouchableOpacity
            onPress={previousTab}
            style={{
              flex:1,
              backgroundColor:'#CBD5E1',
              padding:16,
              borderRadius:12,
              marginRight:8,
              alignItems:'center',
            }}>

            <Text
              style={{
                color:'#1E293B',
                fontWeight:'700',
              }}>
              Previous
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            disabled={loading}
            onPress={submitProject}
            style={{
              flex:1,
              backgroundColor:'#0F766E',
              padding:16,
              borderRadius:12,
              marginLeft:8,
              alignItems:'center',
            }}>

            {
              loading
              ?
              <ActivityIndicator color="#fff" />
              :
              <Text
                style={{
                  color:'#fff',
                  fontWeight:'700',
                }}>
                Submit Project
              </Text>
            }

          </TouchableOpacity>

        </View>

      </Animated.View>

    </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectSummaryTab;