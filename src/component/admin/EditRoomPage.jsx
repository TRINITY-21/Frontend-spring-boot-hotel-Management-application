import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';
import Spinner from '../ui/LoadingSpinner';

const EditRoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        image: '',
        name: '',
        type: '',
        price: '',
        description: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await ApiService.getRoomById(roomId);
                setRoomDetails({
                    image: response.room.image,
                    type: response.room.type,
                    price: response.room.price,
                    name: response.room.name,
                    description: response.room.description,
                });
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };
        fetchRoomDetails();
    }, [roomId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
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

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('type', roomDetails.type);
            formData.append('name', roomDetails.name);
            formData.append('price', roomDetails.price);
            formData.append('description', roomDetails.description);

            if (file) {
                formData.append('image', file);
            }

            const result = await ApiService.updateRoom(roomId, formData);
            if (result.statusCode === 200) {
                toast.success('Room updated successfully.');
                    navigate('/admin/manage-rooms');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error updating room');
        }
    };

    const handleDelete = async () => {
            try {
                setLoading(true);
                const result = await ApiService.deleteRoom(roomId);
                if (result.statusCode === 200) {
                    toast.success('Room Deleted successfully.');
                   
                    setTimeout(()=>{
                        navigate('/admin/manage-rooms');
                    }, 1000)
                   
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                toast.error("Error while deleting")
            }
        }
    

    return (
        <div className="max-w-3xl  h-auto mx-auto bg-gray-50 p-6 mt-30 mb-40 rounded-lg shadow-md">
             <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-[#f70767] hover:text-[#d5065a] transition-colors duration-200 mr-2"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Back
                </button>
            </div>
            <h2 className="text-3xl font-semibold text-[#f70767] mb-6 text-center">Edit Room</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
            {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{success}</p>}

            <div className="edit-room-form">
                <div className="mb-4">
                    {preview ? (
                        <img src={preview} alt="Room Preview" className="w-full h-48 object-cover rounded-md" />
                    ) : (
                        roomDetails.image && (
                            <img src={roomDetails.image} alt="Room" className="w-full h-48 object-cover rounded-md" />
                        )
                    )}
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="mt-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#f70767] file:text-white hover:file:bg-pink-600"
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
                    <input
                        type="text"
                        name="type"
                        value={roomDetails.type}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded focus:border-[#f70767] focus:ring-[#f70767]"
                    />
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

                <div className="flex space-x-4">
                {
                        loading ? (<div className='text-center'>
                            <Spinner />
                        </div>)
                    :
                    <button
                    
                        className="w-full bg-[#f70767] text-white py-3 rounded-md font-semibold hover:bg-pink-600 transition duration-150"
                        onClick={handleUpdate}
                    >
                        Update Room
                    </button>
}
                    <button
                        onClick={handleDelete}
                        className="w-full bg-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-400 transition duration-150"
                    >
                        Delete Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditRoomPage;
