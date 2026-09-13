import axios from 'axios';

const API_URL = 'http://192.168.1.3:7045/api/rent';
const API_URL2 = 'https://savariyaproperty.in/api/rent'

export const getRentalProperties = async () => {
  try {
   
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.log('API Error:', error);
    throw error;
  }
};


