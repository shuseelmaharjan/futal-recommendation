import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../apiClient';
import { BASE_URL } from '../../constant/constants';
import ShowMap from '../Explore/ShowMap';

const Futsal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [futsalData, setFutsalData] = useState([]);
  const [currentFutsal, setCurrentFutsal] = useState(null); // To track the futsal being edited
  const [existData, setExist] = useState(false); // Track if user exists

  const openModal = (futsal) => {
    setCurrentFutsal(futsal); // Set the futsal data for editing
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => setIsModalOpen(false);

  // Fetch user existence
  const fetchUserExist = async () => {
    try {
      const response = await apiClient.get('api/check-user-existence', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setExist(response.data.exists);
      console.log(response.data.exists);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch futsal data
  const fetchFutsalData = async () => {
    try {
      const response = await apiClient.get('/api/list-futsals', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setFutsalData(response.data);
    } catch (error) {
      toast.error('An error occurred while fetching data.');
      console.error(error);
    }
  };

  // Fetch user existence and futsal data on initial load
  useEffect(() => {
    fetchUserExist();
    fetchFutsalData();
  }, []);

  // Handle form submission to update futsal data
  const handleUpdateFutsal = async (updatedFutsalData) => {
    try {
      await apiClient.put(`/api/update-futsal/${updatedFutsalData.id}`, updatedFutsalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      toast.success('Futsal updated successfully!');
      closeModal();
      fetchFutsalData(); // Refresh the futsal data after update
    } catch (error) {
      toast.error('An error occurred while updating the futsal.');
      console.error(error);
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-emerald-950">My Futsal</h1>
        <div>
          {existData ? (
            <button
              className="btn bg-green-600 text-white p-2 mx-2 rounded font-semibold"
              onClick={() => openModal(futsalData[0])} // Open modal for the first futsal data for example
            >
              Edit Info
            </button>
          ) : (
            <button
              className="btn bg-green-600 text-white p-2 mx-2 rounded font-semibold"
              onClick={() => openModal(null)} // Open modal for adding futsal
            >
              Add Futsal
            </button>
          )}
        </div>
      </div>

      <div>
        {futsalData.length > 0 ? (
          futsalData.map((futsal) => (
            <div
              key={futsal.id}
              className="border rounded shadow p-4 bg-white flex flex-col justify-between mb-4"
            >
              <div className="flex flex-wrap justify-between">
                <div className="w-full md:w-1/2 mt-2">
                  <img
                    src={`${BASE_URL}${futsal.image}`}
                    alt={futsal.name}
                    className="w-full object-cover rounded p-2"
                    style={{ height: '400px' }}
                  />
                </div>

                {/* Right: Map */}
                <div className="w-full md:w-1/2 p-2">
                  <ShowMap latitude={futsal.latitude} longitude={futsal.longitude} />
                </div>
              </div>

              <h2 className="mt-2 text-2xl text-emerald-950 font-bold">{futsal.name}</h2>
              <div className="flex mt-2 text-lg">
                <h3>
                  <span className="text-emerald-950 font-bold">Location: </span>
                  {futsal.location || 'Location not specified'}
                </h3>
                <h3 className="mx-4">
                  <span className="text-emerald-950 font-bold">Phone: </span>
                  {futsal.phone || 'N/A'}
                </h3>
              </div>
              <p className="text-gray-700 text-lg mt-4">{futsal.description}</p>

              {/* Edit button */}
              <button
                className="bg-blue-600 text-white p-2 mt-2 rounded"
                onClick={() => openModal(futsal)}
              >
                Edit Info
              </button>
            </div>
          ))
        ) : (
          <p>No futsal data available.</p>
        )}
      </div>

      {/* Modal for Add or Edit Futsal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="container bg-white p-6 rounded shadow-lg w-lg max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">{currentFutsal ? 'Edit My Futsal' : 'Add My Futsal'}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateFutsal(currentFutsal);
              }}
            >
              {/* Futsal Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-2">Futsal Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={currentFutsal?.name || ''}
                  onChange={(e) => setCurrentFutsal({ ...currentFutsal, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              {/* Phone, Location, Image, Description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={currentFutsal?.phone || ''}
                    onChange={(e) => setCurrentFutsal({ ...currentFutsal, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={currentFutsal?.location || ''}
                    onChange={(e) => setCurrentFutsal({ ...currentFutsal, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium mb-2">Choose Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={(e) => setCurrentFutsal({ ...currentFutsal, image: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={currentFutsal?.description || ''}
                  onChange={(e) => setCurrentFutsal({ ...currentFutsal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-between mt-4">
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
                >
                  Save Futsal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Futsal;
