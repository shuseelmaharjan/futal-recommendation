import React, { useEffect, useState } from 'react'
import apiClient from '../apiClient';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const [role, setRole] = useState('');

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
        console.error(error);
      }
    };

    fetchUserRole();
  }, []); 

  return (
    <>
    {role === 'user' && (
      <div className="mx-auto p-4 mt-10">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-emerald-950">Dashboard</h1>
        </div>
        <UserDashboard/>
      </div>
    )}
    {role === 'vendor' && (
      <div className="mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-emerald-950">Payment</h1>
        </div>
      </div>
    )}
    </>
  )
}

export default Dashboard;
