import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../service/ApiService';

const AdminPage = () => {
    const [admin, setAdmin] = useState(null);
    const [totalRooms, setTotalRooms] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0); // State to store total users
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setAdmin(response.user);
            } catch (error) {
                console.error('Error fetching admin details:', error.message);
            }
        };

        const fetchCounts = async () => {
            try {
                const roomsResponse = await ApiService.getAllRooms();
                const bookingsResponse = await ApiService.getAllBookings();
                const usersResponse = await ApiService.getAllUsers(); // Fetch all users
                setTotalRooms(roomsResponse.roomList.length);
                setTotalBookings(bookingsResponse.bookingList.length);
                setTotalUsers(usersResponse.userList.filter(user => !user._deleted && user.active).length); // Set total users
            } catch (error) {
                console.error('Error fetching counts:', error.message);
            }
        };

        fetchAdminData();
        fetchCounts();
    }, []);

    return (
        <div className="admin-page max-w-5xl mx-auto px-6 py-10 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-center text-[#f70767] mb-10">Admin Dashboard</h1>
            
            {admin && (
                <div className="admin-details bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hello, {admin.username}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <p className="text-sm"><strong className="text-[#f70767]">Email:</strong> {admin.email}</p>
                        <p className="text-sm"><strong className="text-[#f70767]">Phone:</strong> {admin.phone}</p>
                        <p className="text-sm"><strong className="text-[#f70767]">Role:</strong> {admin.role}</p>
                        <p className="text-sm"><strong className="text-[#f70767]">Address:</strong> {admin.address}</p>
                    </div>
                </div>
            )}

            <div className="admin-actions flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <button
                    onClick={() => navigate('/admin/manage-rooms')}
                    className="w-full md:w-auto bg-[#f70767] text-white font-semibold py-3 px-8 rounded-md shadow-md hover:bg-[#d5065a] transition duration-150"
                >
                    Manage Rooms
                </button>
                <button
                    onClick={() => navigate('/admin/manage-bookings')}
                    className="w-full md:w-auto bg-[#f70767] text-white font-semibold py-3 px-8 rounded-md shadow-md hover:bg-[#d5065a] transition duration-150"
                >
                    Manage Bookings
                </button>
                <button
                    onClick={() => navigate('/admin/manage-users')}
                    className="w-full md:w-auto bg-[#f70767] text-white font-semibold py-3 px-8 rounded-md shadow-md hover:bg-[#d5065a] transition duration-150"
                >
                    Manage Users
                </button>
            </div>

            <div className="admin-stats grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"> {/* Change to 3 columns */}
                <div className="stat-card bg-white p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-lg text-gray-600 font-semibold mb-2">Total Rooms</h3>
                    <p className="text-4xl font-bold text-[#f70767]">{totalRooms}</p>
                </div>
                <div className="stat-card bg-white p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-lg text-gray-600 font-semibold mb-2">Total Bookings</h3>
                    <p className="text-4xl font-bold text-[#f70767]">{totalBookings}</p>
                </div>
                <div className="stat-card bg-white p-6 rounded-lg shadow-lg text-center"> {/* New Card for Total Users */}
                    <h3 className="text-lg text-gray-600 font-semibold mb-2">Total Users</h3>
                    <p className="text-4xl font-bold text-[#f70767]">{totalUsers}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
