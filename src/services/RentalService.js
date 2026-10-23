import axios from 'axios';

const API_URL1= 'http://192.168.1.4:7045/api/rent';

const API_URL= 'https://savariyaproperty.in/api/rent';

export const getRentalProperties = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.log('API Error:', error);
    throw error;
  }
};

export const getRentalDetails = async rentalId => {
  try {
     const response = await axios.get(`${API_URL}/${rentalId}`);
     return response.data;
  } catch (error) {
    console.log('GET RENTAL DETAILS ERROR:', error);
    throw error;
  }
};