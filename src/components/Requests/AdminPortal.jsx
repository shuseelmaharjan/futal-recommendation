import React, { useEffect, useState } from 'react';
import apiClient from '../apiClient';
import { BASE_URL } from '../../constant/constants';
import { formatDate } from '../../utls/TextUtils';
import { toast } from 'react-toastify';

const AdminPortal = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState([]);

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await apiClient.get('api/pending-verification');
      setUserData(response.data);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // View click handler
  const handleViewClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Verify user handler
  const handleVerify = async (user_id, row_id) => {
    try {
      const response = await apiClient.put(`api/update-vendor/${user_id}`);
      toast.success(response.data.message);

      await apiClient.post(`api/update-vendor-status/${row_id}/${user_id}`);

      // After verification, refresh the table data
      await fetchData();

      setIsModalOpen(false);
    } catch (e) {
      toast.error('Verification failed. Please try again.');
      console.error('Error during verification:', e);
    }
  };

  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white">
      <table className="min-w-full">
        <thead>
          <tr className='border-b'>
            <th className="px-6 py-3 text-left text-gray-600">S.N.</th>
            <th className="px-6 py-3 text-left text-gray-600">Name</th>
            <th className="px-6 py-3 text-left text-gray-600">Email</th>
            <th className="px-6 py-3 text-left text-gray-600">Phone</th>
            <th className="px-6 py-3 text-left text-gray-600">Date</th>
            <th className="px-6 py-3 text-left text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {userData.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-gray-600 py-4 border-b">No records found</td>
            </tr>
          ) : (
            userData.map((user, index) => (
              <tr key={user.id} className="border-t hover:bg-gray-100">
                <td className="px-6 py-1">{index + 1}.</td>
                <td className="px-6 py-1">{user.user.name}</td>
                <td className="px-6 py-1">{user.user.email}</td>
                <td className="px-6 py-1">{user.user.phone}</td>
                <td className="px-6 py-1">{formatDate(user.date)}</td>
                <td className="px-6 py-1">
                  <button
                    onClick={() => handleViewClick(user)}
                    className="px-4 py-1 text-white bg-emerald-800 hover:bg-emerald-950 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal to show user details and verify */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 max-h-[80vh]">
            <h3 className="text-xl font-semibold mb-4">User Details</h3>
            <div className="flex justify-between items-center mb-4 border-b border-gray-400">
              <p><strong>Name:</strong> {selectedUser.user.name}</p>
              <p><strong>Email:</strong> {selectedUser.user.email}</p>
              <p><strong>Phone:</strong> {selectedUser.user.phone}</p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <div>
                <strong>Cover Letter:</strong>
                <br />
                <img
                  src={`${BASE_URL}${selectedUser.coverletter}`}
                  alt="Cover Letter"
                  className="w-full object-cover mt-2"
                />
              </div>
              <div>
                <strong>Registration Document:</strong>
                <br />
                <img
                  src={`${BASE_URL}${selectedUser.registration}`}
                  alt="Registration"
                  className="w-full object-cover mt-2"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-700 rounded"
              >
                Close
              </button>
              <button
                onClick={() => handleVerify(selectedUser.user.id, selectedUser.id)}
                className="px-4 py-2 text-white bg-emerald-800 hover:bg-emerald-950 rounded"
              >
                Verify {selectedUser.user.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
