import React, { useState, useEffect } from 'react';
import { Heart, Eye, BookOpen, Calendar, Clock, MessageSquare, Share2, ChevronDown, ChevronUp, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import './GtStory.css';

const GtStory = () => {
    const { storyId } = useParams();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [activeTab, setActiveTab] = useState('chapters');
    const [expandedChapters, setExpandedChapters] = useState(false);
    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const [storyData, setStoryData] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [totalCommentPages, setTotalCommentPages] = useState(1);
    const commentsPerPage = 5;

    // Debug useEffect for chapters state
    useEffect(() => {
        console.log('Current chapters state:', chapters);
    }, [chapters]);

    // Fetch story data
    useEffect(() => {
        const fetchStoryData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}`);
                if (!response.ok) throw new Error('Failed to fetch story data');
                const data = await response.json();
                setStoryData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchChapters = async () => {
            try {
                console.log('Fetching chapters for storyId:', storyId);
                
                const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}/chapters?sort=ngayThem,desc`);
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Failed to fetch chapters: ${response.status} ${errorText}`);
                }
                
                const data = await response.json();
                console.log('Raw API response:', data);
                
                // Kiểm tra cấu trúc dữ liệu
                if (data && typeof data === 'object') {
                    // Nếu data là một object, thử lấy mảng chương từ nó
                    const chaptersData = Array.isArray(data) ? data : 
                                       data.content ? data.content : 
                                       data.chapters ? data.chapters : 
                                       Object.values(data);
                    
                    console.log('Processed chapters data:', chaptersData);
                    
                    if (Array.isArray(chaptersData) && chaptersData.length > 0) {
                        setChapters(chaptersData);
                    } else {
                        console.warn('No chapters found in the response');
                        setChapters([]);
                    }
                } else {
                    console.warn('Invalid response format');
                    setChapters([]);
                }
            } catch (err) {
                console.error('Error fetching chapters:', err);
                setError(err.message);
                setChapters([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStoryData();
        fetchChapters();
    }, [storyId]);

    // Fetch current user info
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await fetch('http://localhost:8080/webreadstory/users/myInfo', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setCurrentUser(data.result);
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            }
        };
        fetchCurrentUser();
    }, []);

    // Fetch comments
    const fetchComments = async (page = 0) => {
        try {
            const response = await fetch(`http://localhost:8080/webreadstory/stories/${storyId}/comments?page=${page}&size=${commentsPerPage}&sort=ngayThem,desc`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            const data = await response.json();
            
            // Ensure we're working with an array
            if (Array.isArray(data)) {
                setComments(data);
                setTotalCommentPages(Math.ceil(data.length / commentsPerPage));
            } else if (data && data.content && Array.isArray(data.content)) {
                // If the API returns a paginated response with content array
                setComments(data.content);
                setTotalCommentPages(data.totalPages || Math.ceil(data.totalElements / commentsPerPage));
            } else {
                // If the response is not in expected format, set empty array
                console.warn('Unexpected comments data format:', data);
                setComments([]);
                setTotalCommentPages(1);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]); // Set empty array on error
            setTotalCommentPages(1);
        }
    };

    useEffect(() => {
        if (activeTab === 'comments') {
            fetchComments(currentCommentPage - 1);
        }
    }, [activeTab, currentCommentPage, storyId]);

    // Handle comment submission
    const handleCommentSubmit = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Vui lòng đăng nhập để bình luận');
            window.location.href = '/login';
            return;
        }

        if (!commentText.trim()) {
            alert('Vui lòng nhập nội dung bình luận');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/webreadstory/stories/${storyId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    maNguoiDung: currentUser.maNguoiDung,
                    noiDung: commentText
                })
            });

            if (response.ok) {
                setCommentText('');
                fetchComments(currentCommentPage - 1);
            } else {
                alert('Có lỗi xảy ra khi gửi bình luận');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Có lỗi xảy ra khi gửi bình luận');
        }
    };

    // Handle comment edit
    const handleEditComment = async (commentId) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8080/webreadstory/stories/${storyId}/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    noiDung: editCommentText,
                    maNguoiDung: currentUser.maNguoiDung
                })
            });

            if (response.ok) {
                setEditingComment(null);
                setEditCommentText('');
                fetchComments(currentCommentPage - 1);
            } else {
                alert('Có lỗi xảy ra khi sửa bình luận');
            }
        } catch (error) {
            console.error('Error editing comment:', error);
            alert('Có lỗi xảy ra khi sửa bình luận');
        }
    };

    // Start editing a comment
    const startEditing = (comment) => {
        setEditingComment(comment.maBinhLuan);
        setEditCommentText(comment.noiDung);
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingComment(null);
        setEditCommentText('');
    };

    const handleFollow = async () => {
        try {
            const token = localStorage.getItem('authToken');
            console.log(token);
            // Lấy thông tin người dùng từ API
            const userResponse = await fetch('http://localhost:8080/webreadstory/users/myInfo', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user info');
            }

            const userData = await userResponse.json();
            console.log(userData);
            console.log(userData.result.maNguoiDung);
            const userId = userData.result.maNguoiDung;
            
            console.log('Following story with:', {
                maNguoiDung: userId,
                maTruyen: parseInt(storyId)
            });

            const response = await fetch('http://localhost:8080/webreadstory/follows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    maNguoiDung: parseInt(userId),
                    maTruyen: parseInt(storyId)
                })
            });

            console.log('Follow response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Follow error response:', errorText);
                throw new Error(`Failed to follow story: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            console.log('Follow success:', data);
            
            alert('Theo dõi truyện thành công!');
            
        } catch (err) {
            console.error('Error following story:', err);
            alert('Bạn đã theo dõi truyện này. vui lòng xem lại!');
        }
    };

    const handleChapterClick = async (maChuong) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Vui lòng đăng nhập để đọc truyện');
                window.location.href = '/login';
                return;
            }

            // Get current user info
            const userResponse = await fetch('http://localhost:8080/webreadstory/users/myInfo', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user info');
            }

            const userData = await userResponse.json();
            const userId = userData.result.maNguoiDung;

            // Call readStory API
            const response = await fetch('http://localhost:8080/webreadstory/readStory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    maTruyen: parseInt(storyId),
                    maNguoiDung: userId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to record story read');
            }

            // Navigate to the chapter after successful API call
            window.location.href = `/read/${storyId}/${maChuong}`;
        } catch (error) {
            console.error('Error recording story read:', error);
            // Still navigate to the chapter even if the API call fails
            window.location.href = `/read/${storyId}/${maChuong}`;
        }
    };

    // Add pagination controls for comments
    const handlePrevPage = () => {
        if (currentCommentPage > 1) {
            setCurrentCommentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentCommentPage < totalCommentPages) {
            setCurrentCommentPage(prev => prev + 1);
        }
    };

    // Add delete comment function
    const handleDeleteComment = async (commentId) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/webreadstory/stories/${storyId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchComments(currentCommentPage - 1);
            } else {
                alert('Có lỗi xảy ra khi xóa bình luận');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Có lỗi xảy ra khi xóa bình luận');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!storyData) return <div>No story data found</div>;

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="gt-story-container">
            <div className="gt-story-header">
                <div className="story-cover-wrapper">
                    <img src={storyData.anhDaiDien} alt={storyData.tenTruyen} className="story-cover-1" />
                    <div className="story-status">{storyData.tinhTrang}</div>
                </div>
                
                <div className="story-details">
                    <h1 className="story-title-1">{storyData.tenTruyen}</h1>
                    
                    <div className="story-meta">
                        <div className="meta-item">
                            <span className="meta-label">Tác giả:</span>
                            <span className="meta-value">{storyData.tenTacGia || 'Chưa cập nhật'}</span>
                        </div>
                        {/* <div className="meta-item">
                            <span className="meta-label">Thể loại:</span>
                            <span className="meta-value">{storyData.loaiTruyen || 'Chưa cập nhật'}</span>
                        </div> */}
                        <div className="meta-item">
                            <span className="meta-label">Trạng thái:</span>
                            <span className="meta-value status">{storyData.tinhTrang}</span>
                        </div>
                    </div>
                    
                    <div className="story-stats">
                        <div className="stat-item">
                            <Eye size={18} />
                            <span>{storyData.luotDoc} lượt xem</span>
                        </div>
                        <div className="stat-item">
                            <BookOpen size={18} />
                            <span>{storyData.soChuong} chương</span>
                        </div>
                        <div className="stat-item">
                            <Clock size={18} />
                            <span>Cập nhật: {formatDate(storyData.ngayCapNhat)}</span>
                        </div>
                    </div>
                    
                    <div className="story-actions">
                        <Link 
                            to={`/read/${storyId}/${chapters.length > 0 ? chapters[chapters.length - 1].maChuong : 1}`} 
                            className="action-button read-button"
                        >
                            <BookOpen size={18} />
                            Đọc từ đầu
                        </Link>
                        <Link 
                            to={`/read/${storyId}/${chapters.length > 0 ? chapters[0].maChuong : 1}`} 
                            className="action-button read-latest-button"
                        >
                            <Clock size={18} />
                            Đọc mới nhất
                        </Link>
                        <button className="action-button follow-button" onClick={handleFollow}>
                            <Heart size={18} />
                            Theo dõi
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="story-description-section">
                <h2 className="section-title">Giới thiệu truyện</h2>
                <div className={`story-description ${showFullDescription ? 'expanded' : ''}`}>
                    {storyData.moTa}
                </div>
                <button className="toggle-description" onClick={() => setShowFullDescription(!showFullDescription)}>
                    {showFullDescription ? (
                        <>Rút gọn <ChevronUp size={16} /></>
                    ) : (
                        <>Xem thêm <ChevronDown size={16} /></>
                    )}
                </button>
            </div>
            
            <div className="content-tabs">
                <button 
                    className={`tab-button ${activeTab === 'chapters' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chapters')}
                >
                    <BookOpen size={18} />
                    Danh sách chương ({chapters.length})
                </button>
                <button 
                    className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comments')}
                >
                    <MessageSquare size={18} />
                    Bình luận
                </button>
            </div>
            
            {activeTab === 'chapters' && (
                <div className="chapters-section">
                    <div className="chapters-header">
                        <h3>Danh sách chương</h3>
                    </div>
                    
                    <div className="chapters-list">
                        {Array.isArray(chapters) && chapters.length > 0 ? (
                            chapters.map((chapter, index) => {
                                console.log('Rendering chapter:', chapter);
                                return (
                                    <div 
                                        className="chapter-row" 
                                        key={chapter.maChuong || index}
                                        onClick={() => handleChapterClick(chapter.maChuong)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="chapter-info">
                                            <span className="chapter-number-3">Tên chương</span>
                                            <span className="chapter-title">{chapter.tenChuong}</span>
                                        </div>
                                        <div className="chapter-meta">
                                            <span className="chapter-date">
                                                <Calendar size={14} />
                                                {formatDate(chapter.ngayThem)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-chapters">
                                {loading ? 'Đang tải...' : 'Chưa có chương nào'}
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {activeTab === 'comments' && (
                <div style={{
                    marginTop: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '20px'
                    }}>
                        <input
                            type="text"
                            placeholder="Viết bình luận của bạn..."
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                transition: 'border-color 0.2s'
                            }}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button 
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#FB7185',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'background-color 0.2s'
                            }}
                            onClick={handleCommentSubmit}
                        >
                            Gửi
                        </button>
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        {comments.map((comment) => (
                            <div 
                                key={comment.maBinhLuan} 
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '15px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                {editingComment === comment.maBinhLuan ? (
                                    <div style={{
                                        width: '100%',
                                        padding: '10px',
                                        backgroundColor: '#f8f8f8',
                                        borderRadius: '8px',
                                        marginTop: '5px'
                                    }}>
                                        <input
                                            type="text"
                                            value={editCommentText}
                                            onChange={(e) => setEditCommentText(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                marginBottom: '10px',
                                                transition: 'border-color 0.2s'
                                            }}
                                        />
                                        <div style={{
                                            display: 'flex',
                                            gap: '10px',
                                            justifyContent: 'flex-end'
                                        }}>
                                            <button 
                                                onClick={() => handleEditComment(comment.maBinhLuan)}
                                                style={{
                                                    padding: '8px 16px',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    backgroundColor: '#FB7185',
                                                    color: 'white'
                                                }}
                                            >
                                                Lưu
                                            </button>
                                            <button 
                                                onClick={cancelEditing}
                                                style={{
                                                    padding: '8px 16px',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    backgroundColor: '#e0e0e0',
                                                    color: '#333'
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '10px'
                                        }}>
                                            <span style={{
                                                fontWeight: '600',
                                                color: '#333'
                                            }}>
                                                {comment.tenNguoiDung}
                                            </span>
                                            {currentUser && currentUser.maNguoiDung === comment.maNguoiDung && (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button 
                                                        onClick={() => startEditing(comment)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#FB7185',
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                            padding: '5px 10px',
                                                            borderRadius: '4px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteComment(comment.maBinhLuan)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#FF4D4F',
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                            padding: '5px 10px',
                                                            borderRadius: '4px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{
                                            color: '#444',
                                            lineHeight: '1.5',
                                            fontSize: '14px'
                                        }}>
                                            {comment.noiDung}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination controls */}
                    {totalCommentPages > 1 && (
                        <div className="pagination-controls">
                            <button 
                                onClick={handlePrevPage}
                                disabled={currentCommentPage === 1}
                                className="pagination-arrow"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            
                            {[...Array(totalCommentPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentCommentPage(index + 1)}
                                    className={`pagination-number ${currentCommentPage === index + 1 ? 'active' : ''}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            
                            <button 
                                onClick={handleNextPage}
                                disabled={currentCommentPage === totalCommentPages}
                                className="pagination-arrow"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GtStory;