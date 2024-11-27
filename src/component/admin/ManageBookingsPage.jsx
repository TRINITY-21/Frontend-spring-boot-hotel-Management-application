import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(6);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await ApiService.getAllBookings();
                const allBookings = response.bookingList;
                setBookings(allBookings);
                setFilteredBookings(allBookings);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings(searchTerm);
    }, [searchTerm, bookings]);

    const filterBookings = (term) => {
        if (term === '') {
            setFilteredBookings(bookings);
        } else {
            const filtered = bookings.filter((booking) =>
                booking.bookingConfirmationCode && booking.bookingConfirmationCode.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredBookings(filtered);
        }
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-8 bg-gray-50 min-h-screen max-w-7xl mx-auto">
             <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-[#f70767] hover:text-[#d5065a] transition-colors duration-200 mr-2"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Back
                </button>
            </div>
            <h2 className="text-4xl font-semibold text-[#f70767] text-center mb-6">All Bookings</h2>
            <div className="mb-8">
                <div className="flex items-center border-b border-gray-300 pb-4 max-w-sm mx-auto">
                    <FaSearch className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by booking code"
                        className="flex-grow p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#f70767] focus:ring-2 focus:ring-[#f70767] transition-all"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full bg-white border-collapse rounded-lg overflow-hidden">
                    <thead className="bg-[#f70767] text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">Booking Code</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Check-In Date</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Check-Out Date</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Total Adults</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Total Children</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Total Guests</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings.map((booking) => (
                            <tr key={booking.id} className="border-b last:border-none hover:bg-gray-100 transition">
                                <td className="px-6 py-4 text-gray-800 text-sm">{booking.bookingConfirmationCode}</td>
                                <td className="px-6 py-4 text-gray-800 text-sm">{booking.checkInDate}</td>
                                <td className="px-6 py-4 text-gray-800 text-sm">{booking.checkOutDate}</td>
                                <td className="px-6 py-4 text-gray-800 text-sm">{booking.numberOfAdults}</td>
                                <td className="px-6 py-4 text-gray-800 text-sm">{booking.numberOfChildren}</td>
                                <td className="px-6 py-4 text-gray-800 text-sm">{booking.totalNumberOfGuests}</td>
                                <td className="px-6 py-4">
                                    <button
                                        className="flex items-center bg-[#f70767] text-white px-3 py-2 rounded-lg hover:bg-[#d9065a] transition duration-200"
                                        onClick={() => navigate(`/admin/edit-booking/${booking.bookingConfirmationCode}`)}
                                    >
                                        <FaEdit className="mr-2" />
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8">
                <Pagination
                    roomsPerPage={bookingsPerPage}
                    totalRooms={filteredBookings.length}
                    currentPage={currentPage}
                    paginate={paginate}
                />
            </div>
        </div>
    );
};

export default ManageBookingsPage;
