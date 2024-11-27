import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Edit2,
  Info,
  Plus,
  Trash2
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../../service/ApiService';

const ManageRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await ApiService.getAllRooms();
        console.log(response);
        setRooms(response.roomList);
        setFilteredRooms(response.roomList);
      } catch (error) {
        console.error('Error fetching rooms:', error.message);
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Error fetching room types:', error.message);
      }
    };

    fetchRooms();
    fetchRoomTypes();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  
    const sortedRooms = [...filteredRooms].sort((a, b) => {
      if (key === '_booked') {
        return direction === 'asc'
          ? (b._booked - a._booked) // Booked first (true values)
          : (a._booked - b._booked); // Available first (false values)
      } else {
        // Default sorting for other keys
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
    setFilteredRooms(sortedRooms);
  };
  

  const handleRoomTypeChange = (e) => {
    const type = e.target.value;
    setSelectedRoomType(type);
    filterRooms(type, searchQuery);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterRooms(selectedRoomType, query);
    setCurrentPage(1);
  };

  const filterRooms = (type, query) => {
    let filtered = [...rooms];
    if (type) {
      filtered = filtered.filter(room => room.roomType === type);
    }
    if (query) {
      filtered = filtered.filter(room => 
        room.roomNumber.toString().toLowerCase().includes(query) ||
        room.roomType.toLowerCase().includes(query) ||
        room.price.toString().includes(query)
      );
    }
    setFilteredRooms(filtered);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const SortIcon = ({ column }) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUp className="w-4 h-4 inline-block ml-1" /> :
        <ChevronDown className="w-4 h-4 inline-block ml-1" />;
    }
    return <ChevronDown className="w-4 h-4 inline-block ml-1 opacity-30" />;
  };

  const handleDelete = async (roomId) => {
      try {
        const result = await ApiService.deleteRoom(roomId);
        if (result.statusCode === 200) {
          toast.success('Room deleted successfully.');
  
          // Remove the deleted room from the state without page reload
          const updatedRooms = rooms.filter(room => room.id !== roomId);
          setRooms(updatedRooms);
          setFilteredRooms(updatedRooms);
  
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setTimeout(() => setError(''), 5000);
      }
    
  };
  

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
       <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-[#f70767] hover:text-[#d5065a] transition-colors duration-200 mr-2"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Back
                </button>
            </div>
      <h1 className="text-5xl font-bold text-center text-[#f70767] mb-6">Manage Rooms</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full sm:w-auto">
    <div className="flex items-center gap-2">
      <label className="font-semibold text-[#f70767]">Room Type:</label>
      <select
        value={selectedRoomType}
        onChange={handleRoomTypeChange}
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#f70767]"
      >
        <option value="">All</option>
        {roomTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  </div>
  <button
    onClick={() => navigate('/admin/add-room')}
    className="flex items-center px-4 py-2 bg-[#f70767] text-white rounded-md hover:bg-[#d5065a] transition-colors duration-200 mt-4 sm:mt-0"
  >
    <Plus className="w-4 h-4 mr-2" />
    Add Room
  </button>
</div>


      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full bg-white border-collapse rounded-lg overflow-hidden">
                    <thead className="bg-[#f70767] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold ">
                  Image
                </th>
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold  cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Room Type
                    <SortIcon column="type" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold  cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    <SortIcon column="price" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold ">
                  Description
                </th>
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold cursor-pointer"
                  onClick={() => handleSort('_booked')}
                >
                  <div className="flex items-center">
                    Status
                    <SortIcon column="_booked" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRooms.map((room) => (
                <tr 
                  key={room.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <img 
                      src={room.image} 
                      alt={room.type}
                      className="w-24 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-semibold text-[#f70767]">
                      {room.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="mr-1 text-[#f70767] w-4" />
                      <span>{room.price} / night</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start text-gray-700 max-w-xs">
                      <Info className="mr-2 mt-1 text-[#f70767] w-4 flex-shrink-0" />
                      <span className="text-sm line-clamp-2">{room.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room._booked === true 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                     <span>{room._booked==true ? "Booked" : "Available"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit-room/${room.id}`)}
                        className="p-1 hover:bg-gray-100 rounded-md text-gray-700 hover:text-[#f70767] transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                      </button>
                      <button
                        onClick={() => {handleDelete(room.id)}}
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

      {filteredRooms.length > roomsPerPage && (
        <div className="mt-4 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(filteredRooms.length / roomsPerPage) }).map((_, index) => (
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

export default ManageRoomPage;