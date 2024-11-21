import React, { useEffect, useState } from "react";
import apiClient from "./../apiClient";
import { useNavigate } from 'react-router-dom';

const FormulaList = ({ latitude, longitude, radius }) => {
  const [futsals, setFutsals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    if (latitude && longitude && radius) {
      const fetchFutsals = async () => {
        try {
          const response = await apiClient.post("api/nearest-futsals", {
            latitude,
            longitude,
            radius,
          });
          setFutsals(response.data);
        } catch (err) {
          console.error(err);
          setError("Unable to load nearest futsals.");
        } finally {
          setLoading(false);
        }
      };

      fetchFutsals();
    }
  }, [latitude, longitude, radius]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading nearest futsals...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (

    <div className="container mx-auto p-4 shadow-xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Futsals nearby you.</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">S.N.</th>
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Location</th>
              <th className="px-4 py-2 border-b text-left">Phone</th>
              <th className="px-4 py-2 border-b text-left">Distance</th>
              <th className="px-4 py-2 border-b">View</th>
            </tr>
          </thead>
          <tbody>
            {futsals.map((futsal, index) => (
              <tr key={futsal.id} className="text-center">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b text-left">{futsal.name}</td>
                <td className="px-4 py-2 border-b text-left">{futsal.location}</td>
                <td className="px-4 py-2 border-b text-left">{futsal.phone}</td>
                <td className="px-4 py-2 border-b text-left">{futsal.distance} km</td>
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
    // <div className="mt-6 p-4 bg-white shadow-md rounded-md">
    //   <h2 className="text-2xl font-semibold mb-4 text-center">Nearest Futsals</h2>
    //   {futsals.length > 0 ? (
    //     <ul className="space-y-4">
    //       {futsals.map((futsal) => (
    //         <li
    //           key={futsal.id}
    //           className="p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
    //         >
    //           <h3 className="text-xl font-bold">{futsal.name}</h3>
    //           <p className="text-gray-700">Location: {futsal.location}</p>
    //           <p className="text-gray-700">Distance: {futsal.distance} km</p>
    //         </li>
    //       ))}
    //     </ul>
    //   ) : (
    //     <p className="text-center text-gray-500">No futsals found within the selected radius.</p>
    //   )}
    // </div>
  );
};

export default FormulaList;
