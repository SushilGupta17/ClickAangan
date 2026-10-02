
import React, {useEffect, useRef, useState} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

function RegisterScreen({navigation, route}) {
  const scaleAnim = useRef(
    new Animated.Value(0.7),
  ).current;

  const opacityAnim = useRef(
    new Animated.Value(0),
  ).current;

  const [selectedRole, setSelectedRole] =
    useState(null);

  // =====================================================
  // ROLES
  // =====================================================

  const roles = [
    {
      id: 'BUILDER',
      title: 'Builder / Investor',
      subtitle: 'Manage projects & investments',
      icon: 'office-building-outline',
    },
    {
      id: 'PARTNER',
      title: 'Property Partner',
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

  // =====================================================
  // POPUP ANIMATION
  // =====================================================

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, scaleAnim]);

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.timing(scaleAnim, {
        toValue: 0.7,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    });
  };

  // =====================================================
  // CONTINUE
  // =====================================================

  const handleContinue = async () => {
    if (!selectedRole) {
      return;
    }

    try {
      await AsyncStorage.setItem(
        'selectedRole',
        selectedRole,
      );

      navigation.navigate(
        'RoleBasedRegistration',
        {
          role: selectedRole,
        },
      );
    } catch (error) {
      console.log(
        'ROLE SAVE ERROR:',
        error,
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: opacityAnim,
        },
      ]}>

      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}>

        {/* ================================================= */}
        {/* CLOSE BUTTON */}
        {/* ================================================= */}

        <TouchableOpacity
          style={styles.close}
          onPress={handleClose}
          activeOpacity={0.7}>

          <Text style={styles.closeText}>
            ✕
          </Text>

        </TouchableOpacity>

        {/* ================================================= */}
        {/* LOGO */}
        {/* ================================================= */}

        <View style={styles.logoCircle}>

          <Icon
            name="account-group-outline"
            size={29}
            color="#012353"
          />

        </View>

        {/* ================================================= */}
        {/* TITLE */}
        {/* ================================================= */}

        <Text style={styles.title}>
          Welcome to
        </Text>

        <Text style={styles.brand}>
          ClickAangan
        </Text>

        <Text style={styles.desc}>
          Choose your role to get a personalized
          property experience.
        </Text>

        {/* ================================================= */}
        {/* ROLE BOX */}
        {/* ================================================= */}

        <View style={styles.rolesContainer}>

          {roles.map(role => {

            const isSelected =
              selectedRole === role.id;

            return (
              <TouchableOpacity
                key={role.id}
                activeOpacity={0.85}
                onPress={() =>
                  setSelectedRole(role.id)
                }
                style={[
                  styles.roleCard,
                  isSelected &&
                    styles.selectedRoleCard,
                ]}>

                {/* ICON */}

                <View
                  style={[
                    styles.iconContainer,
                    isSelected &&
                      styles.selectedIconContainer,
                  ]}>

                  <Icon
                    name={role.icon}
                    size={25}
                    color={
                      isSelected
                        ? '#FFFFFF'
                        : '#012353'
                    }
                  />

                </View>

                {/* CONTENT */}

                <View style={styles.roleContent}>

                  <Text
                    style={[
                      styles.roleTitle,
                      isSelected &&
                        styles.selectedRoleTitle,
                    ]}>

                    {role.title}

                  </Text>

                  <Text style={styles.roleSubtitle}>
                    {role.subtitle}
                  </Text>

                </View>

                {/* RADIO */}

                <View
                  style={[
                    styles.radioOuter,
                    isSelected &&
                      styles.radioOuterSelected,
                  ]}>

                  {isSelected && (
                    <Icon
                      name="check"
                      size={14}
                      color="#FFFFFF"
                    />
                  )}

                </View>

              </TouchableOpacity>
            );
          })}

        </View>

        {/* ================================================= */}
        {/* CONTINUE */}
        {/* ================================================= */}

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!selectedRole}
          onPress={handleContinue}
          style={[
            styles.continueButton,
            !selectedRole &&
              styles.disabledButton,
          ]}>

          <Text style={styles.continueText}>
            Continue
          </Text>

          <Icon
            name="arrow-right"
            size={20}
            color="#FFFFFF"
          />

        </TouchableOpacity>

        {/* ================================================= */}
        {/* BOTTOM NOTE */}
        {/* ================================================= */}

        <View style={styles.bottomNote}>

          <Icon
            name="shield-check-outline"
            size={16}
            color="#777"
          />

          <Text style={styles.bottomNoteText}>
            Your role helps us personalize your experience
          </Text>

        </View>

      </Animated.View>
    </Animated.View>
  );
}

export default RegisterScreen;

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  // =====================================================
  // OVERLAY
  // =====================================================

  overlay: {
    position: 'absolute',

    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    backgroundColor:
      'rgba(0,0,0,0.60)',

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 999,
  },

  // =====================================================
  // CARD
  // =====================================================

  card: {
    width: width - 32,

    backgroundColor: '#FFFFFF',

    borderRadius: 20,

    paddingHorizontal: 17,
    paddingTop: 16,
    paddingBottom: 14,

    alignItems: 'center',

    elevation: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,

    maxHeight: '90%',
  },

  // =====================================================
  // CLOSE
  // =====================================================

  close: {
    position: 'absolute',

    right: 9,
    top: 8,

    width: 32,
    height: 32,

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 10,
  },

  closeText: {
    fontSize: 20,

    color: '#777',

    fontWeight: '600',
  },

  // =====================================================
  // LOGO
  // =====================================================

  logoCircle: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: '#EAF4FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 7,
  },

  // =====================================================
  // TITLE
  // =====================================================

  title: {
    fontSize: 15,

    color: '#555',

    fontWeight: '500',

    lineHeight: 18,
  },

  brand: {
    fontSize: 23,

    fontWeight: 'bold',

    color: '#012353',

    marginTop: 1,

    textAlign: 'center',

    lineHeight: 28,
  },

  desc: {
    marginTop: 6,

    marginHorizontal: 8,

    textAlign: 'center',

    color: '#666',

    lineHeight: 17,

    fontSize: 12.5,
  },

  // =====================================================
  // ROLES
  // =====================================================

  rolesContainer: {
    width: '100%',

    marginTop: 12,

    gap: 8,
  },

  // =====================================================
  // ROLE CARD
  // =====================================================

  roleCard: {
    minHeight: 66,

    width: '100%',

    backgroundColor: '#FFFFFF',

    borderRadius: 12,

    borderWidth: 1,

    borderColor: '#E2E6EC',

    paddingHorizontal: 10,
    paddingVertical: 8,

    flexDirection: 'row',

    alignItems: 'center',
  },

  selectedRoleCard: {
    borderColor: '#012353',

    borderWidth: 1.5,

    backgroundColor: '#F2F7FC',

    elevation: 2,
  },

  // =====================================================
  // ROLE ICON
  // =====================================================

  iconContainer: {
    width: 43,
    height: 43,

    borderRadius: 11,

    backgroundColor: '#EAF4FF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  selectedIconContainer: {
    backgroundColor: '#012353',
  },

  // =====================================================
  // ROLE CONTENT
  // =====================================================

  roleContent: {
    flex: 1,

    paddingRight: 5,
  },

  roleTitle: {
    fontSize: 13.5,

    fontWeight: '700',

    color: '#222',

    marginBottom: 2,
  },

  selectedRoleTitle: {
    color: '#012353',
  },

  roleSubtitle: {
    fontSize: 10.8,

    color: '#777',

    lineHeight: 15,
  },

  // =====================================================
  // RADIO
  // =====================================================

  radioOuter: {
    width: 22,
    height: 22,

    borderRadius: 11,

    borderWidth: 1.5,

    borderColor: '#D1D5DB',

    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterSelected: {
    borderColor: '#012353',

    backgroundColor: '#012353',
  },

  // =====================================================
  // CONTINUE BUTTON
  // =====================================================

  continueButton: {
    marginTop: 13,

    width: '100%',

    height: 43,

    borderRadius: 10,

    backgroundColor: '#012353',

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    elevation: 3,

    shadowColor: '#012353',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.20,

    shadowRadius: 5,
  },

  disabledButton: {
    backgroundColor: '#B8C4D6',

    elevation: 0,
  },

  continueText: {
    color: '#FFFFFF',

    fontSize: 15,

    fontWeight: 'bold',

    marginRight: 7,
  },

  // =====================================================
  // BOTTOM NOTE
  // =====================================================

  bottomNote: {
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 10,

    paddingHorizontal: 5,
  },

  bottomNoteText: {
    fontSize: 10.5,

    color: '#777',

    marginLeft: 5,

    textAlign: 'center',
  },
});
