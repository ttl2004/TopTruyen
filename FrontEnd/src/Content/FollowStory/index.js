import React, { useState, useEffect} from 'react';
import { Link,  useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Bell, LogIn, Trash2 } from 'lucide-react';
import './FollowStory.css';
import image from '../../Assets/image.png';

const FollowStory = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [followedStories, setFollowedStories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    // Hàm kiểm tra trạng thái đăng nhập
    const checkLoginStatus = () => {
        const token = localStorage.getItem('authToken');
        const currentUser = localStorage.getItem('currentUser');
        if (token && currentUser) {
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                
                if (tokenData.exp && tokenData.exp > currentTime) {
                    return true;
                } else {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('currentUser');
                    return false;
                }
            } catch (error) {
                console.error("Token không hợp lệ:", error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
                return false;
            }
        }
        return false;
    };

    // Hàm lấy thông tin truyện theo mã truyện
    const fetchStoryDetails = async (storyId) => {
        try {
            const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}`);
            if (!response.ok) throw new Error('Failed to fetch story details');
            return await response.json();
        } catch (error) {
            console.error('Error fetching story details:', error);
            return null;
        }
    };

    // Hàm lấy danh sách truyện theo dõi
    const fetchFollowedStories = async () => {
        const token = localStorage.getItem('authToken');
        const currentUser = localStorage.getItem('currentUser');
        
        if (!token || !currentUser) return;

        try {
            const userData = JSON.parse(currentUser);
            const response = await fetch(`http://localhost:8080/webreadstory/follows/${userData.id}?page=${currentPage - 1}&size=${itemsPerPage}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch followed stories');
            
            const data = await response.json();
            
            // Lấy thông tin chi tiết cho từng truyện
            const storiesWithDetails = await Promise.all(
                data.content.map(async (follow) => {
                    const storyDetails = await fetchStoryDetails(follow.maTruyen);
                    return {
                        id: follow.maTruyen,
                        followId: follow.maTheoDoi,
                        title: storyDetails?.tenTruyen || 'Unknown',
                        cover: storyDetails?.anhDaiDien || image,
                        lastChapter: storyDetails?.soChuong || 0,
                        lastUpdated: new Date(storyDetails?.ngayCapNhat).toLocaleDateString('vi-VN'),
                        views: storyDetails?.luotDoc || 0
                    };
                })
            );

            setFollowedStories(storiesWithDetails);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching followed stories:', error);
        }
    };

    useEffect(() => {
        const loginStatus = checkLoginStatus();
        setIsLoggedIn(loginStatus);
        if (loginStatus) {
            fetchFollowedStories();
        }
    }, [currentPage]);

    const handleLogin = () => {
        navigate('/login');
    };
    
    const handleUnfollow = async (followId, event) => {
        event.preventDefault();
        event.stopPropagation();
        
        // Hiển thị hộp thoại xác nhận
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn hủy theo dõi truyện này?');
        if (!isConfirmed) return;
        
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8080/webreadstory/follows/${followId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to unfollow story');

            // Cập nhật lại danh sách truyện sau khi hủy theo dõi
            await fetchFollowedStories();
        } catch (error) {
            console.error('Error unfollowing story:', error);
        }
    };

    return (
        <div className="FollowStory1">
            <div className="FollowStory2">
                <h1 className="FollowStory3">Truyện đang theo dõi</h1>
                {isLoggedIn && (
                    <p className="FollowStory4">{followedStories.length} truyện</p>
                )}
            </div>
            
            {!isLoggedIn ? (
                <div className="FollowStory20">
                    <p className="FollowStory21">Bạn cần đăng nhập để xem danh sách truyện đang theo dõi</p>
                    <button className="FollowStory22" onClick={handleLogin}>
                        <LogIn size={18} />
                        <span>Đăng nhập</span>
                    </button>
                </div>
            ) : followedStories.length === 0 ? (
                <div className="FollowStory20">
                    <p className="FollowStory21">Bạn chưa theo dõi truyện nào</p>
                    <Link to="/" className="FollowStory22">
                        Khám phá truyện ngay
                    </Link>
                </div>
            ) : (
                <>
                    <div className="FollowStory5">
                        {followedStories.map(story => (
                            <div key={story.id} className="FollowStory6">
                                <div className="FollowStory7">
                                    <Link to={`/truyen/${story.id}`} className="FollowStory8">
                                        <img src={story.cover} alt={story.title} className="FollowStory9" />
                                    </Link>
                                    <div className="FollowStory10">
                                        <Link to={`/truyen/${story.id}`} className="FollowStory11">
                                            {story.title}
                                        </Link>
                                        <div className="FollowStory12">
                                            <div className="FollowStory13">
                                                <Clock size={14} />
                                                <span>{story.lastUpdated}</span>
                                            </div>
                                            <div className="FollowStory14">
                                                <span>{story.views} lượt đọc</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="FollowStory15">
                                    <div className="FollowStory16">Chương {story.lastChapter}</div>
                                </div>
                                
                                <div className="FollowStory17">
                                    <Link to={`/read/${story.id}`} className="FollowStory18">
                                        <BookOpen size={16} />
                                        <span>Đọc ngay</span>
                                    </Link>
                                    
                                    <button 
                                        className="FollowStory19"
                                        onClick={(e) => handleUnfollow(story.followId, e)}
                                        title="Hủy theo dõi"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button 
                                className="pagination-arrow"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &laquo;
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(number)}
                                >
                                    {number}
                                </button>
                            ))}
                            
                            <button 
                                className="pagination-arrow"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                &raquo;
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FollowStory;