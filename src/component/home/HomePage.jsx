import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";
import HeroSlider from "./LandingPage";

const HomePage = () => {
    const [roomSearchResults, setRoomSearchResults] = useState([]);
    const navigate = useNavigate();
    // Function to handle search results
    const handleSearchResult = (results) => {
        // console.log(results[]);
        // allSearchResults = 
        setRoomSearchResults(results.slice(0, 3));
    };

    // Carousel settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "linear",
    };

    return (
        <div className="min-h-screen">
            {/* HEADER / CAROUSEL SECTION */}
            <HeroSlider />

            {/* SEARCH/FIND AVAILABLE ROOM SECTION */}


            <RoomSearch handleSearchResult={handleSearchResult} />

            <RoomResult roomSearchResults={roomSearchResults} />


                
                {
                roomSearchResults.length > 0 && 
                <><div className="max-w-6xl mx-auto border-2 pt-0"></div>
                <div className="max-w-6xl mx-auto px- sm:px-6 lg:px-3 mb-20 mt-10 flex justify-end">
                    <button
                        className="flex space-x-6 items-center max-w-5xl py-2 px-4 bg-[#f70767] text-white font-medium rounded-md hover:bg-[#e0065c] transition duration-200"
                        onClick={() => navigate(`/rooms`)}
                    >

                        <span>  See More </span>
                        <ChevronRight className="text-lg transition-transform duration-300 group-hover:scale-110" />

                    </button>
                </div></>
                }
  

            <h1 className="text-center text-4xl font-bold mt-10 mb-4">
                <span className="text-[#f70767]">Dersi Cart </span> Hotel Services
            </h1>

            {/* SERVICES SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
                {[
                    {
                        title: "Air Conditioning",
                        description: "Indulge in personalized comfort with our state-of-the-art air conditioning systems, ensuring a cool and relaxing environment.",
                        img: "./assets/images/ac.png",
                    },
                    {
                        title: "Mini Bar",
                        description: "Savor a delightful selection of beverages and snacks from our complimentary mini bar, replenished daily for your enjoyment.",
                        img: "./assets/images/mini-bar.png",
                    },
                    {
                        title: "Parking",
                        description: "Convenient on-site parking is available, along with valet options to enhance your stay experience.",
                        img: "./assets/images/parking.png",
                    },
                    {
                        title: "WiFi",
                        description: "Stay connected with complimentary high-speed Wi-Fi, accessible in all guest rooms and public areas of the hotel.",
                        img: "./assets/images/wifi.png",
                    },
                ].map((service, index) => (
                    <div
                        key={index}
                        className="service-card bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col"
                    >

                        <div className="p-4 flex flex-row">
                            <img
                                src={service.img}
                                alt={service.title}
                                className="w-full h-16 object-cover"
                            />
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                            </div>
                        </div>
                        <p className="text-gray-600">{service.description}</p>
                    </div>
                ))}
            </section>


        </div>
    );
}

export default HomePage;
