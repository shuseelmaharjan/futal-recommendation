import React from 'react';

export const Results = ({ latitude, longitude }) => {
  // Sample data for futsals, you can replace this with actual data
  const futsals = [
    { id: 1, name: 'Futsal A', location: 'Location A', phone: '123-456-7890' },
    { id: 2, name: 'Futsal B', location: 'Location B', phone: '098-765-4321' },
    // Add more futsal data as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Futsals nearby you.</h1>
      <div className="flex mb-4">
        <p>Latitude: {latitude}, </p>
        <p className='mx-2'>Longitude: {longitude}</p>
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
                  <button className="text-blue-500 hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
