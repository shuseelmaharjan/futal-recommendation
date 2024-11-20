import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../apiClient';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get('/api/user-info', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center text-lg text-emerald-950">Loading...</div>;
  }

  if (!userData) {
    return <div className="text-center text-lg text-red-600">No user data available.</div>;
  }

  return (
    <div className="mx-auto p-4 mt-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-emerald-950">Profile</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div>
          <span className="font-semibold text-gray-700">Name:</span>
          <span className="text-gray-900 mx-2">{userData.name}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="text-gray-900 mx-2">{userData.email}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Username:</span>
          <span className="text-gray-900 mx-2">{userData.username}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Phone:</span>
          <span className="text-gray-900 mx-2">{userData.phone}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Joined On:</span>
          <span className="text-gray-900 mx-2">
            {new Date(userData.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
