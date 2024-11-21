import React, { useEffect, useState } from 'react'
import apiClient from '../apiClient';
import { toast } from 'react-toastify';
import UserBooking from './UserBooking';
import VendorBooking from './VendorBooking';

const Booking = () => {
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
        toast.error('Failed to fetch user role');
      }
    };

    fetchUserRole();
  }, []); 

  return (
    <>
    {role === 'user' && (
      <div className="mx-auto p-4 mt-10">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-emerald-950">My Booking</h1>
        </div>
        <UserBooking/>
      </div>
    )}
    {role === 'vendor' && (
      <div className="mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-emerald-950">Booking</h1>
        </div>
        <VendorBooking/>
      </div>
    )}
    </>
  )
}

export default Booking;
