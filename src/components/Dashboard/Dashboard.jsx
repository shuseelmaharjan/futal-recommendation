import React, { useEffect, useState } from 'react'
import apiClient from '../apiClient';
import UserDashboard from './UserDashboard';
import VendorDashboard from './VendorDashboard';
import AdminDashboard from './AdminDashboars';

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
          <h1 className="text-2xl font-bold text-emerald-950">Dashboard</h1>
        </div>
        <VendorDashboard/>
      </div>
    )}
    {role === 'admin' && (
      <div className="mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-emerald-950">Dashboard</h1>
        </div>
        <AdminDashboard/>
      </div>
    )}
    </>
  )
}

export default Dashboard;
