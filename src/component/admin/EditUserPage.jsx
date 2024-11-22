import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';
import Spinner from '../ui/LoadingSpinner';

function EditUserPage() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
        role: 'USER', // Initialize role with a default value
        profileImage: null,
    });

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await ApiService.getUser(userId);
                setFormData({
                    username: response.user.username || '',
                    email: response.user.email || '',
                    phone: response.user.phone || '',
                    address: response.user.address || '',
                    city: response.user.city || '',
                    role: response.user.role || 'USER', // Set role from response or default to 'USER'
                    profileImage: response.user.profileImage || null,
                });
                setPreview(response.user.profileImage ? response.user.profileImage : null);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Error fetching user data');
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { username, email, phone, address, city, role } = formData;
        return username && email && phone && address && city && role;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fill all the fields.');
            return;
        }

        try {
            setLoading(true);
            const formPayload = new FormData();
            formPayload.append('username', formData.username);
            formPayload.append('email', formData.email);
            formPayload.append('phone', formData.phone);
            formPayload.append('address', formData.address);
            formPayload.append('city', formData.city);
            formPayload.append('role', formData.role); // Append role to the form payload

            if (file) {
                formPayload.append('profileImage', file);
            }

            const response = await ApiService.updateUser(userId, formPayload);
            if (response.statusCode === 200) {
                toast.success('User updated successfully');
                navigate('/admin/manage-users');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Failed to update, try again');
        }
    };

    return (
        <div className="relative w-full h-screen bg-gradient-to-b from-[#f70767] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
                <div className="flex items-center mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center text-[#f70767] hover:text-[#d5065a] transition-colors duration-200 mr-2">
                        <ArrowLeft className="w-5 h-5 mr-1" /> Back
                    </button>
                </div>
                <h2 className="text-center text-2xl font-bold mb-6 text-[#f70767]">Edit User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4 flex flex-col items-center">
                        {preview ? (
                            <img src={preview} alt="Profile Preview" className="w-24 h-24 object-cover rounded-full mb-3" />
                        ) : formData.profileImage && (
                            <img src={formData.profileImage} alt="Profile Preview" className="w-24 h-24 object-cover rounded-full mb-3" />
                        )}
                        <label className="flex justify-start text-left">Add Profile Image</label>
                        <input
                            type="file"
                            name="profileImage"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#f70767] file:text-white hover:file:bg-pink-600"
                        />
                    </div>

                    {['username', 'email', 'phone', 'address', 'city'].map((field) => (
                        <div key={field} className="form-group">
                            <label className="block text-gray-700 capitalize">{field}:</label>
                            <input
                                type={'text'}
                                name={field}
                                value={formData[field]}
                                onChange={handleInputChange}
                                required
                                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#f70767] focus:ring-1 focus:ring-[#f70767]"
                            />
                        </div>
                    ))}

                    {/* Role Select Field */}
                    <div className="form-group">
                        <label className="block text-gray-700">Role:</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#f70767] focus:ring-1 focus:ring-[#f70767]"
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    {loading ? <Spinner /> : (
                        <button
                            type="submit"
                            className="w-full bg-[#f70767] text-white py-3 rounded-xl hover:bg-[#d9065a] transition-colors duration-300"
                        >
                            Update
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default EditUserPage;
