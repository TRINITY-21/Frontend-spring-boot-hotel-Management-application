import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaBed, FaHome, FaKey, FaSearch, FaSignInAlt, FaTimes, FaUserCircle, FaUserCog, FaUserPlus } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';

function Navbar() {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                console.log(response, 'user profile');
                setUser(response.user);
            } catch (error) {
                toast.error("Unable to fetch user");
            }
        };

        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            ApiService.logout();
            navigate('/home');
            setIsOpen(false);
            setShowDropdown(false);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('profileImage', file);
                const response = await ApiService.updateProfileImage(formData);
                setUser(prev => ({
                    ...prev,
                    profileImage: response.profileImage
                }));
                toast.success('Profile image updated successfully');
            } catch (error) {
                toast.error('Failed to update profile image');
            }
        }
    };

    const navItems = [
        { to: '/home', label: 'Home', Icon: FaHome },
        { to: '/rooms', label: 'Rooms', Icon: FaBed },
        { to: '/find-booking', label: 'Find Booking', Icon: FaSearch }
    ];

    const NavItem = ({ to, label, Icon, onClick }) => (
        <li className="group">
            <NavLink
                to={to}
                onClick={onClick}
                className={({ isActive }) =>
                    `flex items-center gap-2 text-sm transition-colors duration-300 p-2 
                    ${isActive ? 'text-[#f70767] font-medium' : 'text-gray-600 hover:text-[#f70767]'}`
                }
            >
                <Icon className="text-lg transition-transform duration-300 group-hover:scale-110" />
                <span>{label}</span>
            </NavLink>
        </li>
    );

    const ProfileDropdown = () => (
        <div
            ref={dropdownRef}
            className="absolute right-20 mt-4 w-64 bg-white rounded-lg shadow-lg py-2 z-50"
        >
            {/* Profile Preview Section */}
            <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <img
                            src={user?.profileImage || 'https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/user-female-circle-pink-1024.png'}
                            alt={`${user?.username}'s profile`}
                            className="w-11 h-11 rounded-full object-cover border-2 border-[#f70767]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white text-xs">Update Photo</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div>
                        <p className="font-medium text-gray-800 truncate">{user?.username}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
                <NavLink
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#f70767]"
                    onClick={() => setShowDropdown(false)}
                >
                    <FaUserCircle className="mr-3" />
                    View Profile
                </NavLink>
                <NavLink
                    to="/forgot-password"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#f70767]"
                    onClick={() => setShowDropdown(false)}
                >
                    <FaKey className="mr-3" />
                    Change Password
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100 hover:text-[#f70767]"
                >
                    <FaSignInAlt className="mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <nav className=" top-0 bg-white shadow-md w-full z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                    <NavLink to="/home" className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="100px" height="auto" viewBox="0 0 490.000000 242.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,242.000000) scale(0.100000,-0.100000)" fill="#f70767" stroke="none"><path d="M915 1915 c-248 -55 -465 -266 -530 -513 -22 -86 -21 -92 18 -92 32 0 33 2 45 56 25 121 114 259 227 354 54 45 189 114 245 125 68 13 70 15 70 51 0 19 -3 34 -7 33 -5 0 -35 -7 -68 -14z"></path><path d="M1172 1899 c3 -33 4 -34 79 -51 149 -33 277 -117 367 -238 73 -97 100 -156 126 -272 5 -23 12 -28 37 -28 l31 0 -7 48 c-8 53 -41 138 -88 221 -36 66 -182 215 -248 253 -59 35 -163 74 -219 83 -25 3 -53 9 -63 12 -16 4 -18 0 -15 -28z"></path><path d="M720 1334 l0 -246 138 4 c108 3 142 7 163 21 l26 17 -5 -80 c-5 -92 12 -151 60 -205 52 -60 178 -85 286 -56 42 12 42 12 42 58 0 43 -1 45 -22 38 -13 -4 -51 -10 -85 -12 -71 -5 -115 14 -149 65 -27 40 -26 151 2 188 41 55 70 69 142 68 37 0 77 -4 90 -8 21 -8 22 -6 22 37 0 25 -5 49 -10 52 -6 4 -44 9 -84 12 -54 4 -86 1 -122 -11 -26 -9 -50 -16 -53 -16 -3 0 -6 37 -6 83 0 68 -5 89 -25 124 -48 86 -122 113 -306 113 l-104 0 0 -246z m277 135 c70 -65 71 -199 1 -266 -25 -24 -38 -28 -103 -31 l-75 -4 0 167 0 168 75 -5 c62 -4 80 -9 102 -29z"></path><path d="M3006 1394 c-30 -30 -12 -64 34 -64 46 0 64 34 34 64 -20 20 -48 20 -68 0z"></path><path d="M1990 1181 l0 -201 103 1 c115 1 153 11 198 54 43 40 59 83 59 157 0 76 -28 132 -80 162 -28 17 -57 21 -157 24 l-123 4 0 -201z m236 95 c30 -30 34 -40 34 -85 0 -96 -41 -141 -127 -141 l-53 0 0 130 0 130 56 0 c50 0 59 -3 90 -34z"></path><path d="M3437 1365 c-78 -27 -126 -101 -127 -191 0 -125 73 -194 207 -194 75 0 103 13 103 48 l0 29 -75 -5 -74 -5 -37 37 c-36 36 -36 38 -32 101 3 55 8 70 31 93 25 25 34 27 107 27 l80 0 0 31 c0 24 -5 33 -22 38 -39 10 -121 6 -161 -9z"></path><path d="M4320 1345 c-29 -10 -36 -17 -38 -43 -2 -24 -8 -32 -23 -32 -14 0 -19 -7 -19 -30 0 -23 5 -30 19 -30 17 0 19 -10 23 -96 3 -86 5 -98 27 -115 26 -21 90 -26 109 -7 7 7 12 22 12 35 0 17 -6 23 -23 23 -37 0 -47 19 -47 91 l0 68 33 3 c26 2 33 8 35 30 3 24 -1 27 -30 30 -30 3 -33 6 -38 44 l-5 41 -35 -12z"></path><path d="M2480 1252 c-47 -26 -72 -71 -72 -132 0 -110 79 -160 211 -134 26 6 31 11 31 36 0 25 -3 29 -17 22 -42 -18 -88 -16 -116 6 -51 40 -37 50 68 50 92 0 95 1 95 23 0 42 -20 93 -45 117 -34 32 -108 38 -155 12z m108 -54 c7 -7 12 -20 12 -30 0 -15 -9 -18 -55 -18 -59 0 -63 4 -39 38 17 24 62 30 82 10z"></path><path d="M2783 1263 c-31 -6 -63 -49 -63 -84 0 -37 28 -65 80 -80 23 -7 45 -21 51 -30 18 -35 -50 -49 -113 -24 -15 6 -18 2 -18 -24 0 -37 23 -46 106 -39 73 6 106 36 102 93 -3 38 -5 41 -66 70 -81 39 -81 60 1 59 56 -1 57 -1 57 26 0 20 -6 29 -22 34 -25 6 -80 6 -115 -1z"></path><path d="M3000 1125 l0 -145 40 0 40 0 0 145 0 145 -40 0 -40 0 0 -145z"></path><path d="M3735 1262 c-23 -6 -31 -13 -33 -34 l-3 -28 60 6 c42 5 65 3 76 -6 29 -24 16 -37 -45 -44 -81 -9 -115 -38 -115 -96 0 -58 32 -84 93 -77 23 2 52 13 62 22 19 17 20 17 20 -3 0 -19 6 -22 41 -22 l41 0 -4 115 c-3 109 -4 116 -30 141 -21 22 -38 28 -80 30 -29 1 -66 0 -83 -4z m115 -167 c0 -14 -9 -34 -20 -45 -35 -35 -80 -20 -80 27 0 17 7 24 28 29 15 3 32 7 37 9 25 9 35 3 35 -20z"></path><path d="M4010 1125 l0 -145 40 0 40 0 0 74 c0 111 17 146 73 146 24 0 27 4 27 35 0 42 -22 47 -63 15 -14 -11 -28 -20 -31 -20 -3 0 -6 9 -6 20 0 17 -7 20 -40 20 l-40 0 0 -145z"></path><path d="M375 1074 c15 -121 99 -283 202 -388 87 -89 252 -178 356 -192 46 -7 47 -6 47 19 0 24 -7 28 -70 47 -238 71 -403 241 -465 480 -21 79 -24 85 -50 88 l-28 4 8 -58z"></path><path d="M1740 1068 c-26 -136 -96 -256 -207 -357 -79 -73 -203 -137 -297 -154 -65 -12 -76 -19 -76 -54 0 -29 28 -30 125 -4 219 59 384 202 480 418 20 44 55 177 55 209 0 2 -15 4 -34 4 -33 0 -34 -1 -46 -62z"></path></g></svg>                        

                        </NavLink>
                    </div>

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:text-[#f70767] focus:outline-none"
                    >
                        {isOpen ? (
                            <FaTimes className="h-6 w-6" />
                        ) : (
                            <FaBars className="h-6 w-6" />
                        )}
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center">
                        <ul className="flex items-center space-x-6 text-gray-600">
                            {navItems.map((item) => (
                                <NavItem key={item.to} {...item} />
                            ))}

                            {isAdmin && (
                                <NavItem to="/admin" label="Admin" Icon={FaUserCog} />
                            )}

                            {!isAuthenticated ? (
                                <>
                                    <NavItem to="/login" label="Login" Icon={FaSignInAlt} />
                                    <NavItem to="/register" label="Register" Icon={FaUserPlus} />
                                </>
                            ) : (
                                <li className="">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center focus:outline-none"
                                    >
                                        
                                        <img
                                            src={user?.profileImage || 'https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/user-female-circle-pink-1024.png'}
                                            alt={`${user?.username}'s profile`}
                                            className="w-11 h-11 rounded-full object-cover border-2 border-[#f70767]"
                                        />
                                        {showDropdown ? (
                                            <ChevronDown  className="w-4 h-4  text-[#f70767]" />
                                            ) : (
                                            <ChevronUp className="w-4 h-4  text-[#f70767]" />
                                            )}
                                    </button>
                                    {showDropdown && <ProfileDropdown />}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`lg:hidden transition-all duration-300 ${
                        isOpen
                            ? 'max-h-screen opacity-100 visible'
                            : 'max-h-0 opacity-0 invisible'
                    }`}
                >
                    <ul className="flex flex-col space-y-2 pb-4">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.to}
                                {...item}
                                onClick={() => setIsOpen(false)}
                            />
                        ))}

                        {isUser && (
                            <NavItem
                                to="/profile"
                                label="Profile"
                                Icon={FaUserCircle}
                                onClick={() => setIsOpen(false)}
                            />
                        )}

                        {isAdmin && (
                            <NavItem
                                to="/admin"
                                label="Admin"
                                Icon={FaUserCog}
                                onClick={() => setIsOpen(false)}
                            />
                        )}

                        {isAuthenticated && (
                            <>
                                <NavItem
                                    to="/profile"
                                    label="View Profile"
                                    Icon={FaUserCircle}
                                    onClick={() => setIsOpen(false)}
                                />
                                <NavItem
                                    to="/change-password"
                                    label="Change Password"
                                    Icon={FaKey}
                                    onClick={() => setIsOpen(false)}
                                />
                                <li className="group">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#f70767] transition-colors duration-300 w-full p-2"
                                    >
                                        <FaSignInAlt className="text-lg transition-transform duration-300 group-hover:scale-110" />
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </>
                        )}

                        {!isAuthenticated && (
                            <>
                                <NavItem
                                    to="/login"
                                    label="Login"
                                    Icon={FaSignInAlt}
                                    onClick={() => setIsOpen(false)}
                                />
                                <NavItem
                                    to="/register"
                                    label="Register"
                                    Icon={FaUserPlus}
                                    onClick={() => setIsOpen(false)}
                                />
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;