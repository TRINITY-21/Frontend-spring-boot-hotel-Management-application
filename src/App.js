

// src/App.js
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddRoomPage from './component/admin/AddRoomPage';
import AddUserPage from './component/admin/AddUserPage';
import AdminPage from './component/admin/AdminPage';
import EditBookingPage from './component/admin/EditBookingPage';
import EditRoomPage from './component/admin/EditRoomPage';
import EditUserPage from './component/admin/EditUserPage';
import ManageBookingsPage from './component/admin/ManageBookingsPage';
import ManageRoomPage from './component/admin/ManageRoomPage';
import ManageUsersPage from './component/admin/ManageUsersPage';
import ChangePasswordPage from './component/auth/ChangePassword';
import LoginPage from './component/auth/LoginPage';
import RegisterPage from './component/auth/RegisterPage';
import ResetPassword from './component/auth/ResetPassword';
import VerifyPage from './component/auth/VerifyPage';
import AllRoomsPage from './component/booking_rooms/AllRoomsPage';
import FindBookingPage from './component/booking_rooms/FindBookingPage';
import RoomDetailsBookingPage from './component/booking_rooms/RoomDetailsPage';
import FooterComponent from './component/common/Footer';
import Navbar from './component/common/Navbar';
import HomePage from './component/home/HomePage';
import EditProfilePage from './component/profile/EditProfilePage';
import ProfilePage from './component/profile/ProfilePage';
import { AdminRoute, ProtectedRoute } from './service/guard';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Public Routes */}
            <Route exact path="/home" element={<HomePage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/activate/:code"
            element={<VerifyPage />} />
            <Route path="/forgot-password"
            element={<ChangePasswordPage />} />
             <Route path="/reset-password/:code"
            element={<ResetPassword />} />
            <Route path="/rooms" element={<AllRoomsPage />} />
            <Route path="/find-booking" element={<FindBookingPage />} />

            {/* Protected Routes */}
            <Route path="/room-details-book/:roomId"
              element={<ProtectedRoute element={<RoomDetailsBookingPage />} />}
            />
            <Route path="/profile"
              element={<ProtectedRoute element={<ProfilePage />} />}
            />
            <Route path="/edit-profile/:userId"
              element={<ProtectedRoute element={<EditProfilePage />} />}
            />

            {/* Admin Routes */}
            <Route path="/admin/add-user"
              element={<AdminRoute element={<AddUserPage />} />}
            />
             <Route path="/admin/edit-user/:userId"
              element={<AdminRoute element={<EditUserPage />} />}
            />
            <Route path="/admin/manage-users"
              element={<AdminRoute element={<ManageUsersPage />} />}
            />
             <Route path="/admin"
              element={<AdminRoute element={<AdminPage />} />}
            />

            <Route path="/admin/manage-rooms"
              element={<AdminRoute element={<ManageRoomPage />} />}
            />
            <Route path="/admin/edit-room/:roomId"
              element={<AdminRoute element={<EditRoomPage />} />}
            />
            <Route path="/admin/add-room"
              element={<AdminRoute element={<AddRoomPage />} />}
            />
            <Route path="/admin/manage-bookings"
              element={<AdminRoute element={<ManageBookingsPage />} />}
            />
            <Route path="/admin/edit-booking/:bookingCode"
              element={<AdminRoute element={<EditBookingPage />} />}
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <FooterComponent />

        <ToastContainer
          autoClose={5000}
          pauseOnFocusLoss={false} 
          draggable={false} 
          pauseOnHover={false} 
          limit={5} 
          style={{minWidth: 400}}
          bodyStyle={{ marginInlineEnd: 20 }}
          closeButton
          hideProgressBar
          position="top-right"
        />
      
      </div>
    </BrowserRouter>

    
  );
}

export default App;
