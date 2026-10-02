import axios from 'axios';
import {API_BASE_URL} from '../config';

const API_URL1= 'http://192.168.1.5:7045/api/project';
const API_URL2= 'https://clickaangan.in/api/project';
const API_URL= 'https://savariyaproperty.in/api/project';

export const addProject = async (formData) => {
  
  const response = await axios.post(
    API_URL,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProjectDetails = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}`);
  return response.data;
};