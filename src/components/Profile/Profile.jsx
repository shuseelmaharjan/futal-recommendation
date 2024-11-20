import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../apiClient';
import { formatDate } from '../../utls/TextUtils';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverletter, setCoverletter] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get('api/user-info', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await apiClient.get('api/user-id', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUserId(response.data.user_id);
      } catch (error) {
        toast.error('Failed to fetch user ID');
      }
    };

    fetchUserId();
  }, []);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await apiClient.get('api/user-role', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setRole(response.data.role);
      } catch (error) {
        toast.error('Failed to fetch user role');
      }
    };

    fetchUserRole();
  }, []);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!coverletter || !registration) {
      toast.error('Both fields are required');
      return;
    }
    const formData = new FormData();
    formData.append('user', userId); 
    formData.append('coverletter', coverletter);
    formData.append('registration', registration);
  
    try {
      const response = await apiClient.post('api/user-documents', formData);
      toast.success(response.data.message);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error('Failed to submit documents');
    }
  };

  // Loading and error states
  if (loading) {
    return <div className="text-center text-lg text-emerald-950">Loading...</div>;
  }

  if (!userData) {
    return <div className="text-center text-lg text-red-600">No user data available.</div>;
  }

  return (
    <>
    {role !== 'user' && (
      <>
      <div className="mx-auto p-4">
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
              {formatDate(userData.created_at)}
            </span>
          </div>
        </div>
      </div>
      </>
      )}
      {role === 'user' &&(
        <>
        <div className="mx-auto p-4 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-emerald-950">Profile</h1>
          <div>
            
              <button
                className="btn bg-emerald-600 text-white p-2 mx-2 rounded font-semibold"
                onClick={() => setIsModalOpen(true)}
              >
                Request Admin Portal
              </button>
            
          </div>
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
              {formatDate(userData.created_at)}
            </span>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Modal for submitting documents */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-emerald-950">Submit Documents</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Cover Letter
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  className="w-full border rounded p-2"
                  onChange={(e) => setCoverletter(e.target.files[0])}
                />
                {coverletter && (
                  <img
                    src={URL.createObjectURL(coverletter)}
                    alt="Cover Letter Preview"
                    className="mt-2 rounded"
                    style={{ height: '100px' }}
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Registration Document
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  className="w-full border rounded p-2"
                  onChange={(e) => setRegistration(e.target.files[0])}
                />
                {registration && (
                  <img
                    src={URL.createObjectURL(registration)}
                    alt="Registration Document Preview"
                    className="mt-2 rounded"
                    style={{ height: '100px' }}
                  />
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-950 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
