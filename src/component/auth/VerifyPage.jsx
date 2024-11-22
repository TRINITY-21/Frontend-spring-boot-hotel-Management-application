import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiService from "../../service/ApiService"; // Adjust path as necessary
import Spinner from "../ui/LoadingSpinner";

function VerifyPage() {
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(null); // Tracks verification status
    const [error, setError] = useState(null); // Tracks error status
    const navigate = useNavigate();
    const location = useLocation();
    const activationCode = location.pathname.split("/").pop(); // Extract activation code from URL

    useEffect(() => {
        const handlePageLoad = () => {
            let isRequestSent = false; // Flag to prevent duplicate requests

            const verifyAccount = async () => {
                if (isRequestSent) return; // Skip if the request has already been sent
                console.log(activationCode, "activation code");

                try {
                    setLoading(true);
                    const response = await ApiService.verifyAccount(activationCode);
                    if (response) {
                        console.log(response, "API response");
                        toast.success(`Account verified successfully.`);
                        setVerified(true);
                    } else {
                        setVerified(false);
                        console.log("Failed");
                    }
                } catch (err) {
                    console.error(err);
                    setVerified(false);
                    setError("Verification failed. Please try again or contact support.");
                } finally {
                    setLoading(false);
                    isRequestSent = true; // Set flag to prevent re-trigger
                }
            };

            verifyAccount();
        };

        // Ensure the account verification happens after the page is fully loaded
        window.onload = handlePageLoad;

        // Cleanup on component unmount
        return () => {
            window.onload = null;
        };
    }, [activationCode]);

    return (
        <div className="relative w-full h-screen bg-gradient-to-r from-[#f70767] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
                {loading ? (
                    <Spinner /> // Show loading spinner during verification
                ) : verified ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-[#28a745]">Account Verified</h2>
                        <p className="mb-6">Your account has been successfully verified.</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-[#f70767] text-white py-3 rounded-xl hover:bg-[#d9065a] transition-colors duration-300"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Verification Failed</h2>
                        {error && <p className="text-red-500 mb-6">{error}</p>}
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-[#f70767] text-white py-3 rounded-xl hover:bg-[#d9065a] transition-colors duration-300"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyPage;
