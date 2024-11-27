import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiService from "../../service/ApiService";

function ChangePasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSent, setIsSent] = useState(false); // Tracks whether the reset request has been sent
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/home';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please fill in all fields.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await ApiService.forgotPassword({ email });
            if (response.statusCode === 200) {
                setIsSent(true); // Show the message card
            }
        } catch (error) {
            toast.error("Failed to send email, try again");
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="relative w-full h-screen bg-gradient-to-r from-[#f70767] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
                {!isSent ? (
                    <>
                        <h2 className="text-center text-2xl font-bold mb-6 text-[#f70767]">Reset Password</h2>
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

                            <button
                                type="submit"
                                className="w-full bg-[#f70767] text-white py-3 rounded-xl hover:bg-[#d9065a] transition-colors duration-300"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    // This card appears once the email is sent successfully
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-[#28a745]">Check Your Email</h2>
                        <p className="mb-6">We've sent a password reset link to your email. Please check your inbox (and spam folder) for the reset code.</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-[#f70767] text-white py-3 rounded-xl hover:bg-[#d9065a] transition-colors duration-300"
                        >
                            Back to Login
                        </button>
                    </div>
                )}

                <p className="text-center mt-4">
                    Remembered your password? <a href="/login" className="text-[#f70767] font-semibold">Login</a>
                </p>
            </div>
        </div>
    );
}

export default ChangePasswordPage;
