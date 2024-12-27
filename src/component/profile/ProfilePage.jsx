import React, { useEffect, useState } from 'react';
import { FaCity, FaEdit, FaEnvelope, FaHome, FaPhone, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);

                const response = await ApiService.getUserProfile();
                console.log(response, "userPlusBookings");
    
                const userPlusBookings = await ApiService.getAllUserBookings(response.user.id);
                console.log(userPlusBookings, "userPlusBookings");
                setUser(userPlusBookings?.bookingList[0]?.user);
                setBookings(userPlusBookings?.bookingList);
                setLoading(false);

            } catch (error) {
                toast.error("Unable to fetch user");
                setError("Failed to load profile data.");
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };
    
            fetchUserProfile();

    }, []);
    

    console.log(loading, "loading stated");
    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = (userId) => {
        navigate('/edit-profile/' + userId);
    };

    console.log("navigate", user);

    const spinnerStyle = {
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderTop: '4px solid #f70767',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
    };
    

    return (
        <div className="bg-gray-100 flex flex-col items-center py-10">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div style={spinnerStyle}></div>
                </div>
                ) : (
                    <>
                        {user && (
                            <>
                                {/* Profile Image */}
                                {user.profileImage && (
                                    <div className="flex justify-center mb-4">
                                        <img
                                            src={user.profileImage}
                                            alt={`${user.username}'s profile`}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-[#f70767]"
                                        />
                                    </div>
                                )}
                                
                                <h1 className="text-3xl text-[#f70767] font-bold text-center mb-4">
                                    Welcome, {user.username}
                                </h1>
                            </>
                        )}

                        {error && <p className="error-message text-red-600 mb-4 text-center">{error}</p>}

                        <div className="flex justify-between mb-6">
                            <button
                                className="flex items-center bg-[#f70767] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#d5065a] transition"
                                onClick={() => handleEditProfile(user.id)}
                            >
                                <FaEdit className="mr-2" /> Edit Profile
                            </button>
                            <button
                                className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="mr-2" /> Logout
                            </button>
                        </div>

                        <div className="profile-details bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                            <h2 className="text-xl text-[#f70767] font-semibold mb-4">Profile Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <FaEnvelope className="text-[#f70767] mr-2" /> 
                                    <span className="text-md"><strong>Email:</strong> {user?.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaPhone className="text-[#f70767] mr-2" /> 
                                    <span className="text-md"><strong>Phone Number:</strong> {user?.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaHome className="text-[#f70767] mr-2" /> 
                                    <span className="text-md"><strong>Address:</strong> {user?.address}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaCity className="text-[#f70767] mr-2" /> 
                                    <span className="text-md"><strong>City:</strong> {user?.city}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bookings-section">
                            <h2 className="text-xl text-[#f70767] font-semibold mb-4">Booking History</h2>
                            <div className="booking-list space-y-4">
                                {user && bookings && bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <div key={booking.id} className="booking-item bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
                                            <p className="text-md mb-2"><strong>Booking Code:</strong> {booking.bookingConfirmationCode}</p>
                                            <p className="text-md mb-2"><strong>Check-in Date:</strong> {booking.checkInDate}</p>
                                            <p className="text-md mb-2"><strong>Check-out Date:</strong> {booking.checkOutDate}</p>
                                            <p className="text-md mb-2"><strong>Total Guests:</strong> {booking.totalNumberOfGuests}</p>
                                            <p className="text-md mb-2"><strong>Room Type:</strong> {booking.room.type}</p>
                                            <img
                                                src={booking.room.image}
                                                alt="Room"
                                                className="room-photo w-full h-40 object-cover rounded-md mt-2"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No bookings found.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
