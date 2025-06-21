import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavAdmin.css';

function NavAdmin({ onMenuChange }) {
    const navigate = useNavigate();
    // State để theo dõi menu item đang active
    const [activeMenu, setActiveMenu] = useState('stories');
    
    // State để kiểm soát hiển thị hộp xác nhận đăng xuất
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    // Hàm xử lý khi click vào menu item
    const handleMenuClick = (menuName) => {
        if (menuName === 'logout') {
            // Hiển thị hộp xác nhận đăng xuất
            setShowLogoutConfirm(true);
        } else {
            setActiveMenu(menuName);
            
            // Gọi hàm onMenuChange để cập nhật tiêu đề
            if (onMenuChange) {
                onMenuChange(menuName);
            }
            
            // Điều hướng đến trang tương ứng nếu cần
            // navigate(`/admin/${menuName}`);
        }
    };
    
    // Hàm xử lý khi xác nhận đăng xuất
    const handleLogoutConfirm = () => {
        // Xóa thông tin người dùng khỏi sessionStorage
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        
        // Phát sự kiện để thông báo trạng thái đăng nhập đã thay đổi
        window.dispatchEvent(new CustomEvent('login-status-changed'));
        
        // Ẩn hộp xác nhận
        setShowLogoutConfirm(false);
        
        // Điều hướng về trang chủ
        navigate('/');
    };
    
    // Hàm xử lý khi hủy đăng xuất
    const handleLogoutCancel = () => {
        // Chỉ cần ẩn hộp xác nhận
        setShowLogoutConfirm(false);
    };
    
    return (
        <>
            <div className="admin-menu">
                {/* <div 
                    className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('dashboard')}
                >
                    <i className="fa-solid fa-microchip"></i>
                    <span>Tổng quan</span>
                </div> */}
                
                <div 
                    className={`menu-item ${activeMenu === 'stories' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('stories')}
                >
                    <i className="fas fa-book"></i>
                    <span>Truyện</span>
                </div>
                
                <div 
                    className={`menu-item ${activeMenu === 'categories' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('categories')}
                >
                    <i className="fas fa-tags"></i>
                    <span>Thể loại</span>
                </div>
                
                <div 
                    className={`menu-item ${activeMenu === 'users' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('users')}
                >
                    <i className="fas fa-users"></i>
                    <span>Người dùng</span>
                </div>
                
                <div 
                    className={`menu-item ${activeMenu === 'comments' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('comments')}
                >
                    <i className="fas fa-comments"></i>
                    <span>Bình luận</span>
                </div>
                
                <div 
                    className={`menu-item ${activeMenu === 'logout' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('logout')}
                >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Đăng xuất</span>
                </div>
            </div>
            
            {/* Hộp xác nhận đăng xuất */}
            {showLogoutConfirm && (
                <div className="logout-confirm-overlay">
                    <div className="logout-confirm-box">
                        <div className="logout-confirm-header">
                            <i className="fa-solid fa-circle-question"></i>
                            <h3>Xác nhận đăng xuất</h3>
                        </div>
                        <div className="logout-confirm-content">
                            <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
                        </div>
                        <div className="logout-confirm-actions">
                            <button 
                                className="btn-cancel" 
                                onClick={handleLogoutCancel}
                            >
                                Hủy
                            </button>
                            <button 
                                className="btn-confirm" 
                                onClick={handleLogoutConfirm}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default NavAdmin;