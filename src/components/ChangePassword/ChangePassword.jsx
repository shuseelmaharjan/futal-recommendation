import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from './../apiClient';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("You must be logged in to change the password.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post(`api/change-password`,{
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {role !== 'user' && (

      <>
      <div className="mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-emerald-950">Change Password</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* First Row: Three Columns */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="oldPassword" className="block text-gray-700 font-semibold mb-2">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-950"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-gray-700 font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-950"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-950"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Second Row: Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-emerald-950 text-white py-2 px-4 rounded hover:bg-emerald-800 transition duration-300"
              disabled={loading}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
      </>
    )}
    {role === 'user' && (
      <>
      <div className="mx-auto p-4 mt-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-emerald-950">Change Password</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      {/* First Row: Three Columns */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="oldPassword" className="block text-gray-700 font-semibold mb-2">
            Old Password
          </label>
          <input
            type="password"
            id="oldPassword"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-950"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-gray-700 font-semibold mb-2">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-950"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-950"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Second Row: Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-emerald-950 text-white py-2 px-4 rounded hover:bg-emerald-800 transition duration-300"
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </form>

    </div>
    </>
    )}
    </>
  );
};

export default ChangePassword;
