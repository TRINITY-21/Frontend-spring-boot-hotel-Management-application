import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaCreditCard, FaHeadphones, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const slides = [
    
    {
        id: 1,
        title: "FIND YOUR PERFECT STAY",
        subtitle: "FIND YOUR PERFECT STAY",
        collection: "BOOK A ROOM",
        image:"https://th.bing.com/th/id/R.631e2317dbb9bcc0af67846148ecf227?rik=QtHZ66d%2biOMWPg&riu=http%3a%2f%2fwww.cfmedia.vfmleonardo.com%2fimageRepo%2f7%2f0%2f123%2f87%2f11%2fISTHA_6317129391_O.jpg&ehk=h82%2fprlW8yF%2feUvkqBBQBvK9bihUzSw7sGKBG1B8s7g%3d&risl=&pid=ImgRaw&r=0",
        bgColor: "bg-gray-50"
    },
    {
        id: 2,
        title: "FIND YOUR PERFECT STAY",
        subtitle: "FIND YOUR PERFECT STAY",
        collection: "BOOK A ROOM",
        image: "https://th.bing.com/th/id/R.fb071770f83d99469698c26ea165e01e?rik=L8MdZnhhE4eonA&riu=http%3a%2f%2fmedia.architecturaldigest.com%2fphotos%2f57e42deafe422b3e29b7e790%2fmaster%2fpass%2fJW_LosCabos_2015_MainExterior.jpg&ehk=T5IeAh1xUTXOGrbKtfbg8dJDabe5Nquu660Eh3%2bi%2bdY%3d&risl=&pid=ImgRaw&r=0",
        bgColor: "bg-gray-50"
    },
    {
        id: 3,
        title: "FIND YOUR PERFECT STAY",
        subtitle: "FIND YOUR PERFECT STAY",
        collection: "BOOK A ROOM",
        image: "https://f22bfca7a5abd176cefa-59c40a19620c1f22577ade10e9206cf5.ssl.cf1.rackcdn.com/u/the-house-hotel-bosphorus-building-nightlife-M-02-r.jpg",
        bgColor: "bg-gray-50"
    }
];

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 3000);

        return () => clearInterval(timer);
    }, [currentSlide]);

    const handlePrevious = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide(current => 
                current === 0 ? slides.length - 1 : current - 1
            );
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    const handleNext = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide(current => 
                current === slides.length - 1 ? 0 : current + 1
            );
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    return (
        <div className="relative h-[600px] overflow-hidden">
            {/* Main Slider */}
                            {/* Dimmed Overlay */}
                            <div className="absolute inset-0 bg-black opacity-30"></div>
                
            <div 
                className={`relative w-full h-full transition-all duration-500 `} 
                style={{
                    backgroundImage: `url(${slides[currentSlide].image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    {/* Text Content */}
                    <div className="w-full text-center animate-fadeIn">
                        <p className="text-4xl md:text-5xl text-white font-black">
                            {slides[currentSlide].subtitle}
                        </p>
                        <button onClick={() => navigate(`/rooms`)}

                        className="bg-[#f70767] text-white px-8 py-3 text-md rounded-md hover:bg-opacity-90 transition-colors duration-300">
                            BOOK NOW
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Navigation Buttons */}
            <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-500/50 hover:bg-[#f70767]/75 text-white rounded-full p-3 transition-colors duration-300"
            >
                <FaChevronLeft size={24} />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-500/50 hover:bg-[#f70767]/75 text-white rounded-full p-3 transition-colors duration-300"
            >
                <FaChevronRight size={24} />
            </button>
    
            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            currentSlide === index ? 'w-8 bg-[#f70767]' : 'w-2 bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
    
};


const FeatureSection = () => {
    const features = [
        {
            icon: <FaShoppingCart className="w-8 h-8 text-[#f70767]" />,
            title: "FREE HOME DELIVERY",
            description: "SUPERFAST DELIVERY",
            animation: ""
        },
        {
            icon: <FaHeadphones className="w-8 h-8 text-[#f70767]" />,
            title: "24/7 SUPPORT",
            description: "CONTACT US ANYTIME",
            animation: ""
        },
        {
            icon: <FaCreditCard className="w-8 h-8 text-[#f70767] " />,
            title: "SECURE PAYMENT",
            description: "100% SAFE TRANSACTIONS",
            animation: ""
            
        }
    ];

    return (
        <div className="w-full py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-lg hover:shadow-md transition-shadow duration-500">
                            <div className={`flex-shrink-0`}>
                               <div className='text-[#f70767]'> {feature.icon}</div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#f70767]">
                                    {feature.title}
                                </h3>
                                <p className="text-xs text-gray-600 mt-1">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};



const LandingPage = () => {
  return (
    <><div className="">
          <HeroSlider />
          <FeatureSection />
      </div></>

  );
};

export default LandingPage;