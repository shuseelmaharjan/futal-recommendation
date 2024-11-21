import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';

export const Results = ({ latitude, longitude }) => {
  const [futsals, setFutsals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the API
    const fetchFutsals = async () => {
      try {
        const response = await apiClient.get('api/futsals');
        setFutsals(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFutsals();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Futsals nearby you.</h1>
      <div className="flex mb-4">
        <p>Latitude: {latitude}, </p>
        <p className="mx-2">Longitude: {longitude}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">S.N.</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Location</th>
              <th className="px-4 py-2 border-b">Phone</th>
              <th className="px-4 py-2 border-b">View</th>
            </tr>
          </thead>
          <tbody>
            {futsals.map((futsal, index) => (
              <tr key={futsal.id} className="text-center">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{futsal.name}</td>
                <td className="px-4 py-2 border-b">{futsal.location}</td>
                <td className="px-4 py-2 border-b">{futsal.phone}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => navigate(`/${futsal.slug}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
