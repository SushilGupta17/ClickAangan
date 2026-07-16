import React, {useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const EnquiryScreen = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    purpose: '',
    propertyType: '',
    location: '',
    budget: '',
    bhk: '',
    timeline: '',
    message: '',
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation', 'Please enter your name');
      return false;
    }

    if (!formData.mobile.trim()) {
      Alert.alert('Validation', 'Please enter mobile number');
      return false;
    }

    if (formData.mobile.length < 10) {
      Alert.alert(
        'Validation',
        'Please enter valid mobile number',
      );
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    console.log('Enquiry Data => ', formData);

    Alert.alert(
      'Success',
      'Your enquiry has been submitted successfully.',
    );

    setFormData({
      name: '',
      mobile: '',
      email: '',
      purpose: '',
      propertyType: '',
      location: '',
      budget: '',
      bhk: '',
      timeline: '',
      message: '',
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>

  <Header />

  <ScrollView
    style={styles.scrollView}
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}>

    <View style={styles.formCard}>
      <Text style={styles.heading}>Property Enquiry Form</Text>

      <Text style={styles.subHeading}>
        Fill in your requirements and our property expert will contact you shortly.
      </Text>

      {/* All Inputs Here */}
<View style={styles.tabContainer}>
  <TouchableOpacity
    style={[
      styles.tab,
      activeTab === 1 && styles.activeTab,
    ]}
    onPress={() => setActiveTab(1)}>
    <Text
      style={[
        styles.tabText,
        activeTab === 1 && styles.activeTabText,
      ]}>
      Personal
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.tab,
      activeTab === 2 && styles.activeTab,
    ]}
    onPress={() => setActiveTab(2)}>
    <Text
      style={[
        styles.tabText,
        activeTab === 2 && styles.activeTabText,
      ]}>
      Property
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.tab,
      activeTab === 3 && styles.activeTab,
    ]}
    onPress={() => setActiveTab(3)}>
    <Text
      style={[
        styles.tabText,
        activeTab === 3 && styles.activeTabText,
      ]}>
      Review
    </Text>
  </TouchableOpacity>
  
</View>

{activeTab === 1 && (
  <>
    <TextInput
  
      placeholder="Full Name *" 
      style={styles.input}
      value={formData.name}
      placeholderTextColor="#999"
      onChangeText={text => handleChange('name', text)}
    />

    <TextInput
      placeholder="Mobile Number *"
      style={styles.input}
      keyboardType="phone-pad"
      value={formData.mobile}
      placeholderTextColor="#999"
      onChangeText={text => handleChange('mobile', text)}
    />

    <TextInput
      placeholder="Email Address"
      placeholderTextColor="#999"
      style={styles.input}
      value={formData.email}
      onChangeText={text => handleChange('email', text)}
    />
  </>
)}

{activeTab === 2 && (
  <>
    <TextInput
      placeholder="Purpose (Buy/Rent/Sell)"
      placeholderTextColor="#999"
      style={styles.input}
      value={formData.purpose}
      onChangeText={text => handleChange('purpose', text)}
    />

    <TextInput
      placeholder="Property Type"
      placeholderTextColor="#999"
      style={styles.input}
      value={formData.propertyType}
      onChangeText={text => handleChange('propertyType', text)}
    />

    <TextInput
      placeholder="Preferred Location"
      placeholderTextColor="#999"
      style={styles.input}
      value={formData.location}
      onChangeText={text => handleChange('location', text)}
    />

    <TextInput
      placeholder="Budget"
      placeholderTextColor="#999"
      style={styles.input}
      value={formData.budget}
      onChangeText={text => handleChange('budget', text)}
    />

    <TextInput
      placeholder="BHK Requirement"
      placeholderTextColor="#999"
      style={styles.input}
      value={formData.bhk}
      onChangeText={text => handleChange('bhk', text)}
    />
  </>
)}

{activeTab === 3 && (
  <>
    <TextInput
      placeholder="Purchase Timeline"
      placeholderTextColor="#999"
      style={styles.input}
      value={formData.timeline}
      onChangeText={text => handleChange('timeline', text)}
    />

    <TextInput
      placeholder="Additional Requirement"
      placeholderTextColor="#999"
      multiline
      numberOfLines={4}
      style={[styles.input, styles.messageBox]}
      value={formData.message}
      onChangeText={text => handleChange('message', text)}
    />

    <TouchableOpacity
      style={styles.submitBtn}
      onPress={handleSubmit}>
      <Text style={styles.submitText}>
        Submit Enquiry
      </Text>
    </TouchableOpacity>
  </>
)}

<View style={styles.navContainer}>
  {activeTab > 1 && (
    <TouchableOpacity
      style={styles.prevBtn}
      onPress={() => setActiveTab(activeTab - 1)}>
      <Text style={styles.navText}>Previous</Text>
    </TouchableOpacity>
  )}

  {activeTab < 3 && (
    <TouchableOpacity
      style={styles.nextBtn}
      onPress={() => setActiveTab(activeTab + 1)}>
      <Text style={styles.nextText}>Next</Text>
    </TouchableOpacity>
  )}
</View>

     
    </View>

   
  </ScrollView>
   <Footer />
</SafeAreaView>
  );
  
};

export default EnquiryScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginTop: 10,
  },

  subHeading: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 25,
  },

  safeContainer: {
  flex: 1,
  backgroundColor: '#F5F7FA',
},

scrollView: {
  flex: 1,
},

scrollContent: {
  padding: 15,
  paddingBottom: 30,
},

formCard: {
  backgroundColor: '#fff',
  borderRadius: 18,
  padding: 20,
  marginBottom: 20,

  elevation: 5,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 5,
},

heading: {
  fontSize: 24,
  fontWeight: '700',
  color: '#1A1A1A',
  textAlign: 'center',
},

subHeading: {
  textAlign: 'center',
  color: '#666',
  fontSize: 14,
  lineHeight: 22,
  marginTop: 8,
  marginBottom: 25,
},

input: {
  backgroundColor: '#F5F5F5',
  borderWidth: 1,
  borderColor: '#5e5959',
  borderRadius: 12,
  paddingHorizontal: 15,
  paddingVertical: 14,
  marginBottom: 14,
  fontSize: 15,
  color: '#222',
},

messageBox: {
  height: 120,
  textAlignVertical: 'top',
},

submitBtn: {
  backgroundColor: '#D32F2F',
  height: 55,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 10,

  elevation: 4,
},

submitText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
},

  
  messageBox: {
    height: 110,
    textAlignVertical: 'top',
  },

  submitBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
  },

  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

 tabContainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 5,
  marginBottom: 20,
},

tab: {
  flex: 1,
  alignItems: 'center',
  paddingVertical: 12,
  borderRadius: 10,
},

activeTab: {
  backgroundColor: '#D32F2F',
},

tabText: {
  color: '#666',
  fontWeight: '600',
},

activeTabText: {
  color: '#fff',
},

navContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
},

prevBtn: {
  backgroundColor: '#E5E7EB',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 10,
},

nextBtn: {
  backgroundColor: '#D32F2F',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 10,
},

navText: {
  fontWeight: '600',
},

nextText: {
  color: '#fff',
  fontWeight: '600',
},

});
