import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiService from "../../service/ApiService";

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSent, setIsSent] = useState(false); // Tracks whether the reset request has been sent
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const resetCode = location.pathname.split("/").pop(); // Extract activation code from URL

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log(resetCode, 'reset code');
                const response = await ApiService.resetPasswordEmail(resetCode);
                console.log(response, 'user profile');
                setUser(response.user);
            } catch (error) {
                toast.error("Unable to fetch user");
            }
        };

        // Ensure the account verification happens after the page is fully loaded
        fetchUserProfile();

        // Cleanup on component unmount
        // return () => {
        //     window.onload = null;
        // };
    }, [resetCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password and confirmPassword match
        if (!password || !confirmPassword) {
            toast.error('Please fill in all fields.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await ApiService.resetPassword({ password: password, password2:confirmPassword, email: user?.email }, resetCode);
            if (response.statusCode === 200) {
                setIsSent(true); // Show the message card
            }
        } catch (error) {
            toast.error("Failed to reset password, try again");
            setTimeout(() => setError(''), 5000);
        }
    };


    console.log(resetCode, "reset code");
    return (
        <div className="relative w-full h-screen bg-gradient-to-r from-[#f70767] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
                {!isSent ? (
                    <>
                        <h2 className="text-center text-2xl font-bold mb-6 text-[#f70767]">Reset Password</h2>
                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-group">
                                <label className="block text-gray-700">New Password:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#f70767] focus:ring-1 focus:ring-[#f70767]"
                                />
                            </div>

                            <div className="form-group">
                                <label className="block text-gray-700">Confirm Password:</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#f70767] focus:ring-1 focus:ring-[#f70767]"
                                />
                            </div>

                            {/* Hidden Email Field */}
                            {user && (
                                <input
                                    type="hidden"
                                    name="email"
                                    value={user.email}
                                />
                            )}

                            <button
                                type="submit"
                                className="w-full bg-[#f70767] text-white py-3 rounded-xl hover:bg-[#d9065a] transition-colors duration-300"
                            >
                                Reset Password
                            </button>
                        </form>
                    </>
                ) : (
                    // This card appears once the password reset is successful
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-[#28a745]">Password Reset Successful</h2>
                        <p className="mb-6">Your password has been reset. Please log in with your new password.</p>
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

export default ResetPassword;
