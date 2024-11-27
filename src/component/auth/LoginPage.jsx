import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiService from "../../service/ApiService";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/home';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await ApiService.loginUser({ email, password });
            if (response.statusCode === 200) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                navigate(from, { replace: true });
            }
        } catch (error) {
            toast.error("Failed to login, try again");
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="relative w-full h-screen bg-gradient-to-r from-[#f70767] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
                <h2 className="text-center text-2xl font-bold mb-6 text-[#f70767]">Login</h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#f70767] focus:ring-1 focus:ring-[#f70767]"
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-gray-700">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#f70767] focus:ring-1 focus:ring-[#f70767]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#f70767] text-white py-3 rounded-xl hover:bg-[#d9065a] transition-colors duration-300"
                    >
                        Login
                    </button>
                </form>
                
                <div className="text-center mt-4">
                    <p>
                        Don't have an account? <a href="/register" className="text-[#f70767] font-semibold">Register</a>
                    </p>
                    <p className="mt-2">
                        <a href="/forgot-password" className="text-[#f70767] font-semibold">Forgot Your Password?</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
