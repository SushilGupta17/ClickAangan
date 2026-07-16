import React, {useState} from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const WishlistScreen = ({navigation}) => {
  const API_URL = 'https://savariyaproperty.in';

 const [wishlist, setWishlist] = useState([]);
 const loadWishlist = async () => {
  try {
    const data = await AsyncStorage.getItem('wishlist');
    const parsed = data ? JSON.parse(data) : [];
    setWishlist(parsed);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    loadWishlist();
  });

  return unsubscribe;
}, [navigation]);

const removeFromWishlist = async (id) => {
  try {
    const updatedWishlist = wishlist.filter(item => item.id !== id);

    await AsyncStorage.setItem(
      'wishlist',
      JSON.stringify(updatedWishlist),
    );

    setWishlist(updatedWishlist);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        <View style={styles.headingCard}>
          <Text style={styles.heading}>
            My Wishlist
          </Text>

          <Text style={styles.subHeading}>
            Your favourite properties are saved here.
          </Text>
        </View>

        {wishlist.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>❤️</Text>

            <Text style={styles.emptyTitle}>
              No Favourite Properties
            </Text>

            <Text style={styles.emptyText}>
              Save your favourite properties and
              they will appear here.
            </Text>

            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() =>
                navigation.navigate('Home')
              }>
              <Text style={styles.exploreButtonText}>
                Explore Properties
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          wishlist.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.propertyCard}
              onPress={() =>
                navigation.navigate(
                  'PropertyDetails',
                )
              }>
                <Image
                        source={{ uri: API_URL + item.imageUrl }}
                        style={styles.propertyImage}
                        resizeMode="cover"
                      />
                      

              <View style={styles.propertyContent}>
                <Text
                  style={styles.propertyTitle}>
                  {item.title}
                </Text>

                <Text
                  style={
                    styles.propertyLocation
                  }>
                  📍 {item.location}
                </Text>

                <Text
                  style={styles.propertyPrice}>
                  {item.price}
                </Text>

 <View style={styles.buttonRow}>

  <TouchableOpacity
    style={styles.detailsButton}
    onPress={() =>
      navigation.navigate('PropertyDetails', {
        property: item,
        id: item.id,
      })
    }>
    <Text style={styles.detailsButtonText}>
      View Details
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.removeButton}
    onPress={() => removeFromWishlist(item.id)}>
    <Text style={styles.removeButtonText}>
      Remove
    </Text>
  </TouchableOpacity>

</View>

              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  container: {
    padding: 20,
    paddingBottom: 100,
  },

  headingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },

  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  subHeading: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    elevation: 4,
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginTop: 20,
  },

  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },

  exploreButton: {
    marginTop: 25,
    backgroundColor: '#0A8754',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
  },

  exploreButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
  },

  propertyImage: {
    width: '100%',
    height: 180,
  },

  propertyContent: {
    padding: 15,
  },

  propertyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },

  propertyPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A8754',
    marginTop: 10,
  },

  detailsButton: {
    backgroundColor: '#0A8754',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 15,
    alignItems: 'center',
  },

  detailsButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 15,
},

detailsButton: {
  flex: 1,
  backgroundColor: '#0A8754',
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  marginRight: 8,
},

removeButton: {
  flex: 1,
  backgroundColor: '#E53935',
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
},

removeButtonText: {
  color: '#fff',
  fontWeight: '700',
},

detailsButtonText: {
  color: '#fff',
  fontWeight: '700',
},
});