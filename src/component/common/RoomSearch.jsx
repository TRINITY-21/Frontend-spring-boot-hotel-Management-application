import { Calendar, Home, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import ApiService from "../../service/ApiService";



const RoomSearch = ({ handleSearchResult }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error('Error fetching room types:', error.message);
            }
        };
        fetchRoomTypes();
    }, []);

    const showError = (message, timeout = 5000) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, timeout);
    };

    const handleInternalSearch = async () => {
        if (!startDate || !endDate || !roomType) {
            toast.error('Please select all fields');
            return false;
        }
        try {
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];
            const response = await ApiService.getAvailableRoomsByDateAndType(
                formattedStartDate,
                formattedEndDate,
                roomType
            );

            if (response.statusCode === 200) {
                if (response.roomList.length === 0) {
                    showError('No rooms available for the selected date range and room type.');
                    return;
                }
                handleSearchResult(response.roomList);
                setError('');
            }
        } catch (error) {
            showError("An unknown error occurred: " + error.response?.data?.message || error.message);
        }
    };

    // Add custom styles for the DatePicker portal
    const CustomDatePickerInput = ({ value, onClick, placeholder }) => (
        <input
            onClick={onClick}
            value={value}
            placeholder={placeholder}
            readOnly
            className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 focus:border-[#f70767] focus:ring-4 focus:ring-[#f70767] focus:ring-opacity-20 transition-all duration-200 outline-none text-gray-700 bg-gray-50 cursor-pointer"
        />
    );

    return (
        <div className="text-sm w-full bg-gradient-to-b bg-gradient-to-b from-[#f70767] py-16">
            <style>
                {`
                    .react-datepicker-popper {
                        z-index: 9999 !important;
                    }
                    .react-datepicker-wrapper,
                    .react-datepicker__input-container {
                        display: block;
                        width: 100%;
                    }
                    .react-datepicker__navigation {
                        top: 8px;
                    }
                    .react-datepicker__month-container {
                        background: white;
                        border-radius: 8px;
                        font-family: inherit;
                    }
                    .react-datepicker__header {
                        background: #f8f8f8;
                        border-bottom: 1px solid #e5e7eb;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                    }
                    .react-datepicker__day--selected {
                        background-color: #f70767 !important;
                    }
                    .react-datepicker__day--keyboard-selected {
                        background-color: rgba(247, 7, 103, 0.5) !important;
                    }
                    .react-datepicker__day:hover {
                        background-color: rgba(247, 7, 103, 0.1) !important;
                    }
                `}
            </style>
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Find Your Perfect Stay
                    </h2>
                    <p className="text-gray-100">
                        Search through our premium selection of rooms
                    </p>
                </div>

                <div className="bg-white text-sm rounded-2xl shadow-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="relative">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 mr-2 text-[#f70767]" />
                                Check-in Date
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select check-in date"
                                customInput={<CustomDatePickerInput />}
                                portalId="root"
                                className="text-sm"
                            />
                        </div>

                        <div className="relative">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 mr-2 text-[#f70767]" />
                                Check-out Date
                            </label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select check-out date"
                                customInput={<CustomDatePickerInput />}
                                portalId="root"
                            />
                        </div>

                        <div className="relative">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <Home className="w-4 h-4 mr-2 text-[#f70767]" />
                                Room Type
                            </label>
                            <select
                                value={roomType}
                                onChange={(e) => setRoomType(e.target.value)}
                                className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 focus:border-[#f70767] focus:ring-4 focus:ring-[#f70767] focus:ring-opacity-20 transition-all duration-200 outline-none text-gray-700 bg-gray-50 appearance-none cursor-pointer"
                            >
                                <option value="" disabled>
                                    Select your room type
                                </option>
                                {roomTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
                            <p className="text-red-600 text-sm text-center font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleInternalSearch}
                        className="w-full mt-8 bg-[#f70767] hover:bg-[#d9065a] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[0.99] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <Search className="w-5 h-5 text-white" />
                        Search Available Rooms
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomSearch;