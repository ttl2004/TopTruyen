import React, { useState, useRef, useEffect,  } from 'react';
import { X,  Eye, EyeOff,  ChevronLeft, ChevronRight } from 'lucide-react';
import './userMain.css';
import avatar from '../Assets/anhdaidien.png';
import image from '../Assets/image.png';
import { Link } from 'react-router-dom';

function UserMain() {
    // Dữ liệu người dùng
    const [userData, setUserData] = useState({
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        username: "nguyenvana",
        avatar: avatar,
        level: "Nguyên anh",
        comments: [
            {
                id: 1,
                storyTitle: "Đấu La Đại Lục",
                storyImage: image,
                time: "17/03/2025 08:15",
                content: "Trận chiến của Tang San thực sự xuất sắc, cách tác giả miêu tả rất lôi cuốn!"
            },
            {
                id: 2,
                storyTitle: "Vũ Động Càn Khôn",
                storyImage: image,
                time: "15/03/2025 14:23",
                content: "Lâm Động ngày càng mạnh, phần này có nhiều tình tiết hay."
            },
            {
                id: 3,
                storyTitle: "Đế Bá",
                storyImage: image, 
                time: "10/03/2025 20:45",
                content: "Tình tiết hơi chậm nhưng vẫn rất hay, mong chờ chapter tiếp theo."
            },
            {
                id: 4,
                storyTitle: "Đế Bá",
                storyImage: image, 
                time: "10/03/2025 20:45",
                content: "Tình tiết hơi chậm nhưng vẫn rất hay, mong chờ chapter tiếp theo."
            },
            {
                id: 5,
                storyTitle: "Đế Bá",
                storyImage: image, 
                time: "10/03/2025 20:45",
                content: "Tình tiết hơi chậm nhưng vẫn rất hay, mong chờ chapter tiếp theo."
            },
            {
                id: 6,
                storyTitle: "Đế Bá",
                storyImage: image, 
                time: "10/03/2025 20:45",
                content: "Tình tiết hơi chậm nhưng vẫn rất hay, mong chờ chapter tiếp theo."
            },
            {
                id: 7,
                storyTitle: "Đế Bá",
                storyImage: image, 
                time: "10/03/2025 20:45",
                content: "Tình tiết hơi chậm nhưng vẫn rất hay, mong chờ chapter tiếp theo."
            },
        ]
    });
     // Lấy dữ liệu từ sessionStorage
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
     const fetchUserInfo = async () => {
            setError(null);
            
            try {
                // Lấy token từ localStorage
                const token = localStorage.getItem('authToken');
                
                console.log('Token:', token);
                if (!token) {
                    console.log('Không tìm thấy token, người dùng chưa đăng nhập');
                    return;
                }
                
                // Gọi API để lấy thông tin người dùng
                const response = await fetch('http://localhost:8080/webreadstory/users/myInfo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Chuyển đổi response thành JSON
                const data = await response.json();
                
                if (response.ok) {
                    console.log('Dữ liệu người dùng:', data);
                    
                    // Kiểm tra nếu API trả về cấu trúc có code và result
                    if (data && data.code === 0 && data.result) {
                        // Lưu thông tin người dùng vào state
                        setCurrentUser(data.result);
                        
                        // Cập nhật dữ liệu hiển thị
                        setUserData({
                            name: data.result.tenNguoiDung || "Người dùng",
                            email: data.result.email || "",
                            username: data.result.tenDangNhap || "",
                            avatar: data.result.anhDaiDien || avatar,
                            level: data.result.capBac || "Tân thủ",
                            comments: userData.comments // Giữ nguyên dữ liệu comments
                        });
                    } else {
                        console.error('API trả về dữ liệu không đúng định dạng:', data);
                        setError('Không thể lấy thông tin người dùng');
                    }
                } else {
                    console.error('Lỗi khi gọi API:', response.status);
                    setError(`Lỗi ${response.status}: Không thể kết nối đến máy chủ`);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                setError('Có lỗi xảy ra khi kết nối đến máy chủ');
            } 
        };

    useEffect(() => {
        const fetchUserInfo = async () => {
            setError(null);
            
            try {
                // Lấy token từ localStorage
                const token = localStorage.getItem('authToken');
                
                console.log('Token:', token);
                if (!token) {
                    console.log('Không tìm thấy token, người dùng chưa đăng nhập');
                    return;
                }
                
                // Gọi API để lấy thông tin người dùng
                const response = await fetch('http://localhost:8080/webreadstory/users/myInfo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Chuyển đổi response thành JSON
                const data = await response.json();
                
                if (response.ok) {
                    console.log('Dữ liệu người dùng:', data);
                    
                    // Kiểm tra nếu API trả về cấu trúc có code và result
                    if (data && data.code === 0 && data.result) {
                        // Lưu thông tin người dùng vào state
                        setCurrentUser(data.result);
                        
                        // Cập nhật dữ liệu hiển thị
                        setUserData({
                            name: data.result.tenNguoiDung || "Người dùng",
                            email: data.result.email || "",
                            username: data.result.tenDangNhap || "",
                            avatar: data.result.anhDaiDien || avatar,
                            level: data.result.capBac || "Tân thủ",
                            comments: userData.comments // Giữ nguyên dữ liệu comments
                        });
                    } else {
                        console.error('API trả về dữ liệu không đúng định dạng:', data);
                        setError('Không thể lấy thông tin người dùng');
                    }
                } else {
                    console.error('Lỗi khi gọi API:', response.status);
                    setError(`Lỗi ${response.status}: Không thể kết nối đến máy chủ`);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                setError('Có lỗi xảy ra khi kết nối đến máy chủ');
            } 
        };

        // Gọi hàm lấy thông tin người dùng
        fetchUserInfo();
    }, []);

    console.log("Current User:", currentUser);


    // Trạng thái UI
    const [activeMenu, setActiveMenu] = useState('account');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: '', email: '' });

    
    useEffect(() => {
    if (currentUser) {
        setEditFormData({
        name: currentUser.fullName,
        email: currentUser.email
        });
    }
    }, [currentUser]);


    // Xử lý khi chọn menu
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    // Mở modal chỉnh sửa thông tin người dùng
    const handleEditClick = () => {
        setEditFormData({
            name: currentUser.tenNguoiDung,
            email: currentUser.email
        });
        setShowEditModal(true);
    };


    // Xử lý thay đổi input trong form chỉnh sửa
    const handleInputChange = (e) => {
        const { name, value } = e.target;
            setEditFormData(prev => ({
                ...prev,
                [name]: value
            }));
    };
    
        // Lưu thay đổi từ form chỉnh sửa
    const handleSaveChanges = async () => {
         // Lấy token từ localStorage
            const token = localStorage.getItem('authToken');
            try {
                
                if (!token || !currentUser || !currentUser.maNguoiDung) {
                    return;
                }
                
                // Chuẩn bị dữ liệu để gửi lên API
                const updateData = {
                    tenNguoiDung: editFormData.name,
                    email: editFormData.email
                };
                
                // Gọi API cập nhật thông tin người dùng
                const response = await fetch(`http://localhost:8080/webreadstory/users/myInfo/${currentUser.maNguoiDung}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateData)
                });
                
                const data = await response.json();
                
                if (response.ok && data.code === 0) {
                    // Cập nhật thông tin trong state hiện tại
                    setCurrentUser(prev => ({
                        ...prev,
                        tenNguoiDung: editFormData.name,
                        email: editFormData.email
                    }));
                    
                    // Cập nhật userData để hiển thị
                    setUserData(prev => ({
                        ...prev,
                        name: editFormData.name,
                        email: editFormData.email
                    }));
                
               
                
                
                setShowEditModal(false);
                
            } else {
                // Xử lý lỗi
                const errorMsg = data.message || 'Có lỗi xảy ra khi cập nhật thông tin.';
            }
        } catch (error) {
            console.error('Lỗi khi gọi API cập nhật:', error);
          
        }
        setShowEditModal(false);
         // Load lại thông tin người dùng từ API
        const updatedUserInfo = await fetchUserInfo(token);
    };

   
       // States cho form đổi mật khẩu
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    
    // Xử lý đổi mật khẩu
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Cập nhật hàm gọi API đổi mật khẩu
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setIsUpdatingPassword(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token || !currentUser || !currentUser.maNguoiDung) {
                setPasswordError('Không tìm thấy thông tin người dùng');
                return;
            }

            const response = await fetch(`http://localhost:8080/webreadstory/users/${currentUser.maNguoiDung}/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.text();

            if (data === "Đổi mật khẩu thành công.") {
                setPasswordSuccess('Đổi mật khẩu thành công');
                // Clear password fields
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                
                // Clear token and redirect after a short delay
                setTimeout(() => {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                }, 1500);
            } else if (data === "Mật khẩu hiện tại không đúng.") {
                setPasswordError('Mật khẩu hiện tại không đúng');
            } else {
                setPasswordError('Có lỗi xảy ra khi đổi mật khẩu');
            }
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            setPasswordError('Có lỗi xảy ra khi kết nối đến máy chủ');
        } finally {
            setIsUpdatingPassword(false);
        }
    };
    
    // Toggle hiển thị mật khẩu - thêm xử lý cho trường confirmPassword
    const togglePasswordVisibility = (field) => {
        if (field === 'current') {
            setShowCurrentPassword(!showCurrentPassword);
        } else if (field === 'new') {
            setShowNewPassword(!showNewPassword);
        } else if (field === 'confirm') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    
    // Add new state for comments and pagination
    const [userComments, setUserComments] = useState([]);
    const [commentStories, setCommentStories] = useState({});
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch user comments
    const fetchUserComments = async (page = 0) => {
        setCommentsLoading(true);
        setCommentsError(null);
        try {
            const token = localStorage.getItem('authToken');
            if (!token || !currentUser) return;

            const response = await fetch(`http://localhost:8080/webreadstory/stories/${currentUser.maNguoiDung}/commentsUser?page=${page}&size=3&sort=ngayThem,desc`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch comments');
            const data = await response.json();

            setUserComments(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(page + 1);

            // Fetch story details for each comment
            const storyPromises = data.content.map(comment => 
                fetch(`http://localhost:8080/webreadstory/storys/${comment.maTruyen}`)
                    .then(res => res.json())
            );

            const stories = await Promise.all(storyPromises);
            const storiesMap = {};
            stories.forEach(story => {
                storiesMap[story.maTruyen] = story;
            });
            setCommentStories(storiesMap);

        } catch (error) {
            console.error('Error fetching comments:', error);
            setCommentsError('Failed to load comments');
        } finally {
            setCommentsLoading(false);
        }
    };

    // Update useEffect to fetch comments when comments tab is active
    useEffect(() => {
        if (activeMenu === 'comments' && currentUser) {
            fetchUserComments(currentPage - 1);
        }
    }, [activeMenu, currentUser, currentPage]);

    // Pagination handlers for comments
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchUserComments(pageNumber - 1);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            fetchUserComments(currentPage);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            fetchUserComments(currentPage - 2);
        }
    };

    // Render nội dung bên phải dựa trên menu đang hoạt động
    const renderRightContent = () => {
        switch (activeMenu) {
            case 'account':
                return (
                    <div className="right-content">
                        <h2 className="content-title">Thông tin tài khoản</h2>
                        
                        <div className="info-card">
                            <div className="info-header">
                                <h3>Thông tin cá nhân</h3>
                                <button className="edit-button" onClick={handleEditClick}>
                                    Thay đổi
                                </button>
                            </div>
                            <div className="info-content">
                                <div className="info-row">
                                    <div className="info-label">Họ và tên:</div>
                                    <div className="info-value">{userData.name}</div>
                                </div>
                                <div className="info-row">
                                    <div className="info-label">Email:</div>
                                    <div className="info-value">{userData.email}</div>
                                </div>
                                
                            </div>
                        </div>

                       
                    </div>
                );
            case 'updatePass':
                return (
                    <div className="right-content">
                        <h2 className="content-title">Đổi mật khẩu</h2>
                        
                        <div className="password-change-container">
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="password-form-group">
                                    <label>Mật khẩu hiện tại</label>
                                    <div className="password-input-container">
                                        <input 
                                            type={showCurrentPassword ? "text" : "password"} 
                                            name="currentPassword" 
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Nhập mật khẩu hiện tại" 
                                        />
                                        <button 
                                            type="button"   
                                            className="toggle-password-btn"
                                            onClick={() => togglePasswordVisibility('current')}
                                        >
                                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>    
                                    </div>
                                </div>
                                
                                <div className="password-form-group">
                                    <label>Mật khẩu mới</label>
                                    <div className="password-input-container">
                                        <input 
                                            type={showNewPassword ? "text" : "password"} 
                                            name="newPassword" 
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Nhập mật khẩu mới" 
                                        />
                                        <button 
                                            type="button" 
                                            className="toggle-password-btn"
                                            onClick={() => togglePasswordVisibility('new')}
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                {passwordError && <p className="password-error">{passwordError}</p>}
                                {passwordSuccess && <p className="password-success">{passwordSuccess}</p>}

                                <button type="submit" className="password-submit-btn">
                                    Đổi mật khẩu
                                </button>
                            </form>
                        </div>
                    </div>
                );
                case 'comments':
                    
                    return (
                        <div className="right-content">
                            <h2 className="content-title">Bình luận của bạn</h2>
                            
                            {commentsLoading ? (
                                <div className="loading-state">Loading...</div>
                            ) : commentsError ? (
                                <div className="error-state">{commentsError}</div>
                            ) : userComments.length > 0 ? (
                                <>
                                    <div className="comments-container">
                                        {userComments.map(comment => (
                                            <div key={comment.maBinhLuan} className="comment-card">
                                                <div className="comment-header">
                                                    <div className="comment-story-info">
                                                        <img 
                                                            src={commentStories[comment.maTruyen]?.anhDaiDien || image} 
                                                            alt={comment.tenTruyen} 
                                                            className="comment-story-thumbnail" 
                                                        />
                                                        <div className="comment-story-details">
                                                            <h4 className="comment-story-title">{comment.tenTruyen}</h4>
                                                            <span className="comment-time">
                                                                {new Date(comment.ngayThem).toLocaleDateString('vi-VN')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="comment-content">
                                                    <p>{comment.noiDung}</p>
                                                </div>
                                                <div className="comment-footer">
                                                    <Link 
                                                        to={`/read/${comment.maTruyen}`} 
                                                        className="comment-action-link"
                                                    >
                                                        Đến trang truyện
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Pagination controls */}
                                    {totalPages > 1 && (
                                        <div className="pagination-controls">
                                            <button 
                                                className="pagination-arrow" 
                                                onClick={prevPage} 
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            
                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => paginate(index + 1)}
                                                    className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                            
                                            <button 
                                                className="pagination-arrow" 
                                                onClick={nextPage} 
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">💬</div>
                                    <h3>Chưa có bình luận nào</h3>
                                    <p>Bạn chưa có bình luận nào trên hệ thống</p>
                                    <Link to="/" className="empty-state-button">
                                        Khám phá truyện
                                    </Link>
                                </div>
                            )}
                        </div>
                    );
            default:
                return null;
        }
    };

    return (
        <div className="userMain">
            {/* Sidebar bên trái */}
            <div className="left-sidebar">
                <h2 className="sidebar-title">Trang cá nhân</h2>
                
                <div className="user-avatar-container">
                   
                    <div className="user-name">{userData.name}</div>
                </div>

                <div className="sidebar-menu">
                    <div 
                        className={`menu-item ${activeMenu === 'account' ? 'active' : ''}`} 
                        onClick={() => handleMenuClick('account')}
                    >
                        <span>Thông tin tài khoản</span>
                    </div>
                    <div 
                        className={`menu-item ${activeMenu === 'updatePass' ? 'active' : ''}`} 
                        onClick={() => handleMenuClick('updatePass')}
                    >
                        <span>Đổi mật khẩu</span>
                    </div>
                    <div 
                        className={`menu-item ${activeMenu === 'comments' ? 'active' : ''}`} 
                        onClick={() => handleMenuClick('comments')}
                    >
                        <span>Bình luận</span>
                    </div>
                    
                </div>
            </div>

            {/* Nội dung bên phải */}
            <div className="right-container">
                {renderRightContent()}
            </div>

            {/* Modal chỉnh sửa thông tin người dùng */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Thay đổi thông tin</h3>
                            <button className="close-button" onClick={() => setShowEditModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={editFormData.name} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={editFormData.email} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-button" onClick={() => setShowEditModal(false)}>Hủy</button>
                            <button className="save-button" onClick={handleSaveChanges}>Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMain;