import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye,  Trash2, ChevronDown, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import './CommentsAdmin.css';

const CommentsAdmin = () => {
    const [comments, setComments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0); // Changed to 0-based for API
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [currentCmt, setCurrentCmt] = useState(null);
    const [sortOption, setSortOption] = useState('dateDesc');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [totalCommentToday, settotalCommentToday] = useState(0);
    const [totalCommentYesterday, settotalCommentYesterday] = useState(0);
    const [totalCommentLastMonth, settotalCommentLastMonth] = useState(0);
    const commentPerPage = 10;

    // Function to get auth token
    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    // Function to fetch statistics
    const fetchStatistics = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch('http://localhost:8080/webreadstory/commentAdmin/statistical', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }
            
            const data = await response.json();
            // console.log('Statistical API Response:', data.totalCommentsToday, data.totalCommentsYesterday, data.totalCommentsLastMonth);
            settotalCommentToday(data.totalCommentsToday);
            settotalCommentYesterday(data.totalCommentsYesterday);
            settotalCommentLastMonth(data.totalCommentsLastMonth);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    // Function to fetch comments
    const fetchComments = async (page = 0) => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const sortDirection = sortOption === 'dateAsc' ? 'asc' : 'desc';
            const response = await fetch(`http://localhost:8080/webreadstory/commentAdmin?page=${page}&size=${commentPerPage}&sort=ngayThem,${sortDirection}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            
            const data = await response.json();
            
            setComments(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching comments:', error);
            // You might want to show an error message to the user here
        } finally {
            setLoading(false);
        }
    };

    // Function to search comments
    const searchComments = async (keyword, page = 0) => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const sortDirection = sortOption === 'dateAsc' ? 'asc' : 'desc';
            const response = await fetch(`http://localhost:8080/webreadstory/commentAdmin/search?keyword=${keyword}&page=${page}&size=${commentPerPage}&sort=ngayThem,${sortDirection}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to search comments');
            }
            
            const data = await response.json();
            setComments(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error searching comments:', error);
            // You might want to show an error message to the user here
        } finally {
            setLoading(false);
        }
    };

    // Function to delete comment
    const handleDeleteUser = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
            try {
                const token = getAuthToken();
                const response = await fetch(`http://localhost:8080/webreadstory/commentAdmin/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to delete comment');
                }
                
                // Reload comments after deletion
                if (searchTerm) {
                    searchComments(searchTerm, currentPage);
                } else {
                    fetchComments(currentPage);
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
                // You might want to show an error message to the user here
            }
        }
    };

    // Handle search input change with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                searchComments(searchTerm, 0);
            } else {
                fetchComments(0);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, sortOption]);

    // Initial fetch
    useEffect(() => {
        fetchComments(0);
        fetchStatistics();
    }, []);

    // Handle view comment
    const handleViewUser = (cmt) => {
        setCurrentCmt(cmt);
        setShowViewModal(true);
    };

    // Function to get sort option display name
    const getSortOptionDisplayName = (option) => {
        switch (option) {
            case 'dateAsc':
                return 'Time A → Z';
            case 'dateDesc':
                return 'Time Z → A';
            default:
                return 'Time Z → A';
        }
    };

    // Function to render trend indicator
    const getPercentageChangeDisplay = (percentage) => {
        if (percentage === 'Infinity') {
          return { text: '↑ 100%', isPositive: true };
        }
        const num = parseFloat(percentage);
        if (isNaN(num)) return { text: '0%', isPositive: true };
        return {
          text: `${num >= 0 ? '↑' : '↓'} ${Math.abs(num)}%`,
          isPositive: num >= 0
        };
      };

    return (
        <div className="user-management-container">
            {/* Stats cards */}
            <div className="stats-container-2">
                <div className="stats-card">
                    <div className="stats-title">Tổng số bình luận</div>
                    <div className="stats-number">{totalElements}</div>
                    <div className={`stats-change ${getPercentageChangeDisplay(Math.floor((totalElements - totalCommentLastMonth) / totalCommentLastMonth * 100)).isPositive ? 'positive' : 'negative'}`}>
                        {getPercentageChangeDisplay(Math.floor((totalElements - totalCommentLastMonth) / totalCommentLastMonth * 100)).text} so với tháng trước
                    </div>
                </div>
                <div className="stats-card">
                    <div className="stats-title">Bình luận hôm nay</div>
                    <div className="stats-number">{totalCommentToday}</div>
                    <div className={`stats-change ${totalCommentToday >=totalCommentYesterday ? 'positive' : 'negative'}`}>
                        {totalCommentToday >= totalCommentYesterday ? '↑' : '↓'} {Math.abs(totalCommentToday - totalCommentYesterday)} người so với hôm qua
                    </div>
                </div>
            </div>

            {/* Tìm kiếm và sắp xếp */}
            <div className="controls-container">
                <div className="search-container">
                    <div className='search-items'>
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bình luận"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="sort-container" style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        className="sort-button" 
                        onClick={() => setShowSortOptions(!showSortOptions)}
                    >
                        {getSortOptionDisplayName(sortOption)} <ChevronDown size={16} />
                    </button>
                    <button 
                        className="reload-button" 
                        onClick={() => {
                            if (searchTerm) {
                                searchComments(searchTerm, currentPage);
                            } else {
                                fetchComments(currentPage);
                            }
                        }}
                        title="Tải lại danh sách"
                    >
                        <RefreshCw size={16} />
                    </button>
                    {showSortOptions && (
                        <div className="sort-dropdown">
                            <div onClick={() => {
                                setSortOption('dateAsc');
                                setShowSortOptions(false);
                                if (searchTerm) {
                                    searchComments(searchTerm, 0);
                                } else {
                                    fetchComments(0);
                                }
                            }}>
                                Time A → Z
                            </div>
                            <div onClick={() => {
                                setSortOption('dateDesc');
                                setShowSortOptions(false);
                                if (searchTerm) {
                                    searchComments(searchTerm, 0);
                                } else {
                                    fetchComments(0);
                                }
                            }}>
                                Time Z → A
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bảng người dùng */}
            <div className="table-container">
                <div className="table-header">
                    <div className="table-row">
                        <div className="table-cell header">Tên người dùng</div>
                        <div className="table-cell header">Tên truyện</div>
                        <div className="table-cell header">Ngày thêm</div>
                        <div className="table-cell header">Nội dung</div>
                        <div className="table-cell header">Thao tác</div>
                    </div>
                </div>

                <div className="table-body">
                    {loading ? (
                        <div className="loading">Đang tải...</div>
                    ) : (
                        comments.map(cmt => (
                            <div className="table-row" key={cmt.id}>
                                <div className="table-cell name">{cmt.tenNguoiDung}</div>
                                <div className="table-cell">{cmt.tenTruyen}</div>
                                <div className="table-cell">{new Date(cmt.ngayThem).toLocaleDateString()}</div>
                                <div className="table-cell">{cmt.noiDung}</div>
                                <div className="table-cell actions">
                                    <Eye 
                                        className="action-icon view" 
                                        onClick={() => handleViewUser(cmt)} 
                                    />
                                    <Trash2 
                                        className="action-icon delete" 
                                        onClick={() => handleDeleteUser(cmt.id)} 
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Phân trang */}
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
                        onClick={() => {
                            const newPage = currentPage - 1;
                            if (searchTerm) {
                                searchComments(searchTerm, newPage);
                            } else {
                                fetchComments(newPage);
                            }
                        }}
                        disabled={currentPage === 0}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (searchTerm) {
                                    searchComments(searchTerm, index);
                                } else {
                                    fetchComments(index);
                                }
                            }}
                            className={`pagination-btn ${currentPage === index ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    
                    <button
                        className="pagination-btn next"
                        onClick={() => {
                            const newPage = currentPage + 1;
                            if (searchTerm) {
                                searchComments(searchTerm, newPage);
                            } else {
                                fetchComments(newPage);
                            }
                        }}
                        disabled={currentPage === totalPages - 1}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Modal xem cmt */}
            {showViewModal && currentCmt && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Thông tin bình luận</h2>
                        <div className="user-info">
                            <div className="info-row">
                                <div className="info-label">Tên:</div>
                                <div className="info-value">{currentCmt.tenNguoiDung}</div>
                            </div>
                        
                            <div className="info-row">
                                <div className="info-label">Tên truyện:</div>
                                <div className="info-value">{currentCmt.tenTruyen}</div>
                            </div>
                       
                            <div className="info-row">
                                <div className="info-label">Nội dung:</div>
                                <div className="info-value">{currentCmt.noiDung}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label">Thời gian thêm:</div>
                                <div className="info-value">{new Date(currentCmt.ngayThem).toLocaleString()}</div>
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
        </div>
    );
};

export default CommentsAdmin;