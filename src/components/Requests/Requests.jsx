import React, { useEffect, useState } from 'react'
import apiClient from '../apiClient';
import { toast } from 'react-toastify';
import AdminPortal from './AdminPortal';
import VendorPortal from './VendorPortal';

const Requests = () => {
  const [role, setRole] = useState('');

  useEffect(()=>{
    const fetchUserRole = async() => {
      try {
        const response = await apiClient.get('api/user-role', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setRole(response.data.role);
      } catch (error) {
        toast.error('Failed to fetch user ID');
      }
    }

    fetchUserRole();
  });
  return (
    <div className="mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-emerald-950">Vendor Requests</h1>
      </div>
      {role === 'admin' &&(
        <>
        <AdminPortal/>
        </>
      )}
      {role === 'vendor' && (
        <>
        <VendorPortal/>
        </>
      )}
    </div>
  )
}

export default Requests