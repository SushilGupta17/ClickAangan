import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import ContactOwnerScreen from './src/screens/ContactOwnerScreen';
import EnquiryScreen from './src/screens/EnquiryScreen';
import { Linking } from 'react-native';
import WishlistScreen from './src/screens/WishlistScreen';
import SearchScreen from './src/screens/SearchScreen';
import AiSearchScreen from './src/screens/AiSearchScreen';
import FilterScreen from './src/screens/FilterScreen';
import AddPropertyScreen from './src/screens/AddPropertyScreen';
import ProjectListScreen from './src/screens/ProjectListScreen';
import RentalListScreen from './src/screens/RentalListScreen';
import RentHomeScreen from './src/screens/RentHomeScreen';
import ProjectDetailsScreen from './src/screens/ProjectDetailsScreen';
import RentalDetailsScreen from './src/screens/RentalDetailedScreen';
import RoleBasedRegistrationScreen from './src/screens/RoleBasedRegistrationScreen'
import OTPScreen  from './src/screens/OTPScreen'

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['propertyapp://'],
  
  config: {
    screens: {
      PropertyDetails: 'property/:id',
    },
  },
};

function App() {
  useEffect(() => {
  Linking.getInitialURL().then(url => {
    console.log('Initial URL:', url);
  });

  const sub = Linking.addEventListener('url', ({ url }) => {
    console.log('Deep Link:', url);
  });

  return () => sub.remove();
}, []);

  return (
  <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

 <Stack.Screen
          name="RentHome"
          component={RentHomeScreen}
        />

<Stack.Screen
  name="RoleBasedRegistration"
  component={RoleBasedRegistrationScreen}
/>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

         <Stack.Screen
          name="PropertyDetails"
          component={DetailsScreen}
        />

        <Stack.Screen
          name="ContactOwner"
          component={ContactOwnerScreen}
        />

        <Stack.Screen
            name="Wishlist"
            component={WishlistScreen}
        />

        <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
        />

        <Stack.Screen
            name="EnquiryScreen"
            component={EnquiryScreen}
        />

        <Stack.Screen
            name="AiSearchScreen"
            component={AiSearchScreen}
        />

        <Stack.Screen 
            name="FilterScreen"
            component={FilterScreen}
        />

        <Stack.Screen
             name="AddPropertyScreen"
             component={AddPropertyScreen}
        />

        <Stack.Screen  name="ProjectList" component={ProjectListScreen} />
        
        <Stack.Screen  name="RentalList" component={RentalListScreen} />

        <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen}
            options={{
                headerShown:false,
            }}
        />

        <Stack.Screen name="RentDetails" component={RentalDetailsScreen} />
        </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;