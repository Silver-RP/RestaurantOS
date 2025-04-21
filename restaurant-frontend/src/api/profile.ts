import api from "./axiosInstance";

api.get('/profile')
  .then((response) => {
    console.log('Profile data:', response.data);
  })
  .catch((error) => {
    console.error('Error fetching profile data:', error);
  } );