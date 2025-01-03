import axios from "axios";

export default class ApiService {

    static isLocalhost() {
        return window.location.hostname === 'localhost';
    }

    static BOOKING_BASE_URL = ApiService.isLocalhost() 
        ? "http://localhost:4050/api" 
        : "http://13.60.184.247:4050/api";

    static USER_BASE_URL = ApiService.isLocalhost() 
        ? "http://localhost:4070/api" 
        : "http://13.60.184.247:4070/api";

    static ROOM_BASE_URL = ApiService.isLocalhost() 
        ? "http://localhost:4060/api" 
        : "http://13.60.184.247:4060/api";

    // static BASE_URL = "http://ec2-13-49-78-134.eu-north-1.compute.amazonaws.com/api"

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            
        };
    }


    /**AUTH */

    /* This  register a new user */
    static async registerUser(registration) {
        const response = await axios.post(`${this.USER_BASE_URL}/auth/register`, registration)
        return response.data
    }

    /* This  login a registered user */
    static async loginUser(loginDetails) {

        const response = await axios.post(`${this.USER_BASE_URL}/auth/login`, loginDetails)
        console.log(response, "login successful");
        return response.data
    }

    static async forgotPassword(email) {
        console.log(email, 'ema')
        const response = await axios.post(`${this.USER_BASE_URL}/auth/forgot`, email)
        return response.data
    }

    static async resetPasswordEmail(code) {
        console.log('resetPasswordmail' , code)
        const response = await axios.get(`${this.USER_BASE_URL}/auth/reset/${code}`)
        console.log(response.data, "accc")
        return response.data
    }
    

    static async resetPassword(resetPasswordDetails, code) {
        console.log(resetPasswordDetails, 'resetPassword', code)
        const response = await axios.post(`${this.USER_BASE_URL}/auth/reset/${code}`, resetPasswordDetails)
        return response.data
    }
    
    
    
    /* This  login a registered user */
    static async verifyAccount(code) {
        const response = await axios.get(`${this.USER_BASE_URL}/auth/activate/${code}`)
        console.log(response.data, "accc")
        return response.data
    }

    /***USERS */


    /*  This is  to get the user profile */
    static async getAllUsers() {
        const response = await axios.get(`${this.USER_BASE_URL}/users/all`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async getUserProfile() {
        const response = await axios.get(`${this.USER_BASE_URL}/users/get-logged-in-profile-info`, {
            headers: this.getHeader()
        })
        console.log(response.data, 'logged in')
        return response.data
    }


    /* This is the  to get a single user */
    static async getUser(userId) {
        const response = await axios.get(`${this.USER_BASE_URL}/users/get-by-id/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }


    static async addUser(formData) {
        console.log(formData, 'form data')
        const response = await axios.post(`${this.USER_BASE_URL}/users/add/user`,formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response, "result: ")
        return response.data;
    }


    static async updateUser(userId, formData) {
        console.log(formData, 'form data')
        const response = await axios.patch(`${this.USER_BASE_URL}/users/edit-user/${userId}`,formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response, "result: ")
        return response.data;
    }

    /* This is the  to get user bookings by the user id */
    static async getUserBookings(userId) {
        const response = await axios.get(`${this.BOOKING_BASE_URL}/users/get-user-bookings/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }


    static async getAllUserBookings(userId) {
        const response = await axios.get(`${this.BOOKING_BASE_URL}/bookings/user/${userId}`, {
            headers: this.getHeader()
        })

        console.log(response, "all user bookings")
        return response.data
    }



    /* This is to delete a user */
    static async deleteUser(userId) {
        const response = await axios.delete(`${this.USER_BASE_URL}/users/delete/${userId}`, {
            headers: this.getHeader()
        })

        console.log(response, "delete user")
        return response.data
    }

    /**ROOM */
    /* This  adds a new room room to the database */
    static async addRoom(formData) {
        const result = await axios.post(`${this.ROOM_BASE_URL}/rooms/add`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(result, "result: " + JSON.stringify(result))
        return result.data;
    }

    /* This  gets all availavle rooms */
    static async getAllAvailableRooms() {
        const result = await axios.get(`${this.ROOM_BASE_URL}/rooms/all-available-rooms`, {
            headers:this.getHeader()})
        return result.data
    }


    /* This  gets all availavle by dates rooms from the database with a given date and a room type */
    static async getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
        console.log(checkInDate, checkOutDate, roomType, "checkInDate, checkOutDate, roomType")
        const result = await axios.get(
            `${this.ROOM_BASE_URL}/rooms/available-rooms-by-date-and-type?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`, {
            headers:this.getHeader()}
        )
        return result.data
    }

    /* This  gets all room types from thee database */
    static async getRoomTypes() {
        const response = await axios.get(`${this.ROOM_BASE_URL}/rooms/types`
        )
        return response.data
    }
    /* This  gets all rooms from the database */
    static async getAllRooms() {
        const result = await axios.get(`${this.ROOM_BASE_URL}/rooms/all`)
        return result.data
    }
    /* This funcction gets a room by the id */
    static async getRoomById(roomId) {
        const result = await axios.get(`${this.ROOM_BASE_URL}/rooms/room-by-id/${roomId}`, {
            headers:this.getHeader()})
        return result.data
    }

    /* This  deletes a room by the Id */
    static async deleteRoom(roomId) {
        console.log(roomId, "delete room", this.getHeader());
        const result = await axios.delete(`${this.ROOM_BASE_URL}/rooms/delete/${roomId}`, {
            headers: this.getHeader(),
            
        })
        return result.data
    }

    /* This updates a room */
    static async updateRoom(roomId, formData) {
        const result = await axios.patch(`${this.ROOM_BASE_URL}/rooms/update/${roomId}`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return result.data;
    }


    /**BOOKING */
    /* This  saves a new booking to the databse */
    static async bookRoom(roomId, userId, booking) {
        console.log("USER ID IS: " + userId);

        const response = await axios.post(`${this.BOOKING_BASE_URL}/bookings/book-room/${roomId}/${userId}`, booking, {
            headers: this.getHeader()
        })

        console.log("response: " + response)
        return response.data
    }

    /* This  gets alll bokings from the database */
    static async getAllBookings() {
        const result = await axios.get(`${this.BOOKING_BASE_URL}/bookings/all`, {
            headers: this.getHeader()
        })
        return result.data
    }

    /* This  get booking by the cnfirmation code */
    static async getBookingByConfirmationCode(bookingCode) {
        const result = await axios.get(`${this.BOOKING_BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`, {
            headers:this.getHeader()})

            console.log(result)
        return result.data
    }

    /* This is the  to cancel user booking */
    static async cancelBooking(bookingId) {
        const result = await axios.delete(`${this.BOOKING_BASE_URL}/bookings/cancel/${bookingId}`, {
            headers: this.getHeader()
        })
        return result.data
    }


    /**AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin() {
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isUser() {
        const role = localStorage.getItem('role')
        return role === 'USER'
    }
}
// export default new ApiService();