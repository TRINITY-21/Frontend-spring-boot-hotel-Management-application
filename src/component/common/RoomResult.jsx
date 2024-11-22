import { DollarSign, Info } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ApiService from '../../service/ApiService';

const RoomResult = ({ roomSearchResults }) => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const isAdmin = ApiService.isAdmin();
    return (

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-3 mb-6 ">
            {roomSearchResults && roomSearchResults.length > 0 && (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
                    {roomSearchResults.map((room) => (
                        <div 
                            key={room.id} 
                            className="bg-white rounded-lg shadow-md hover:shadow-lg duration-300 transition-transform transform hover:scale-105 overflow-hidden"
                        >
                            <img 
                                className="w-full h-40 object-cover" 
                                src={room.image} 
                                alt={room.type} 
                            />
                            <div className="p-4">
                                <h3 className="text-2xl font-semibold text-[#f70767] mb-1"> {room.type}</h3>
                                <div className="flex items-center text-gray-600">
                                    <DollarSign className="mr-1 text-[#f70767] w-4" />
                                    <span>{room.price} / night</span>
                                </div>
                                <div className="flex items-start mt-1 text-gray-700">
                                    <Info className="mr-2 mt-1 text-[#f70767] w-4" />
                                    <span>{room.description}</span>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-200 flex justify-center">
                                {isAdmin ? (
                                    <button
                                        className="w-full py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition duration-200"
                                        onClick={() => navigate(`/admin/edit-room/${room.id}`)}
                                    >
                                        Edit Room
                                    </button>
                                ) : (
                                    <button
                                        className="w-full py-2 px-4 bg-[#f70767] text-white font-medium rounded-md hover:bg-[#e0065c] transition duration-200"
                                        onClick={() => navigate(`/room-details-book/${room.id}`)}
                                    >
                                        View/Book Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
        

    );
}

export default RoomResult;
