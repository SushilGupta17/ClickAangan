import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const LoginPopup = ({
  visible,
  onClose,
  onLogin,
  onRegister,
  onGuest,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

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
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.logoCircle}>
          <Text style={styles.logo}>🏠</Text>
        </View>

        <Text style={styles.title}>Welcome to</Text>

        <Text style={styles.brand}>Savariya Property</Text>

        <Text style={styles.desc}>
          Login to unlock premium features and enjoy a personalized property
          search experience.
        </Text>

        <View style={styles.featureBox}>
          <Text style={styles.feature}>❤️ Save Favourite Properties</Text>

          <Text style={styles.feature}>🔔 Instant Property Alerts</Text>

          <Text style={styles.feature}>📞 Quick Property Enquiry</Text>

          <Text style={styles.feature}>⭐ Personalized Recommendations</Text>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={onLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerBtn} onPress={onRegister}>
          <Text style={styles.registerText}>Create Account</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={onGuest}>
          <Text style={styles.guest}>Continue as Guest</Text>
        </TouchableOpacity> */}
      </Animated.View>
    </Animated.View>
  );
};

export default LoginPopup;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  card: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },

  close: {
    position: 'absolute',
    right: 15,
    top: 15,
  },

  closeText: {
    fontSize: 22,
    color: '#777',
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  logo: {
    fontSize: 40,
  },

  title: {
    fontSize: 18,
    color: '#555',
  },

  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0A84FF',
    marginTop: 5,
  },

  desc: {
    marginTop: 15,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },

  featureBox: {
    marginTop: 25,
    width: '100%',
    backgroundColor: '#F6F8FC',
    borderRadius: 15,
    padding: 15,
  },

  feature: {
    fontSize: 15,
    marginVertical: 6,
    color: '#333',
  },

  loginBtn: {
    marginTop: 25,
    width: '100%',
    height: 52,
    borderRadius: 15,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  registerBtn: {
    width: '100%',
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  registerText: {
    color: '#0A84FF',
    fontWeight: 'bold',
    fontSize: 17,
  },

  guest: {
    marginTop: 20,
    color: '#888',
    fontWeight: '600',
  },
});
