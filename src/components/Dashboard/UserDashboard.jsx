import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import { formatTime, onlyDate } from '../../utls/TextUtils';
import { GoDotFill } from "react-icons/go";

const UserDashboard = () => {
    const [lastData, setLastData] = useState([]);
    const [totalBooking, setTotalBooking] = useState('');
    const [totalConfirmBooking, setTotalCBooking] = useState('');
    const [totalCancelled, setTotalCancelled] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('api/booking-stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                setLastData(response.data.last_3_bookings);
                setTotalBooking(response.data.total_bookings);
                setTotalCBooking(response.data.total_confirmed_reserved);
                setTotalCancelled(response.data.total_confirmed_reserved_status_false);
            } catch (e) {
                setError('An error occurred while fetching the data');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Total Bookings</h2>
                        <p className="text-4xl font-bold">{totalBooking}</p>
                    </div>
                    <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Total Confirmed Bookings</h2>
                        <p className="text-4xl font-bold">{totalConfirmBooking}</p>
                    </div>
                    <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Cancelled Bookings</h2>
                        <p className="text-4xl font-bold">{totalCancelled}</p>
                    </div>
                </div>

                {/* Recent Activities Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
                    {lastData.length > 0 ? (
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b text-left">Futsal</th>
                                    <th className="px-4 py-2 border-b text-left">Address</th>
                                    <th className="px-4 py-2 border-b text-left">Phone</th>
                                    <th className="px-4 py-2 border-b text-center">Start Time</th>
                                    <th className="px-4 py-2 border-b text-center">End Time</th>
                                    <th className="px-4 py-2 border-b text-center">Booking Date</th>
                                    <th className="px-4 py-2 border-b text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lastData.map((data, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{data.futsal.name}</td>
                                        <td className="px-4 py-2 border-b">{data.futsal.location}</td>
                                        <td className="px-4 py-2 border-b">{data.futsal.phone}</td>
                                        <td className="px-4 py-2 border-b text-center">{formatTime(data.start_time)}</td>
                                        <td className="px-4 py-2 border-b text-center">{formatTime(data.end_time)}</td>
                                        <td className="px-4 py-2 border-b text-center">{onlyDate(data.booking_date)}</td>
                                        <td className="px-4 py-2 border-b text-center">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                                                data.is_confirmed
                                                    ? 'bg-green-200 text-green-800'
                                                    : 'bg-red-200 text-red-800'
                                                }`}
                                            >
                                                <GoDotFill className="mr-1" />
                                                {data.is_confirmed ? 'Reserved' : 'Not Paid'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center">No recent activities.</div>
                    )}
                </div>
            </div>
    );
};

export default UserDashboard;
