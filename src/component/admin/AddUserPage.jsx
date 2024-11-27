import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';
import Spinner from '../ui/LoadingSpinner';

function AddUserPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
        role: 'USER' // Default role value
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { username, email, password, phone, address, city, role } = formData;
        return username && email && password && phone && address && city && role;
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
            setTimeout(() => setErrorMessage(''), 1000);
            return;
        }

        try {
            setLoading(true);
            const formPayload = new FormData();
            formPayload.append('username', formData.username);
            formPayload.append('email', formData.email);
            formPayload.append('password', formData.password);
            formPayload.append('phone', formData.phone);
            formPayload.append('address', formData.address);
            formPayload.append('city', formData.city);
            formPayload.append('role', formData.role);

            if (file) {
                formPayload.append('profileImage', file);
            }

            console.log(formData, "all form data")

            const response = await ApiService.addUser(formPayload);

            if (response.statusCode === 200) {
                setFormData({
                    username: '', email: '', password: '', phone: '', address: '', city: '', role: 'USER'
                });
                setFile(null);
                setPreview(null);
                setIsRegistered(true);
                toast.success('User registered successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 1000);
            }
            setLoading(false);

        } catch (error) {
            setLoading(false);
            toast.error("Failed to register, try again");
            setTimeout(() => setErrorMessage(''), 1000);
        }
    };

    return (
        <div className="relative w-full h-screen bg-gradient-to-b from-[#f70767] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-[#f70767] hover:text-[#d5065a] transition-colors duration-200 mr-2"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        Back
                    </button>
                </div>
                {!isRegistered ? (
                    <>
                        <h2 className="text-center text-2xl font-bold mb-6 text-[#f70767]">Add User</h2>
                        {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>}
                        {successMessage && <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>}
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-4 flex flex-col items-center">
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Profile Preview"
                                        className="w-24 h-24 object-cover rounded-full mb-3"
                                    />
                                )}
                                <label className='flex justify-start text-left'>Add Profile Image</label>
                                <input
                                    placeholder="Add Profile Image"
                                    type="file"
                                    name="profileImage"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#f70767] file:text-white hover:file:bg-pink-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['username', 'email', 'phone', 'password', 'city', 'address'].map((field) => (
                                    <div key={field} className="form-group">
                                        <label className="block text-gray-700 capitalize">{field}:</label>
                                        <input
                                            type={field === 'password' ? 'password' : 'text'}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#f70767] focus:ring-1 focus:ring-[#f70767]"
                                        />
                                    </div>
                                ))}
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
                            </div>

                            {loading ? (
                                <Spinner />
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full bg-[#f70767] text-white py-3 rounded-xl hover:bg-[#d9065a] transition-colors duration-300"
                                >
                                    Add
                                </button>
                            )}
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-[#28a745]">New User Registered Successful!</h2>
                        <p className="mb-6">You have successfully registered a new user. Please inform the user to check email or spam folder to verify the account.</p>
                        <button
                            onClick={() => navigate("/admin")}
                            className="w-full bg-[#f70767] text-white py-3 rounded-xl hover:bg-[#d9065a] transition-colors duration-300"
                        >
                            Go to Admin Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddUserPage;
