import axios from 'axios';

// ===============================
// API Base URL
// ===============================

// Local
 const BASE_URL2 = 'http://192.168.1.3:7045/api/';

// Live
const BASE_URL= 'https://savariyaproperty.in/api/';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  },
});

// ==========================================
// Add Property
// ==========================================

export const addProperty = async formData => {
  try {
    const response = await api.post(
      'Property',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
    );
    return response.data;
  } catch (error) {
    console.log(error.response?.data || error);
    throw error.response?.data || error;
  }
};

// ==========================================
// Update Property
// ==========================================

export const updateProperty = async (
  id,
  formData,
) => {
  try {
    const response = await api.put(
      `Property/UpdateProperty/${id}`,
      formData,
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error.response?.data || error;
  }
};

// ==========================================
// Delete Property
// ==========================================

export const deleteProperty = async id => {
  try {
    const response = await api.delete(
      `Property/DeleteProperty/${id}`,
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error.response?.data || error;
  }
};

// ==========================================
// Property Details
// ==========================================

export const getPropertyDetails = async id => {
  try {
    const response = await api.get(
      `Property/GetPropertyDetails/${id}`,
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error.response?.data || error;
  }
};

// ==========================================
// Property List
// ==========================================

export const getProperties = async () => {
  try {
    const response = await api.get(
      'Property/GetProperties',
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error.response?.data || error;
  }
};

// ==========================================
// Search Property
// ==========================================

export const searchProperties = async body => {
  try {
    const response = await api.post(
      'Property/SearchProperty',
      body,
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error.response?.data || error;
  }
};

// ==========================================
// Wishlist
// ==========================================

export const addWishlist = async body => {
  try {
    const response = await api.post(
      'Wishlist/AddWishlist',
      body,
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeWishlist = async body => {
  try {
    const response = await api.post(
      'Wishlist/RemoveWishlist',
      body,
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ==========================================
// Enquiry
// ==========================================

export const sendEnquiry = async body => {
  try {
    const response = await api.post(
      'Enquiry/AddEnquiry',
      body,
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;