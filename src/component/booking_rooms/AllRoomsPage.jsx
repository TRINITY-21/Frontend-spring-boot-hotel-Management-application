import React, { useEffect, useState } from 'react';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import RoomResult from '../common/RoomResult';
import RoomSearch from '../common/RoomSearch';

const AllRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await ApiService.getAllRooms();
        const allRooms = response.roomList;
        setRooms(allRooms);
        setFilteredRooms(allRooms);
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

  const handleRoomTypeChange = (e) => {
    setSelectedRoomType(e.target.value);
    filterRooms(e.target.value);
  };

  const filterRooms = (type) => {
    setFilteredRooms(type === '' ? rooms : rooms.filter((room) => room.type === type));
    setCurrentPage(1);
  };

  const handleSearchResult = (results) => {
    setRooms(results);
    setFilteredRooms(results);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="py-10 bg-gray-100">
      <h1 className="text-center text-4xl font-semibold text-[#f70767] mb-3">Explore Our Rooms</h1>
      <p className="text-center text-lg text-gray-700 mb-8">
        Find the perfect room that suits your style and needs.
      </p>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <span className="mr-2 font-semibold text-[#f70767]">Filter by Room Type:</span>
          <select
            value={selectedRoomType}
            onChange={handleRoomTypeChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#f70767] transition duration-200"
          >
            <option value="">All</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Room Search */}
      <RoomSearch handleSearchResult={handleSearchResult} />

      {/* Room Results */}
      <RoomResult roomSearchResults={currentRooms} />

      {/* Pagination */}
      {
        rooms.length > 0 && 
        <Pagination
        roomsPerPage={roomsPerPage}
        totalRooms={filteredRooms.length}
        currentPage={currentPage}
        paginate={paginate}
      />
      }
    </div>
  );
};

export default AllRoomsPage;
