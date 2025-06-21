import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Edit, Trash2, ChevronDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import './UsersAdmin.css';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // Changed to 0-based for API
  const [sortOption, setSortOption] = useState('tenNguoiDung,asc');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [stats, setStats] = useState({
    totalUsersToday: 0,
    totalUsersLastMonth: 0,
    percentageChange: 0,
    totalUsersYesterday: 0
  });
  const usersPerPage = 10;

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:8080/webreadstory/users/statistical', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(token);
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(
        `http://localhost:8080/webreadstory/users?page=${currentPage}&size=${usersPerPage}&sort=${sortOption}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Search users
  const searchUsers = async (keyword) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(
        `http://localhost:8080/webreadstory/users/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&size=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Fetch users when page or sort changes
  useEffect(() => {
    if (searchTerm) {
      searchUsers(searchTerm);
    } else {
      fetchUsers();
    }
  }, [currentPage, sortOption]);

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search on Enter key press
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(0); // Reset to first page when searching
      if (searchTerm) {
        searchUsers(searchTerm);
      } else {
        fetchUsers();
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.tenNguoiDung?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page changes
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber - 1); // Convert to 0-based for API
  };

  // Handle viewing a user
  const handleViewUser = (user) => {
    setCurrentUser(user);
    setShowViewModal(true);
  };

  // Handle editing a user
  const handleEditUser = (user) => {
    setCurrentUser({ ...user });
    setShowEditModal(true);
  };

  // Handle deleting a user
  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        const response = await fetch(`http://localhost:8080/webreadstory/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Xoá thành công, reload lại danh sách
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Handle save for edit
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      const { maNguoiDung, tenNguoiDung, tenDangNhap, email } = currentUser;
      const response = await fetch(`http://localhost:8080/webreadstory/users/${maNguoiDung}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tenNguoiDung, tenDangNhap, email })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Cập nhật thành công, reload lại danh sách
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  // Get level color class
  const getLevelColorClass = (level) => {
    switch (level) {
      case 'Thần biến cảnh':
        return 'level-than-bien';
      case 'Thần hải cảnh':
        return 'level-than-hai';
      case 'Hoá thần':
        return 'level-hoa-than';
      case 'Nguyên anh':
        return 'level-nguyen-anh';
      case 'Trúc cơ':
        return 'level-truc-co';
      default:
        return '';
    }
  };

  // Get sort option display name
  const getSortOptionDisplayName = (option) => {
    switch (option) {
      case 'tenNguoiDung,asc':
        return 'A → Z';
      case 'tenNguoiDung,desc':
        return 'Z → A';
      case 'ngayTao,asc':
        return 'Ngày đăng ký (tăng dần)';
      case 'ngayTao,desc':
        return 'Ngày đăng ký (giảm dần)';
      default:
        return 'A → Z';
    }
  };

  // Reset current page when search term or sort option changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, sortOption]);

  // Get percentage change display
  const getPercentageChangeDisplay = (percentage) => {
    if (percentage === 'Infinity') {
      return { text: '↑ 100%', isPositive: true };
    }
    const num = parseFloat(percentage);
    if (isNaN(num)) return { text: '0%', isPositive: true };
    return {
      text: `${num > 0 ? '↑' : '↓'} ${Math.abs(num)}%`,
      isPositive: num >= 0
    };
  };

  // Handle reset
  const handleReset = () => {
    setSearchTerm('');
    setCurrentPage(0);
    setSortOption('tenNguoiDung,asc');
    fetchUsers();
    fetchStats();
  };

  return (
    <div className="user-management-container">
      {/* Stats Cards */}
      <div className="stats-container-2">
        <div className="stats-card">
          <div className="stats-title">Tổng số người dùng</div>
          <div className="stats-number">{totalElements}</div>
          <div className={`stats-change ${getPercentageChangeDisplay(Math.floor((totalElements - stats.totalUsersLastMonth) / stats.totalUsersLastMonth * 100)).isPositive ? 'positive' : 'negative'}`}>
            {getPercentageChangeDisplay(Math.floor((totalElements - stats.totalUsersLastMonth) / stats.totalUsersLastMonth * 100)).text} so với tháng trước
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-title">Người dùng mới hôm nay</div>
          <div className="stats-number">{stats.totalUsersToday}</div>
          <div className={`stats-change ${stats.totalUsersToday >= stats.totalUsersYesterday ? 'positive' : 'negative'}`}>
            {stats.totalUsersToday >= stats.totalUsersYesterday ? '↑' : '↓'} {Math.abs(stats.totalUsersToday - stats.totalUsersYesterday)} người so với hôm qua
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="controls-container">
        <div className="search-container">
          <div className='search-items'>
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
            />
          </div>
        </div>

        <div className="sort-container">
          <button 
            className="sort-button" 
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            {getSortOptionDisplayName(sortOption)} <ChevronDown size={16} />
          </button>
          <button
            className="reset-button"
            onClick={handleReset}
            title="Làm mới danh sách"
            style={{ marginLeft: 8 }}
          >
            <RefreshCw size={18} />
          </button>
          {showSortOptions && (
            <div className="sort-dropdown">
              <div onClick={() => {setSortOption('tenNguoiDung,asc'); setShowSortOptions(false);}}>
                A → Z (tên)
              </div>
              <div onClick={() => {setSortOption('tenNguoiDung,desc'); setShowSortOptions(false);}}>
                Z → A (tên)
              </div>
              <div onClick={() => {setSortOption('ngayTao,asc'); setShowSortOptions(false);}}>
                Ngày đăng ký (tăng dần)
              </div>
              <div onClick={() => {setSortOption('ngayTao,desc'); setShowSortOptions(false);}}>
                Ngày đăng ký (giảm dần)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell header">Tên người dùng</div>
            <div className="table-cell header">Email</div>
            <div className="table-cell header">Ngày đăng ký</div>
            <div className="table-cell header">Cấp bậc</div>
            <div className="table-cell header">Thao tác</div>
          </div>
        </div>

        <div className="table-body">
          {filteredUsers.map(user => (
            <div className="table-row" key={user.maNguoiDung}>
              <div className="table-cell name">{user.tenNguoiDung}</div>
              <div className="table-cell">{user.email || 'N/A'}</div>
              <div className="table-cell">{new Date(user.ngayTao).toLocaleDateString('vi-VN')}</div>
              <div className={`table-cell level ${getLevelColorClass(user.capBac)}`}>
                {user.capBac || 'N/A'}
              </div>
              <div className="table-cell actions">
                <Eye 
                  className="action-icon view" 
                  onClick={() => handleViewUser(user)} 
                />
                <Edit
                  className="action-icon edit" 
                  onClick={() => handleEditUser(user)} 
                />
                <Trash2 
                  className="action-icon delete" 
                  onClick={() => handleDeleteUser(user.maNguoiDung)} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination" 
          style={{backgroundColor: 'var(--color_3)', 
                  marginTop: '0',
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px'
                }}
      >
        <div className="pagination-controls">
          <button
            className="pagination-btn prev"
            onClick={() => paginate(currentPage)}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={20} />
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`pagination-btn ${currentPage + 1 === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            className="pagination-btn next"
            onClick={() => paginate(currentPage + 2)}
            disabled={currentPage + 1 === totalPages}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* View User Modal */}
      {showViewModal && currentUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Thông tin người dùng</h2>
            <div className="user-info">
              <div className="info-row">
                <div className="info-label">Tên:</div>
                <div className="info-value">{currentUser.tenNguoiDung}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Tên đăng nhập:</div>
                <div className="info-value">{currentUser.tenDangNhap}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Email:</div>
                <div className="info-value">{currentUser.email || 'N/A'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Ngày đăng ký:</div>
                <div className="info-value">{new Date(currentUser.ngayTao).toLocaleDateString('vi-VN')}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Cấp bậc:</div>
                <div className={`info-value ${getLevelColorClass(currentUser.capBac)}`}>
                  {currentUser.capBac || 'N/A'}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="close-button" 
                onClick={() => setShowViewModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Chỉnh sửa người dùng</h2>
            <div className="form-group">
              <label>Tên:</label>
              <input
                type="text"
                name="tenNguoiDung"
                value={currentUser.tenNguoiDung}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Tên đăng nhập:</label>
              <input
                type="text"
                name="tenDangNhap"
                value={currentUser.tenDangNhap}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={currentUser.email || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => setShowEditModal(false)}
              >
                Huỷ
              </button>
              <button 
                className="save-button" 
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;