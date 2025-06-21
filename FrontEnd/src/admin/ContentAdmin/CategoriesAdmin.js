import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import './CategoriesAdmin.css';

const CategoriesAdmin = () => {
    const [genres, setGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0); // Changed to 0-based for API
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentGenre, setCurrentGenre] = useState({ tenTheLoai: '', moTa: '' });
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const genresPerPage = 8;

    // Fetch genres from API
    const fetchGenres = async (page) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:8080/webreadstory/categorys?page=${page}&size=${genresPerPage}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setGenres(data.content);
            setTotalElements(data.totalElements);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    // Search categories
    const searchCategories = async (keyword, page) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(
                `http://localhost:8080/webreadstory/categorys/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${genresPerPage}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            setGenres(data.content);
            setTotalElements(data.totalElements);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error searching categories:', error);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            searchCategories(searchTerm, currentPage);
        } else {
            fetchGenres(currentPage);
        }
    }, [currentPage, searchTerm]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle search on Enter key press
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0); // Reset to first page when searching
            if (searchTerm) {
                searchCategories(searchTerm, 0);
            } else {
                fetchGenres(0);
            }
        }
    };

    // Handle reset
    const handleReset = () => {
        setSearchTerm('');
        setCurrentPage(0);
        fetchGenres(0);
    };

    // Lọc các thể loại dựa trên từ khóa tìm kiếm
    const filteredGenres = genres.filter(genre =>
        genre.tenTheLoai.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Xử lý thay đổi trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Xử lý thêm thể loại mới
    const handleAddGenre = () => {
        setCurrentGenre({ tenTheLoai: '', moTa: '' });
        setShowAddModal(true);
    };

    // Xử lý chỉnh sửa thể loại
    const handleEditGenre = (genre) => {
        setCurrentGenre(genre);
        setShowEditModal(true);
    };

    // Xử lý xóa thể loại
    const handleDeleteGenre = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thể loại này?')) {
            try {
                const token = localStorage.getItem('authToken');
                await fetch(`http://localhost:8080/webreadstory/categorys/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                fetchGenres(currentPage); // Reload the list
            } catch (error) {
                console.error('Error deleting genre:', error);
            }
        }
    };

    // Xử lý lưu cho thêm/chỉnh sửa
    const handleSave = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            if (showAddModal) {
                // Add new genre
                await fetch('http://localhost:8080/webreadstory/categorys', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        tenTheLoai: currentGenre.tenTheLoai,
                        moTa: currentGenre.moTa
                    })
                });
                setShowAddModal(false);
            } else if (showEditModal) {
                // Update existing genre
                await fetch(`http://localhost:8080/webreadstory/categorys/${currentGenre.maTheLoai}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({
                        tenTheLoai: currentGenre.tenTheLoai,
                        moTa: currentGenre.moTa
                    })
                });
                setShowEditModal(false);
            }
            fetchGenres(currentPage); // Reload the list
        } catch (error) {
            console.error('Error saving genre:', error);
        }
    };

    // Xử lý thay đổi đầu vào
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentGenre({ ...currentGenre, [name]: value });
    };

    // Đặt lại trang hiện tại khi từ khóa tìm kiếm thay đổi
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);

    return (
        <div className="genre-container-2">
            <div className="header-container-2">
                <div className="search-container">
                    <div className='search-items'>
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm thể loại"
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={handleSearchKeyPress}
                        />
                    </div>
                </div>
                <div className="genre-count">
                    <span>Tổng số: {totalElements} thể loại</span>
                </div>
                <div className="action-buttons">
                    <button className="add-button" onClick={handleAddGenre}>
                        Thêm thể loại
                    </button>
                    <button
                        className="reset-button1"
                        onClick={handleReset}
                        title="Làm mới danh sách"
                        style={{ marginLeft: 8 }}
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>
            <div className="genres-grid">
                {filteredGenres.map(genre => (
                    <div key={genre.maTheLoai} className="genre-card">
                        <div className="genre-title">
                            <h3>{genre.tenTheLoai}</h3>
                        </div>
                        <div className="genre-stats">
                            <div>
                                <span>Số truyện</span>
                                <span>0</span>
                            </div>
                        </div>
                        <div className="genre-desc">
                            <p><strong>Mô tả:</strong></p>
                            <p>{genre.moTa}</p>
                        </div>
                        <div className="genre-actions-2">
                            <Edit 
                                size={20} 
                                className="action-icon" 
                                onClick={() => handleEditGenre(genre)} 
                            />
                            <Trash 
                                size={20} 
                                className="action-icon" 
                                onClick={() => handleDeleteGenre(genre.maTheLoai)} 
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <div className="pagination-controls">
                    <button 
                        className="pagination-btn prev" 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <button 
                            key={index}
                            onClick={() => paginate(index)}
                            className={`pagination-btn ${currentPage === index ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    
                    <button 
                        className="pagination-btn next" 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Thêm thể loại</h2>
                        <div className="form-group">
                            <label>Tên thể loại</label>
                            <input
                                type="text"
                                name="tenTheLoai"
                                value={currentGenre.tenTheLoai}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea
                                name="moTa"
                                value={currentGenre.moTa}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="cancel-button" 
                                onClick={() => setShowAddModal(false)}
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

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Chỉnh sửa thể loại</h2>
                        <div className="form-group">
                            <label>Tên thể loại</label>
                            <input
                                type="text"
                                name="tenTheLoai"
                                value={currentGenre.tenTheLoai}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea
                                name="moTa"
                                value={currentGenre.moTa}
                                onChange={handleInputChange}
                            ></textarea>
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

export default CategoriesAdmin;