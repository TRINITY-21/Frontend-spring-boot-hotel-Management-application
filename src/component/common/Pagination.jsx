import React from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'; // Import icons

const Pagination = ({ roomsPerPage, totalRooms, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalRooms / roomsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='pagination-nav flex justify-center mt-6'>
      <ul className="pagination-ul flex items-center space-x-2">
        {/* Previous button */}
        <li>
          <button 
            onClick={() => currentPage > 1 && paginate(currentPage - 1)} 
            className={`pagination-button border rounded-md p-2 ${currentPage === 1 ? 'text-gray-300' : 'text-[#f70767]'}`}
          >
            <FaAngleLeft size={20} />
          </button>
        </li>

        {/* Page number buttons */}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button 
              onClick={() => paginate(number)} 
              className={`pagination-button border rounded-md px-3 py-1 transition ${
                currentPage === number 
                  ? 'bg-[#f70767] text-white' 
                  : 'text-gray-700 hover:text-[#f70767] hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Next button */}
        <li>
          <button 
            onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)} 
            className={`pagination-button border rounded-md p-2 ${currentPage === pageNumbers.length ? 'text-gray-300' : 'text-[#f70767]'}`}
          >
            <FaAngleRight size={20} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
