import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import { formatTime, onlyDate } from './../../utls/TextUtils';
import { GoDotFill } from "react-icons/go";
import { MdVerified } from "react-icons/md";
import ShowMap from '../Explore/ShowMap';

const UserBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [futsal, setFutsalId] = useState(null);
  const [user, setUser] = useState({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const rowsPerPage = 10;
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [isShowDetailModel, setisShowDetailModel] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await apiClient.get('api/user-id', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchUserId();
  }, []);


  const fetchBooking = async () => {
    try {
      const response = await apiClient.get('api/bookings', {
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

  const handlePayNow = (booking) => {
    setBookingId(booking.id);
    setFutsalId(booking.futsal.id);
    console.log(booking.id);
    console.log("futsal id:" + booking.futsal.id);
    setIsModalOpen(true);
  };
  
  

  const handlePaymentVerification = async () => {
    console.log("Booking ID:", bookingId);
    console.log("User ID:", user.user_id);
    console.log("Futsal ID:", futsal);
    console.log("Payment verification submitted:", { amount, screenshot });
  
    const formData = new FormData();
    formData.append("booking", bookingId);
    formData.append("user", user.user_id);
    formData.append("payment_amount", amount);
    formData.append("screenshot", screenshot);
  
    try {
      // First API call to create payment
      const paymentResponse = await apiClient.post('api/create-payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Log payment response
      console.log("Payment Response:", paymentResponse.data);
  
      // Second API call to confirm booking
      const confirmBookingResponse = await apiClient.post(
        'api/confirm-booking',
        {
          booking_id: bookingId,
          user_id: user.user_id,
          futsal_id: futsal,
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
  
      // Log booking confirmation response
      console.log("Booking Confirmation Response:", confirmBookingResponse.data);
  
      // Refresh bookings and update UI
      fetchBooking();
      setIsSuccessModalOpen(true);
      setIsModalOpen(false);
    } catch (e) {
      console.error("Error during payment verification:", e);
    }
  };
  
  const handleOpenDetail = async (booking) => {
    console.log(booking.futsal.id);
    
    try {
      const response = await apiClient.get(`api/futsal/${booking.futsal.slug}`);
      setLat(response.data.latitude);
      setLon(response.data.longitude);
    } catch (e) {
      console.error("Error fetching futsal details:", e);
    }
  
    setisShowDetailModel(true);
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-3 text-left">S.N.</th>
            <th className="border p-3 text-left">Futsal Name</th>
            <th className="border p-3 text-left">Location</th>
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
                <td className="border p-2">{booking.futsal?.name || 'N/A'}</td>
                <td className="border p-2">{booking.futsal?.location || 'N/A'}</td>
                <td className="border p-2">{booking.futsal?.phone || 'N/A'}</td>
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
                  {booking.payment_status === 'Paid' ? (
                    <button
                      onClick={() => handleOpenDetail(booking)}
                      className="bg-green-500 text-white px-4 rounded hover:bg-green-600 transition"
                    >
                      View
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePayNow(booking)} 
                      className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition"
                    >
                      Pay Now
                    </button>
                  )}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Verify Payment</h3>
            <form onSubmit={(e) => { e.preventDefault(); handlePaymentVerification(); }}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700">
                  Screenshot (Image)
                </label>
                <input
                  type="file"
                  id="screenshot"
                  onChange={(e) => setScreenshot(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  accept="image/*"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    {isShowDetailModel && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setisShowDetailModel(false)} 
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()} 
        >
          <h3 className="text-xl font-semibold mb-4">Show Information</h3>
          <ShowMap latitude={lat} longitude={lon} />
        </div>
      </div>
    )}


      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4 text-center">Your request submitted successfully.</h3>
          <div className="flex justify-center items-center">
            <MdVerified className='text-[200px] text-green-600' />
          </div>
          <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default UserBooking;
