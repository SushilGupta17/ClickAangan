// src/screens/AiSearchScreen.js

import React, {useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';

import Header from '../components/Header';
import Footer from '../components/Footer';


const AiSearchScreen = ({navigation}) => {
  
  const flatListRef = useRef(null);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      text:
        '👋 Namaste!\nMain Savariya AI hoon.\nAap kis type ki property dhoondh rahe hain?',
    },
  ]);

  const addMessage = (text, type) => {
    const message = {
      id: Date.now().toString() + Math.random(),
      text,
      type,
    };

    setMessages(prev => [...prev, message]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);
  };

  const searchProperty = async () => {
    if (!query.trim()) {
      Alert.alert('Please enter your requirement.');
      return;
    }

    const currentQuery = query.trim();

    addMessage(currentQuery, 'user');
    setQuery('');
    setLoading(true);

    try {
      // Replace with your API
      /*
      const response = await fetch(
        'https://your-api-url/api/Property/ai-search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: currentQuery,
          }),
        },
      );

      const data = await response.json();
      */

      // Temporary Demo Data
      const data = {
        message:
          'Jaipur me 12 properties mili hain.',
        properties: [
          {
            id: 1,
            title: '3 BHK Flat',
            location: 'Mansarovar, Jaipur',
            price: '₹45,00,000',
          },
          {
            id: 2,
            title: '3 BHK Luxury Apartment',
            location: 'Vaishali Nagar, Jaipur',
            price: '₹49,00,000',
          },
        ],
      };

      addMessage(data.message, 'bot');

      const propertyCards = data.properties.map(
        item => ({
          id:
            'p' +
            item.id +
            Math.random(),
          type: 'property',
          property: item,
        }),
      );

      setMessages(prev => [
        ...prev,
        ...propertyCards,
      ]);
    } catch (error) {
      console.log(error);

      addMessage(
        'Kuch problem aa gayi. Dobara try kijiye.',
        'bot',
      );
    }

    setLoading(false);
  };

  const renderItem = ({item}) => {
    if (item.type === 'property') {
      return (
          <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>

        <View style={styles.propertyCard}>
          <Text style={styles.propertyTitle}>
            🏠 {item.property.title}
          </Text>

          <Text style={styles.propertyText}>
            📍 {item.property.location}
          </Text>

          <Text style={styles.propertyText}>
            💰 {item.property.price}
          </Text>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() =>
              navigation.navigate(
                'PropertyDetails',
                {
                  id: item.property.id,
                },
              )
            }>
            <Text style={styles.viewButtonText}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      );
    }

    const isUser =
      item.type === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser
            ? styles.userContainer
            : styles.botContainer,
        ]}>
        <View
          style={[
            styles.messageCard,
            isUser
              ? styles.userCard
              : styles.botCard,
          ]}>
          <Text
            style={
              styles.messageText
            }>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}>
         <Header />
  <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>

       
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          🤖 Savariya AI Assistant
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item =>
          item.id.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 15,
        }}
      />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator
            size="small"
          />
          <Text
            style={styles.loadingText}>
            Searching properties...
          </Text>
        </View>
      )}

      <View
        style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ex-Jaipur me 3 BHK flat under 50 lakh..."
          placeholderTextColor="#b3afaf"
          value={query}
          onChangeText={setQuery}
          multiline={true}
          numberOfLines={3}

        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={
            searchProperty
          }>
          <Text
            style={styles.sendText}>
            ➤
          </Text>
        </TouchableOpacity>
      </View>
</ScrollView>

        <Footer/>
    </SafeAreaView>
  );
};

export default AiSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      '#F4F6F8',
  },

  header: {
    backgroundColor:
      '#0A84FF',
    paddingVertical: 16,
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  messageContainer: {
    marginBottom: 10,
  },

  userContainer: {
    alignItems: 'flex-end',
  },

  botContainer: {
    alignItems: 'flex-start',
  },

  messageCard: {
    width: '85%',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },

  userCard: {
    backgroundColor:
      '#DCF8C6',
  },

  botCard: {
    backgroundColor:
      '#FFFFFF',
  },

  messageText: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
  },

  propertyCard: {
    backgroundColor:
      '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 4,
  },

  propertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  propertyText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
  },

  viewButton: {
    backgroundColor:
      '#0A84FF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  loadingText: {
    marginLeft: 10,
    color: '#666',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor:
      '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor:
      '#EEEEEE',
  },

  input: {
  flex: 1,
  minHeight: 80,
  maxHeight: 120,
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  paddingHorizontal: 15,
  paddingVertical: 12,
  fontSize: 15,
  color: '#222',
  borderWidth: 1,
  borderColor: '#E0E0E0',
  textAlignVertical: 'top', // Android के लिए जरूरी
},

  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor:
      '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  sendText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});