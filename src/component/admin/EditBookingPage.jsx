import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';

const EditBookingPage = () => {
  const navigate = useNavigate();
  const { bookingCode } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('booking');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await ApiService.getBookingByConfirmationCode(bookingCode);
        console.log('Booking details: ' + response.booking.user);

        setBookingDetails(response.booking);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBookingDetails();
  }, [bookingCode]);

  const achieveBooking = async (bookingId) => {
    try {
      setLoading(true)
      const response = await ApiService.cancelBooking(bookingId);
      if (response.statusCode === 200) {
        toast.success("The booking was Successfully Cencelled");
        setTimeout(() => {
          navigate('/admin/manage-bookings');
        }, 3000);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Unable to Cancel booking");
      setTimeout(() => setError(''), 5000);
    }
  };

  const getTabContent = () => {
    if (!bookingDetails) return null;
  
    switch (activeTab) {
      case 'booking':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-[#f70767]">Confirmation Code:</label>
              <span className="text-lg font-semibold text-gray-900">{bookingDetails.bookingConfirmationCode}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-[#f70767]">Check-in Date:</label>
              <span className="text-lg font-semibold text-gray-900">{bookingDetails.checkInDate}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-[#f70767]">Check-out Date:</label>
              <span className="text-lg font-semibold text-gray-900">{bookingDetails.checkOutDate}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-[#f70767]">Number of Adults:</label>
              <span className="text-lg font-semibold text-gray-900">{bookingDetails.numberOfAdults}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-[#f70767]">Number of Children:</label>
              <span className="text-lg font-semibold text-gray-900">{bookingDetails.numberOfChildren}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-[#f70767]">Guest Total:</label>
              <span className="text-lg font-semibold text-gray-900">{bookingDetails.totalNumberOfGuests}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-[#f70767]">Guest Email:</label>
              <span className="text-lg font-semibold text-gray-900">{bookingDetails.user.username}</span>
            </div>
          </div>
        );
      case 'booker':
        return (
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-[#f70767]">Name:</label>
              <span className="text-lg font-semibold text-gray-900">{bookingDetails.user.username}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-[#f70767]">Email:</label>
              <span className="text-lg font-semibold text-gray-900">{bookingDetails.user.email}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-[#f70767]">Phone Number:</label>
              <span className="text-lg font-semibold text-gray-900">{bookingDetails.user.phone}</span>
            </div>
          </div>
        );
      case 'room':
        return (
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-col">
                <label className="text-[#f70767]">Room Type:</label>
                <span className="text-lg font-semibold text-gray-900">{bookingDetails.room.type}</span>
              </div>
              <div className="flex flex-col">
                <label className="text-[#f70767]">Room Price:</label>
                <span className="text-lg font-semibold text-gray-900">${bookingDetails.room.price}</span>
              </div>
              <div className="flex flex-col">
                <label className="text-[#f70767]">Room Description:</label>
                <span className="text-lg font-semibold text-gray-900">{bookingDetails.room.description}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-1/3">
              <img src={bookingDetails.room.image} alt="Room" className="w-full rounded-lg object-cover" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
       <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-[#f70767] hover:text-[#d5065a] transition-colors duration-200 mr-2"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Back
                </button>
            </div>
      <h2 className="text-5xl text-center font-bold text-[#f70767] mb-16">Booking Details</h2>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">{success}</div>}

      {bookingDetails && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              className={`flex-1 py-3 text-lg text-center ${activeTab === 'booking' ? 'text-white border-b-2 border-[#f70767] bg-[#f70767] hover:text-white ' : 'text-[#f70767]'} hover:text-pink-900 transition duration-200`}
              onClick={() => setActiveTab('booking')}
            >
              Booking Details
            </button>
            <button
              className={`flex-1 py-3 text-lg text-center ${activeTab === 'booker' ? 'text-white border-b-2 border-[#f70767] bg-[#f70767] hover:text-white ' : 'text-gray-600'} hover:text-pink-900 transition duration-200`}
              onClick={() => setActiveTab('booker')}
            >
              Reservation Holder
            </button>
            <button
              className={`flex-1 py-3 text-lg text-center ${activeTab === 'room' ? 'text-white border-b-2 border-[#f70767] bg-[#f70767] hover:text-white ' : 'text-gray-600'} hover:text-pink-900 transition duration-200`}
              onClick={() => setActiveTab('room')}
            >
              Room Details
            </button>
          </div>

          <div className="p-6">
            {getTabContent()}
          </div>

          <div className="p-6 border-t border-gray-200">
            <button
              className="w-full bg-[#f70767] text-white py-3 rounded-lg hover:bg-[#d9065a] transition duration-200"
              onClick={() => achieveBooking(bookingDetails.id)}
            >
             Cancel Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBookingPage;
