import axios from 'axios';

const API_URL2 = 'http://192.168.1.3:7045/api/Property';
const API_URL = 'https://savariyaproperty.in/api/property'

export const getProperties = async () => {
  try {
   
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.log('API Error:', error);
    throw error;
  }
};

export const getRentalProperties = async () => {
try {
const response = await axios.get(
`${API_URL}/Rent`
);


} catch (error) {
console.log(
'Get Rental Properties Error:',
error
);

}
};


