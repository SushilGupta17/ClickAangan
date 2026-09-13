// RoleSelectionScreen.js

import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function RoleSelectionScreen({navigation}) {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'BUILDER',
      title: 'Builder / Investor',
      subtitle: 'Manage projects & investments',
      icon: 'office-building-outline',
    },
    {
      id: 'EXECUTIVE',
      title: 'Property Executive',
      subtitle: 'Manage properties & clients',
      icon: 'account-tie-outline',
    },
    {
      id: 'OWNER',
      title: 'Property Owner',
      subtitle: 'Sell or rent your property',
      icon: 'home-account',
    },
    {
      id: 'CUSTOMER',
      title: 'Property Seeker',
      subtitle: 'Buy or rent a property',
      icon: 'home-search-outline',
    },
  ];

  const handleContinue = async () => {
    if (!selectedRole) {
      return;
    }

    await AsyncStorage.setItem('selectedRole', selectedRole);

    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F7FA"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Icon
              name="home-city-outline"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.appName}>
            Savariya Property
          </Text>

          <Text style={styles.tagline}>
            Your Property. Your Choice.
          </Text>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.welcomeText}>
            Welcome!
          </Text>

          <Text style={styles.title}>
            How would you like to continue?
          </Text>

          <Text style={styles.description}>
            Select your role to get a personalized
            property experience.
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>

          {roles.map(role => {
            const isSelected = selectedRole === role.id;

            return (
              <TouchableOpacity
                key={role.id}
                activeOpacity={0.85}
                onPress={() => setSelectedRole(role.id)}
                style={[
                  styles.roleCard,
                  isSelected && styles.selectedRoleCard,
                ]}>

                {/* Icon */}
                <View
                  style={[
                    styles.iconContainer,
                    isSelected && styles.selectedIconContainer,
                  ]}>
                  <Icon
                    name={role.icon}
                    size={30}
                    color={isSelected ? '#FFFFFF' : '#1F6FEB'}
                  />
                </View>

                {/* Text */}
                <View style={styles.roleContent}>
                  <Text
                    style={[
                      styles.roleTitle,
                      isSelected && styles.selectedRoleTitle,
                    ]}>
                    {role.title}
                  </Text>

                  <Text style={styles.roleSubtitle}>
                    {role.subtitle}
                  </Text>
                </View>

                {/* Selection */}
                <View
                  style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}>

                  {isSelected && (
                    <View style={styles.radioInner}>
                      <Icon
                        name="check"
                        size={13}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!selectedRole}
          onPress={handleContinue}
          style={[
            styles.continueButton,
            !selectedRole && styles.disabledButton,
          ]}>

          <Text style={styles.continueText}>
            Continue
          </Text>

          <Icon
            name="arrow-right"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Bottom Note */}
        <View style={styles.bottomNote}>
          <Icon
            name="shield-check-outline"
            size={18}
            color="#6B7280"
          />

          <Text style={styles.bottomNoteText}>
            Your role helps us personalize your experience
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 35,
  },

  /* Header */

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1F6FEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 5,
    shadowColor: '#1F6FEB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.2,
  },

  tagline: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  /* Title */

  titleSection: {
    marginBottom: 22,
  },

  welcomeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F6FEB',
    marginBottom: 5,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 32,
  },

  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
    marginTop: 8,
  },

  /* Roles */

  rolesContainer: {
    gap: 13,
  },

  roleCard: {
    minHeight: 88,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 15,
    paddingVertical: 14,

    flexDirection: 'row',
    alignItems: 'center',

    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  selectedRoleCard: {
    borderColor: '#1F6FEB',
    borderWidth: 2,
    backgroundColor: '#F0F6FF',
    elevation: 4,
  },

  /* Icon */

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: '#EEF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  selectedIconContainer: {
    backgroundColor: '#1F6FEB',
  },

  /* Content */

  roleContent: {
    flex: 1,
    paddingRight: 8,
  },

  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  selectedRoleTitle: {
    color: '#1456B8',
  },

  roleSubtitle: {
    fontSize: 12.5,
    color: '#6B7280',
    lineHeight: 18,
  },

  /* Radio */

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterSelected: {
    borderColor: '#1F6FEB',
    backgroundColor: '#1F6FEB',
  },

  radioInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Button */

  continueButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#1F6FEB',
    marginTop: 25,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 4,
    shadowColor: '#1F6FEB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
  },

  disabledButton: {
    backgroundColor: '#B8C4D6',
    elevation: 0,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },

  /* Bottom */

  bottomNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    paddingHorizontal: 10,
  },

  bottomNoteText: {
    fontSize: 11.5,
    color: '#6B7280',
    marginLeft: 6,
    textAlign: 'center',
  },
});

export default RoleSelectionScreen;