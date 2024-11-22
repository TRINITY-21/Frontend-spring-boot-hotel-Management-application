import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [roomId]);


  const handleConfirmBooking = () => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates.');
      return;
    }

    if (isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
      toast.error('Please enter valid numbers for adults and children.');
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.round(Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / oneDay)) + 1;
    const pricePerNight = roomDetails.price;
    const total = pricePerNight * totalDays;

    setTotalPrice(total);
    setTotalGuests(numAdults + numChildren);
  };

  const acceptBooking = async () => {
    try {
      const booking = {
        checkInDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate.toISOString().split('T')[0],
        numberOfAdults: numAdults,
        numberOfChildren: numChildren,
      };

      const response = await ApiService.bookRoom(roomId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        // setShowMessage(true);
        toast.success("Your booking has been confirmed. Check your email for further instructions")

        setTimeout(() => {
          setShowMessage(false);
          navigate('/rooms');
        }, 2000);
      }
    } catch (error) {
      toast.error("Unable to book room, try again");
    }
  };

  if (isLoading) return <p className='text-center text-lg'>Loading room details...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;
  if (!roomDetails) return <p className='text-center'>Room not found.</p>;

  const { type, price, image, description, bookings } = roomDetails;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mb-40 mt-10">
      {showMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          <strong>Success!</strong> Your booking has been confirmed. Confirmation code: {confirmationCode}.
          An SMS and email with your booking details have been sent to you.
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <strong>Error!</strong> {errorMessage}
        </div>
      )}
      <h2 className="text-4xl font-semibold mb-8 mt-2 text-[#f70767]">Room Details</h2>
      <img src={image} alt={type} className="w-full h-64 object-cover rounded-lg shadow-md mb-6" />
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#f70767]">{type}</h3>
        <p className="text-lg">
          Price: <span className="font-semibold text-[#f70767]">${price} / night</span>
        </p>
        <p className="mt-2">{description}</p>
      </div>
      {bookings && bookings.length > 0 && (
        <div className="mb-6 rounded-lg ">
          <h3 className="text-lg font-semibold text-gray-800">Existing Booking Details</h3>
          <table className="w-full rounded-lg mb-4 border-collapse border border-gray-300">
            <thead className="bg-[#f70767] text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2 font-medium">Booking #</th>
                <th className="border border-gray-300 px-4 py-2 font-medium">Check-in Date</th>
                <th className="border border-gray-300 px-4 py-2 font-medium">Check-out Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.checkInDate}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.checkOutDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mb-6">
        <button
          className="bg-[#f70767] text-white py-2 px-5 rounded-lg shadow hover:bg-[#e2065b] transition duration-300"
          onClick={() => setShowDatePicker(true)}
        >
          Book Room
        </button>
        {showDatePicker && (
          <div className="mt-5 border p-5 rounded-lg bg-gray-50">
            <DatePicker
              className="border border-gray-300 rounded p-2 mr-2"
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              placeholderText="Check-in Date"
              dateFormat="dd/MM/yyyy"
            />
            <DatePicker
              className="border border-gray-300 rounded p-2"
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate}
              placeholderText="Check-out Date"
              dateFormat="dd/MM/yyyy"
            />
            <div className="flex mt-5">
              <div className="mr-5">
                <label className="block mb-1 text-gray-600">Adults:</label>
                <input
                  type="number"
                  min="1"
                  value={numAdults}
                  onChange={(e) => setNumAdults(parseInt(e.target.value))}
                  className="border border-gray-300 rounded p-2 w-20"
                />
              </div>
              <div className="mr-5">
                <label className="block mb-1 text-gray-600">Children:</label>
                <input
                  type="number"
                  min="0"
                  value={numChildren}
                  onChange={(e) => setNumChildren(parseInt(e.target.value))}
                  className="border border-gray-300 rounded p-2 w-20"
                />
              </div>
              <button
                className="bg-[#f70767] text-white py-2 px-5 rounded-lg shadow hover:bg-[#e2065b] transition duration-300"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
        {totalPrice > 0 && (
          <div className="mt-5 p-5 border-t border-gray-300">
            <p className="text-lg font-semibold">Total Price: <span className="text-[#f70767]">${totalPrice}</span></p>
            <p className="text-lg font-semibold">Total Guests: <span className="text-[#f70767]">{totalGuests}</span></p>
            <button
              className="bg-[#f70767] text-white py-2 px-5 rounded-lg shadow hover:bg-[#e2065b] transition duration-300 mt-2"
              onClick={acceptBooking}
            >
              Finalize Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;
