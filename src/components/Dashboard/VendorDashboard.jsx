import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_confirmed: 0,
    total_reserved: 0,
    total_status_false: 0,
    bookings_today: 0,
  });
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('api/futsal-owner-stat', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        // Ensure the response contains the expected data structure
        if (response.data) {
          const {
            total_confirmed,
            total_reserved,
            total_status_false,
            bookings_today,
          } = response.data;

          setDashboardData({
            total_confirmed,
            total_reserved,
            total_status_false,
            bookings_today,
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
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Confirmed Bookings</h2>
          <p className="text-2xl">{dashboardData.total_confirmed}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Reserved Bookings</h2>
          <p className="text-2xl">{dashboardData.total_reserved}</p>
        </div>

        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Status False Bookings</h2>
          <p className="text-2xl">{dashboardData.total_status_false}</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Bookings Today</h2>
          <p className="text-2xl">{dashboardData.bookings_today}</p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
