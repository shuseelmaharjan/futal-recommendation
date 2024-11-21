import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import { formatDate } from '../../utls/TextUtils';
import { BASE_URL } from '../../constant/constants';

const VendorPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await apiClient.get('api/futsal-payment', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setPayments(response.data.payments);
      } catch (error) {
        console.error('Error fetching user payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {payments.length === 0 ? (
        <div className="text-center text-gray-500">No payments found.</div>
      ) : (
        <>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-3 text-left">S.N.</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">Paid Amount</th>
                <th className="border p-3 text-left">Created At</th>
                <th className="border p-3 text-left">View Doc</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment.payment_id} className="border-t">
                  <td className="border p-3 text-center">{index + 1}</td>
                  <td className="border p-3">{payment.user_details.name}</td>
                  <td className="border p-3">{payment.user_details.phone}</td>
                  <td className="border p-3">NRs. {payment.payment_amount}</td>
                  <td className="border p-3">
                    {formatDate(payment.payment_date)}
                  </td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => openModal(payment.screenshot)}
                      className="text-blue-500 hover:underline"
                    >
                      View Doc
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {modalImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={closeModal} 
            >
              <div
                className="bg-white p-4 rounded-lg max-w-lg w-full"
                onClick={(e) => e.stopPropagation()} 
              >
                <img
                  src={`${BASE_URL}${modalImage}`}
                  alt="Payment Screenshot"
                  className="max-h-[500px] w-full object-contain"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VendorPayment;
