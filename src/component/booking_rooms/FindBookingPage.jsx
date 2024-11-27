import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Icon for search
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            toast.error("Please enter a booking confirmation code");
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);
            setError(null);
        } catch (error) {
            toast.error("Unable to get booking details")
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="relative w-full h-full py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-center text-4xl font-bold mb-6 text-[#f70767]">Find Your Bookings</h1>
                <div className="flex justify-center mb-8 items-center"> {/* Added items-center for vertical alignment */}
                    <input
                        required
                        type="text"
                        placeholder="Enter your booking confirmation code"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 focus:border-[#f70767] focus:ring-4 focus:ring-[#f70767] focus:ring-opacity-20 transition-all duration-200 outline-none text-gray-700 bg-white"
                    />
                    <button 
                        onClick={handleSearch} 
                        className="bg-[#f70767] text-white px-6 py-4 rounded-xl font-semibold ml-4 hover:bg-[#d9065a] transition-colors duration-300 flex items-center" // Added flex and items-center
                    >
                        <FaSearch className="mr-2" /> Look Up
                    </button>
                </div>
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                {bookingDetails && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                        <h3 className="text-2xl font-semibold mb-4">Booking Details</h3>
                        <table className="w-full mb-4 border-collapse rounded-lg overflow-hidden shadow">
                            <thead className="bg-[#f70767] text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Booking</th>
                                    <th className="px-4 py-2 text-center">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Confirmation Code</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.bookingConfirmationCode}</td> {/* Centered cell */}
                                </tr>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Check-in Date</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.checkInDate}</td> {/* Centered cell */}
                                </tr>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Check-out Date</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.checkOutDate}</td> {/* Centered cell */}
                                </tr>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Number Of Adults</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.numberOfAdults}</td> {/* Centered cell */}
                                </tr>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Number Of Children</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.numberOfChildren}</td> {/* Centered cell */}
                                </tr>
                            </tbody>
                        </table>
                        
                        <h3 className="text-2xl font-semibold mb-4">Reservation Holder</h3>
                        <table className="w-full mb-4 border-collapse rounded-lg overflow-hidden shadow">
                            <thead className="bg-[#f70767] text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">User</th>
                                    <th className="px-4 py-2 text-center">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Name</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.user.username}</td> {/* Centered cell */}
                                </tr>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Email</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.user.email}</td> {/* Centered cell */}
                                </tr>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Phone Number</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.user.phone}</td> {/* Centered cell */}
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="text-2xl font-semibold mb-4">Room Details</h3>
                        <table className="w-full mb-4 border-collapse rounded-lg overflow-hidden shadow">
                            <thead className="bg-[#f70767] text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Room</th>
                                    <th className="px-4 py-2 text-center">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Room Type</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.room.type}</td> {/* Centered cell */}
                                </tr>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Room Price</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.room.price}</td> {/* Centered cell */}
                                </tr>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Room Description</td>
                                    <td className="px-4 py-2 text-center">{bookingDetails.room.description}</td> {/* Centered cell */}
                                </tr>
                                <tr className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 font-semibold">Room Image</td>
                                    <td className="px-4 py-2 text-center">
                                        <img src={bookingDetails.room.image} alt="Room" className="w-full h-48 object-cover rounded-lg" />
                                    </td> {/* Centered cell */}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindBookingPage;
