import React, { useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdClose } from "react-icons/md";

export const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if password and confirm password match
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Password and confirm password didn't match.");
            return;
        }

        // Clear any previous error message
        setErrorMessage('');

        // Create data object without confirmPassword
        const dataToSend = {
            name: formData.name,
            email: formData.email,
            username: formData.username,
            password: formData.password,
            phone: formData.phone
        };
        console.log(dataToSend);

        try {
            // Send data to the API
            const response = await axios.post('http://localhost:8000/api/register-user', dataToSend);

            setResponseMessage(response.data.message);
        } catch (error) {
            setResponseMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800">Signup</h2>
                <p className="text-center text-gray-500">Create an account to get started.</p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
                            placeholder="Choose a username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                             role="alert">
                            <span className="block sm:inline">{errorMessage}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <MdClose
                                    className="h-6 w-6 text-red-500 cursor-pointer"
                                    onClick={() => setErrorMessage('')}
                                    role="button"
                                    title="Close"
                                />
                            </span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>

                {responseMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                         role="alert">
                        <span className="block sm:inline">{responseMessage}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <MdClose
                                    className="h-6 w-6 text-green-500 cursor-pointer"
                                    onClick={() => setErrorMessage('')}
                                    role="button"
                                    title="Close"
                                />
                            </span>
                    </div>
                )}

                <div className="text-center">
                    <p className="text-gray-500">
                        Already have an account?
                        <span className="font-medium text-green-700 cursor-pointer hover:underline mx-2">
                            <Link to='/login'>Login</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};
