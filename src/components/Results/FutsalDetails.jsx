import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../apiClient';
import 'react-datepicker/dist/react-datepicker.css';
import { BASE_URL } from '../../constant/constants';
import { MdVerified } from "react-icons/md";

export const FutsalDetails = () => {
  const { slug } = useParams();
  const [futsal, setFutsal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedAmPm, setSelectedAmPm] = useState('AM');
  const [expiredHour, setExpiredHour] = useState('');
  const [expiredMinute, setExpiredMinute] = useState('');
  const [expiredAmPm, setExpiredAmPm] = useState('AM');
  const [responseMessage, setResponseMessage] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [user, setUser] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [bookingId, setBookingId] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);



  useEffect(() => {
    const fetchFutsalDetails = async () => {
      try {
        const response = await apiClient.get(`api/futsal/${slug}`);
        setFutsal(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFutsalDetails();
  }, [slug]);

  const handleHourChange = (e) => {
    const hour = e.target.value;
    setSelectedHour(hour);
    calculateExpiredTime(hour, selectedMinute, selectedAmPm);
  };

  const handleMinuteChange = (e) => {
    const minute = e.target.value;
    if (minute >= 0 && minute < 60) {
      setSelectedMinute(minute);
      calculateExpiredTime(selectedHour, minute, selectedAmPm);
    }
  };

  const handleAmPmChange = (e) => {
    const amPm = e.target.value;
    setSelectedAmPm(amPm);
    calculateExpiredTime(selectedHour, selectedMinute, amPm);
  };

  const handleExpiredHourChange = (e) => {
    const hour = e.target.value;
    setExpiredHour(hour);
  };

  const handleExpiredMinuteChange = (e) => {
    const minute = e.target.value;
    setExpiredMinute(minute);
  };

  const handleExpiredAmPmChange = (e) => {
    const amPm = e.target.value;
    setExpiredAmPm(amPm);
  };

  const handleDateChange = (event) => {
    const date = event.target.value; 
    setSelectedDate(date);
  };

  const calculateExpiredTime = (hour, minute, amPm) => {
    if (!hour || !minute || !amPm) return;

    const hourIn24Format = amPm === 'AM' && hour === '12' ? 0 : amPm === 'PM' && hour !== '12' ? +hour + 12 : +hour;

    const selectedTimeObj = new Date();
    selectedTimeObj.setHours(hourIn24Format, minute);

    const expiryTime = new Date(selectedTimeObj.getTime() + 60 * 60 * 1000); 
    const expiryHour = expiryTime.getHours() % 12 || 12;
    const expiryMinute = expiryTime.getMinutes();
    const expiryAmPm = expiryTime.getHours() >= 12 ? 'PM' : 'AM';

    setExpiredHour(expiryHour);
    setExpiredMinute(expiryMinute < 10 ? `0${expiryMinute}` : expiryMinute); 
    setExpiredAmPm(expiryAmPm);
  };

  const formatSelectedTime = (hour, minute, amPm) => {
    const hourIn24Format = amPm === 'AM' && hour === '12' ? 0 : amPm === 'PM' && hour !== '12' ? +hour + 12 : +hour;
    const formattedMinute = String(minute).padStart(2, '0'); 
    return `${hourIn24Format}:${formattedMinute}:00`; 
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get('api/user-info', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUser(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserData();
  }, []); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedStartTime = formatSelectedTime(selectedHour, selectedMinute, selectedAmPm);
    const formattedExpireTime = formatSelectedTime(expiredHour, expiredMinute, expiredAmPm);
  
    const bookingDetails = {
      futsal_id: futsal.id, 
      start_time: formattedStartTime,
      end_time: formattedExpireTime,
      booking_date: selectedDate,
    };
    setBookingDate(selectedDate);
    setStartTime(formattedStartTime);
    setEndTime(formattedExpireTime);    
  
    try {
      const response = await apiClient.post('api/reservation-check', bookingDetails);  
      setResponseMessage(response.data);
    } catch (error) {
      console.error('Error checking reservation:', error);
    }
  };
  
  

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }
  if (!futsal) {
    return <div className="text-center">No details available</div>;
  }

  const handleBooking = async () => {
    setIsBooking(true); 
    setBookingMessage(null);  
  
    const bookingData = {
      futsal: futsal.id,  
      user: user.id, 
      start_time: startTime,
      end_time: endTime,
      booking_date: bookingDate,
    };
  
    console.log(bookingData);
  
    try {
      const response = await apiClient.post("/api/create-booking", bookingData);
      setBookingMessage(response.data.message); 
      setBookingId(response.data.booking_id);
    } catch (error) {
      console.error("Error creating booking:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setBookingMessage(error.response.data.message);
      } else {
        setBookingMessage("An error occurred while booking. Please try again.");
      }
    } finally {
      setIsBooking(false);  
    }
  };
  

  const handlePaymentVerification = async () => {
    console.log("Booking ID:", bookingId);
    console.log("Payment verification submitted:", { amount, screenshot });
  
    const formData = new FormData();
    formData.append("booking", bookingId);  
    formData.append("user", user.id);  
    formData.append("payment_amount", amount);  
    formData.append("screenshot", screenshot);  
  
    try {
      const confirmResponse = await apiClient.post('api/confirm-booking', {
        booking_id: bookingId,
        user_id: user.id,
        futsal_id: futsal.id,
      });
  
      console.log("Booking confirmed:", confirmResponse.data);
  
      const paymentResponse = await apiClient.post('api/create-payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log("Payment verification successful:", paymentResponse.data);
  
      setBookingMessage(paymentResponse.data.message);
      setIsModalOpen(false);
  
      setIsSuccessModalOpen(true);
    
    } catch (error) {
      console.error("Error verifying payment:", error);
      
      if (error.response) {
        setBookingMessage(error.response.data.message || 'An error occurred');
      } else {
        setBookingMessage('An error occurred while verifying payment.');
      }
      
      setIsModalOpen(false);
    }
  };
  
  

  return (
    <div className="container mx-auto p-4">
      {/* Image Section */}
      <div className="relative mb-6">
        <img src={`${BASE_URL}${futsal.image}`} alt={futsal.name} className="w-full h-[40vh] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-4xl font-bold">{futsal.name}</h1>
          <p>{futsal.location}</p>
          <p>{futsal.phone}</p>
        </div>
      </div>

      {/* Description Section */}
      <div className="container mx-auto mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p>{futsal.description}</p>
      </div>

      {/* Find Date and Time Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Select Date */}
        <div className="w-[20%]">
          <label htmlFor="date" className="block text-lg mb-2">Pick Date</label>
          <input
        type="date"
        id="datePicker"
        onChange={handleDateChange}
        min={new Date().toISOString().split('T')[0]} // Set min date to today
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Select date"
      />
        </div>

        {/* Select Start Time */}
        <div className="w-[30%] flex gap-4">
          <div className="flex-1">
            <label htmlFor="startTime" className="block text-lg mb-2">Select Start Time</label>
            <div className="flex gap-4">
              <select
                value={selectedHour}
                onChange={handleHourChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Hour</option>
                {[...Array(12).keys()].map((hour) => (
                  <option key={hour + 1} value={hour + 1}>{hour + 1}</option>
                ))}
              </select>
              <select
                value={selectedMinute}
                onChange={handleMinuteChange}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={!selectedHour}
              >
                <option value="">Minute</option>
                {[...Array(60).keys()].map((minute) => (
                  <option key={minute} value={minute < 10 ? '0' + minute : minute}>{minute < 10 ? '0' + minute : minute}</option>
                ))}
              </select>
              <select
                value={selectedAmPm}
                onChange={handleAmPmChange}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={!selectedHour || !selectedMinute}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Select Expire Time */}
        <div className="w-[30%] flex gap-4">
          <div className="flex-1">
            <label htmlFor="expireTime" className="block text-lg mb-2">Select Expire Time</label>
            <div className="flex gap-4">
              <select
                value={expiredHour}
                onChange={handleExpiredHourChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Hour</option>
                {[...Array(12).keys()].map((hour) => (
                  <option key={hour + 1} value={hour + 1}>{hour + 1}</option>
                ))}
              </select>
              <select
                value={expiredMinute}
                onChange={handleExpiredMinuteChange}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={!expiredHour}
              >
                <option value="">Minute</option>
                {[...Array(60).keys()].map((minute) => (
                  <option key={minute} value={minute < 10 ? '0' + minute : minute}>{minute < 10 ? '0' + minute : minute}</option>
                ))}
              </select>
              <select
                value={expiredAmPm}
                onChange={handleExpiredAmPmChange}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={!expiredHour || !expiredMinute}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-[10%] flex items-end justify-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Check Avaibality
          </button>
        </div>
      </div>

      {responseMessage && responseMessage.status === 'available' && (
        <div className="container mx-auto mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-green-600">
            Result: The seat is {responseMessage.status}
          </h2>
    
          <div className="mb-4 flex justify-between">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Booking Time: {startTime} to {endTime}</p>
            <p>Booking Date: {bookingDate}</p>
          </div>
          <p className="text-red-600">Note: You need to verify payment to confirm your booking.</p>
    
          <div className="flex">
            <div className="ml-auto">
              <button
                onClick={handleBooking}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isBooking}
              >
                {isBooking ? "Booking..." : "Book Futsal"}
              </button>
            </div>
          </div>
    
          {bookingMessage &&(
            <>
              <p className="text-green-600 mt-4">{bookingMessage}</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
              >
                Verify Payment
              </button>            
          </>
          )}
        </div>
      )}

      {responseMessage && responseMessage.status === 'unavailable' && (
        <div className="container mx-auto mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Result: Booking is {responseMessage.status}, {responseMessage.message}
          </h2>
        </div>
      )}

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