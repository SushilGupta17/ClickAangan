import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// ======================================================
// COLORS
// ======================================================

const COLORS = {
  navy: '#012353',
  orange: '#F58220',
  white: '#FFFFFF',
  black: '#111827',
  text: '#1F2937',
  subText: '#6B7280',

  success: '#16A34A',
  error: '#DC2626',
  warning: '#F59E0B',
  info: '#2563EB',

  lightSuccess: '#EAF8EF',
  lightError: '#FDECEC',
  lightWarning: '#FFF7E6',
  lightInfo: '#EAF2FF',

  border: '#E5E7EB',
};

// ======================================================
// CONTEXT
// ======================================================

const AppAlertContext = createContext(null);

// ======================================================
// PROVIDER
// ======================================================

export const AppAlertProvider = ({children}) => {
  const [alertData, setAlertData] = useState(null);

  // TOP ANIMATION
  const translateY = useRef(
    new Animated.Value(-150),
  ).current;

  const opacity = useRef(
    new Animated.Value(0),
  ).current;

  const hideTimer = useRef(null);

  // ====================================================
  // CLEAR TIMER
  // ====================================================

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  // ====================================================
  // HIDE ALERT
  // ====================================================

  const hideAlert = () => {
    clearHideTimer();

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 220,
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        setAlertData(null);
      }
    });
  };

  // ====================================================
  // ANIMATE SHOW
  // ====================================================

  const animateShow = () => {
    translateY.setValue(-150);
    opacity.setValue(0);

    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 180,
          mass: 0.8,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // ====================================================
  // GET DEFAULT TITLE
  // ====================================================

  const getDefaultTitle = type => {
    switch (type) {
      case 'success':
        return 'Success';

      case 'error':
        return 'Error';

      case 'warning':
        return 'Warning';

      case 'info':
      default:
        return 'Information';
    }
  };

  // ====================================================
  // SHOW NORMAL ALERT
  // ====================================================

  const showAlert = ({
    type = 'info',
    title = '',
    message = '',
    duration = 3000,
    onPress,
  }) => {
    clearHideTimer();

    const finalTitle =
      title && String(title).trim()
        ? String(title)
        : getDefaultTitle(type);

    const finalMessage =
      message === undefined || message === null
        ? ''
        : String(message);

    console.log(
      'APP ALERT:',
      type,
      finalTitle,
      finalMessage,
    );

    setAlertData({
      type,
      title: finalTitle,
      message: finalMessage,
      isConfirm: false,
      onPress,
      onYes: null,
      onNo: null,
    });

    animateShow();

    // NORMAL ALERT AUTO HIDE
    if (duration > 0) {
      hideTimer.current = setTimeout(() => {
        hideAlert();
      }, duration);
    }
  };

  // ====================================================
  // CONFIRM ALERT
  // ====================================================

  const confirm = (
    title,
    message,
    onYes,
    onNo,
  ) => {
    clearHideTimer();

    const finalTitle =
      title && String(title).trim()
        ? String(title)
        : 'Confirmation';

    const finalMessage =
      message === undefined || message === null
        ? ''
        : String(message);

    console.log(
      'APP CONFIRM:',
      finalTitle,
      finalMessage,
    );

    setAlertData({
      type: 'warning',
      title: finalTitle,
      message: finalMessage,
      isConfirm: true,
      onPress: null,
      onYes,
      onNo,
    });

    // IMPORTANT:
    // Confirmation alert will NOT auto-hide
    animateShow();
  };

  // ====================================================
  // CLEANUP
  // ====================================================

  useEffect(() => {
    return () => {
      clearHideTimer();
    };
  }, []);

  // ====================================================
  // SUCCESS
  // ====================================================

  const success = (
    title,
    message,
    duration = 3000,
    onPress,
  ) => {
    showAlert({
      type: 'success',
      title,
      message,
      duration,
      onPress,
    });
  };

  // ====================================================
  // ERROR
  // ====================================================

  const error = (
    title,
    message,
    duration = 3000,
    onPress,
  ) => {
    showAlert({
      type: 'error',
      title,
      message,
      duration,
      onPress,
    });
  };

  // ====================================================
  // WARNING
  // ====================================================

  const warning = (
    title,
    message,
    duration = 3000,
    onPress,
  ) => {
    showAlert({
      type: 'warning',
      title,
      message,
      duration,
      onPress,
    });
  };

  // ====================================================
  // INFO
  // ====================================================

  const info = (
    title,
    message,
    duration = 3000,
    onPress,
  ) => {
    showAlert({
      type: 'info',
      title,
      message,
      duration,
      onPress,
    });
  };

  // ====================================================
  // CUSTOM
  // ====================================================

  const custom = (
    type,
    title,
    message,
    duration = 3000,
    onPress,
  ) => {
    showAlert({
      type,
      title,
      message,
      duration,
      onPress,
    });
  };

  // ====================================================
  // ALERT STYLE
  // ====================================================

  const getAlertStyle = () => {
    switch (alertData?.type) {
      case 'success':
        return {
          icon: 'check-circle',
          iconColor: COLORS.success,
          iconBackground: COLORS.lightSuccess,
          accent: COLORS.success,
        };

      case 'error':
        return {
          icon: 'close-circle',
          iconColor: COLORS.error,
          iconBackground: COLORS.lightError,
          accent: COLORS.error,
        };

      case 'warning':
        return {
          icon: 'alert-circle',
          iconColor: COLORS.warning,
          iconBackground: COLORS.lightWarning,
          accent: COLORS.warning,
        };

      case 'info':
      default:
        return {
          icon: 'information',
          iconColor: COLORS.info,
          iconBackground: COLORS.lightInfo,
          accent: COLORS.info,
        };
    }
  };

  const alertStyle = getAlertStyle();

  // ====================================================
  // NORMAL ALERT CONTENT
  // ====================================================

  const renderNormalContent = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.content}
        onPress={() => {
          if (alertData?.onPress) {
            alertData.onPress();
          }

          hideAlert();
        }}
      >
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {alertData?.title}
        </Text>

        <Text
          style={styles.message}
          numberOfLines={4}
        >
          {alertData?.message}
        </Text>
      </TouchableOpacity>
    );
  };

  // ====================================================
  // CONFIRM CONTENT
  // ====================================================

  const renderConfirmContent = () => {
    return (
      <View style={styles.confirmContent}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {alertData?.title}
        </Text>

        <Text
          style={styles.message}
          numberOfLines={4}
        >
          {alertData?.message}
        </Text>

        {/* BUTTONS */}

        <View style={styles.confirmButtons}>

          {/* NO */}

          <TouchableOpacity
            style={styles.noButton}
            activeOpacity={0.8}
            onPress={() => {
              clearHideTimer();

              if (alertData?.onNo) {
                alertData.onNo();
              }

              hideAlert();
            }}
          >
            <Text style={styles.noButtonText}>
              No
            </Text>
          </TouchableOpacity>

          {/* YES */}

          <TouchableOpacity
            style={styles.yesButton}
            activeOpacity={0.8}
            onPress={() => {
              clearHideTimer();

              if (alertData?.onYes) {
                alertData.onYes();
              }

              hideAlert();
            }}
          >
            <Text style={styles.yesButtonText}>
              Yes
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  };

  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <AppAlertContext.Provider
      value={{
        showAlert,
        success,
        error,
        warning,
        info,
        custom,
        confirm,
        hideAlert,
      }}
    >
      {children}

      {alertData && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.overlay,
            {
              opacity,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.alertContainer,
              {
                transform: [{translateY}],
              },
            ]}
          >
            {/* LEFT ACCENT */}

            <View
              style={[
                styles.leftAccent,
                {
                  backgroundColor:
                    alertStyle.accent,
                },
              ]}
            />

            {/* ICON */}

            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    alertStyle.iconBackground,
                },
              ]}
            >
              <Icon
                name={alertStyle.icon}
                size={25}
                color={alertStyle.iconColor}
              />
            </View>

            {/* CONTENT */}

            {alertData.isConfirm
              ? renderConfirmContent()
              : renderNormalContent()}

            {/* CLOSE */}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={hideAlert}
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              <Icon
                name="close"
                size={19}
                color="#6B7280"
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </AppAlertContext.Provider>
  );
};

// ======================================================
// HOOK
// ======================================================

export const useAppAlert = () => {
  const context = useContext(AppAlertContext);

  if (!context) {
    throw new Error(
      'useAppAlert must be used inside AppAlertProvider',
    );
  }

  return context;
};

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

  // ====================================================
  // OVERLAY
  // ====================================================

  overlay: {
    position: 'absolute',

    left: 0,
    right: 0,
    top: 0,

    alignItems: 'center',

    zIndex: 999999,
    elevation: 999999,

    pointerEvents: 'box-none',
  },

  // ====================================================
  // ALERT CARD
  // ====================================================

  alertContainer: {
    width: SCREEN_WIDTH - 20,

    minHeight: 96,

    marginTop:
      Platform.OS === 'android'
        ? 42
        : 52,

    backgroundColor: COLORS.white,

    borderRadius: 18,

    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 16,

    paddingLeft: 14,

    paddingRight: 6,

    borderWidth: 1,

    borderColor: '#DDE5EF',

    elevation: 18,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 7,
    },

    shadowOpacity: 0.20,

    shadowRadius: 16,

    overflow: 'hidden',
  },

  // ====================================================
  // LEFT ACCENT
  // ====================================================

  leftAccent: {
    position: 'absolute',

    left: 0,
    top: 0,
    bottom: 0,

    width: 4,
  },

  // ====================================================
  // ICON
  // ====================================================

  iconContainer: {
    width: 52,
    height: 52,

    borderRadius: 26,

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 2,

    marginRight: 12,
  },

  // ====================================================
  // NORMAL CONTENT
  // ====================================================

  content: {
    flex: 1,

    minWidth: 0,

    justifyContent: 'center',

    paddingVertical: 2,

    paddingRight: 4,
  },

  // ====================================================
  // CONFIRM CONTENT
  // ====================================================

  confirmContent: {
    flex: 1,

    minWidth: 0,

    justifyContent: 'center',

    paddingVertical: 4,

    paddingRight: 4,
  },

  // ====================================================
  // TITLE
  // ====================================================

  title: {
    fontSize: 16,

    fontWeight: '700',

    color: COLORS.navy,

    marginBottom: 4,
  },

  // ====================================================
  // MESSAGE
  // ====================================================

  message: {
    fontSize: 14,

    lineHeight: 20,

    color: COLORS.subText,

    paddingRight: 0,

    flexShrink: 1,
  },

  // ====================================================
  // CONFIRM BUTTONS
  // ====================================================

  confirmButtons: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'flex-end',

    marginTop: 10,
  },

  // ====================================================
  // NO BUTTON
  // ====================================================

  noButton: {
    minWidth: 65,

    paddingVertical: 7,

    paddingHorizontal: 14,

    borderRadius: 6,

    borderWidth: 1,

    borderColor: '#D1D5DB',

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 8,

    backgroundColor: '#FFFFFF',
  },

  noButtonText: {
    color: '#6B7280',

    fontSize: 12,

    fontWeight: '700',
  },

  // ====================================================
  // YES BUTTON
  // ====================================================

  yesButton: {
    minWidth: 65,

    paddingVertical: 7,

    paddingHorizontal: 14,

    borderRadius: 6,

    backgroundColor: COLORS.navy,

    alignItems: 'center',

    justifyContent: 'center',
  },

  yesButtonText: {
    color: COLORS.white,

    fontSize: 12,

    fontWeight: '700',
  },

  // ====================================================
  // CLOSE BUTTON
  // ====================================================

  closeButton: {
    width: 34,

    height: 48,

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 2,
  },
});