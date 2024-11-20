import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../apiClient';
import { BASE_URL } from '../../constant/constants';
import ShowMap from '../Explore/ShowMap';
import UpdateFutsal from './UpdateFutsal';

const Futsal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [futsalData, setFutsalData] = useState([]);
  const [currentFutsal, setCurrentFutsal] = useState(null);
  const [existData, setExist] = useState(false);

  const openModal = (futsal) => {
    setCurrentFutsal(futsal || { name: '', phone: '', location: '', image: null, description: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFutsal(null);
  };

  const fetchUserExist = async () => {
    try {
      const response = await apiClient.get('api/check-user-existence', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setExist(response.data.exists);
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    fetchUserExist();
    fetchFutsalData();
  }, []);

  return (
    <div className="mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-emerald-950">My Futsal</h1>
        <div>
          {existData ? (
            <button
              className="btn bg-emerald-600 text-white p-2 mx-2 rounded font-semibold"
              onClick={() => openModal(futsalData[0])}
            >
              Edit Info
            </button>
          ) : (
            <button
              className="btn bg-emerald-600 text-white p-2 mx-2 rounded font-semibold"
              onClick={() => openModal(null)}
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
            </div>
          ))
        ) : (
          <p>No futsal data available.</p>
        )}
      </div>

      {isModalOpen && (
        <UpdateFutsal
          currentFutsal={currentFutsal}
          closeModal={closeModal}
          fetchFutsalData={fetchFutsalData}
        />
      )}
    </div>
  );
};

export default Futsal;
