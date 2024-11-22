import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Edit2,
    Plus,
    Trash2
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await ApiService.getAllUsers();
                console.log(response, "all users")
                setUsers(response.userList.filter(user => !user._deleted && user.active));
                setFilteredUsers(response.userList.filter(user => !user._deleted && user.active));
            } catch (error) {
                console.error('Error fetching users:', error.message);
            }
        };
  
        fetchUsers();
    }, []);
  
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    
        const sortedUsers = [...filteredUsers].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredUsers(sortedUsers);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterUsers(query);
        setCurrentPage(1);
    };

    const filterUsers = (query) => {
        let filtered = [...users];
        if (query) {
            filtered = filtered.filter(user => 
                user.username.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.phone.toLowerCase().includes(query) ||
                user.address.toLowerCase().includes(query) ||
                user.city.toLowerCase().includes(query)
            );
        }
        setFilteredUsers(filtered);
    };
  
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const SortIcon = ({ column }) => {
        if (sortConfig.key === column) {
            return sortConfig.direction === 'asc' ? 
                <ChevronUp className="w-4 h-4 inline-block ml-1" /> :
                <ChevronDown className="w-4 h-4 inline-block ml-1" />;
        }
        return <ChevronDown className="w-4 h-4 inline-block ml-1 opacity-30" />;
    };

    const handleDelete = async (userId) => {
        try {
            console.log(userId)
            const result = await ApiService.deleteUser(userId);
            if (result.statusCode === 200) {
                toast.success('User deleted successfully.');

                // Remove the deleted user from the state without page reload
                const updatedUsers = users.filter(user => user.id !== userId);
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);

                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
             {/* Back Button with Manage Users Heading */}
             <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-[#f70767] hover:text-[#d5065a] transition-colors duration-200 mr-2"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Back
                </button>
            </div>
            <h1 className="text-5xl font-bold text-center text-[#f70767] mb-6">Manage Users</h1>
            
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8 w-full sm:w-auto">
    <input
      type="text"
      placeholder="Search users..."
      value={searchQuery}
      onChange={handleSearch}
      className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#f70767]"
    />
  </div>
  <button
    onClick={() => navigate('/admin/add-user')}
    className="flex items-center px-4 py-2 bg-[#f70767] text-white rounded-md hover:bg-[#d5065a] transition-colors duration-200 mt-4 sm:mt-0"
  >
    <Plus className="w-4 h-4 mr-2" />
    Add User
  </button>
</div>

  
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full bg-white border-collapse rounded-lg overflow-hidden">
                        <thead className="bg-[#f70767] text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Photo</th>
                                <th 
                                    className="px-6 py-3 text-left text-sm font-semibold cursor-pointer"
                                    onClick={() => handleSort('username')}
                                >
                                    <div className="flex items-center">
                                        Username
                                        <SortIcon column="username" />
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-sm font-semibold cursor-pointer"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center">
                                        Email
                                        <SortIcon column="email" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Address</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <img 
                                            src={user.profileImage || "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/user-female-circle-pink-1024.png"} 
                                            alt={user.username}
                                            className="w-14 h-14 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-lg font-semibold text-[#f70767]">{user.username}</span>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.phone}</td>
                                    <td className="px-6 py-4">{user.address}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                                                className="p-1 hover:bg-gray-100 rounded-md text-gray-700 hover:text-[#f70767] transition-colors duration-200"
                                            >
                                                <Edit2 className="w-4 h-4 mr-1" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-1 hover:bg-gray-100 rounded-md text-[#f70767] hover:text-red-800 transition-colors duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
  
            {filteredUsers.length > usersPerPage && (
                <div className="mt-4 flex justify-center">
                    <div className="flex gap-2">
                        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    currentPage === index + 1
                                    ? 'bg-[#f70767] text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
  
export default ManageUsersPage;
