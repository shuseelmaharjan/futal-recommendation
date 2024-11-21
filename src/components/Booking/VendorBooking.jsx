import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import { formatTime, onlyDate } from './../../utls/TextUtils';
import { GoDotFill } from "react-icons/go";
import { toast } from 'react-toastify';

const VendorBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null); 
  const rowsPerPage = 10;

  const fetchBooking = async () => {
    try {
      const response = await apiClient.get('api/futsal-bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const totalPages = Math.ceil(bookings.length / rowsPerPage);

  const currentData = bookings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleConfirmation = (booking) => {
    setSelectedBooking(booking); 
    setConfirmModal(true);
  };

  const handleCancelBooking = async () => {
    if (selectedBooking) {
      try {
        const response = await apiClient.post('api/cancel-booking', {
          booking_id: selectedBooking.id,
          user_id: selectedBooking.user.id,
          futsal_id: selectedBooking.futsal,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.status === 200) {
          toast.success('Booking cancelled successfully');
        } else {
          toast.alert('Error cancelling booking');
        }
      } catch (error) {
        console.error('Error canceling booking:', error);
        toast.alert('Error cancelling booking');
      }
    }
    setConfirmModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-3 text-left">S.N.</th>
            <th className="border p-3 text-left">Name</th>
            <th className="border p-3 text-left">Phone</th>
            <th className="border p-3 text-center">Start Time</th>
            <th className="border p-3 text-center">End Time</th>
            <th className="border p-3 text-center">Booking Date</th>
            <th className="border p-3 text-center">Booking</th>
            <th className="border p-3 text-center">Payment Status</th>
            <th className="border p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((booking, index) => (
              <tr key={booking.id}>
                <td className="border p-2 text-center">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="border p-2">{booking.user?.name || 'N/A'}</td>
                <td className="border p-2">{booking.user?.phone || 'N/A'}</td>
                <td className="border p-2 text-center">{formatTime(booking.start_time)}</td>
                <td className="border p-2 text-center">{formatTime(booking.end_time)}</td>
                <td className="border p-2 text-center">{onlyDate(booking.booking_date)}</td>
                <td className="border p-2 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                      booking.is_confirmed
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    <GoDotFill className="mr-1" />
                    {booking.is_confirmed ? 'Booked' : 'Not Confirmed'}
                  </span>
                </td>
                <td className="border p-2 text-center">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                      booking.payment_status === 'Paid'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    <GoDotFill className="mr-1" />
                    {booking.payment_status}
                  </div>
                </td>
                <td className="border p-2 text-center">
                  <button
                    className="bg-red-800 text-white px-4 rounded hover:bg-red-700 transition"
                    onClick={() => handleConfirmation(booking)} // Pass booking to confirmation
                  >
                    Remove Request
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="border p-2 text-center">
                No bookings available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end items-end mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-1 mx-1 rounded ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-emerald-900 text-white hover:bg-emerald-950'
          }`}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-1 mx-1 rounded ${
              currentPage === index + 1
                ? 'bg-emerald-950 text-white'
                : 'bg-emerald-800 text-white hover:bg-emerald-950'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-1 mx-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-emerald-800 text-white hover:bg-emerald-950'
          }`}
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Are you sure you want to remove <br/> {selectedBooking.user?.name} booking?</h3>
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 ml-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={handleCancelBooking} 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-4"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorBooking;
