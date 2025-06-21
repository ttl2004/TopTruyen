import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Trash2, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './HistoryStory.css';

const HistoryStory = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [stories, setStories] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 8;

    // Fetch reading history
    const fetchReadingHistory = async (page) => {
        try {
            const token = localStorage.getItem('authToken');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (!token || !currentUser) {
                setIsLoggedIn(false);
                return;
            }

            const response = await fetch(`http://localhost:8080/webreadstory/readStory/${currentUser.id}?page=${page-1}&size=${itemsPerPage}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch reading history');

            const data = await response.json();
            setTotalPages(Math.ceil(data.totalElements / itemsPerPage));

            // Fetch story details for each reading history item
            const storiesWithDetails = await Promise.all(
                data.content.map(async (item) => {
                    const storyResponse = await fetch(`http://localhost:8080/webreadstory/storys/${item.maTruyen}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const storyData = await storyResponse.json();
                    return {
                        ...item,
                        storyDetails: storyData
                    };
                })
            );

            setStories(storiesWithDetails);
        } catch (error) {
            console.error('Error fetching reading history:', error);
        }
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchReadingHistory(pageNumber);
    };

    // Handle delete reading history
    const handleRemoveFromHistory = async (readStoryId, event) => {
        event.stopPropagation();
        
        if (window.confirm('Bạn có chắc chắn muốn xóa truyện này khỏi lịch sử đọc?')) {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:8080/webreadstory/readStory/${readStoryId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to delete reading history');

                // Refresh the list after deletion
                fetchReadingHistory(currentPage);
            } catch (error) {
                console.error('Error deleting reading history:', error);
            }
        }
    };

    // Check login status and fetch data
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('authToken');
            const currentUser = localStorage.getItem('currentUser');
            
            if (token && currentUser) {
                try {
                    const tokenData = JSON.parse(atob(token.split('.')[1]));
                    const currentTime = Math.floor(Date.now() / 1000);
                    
                    if (tokenData.exp && tokenData.exp > currentTime) {
                        setIsLoggedIn(true);
                        fetchReadingHistory(currentPage);
                        return true;
                    }
                } catch (error) {
                    console.error("Invalid token:", error);
                }
            }
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            setIsLoggedIn(false);
            return false;
        };

        checkLoginStatus();
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="HistoryStory1">
            <div className="HistoryStory2">
                <h1 className="HistoryStory3">Lịch sử đọc truyện</h1>
                {isLoggedIn && (
                    <p className="HistoryStory4">{stories.length} truyện đã đọc</p>
                )}
            </div>
            
            {isLoggedIn ? (
                <>
                    {stories.length > 0 ? (
                        <div className="HistoryStory5">
                            {stories.map(item => (
                                <div key={item.maDoc} className="HistoryStory6">
                                    <div className="HistoryStory7">
                                        <Link to={`/truyen/${item.maTruyen}`} className="HistoryStory8">
                                            <img 
                                                src={item.storyDetails.anhDaiDien} 
                                                alt={item.storyDetails.tenTruyen} 
                                                className="HistoryStory9" 
                                            />
                                        </Link>
                                        <div className="HistoryStory10">
                                            <Link to={`/truyen/${item.maTruyen}`} className="HistoryStory11">
                                                {item.storyDetails.tenTruyen}
                                            </Link>
                                            <div className="HistoryStory12">
                                                <div className="HistoryStory13">
                                                    <Clock size={14} />
                                                    <span>{new Date(item.storyDetails.ngayCapNhat).toLocaleDateString()}</span>
                                                </div>
                                                <div className="HistoryStory14">
                                                    Lượt đọc: <span>{item.storyDetails.luotDoc}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="HistoryStory15">
                                        <div className="HistoryStory16">Số chương: {item.storyDetails.soChuong}</div>
                                    </div>
                                    
                                    <div className="HistoryStory17">
                                        <Link 
                                            to={`/read/${item.maTruyen}`} 
                                            className="HistoryStory18"
                                        >
                                            <BookOpen size={16} />
                                            <span>Đọc ngay</span>
                                        </Link>
                                        
                                        <button 
                                            className="HistoryStory19"
                                            onClick={(e) => handleRemoveFromHistory(item.maDoc, e)}
                                            title="Xóa khỏi lịch sử"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="HistoryStory20">
                            <p className="HistoryStory21">Bạn chưa đọc truyện nào gần đây</p>
                            <Link to="/" className="HistoryStory22">
                                Khám phá truyện ngay
                            </Link>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button 
                                className="pagination-arrow"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &laquo;
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => handlePageChange(number)}
                                >
                                    {number}
                                </button>
                            ))}
                            
                            <button 
                                className="pagination-arrow"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                &raquo;
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="login-required-container">
                    <div className="login-required-content">
                        <div className="login-required-icon">
                            <i className="fas fa-history"></i>
                        </div>
                        <h2>Đăng nhập để xem lịch sử đọc truyện</h2>
                        <p>Bạn cần đăng nhập để xem và quản lý lịch sử đọc truyện của mình</p>
                        <button className="login-button" onClick={handleLoginClick}>
                            <LogIn size={18} />
                            <span>Đăng nhập</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryStory;