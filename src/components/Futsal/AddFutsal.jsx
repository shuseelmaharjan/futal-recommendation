import React, { useState, useEffect } from 'react';
import UseMap from '../Explore/UseMap';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiClient from '../apiClient';

const AddFutsal = ({ isOpen, closeModal, handleSubmit }) => {
  const [futsalData, setFutsalData] = useState({
    name: '',
    description: '',
    location: '',
    phone: '',
    longitude: '',
    latitude: '',
    image: null,
    user_id: '', 
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await apiClient.get('api/user-id', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setFutsalData((prevState) => ({
          ...prevState,
          user_id: response.data.user_id, 
        }));
      } catch (error) {
        console.error('Error fetching user ID:', error);
        toast.error('Failed to fetch user information');
      }
    };

    fetchUserId();
  }, []);

  const setDestination = (coords) => {
    setFutsalData((prevState) => ({
      ...prevState,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }));
  };
  

  const handleChange = (e) => {
    setFutsalData({
      ...futsalData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFutsalData({
      ...futsalData,
      image: e.target.files[0],
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data before submit:', futsalData); 
  
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', futsalData.name);
      formData.append('description', futsalData.description);
      formData.append('location', futsalData.location);
      formData.append('phone', futsalData.phone);
      formData.append('longitude', futsalData.longitude);
      formData.append('latitude', futsalData.latitude);  
      formData.append('user_id', futsalData.user_id); 
      if (futsalData.image) formData.append('image', futsalData.image);
  
      const response = await axios.post('http://localhost:8000/api/add-futsal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      // Handle success
      toast.success('Futsal added successfully!');
      handleSubmit(response.data); 
      closeModal();
    } catch (error) {
      console.error('Error submitting futsal data:', error);
      toast.error('Failed to add futsal');
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="container bg-white p-6 rounded shadow-lg w-lg max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Add My Futsal</h2>
        <form onSubmit={handleFormSubmit}>
          {/* Futsal Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">Futsal Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={futsalData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={futsalData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={futsalData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-2">Choose Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mb-2">
            {/* Left side: Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <textarea
                id="description"
                name="description"
                value={futsalData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            {/* Right side: Map */}
            <div>
              <label className="block text-sm font-medium mb-2 mb-2">Pin your futsal location here</label>
              <UseMap setDestination={setDestination}/>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Futsal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFutsal;
