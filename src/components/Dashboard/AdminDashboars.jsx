import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_admins: 0,
    total_users: 0,
    total_vendors: 0,
    total_futsals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('api/dashboard-stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        // Validate the response data structure
        if (response.data) {
          const { total_admins, total_users, total_vendors, total_futsals } =
            response.data;

          setDashboardData({
            total_admins,
            total_users,
            total_vendors,
            total_futsals,
          });
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4 text-lg font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Admins</h2>
          <p className="text-2xl">{dashboardData.total_admins}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Vendors</h2>
          <p className="text-2xl">{dashboardData.total_vendors}</p>
        </div>

        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl">{dashboardData.total_users}</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Futsals</h2>
          <p className="text-2xl">{dashboardData.total_futsals}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
