import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../apiClient';
import UpdateMap from '../Explore/UpdateMap';

const UpdateFutsal = ({ currentFutsal, closeModal, fetchFutsalData }) => {
  const [futsalData, setFutsalData] = useState(currentFutsal);

  useEffect(() => {
    if (!futsalData.latitude || !futsalData.longitude) {
      apiClient
        .get(`/api/futsal/${currentFutsal.id}`)
        .then((response) => {
          const { latitude, longitude } = response.data;
          setFutsalData((prev) => ({ ...prev, latitude, longitude }));
        })
        .catch((error) => {
          console.error('Failed to fetch futsal coordinates:', error);
        });
    }
  }, [currentFutsal.id, futsalData.latitude, futsalData.longitude]);

  const handleUpdateFutsal = async () => {
    const formData = new FormData();
    Object.keys(futsalData).forEach((key) => {
      if (key === 'image' && typeof futsalData.image === 'string') {
        return;
      }
      formData.append(key, futsalData[key]);
    });

    try {
      if (futsalData.id) {
        await apiClient.put(`/api/update-futsal/${futsalData.id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        toast.success('Futsal updated successfully!');
      } else {
        await apiClient.post('/api/add-futsal', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        toast.success('Futsal added successfully!');
      }
      closeModal();
      fetchFutsalData();
    } catch (error) {
      toast.error('An error occurred while saving the futsal.');
      console.error(error);
    }
  };

  const handleMapUpdate = (location) => {
    setFutsalData((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1050]">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[80vh] overflow-auto relative z-[1060]">
        <h2 className="text-xl font-bold mb-4">
          {futsalData.id ? 'Edit My Futsal' : 'Add My Futsal'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateFutsal();
          }}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">Futsal Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={futsalData.name}
              onChange={(e) => setFutsalData({ ...futsalData, name: e.target.value })}
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
                onChange={(e) => setFutsalData({ ...futsalData, phone: e.target.value })}
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
                onChange={(e) => setFutsalData({ ...futsalData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-2">Choose Image</label>
              <input
                type="file"
                id="image"
                name="image"
                placeholder='test'
                onChange={(e) => setFutsalData({ ...futsalData, image: e.target.files[0] })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={futsalData.description}
                onChange={(e) => setFutsalData({ ...futsalData, description: e.target.value })}
                rows="8"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
                <label htmlFor="map" className='block text-sm font-medium mb-2'>Choose your Location</label>
              <UpdateMap
                defaultCoordinates={{
                  latitude: futsalData.latitude,
                  longitude: futsalData.longitude,
                }}
                setDestination={handleMapUpdate}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="btn bg-red-600 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateFutsal;
