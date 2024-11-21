import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import { formatDate } from '../../utls/TextUtils';

const UserPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await apiClient.get('api/user-payments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching user payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {payments.length === 0 ? (
        <div className="text-center text-gray-500">No payments found.</div>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-3 text-left">S.N.</th>
              <th className="border p-3 text-left">Booking</th>
              <th className="border p-3 text-left">Address</th>
              <th className="border p-3 text-left">Paid Amount</th>
              <th className="border p-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment.id} className="border-t">
                <td className="border p-3 text-center">{index + 1}</td>
                <td className="border p-3">{payment.futsal.name}</td>
                <td className="border p-3">{payment.futsal.location}</td>
                <td className="border p-3">NRs. {payment.payment_amount}</td>
                <td className="border p-3">
                  {formatDate(payment.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserPayment;
