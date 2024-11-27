import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';
import Spinner from '../ui/LoadingSpinner';

const AddRoomPage = () => {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        image: '',
        type: '',
        price: '',
        description: '',
        name: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRoomTypeChange = (e) => {
        if (e.target.value === 'new') {
            setNewRoomType(true);
            setRoomDetails(prevState => ({ ...prevState, type: '' }));
        } else {
            setNewRoomType(false);
            setRoomDetails(prevState => ({ ...prevState, type: e.target.value }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(null);
        }
    };

    const addRoom = async () => {
        if (!roomDetails.type || !roomDetails.name || !roomDetails.price || !roomDetails.description) {
            toast.error('All room details must be provided.');
            return;
        }

        try {
            
            setLoading(true);
            const formData = new FormData();
            formData.append('type', roomDetails.type);
            formData.append('price', roomDetails.price);
            formData.append('description', roomDetails.description);
            formData.append('name', roomDetails.name);

            if (file) {
                formData.append('image', file);
            }

            const result = await ApiService.addRoom(formData);
            if (result.statusCode === 200) {
                toast.success("Room Added successfully");
                
                navigate('/admin/manage-rooms');
            }
            
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || error.message);
            toast.error("Error adding room");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            
            <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-[#f70767] hover:text-[#d5065a] transition-colors duration-200 mr-2"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Back
                </button>
            </div>
                <h2 className="text-3xl font-semibold text-[#f70767] mb-6 text-center">Add New Room</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
                {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{success}</p>}
                <div className="edit-room-form">
                    <div className="mb-4">
                        {preview && (
                            <img src={preview} alt="Room Preview" className="w-full h-48 object-cover rounded-md mb-3" />
                        )}
                        <input
                            type="file"
                            name="roomPhoto"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#f70767] file:text-white hover:file:bg-pink-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Room Name</label>
                        <input
                            type="text"
                            name="name"
                            value={roomDetails.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:border-[#f70767] focus:ring-[#f70767]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Room Type</label>
                        <select value={roomDetails.type} onChange={handleRoomTypeChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#f70767] focus:ring-[#f70767]">
                            <option value="">Select a room type</option>
                            {roomTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                            <option value="new">Other (please specify)</option>
                        </select>
                        {newRoomType && (
                            <input
                                type="text"
                                name="type"
                                placeholder="Enter new room type"
                                value={roomDetails.type}
                                onChange={handleChange}
                                className="mt-2 w-full p-3 border border-gray-300 rounded focus:border-[#f70767] focus:ring-[#f70767]"
                            />
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Room Price</label>
                        <input
                            type="text"
                            name="price"
                            value={roomDetails.price}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:border-[#f70767] focus:ring-[#f70767]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Room Description</label>
                        <textarea
                            name="description"
                            value={roomDetails.description}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:border-[#f70767] focus:ring-[#f70767]"
                        ></textarea>
                    </div>

                    {
                        loading ? (<div className='text-center'>
                            <Spinner />
                        </div>)
                    :
                    <button
                    
                        className="w-full bg-[#f70767] text-white py-3 rounded-md font-semibold hover:bg-pink-600 transition duration-150"
                        onClick={addRoom}
                    >
                        Add Room
                    </button>
}
                </div>
            </div>
        </div>
    );
};

export default AddRoomPage;
