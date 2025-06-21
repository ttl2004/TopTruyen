import HeaderAdmin from "./HeaderAdmin";
import NavAdmin from "./NavAdmin";
import MainAdminContent from "./ContentAdmin/MainAdminContent";
import StoriesAdmin from "./ContentAdmin/StoriesAdmin";
import CategoriesAdmin from "./ContentAdmin/CategoriesAdmin"; 
import UsersAdmin from "./ContentAdmin/UsersAdmin"; 
import CommentsAdmin from "./ContentAdmin/CommentsAdmin"; 
import './admin.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import adminAvatar from '../Assets/admin.jpg'; // Import ảnh admin
import StoryEditor from './ContentAdmin/Stories/StoryEditor';

function Admin() {
    // State để lưu trữ tiêu đề trang hiện tại
    const [currentSection, setCurrentSection] = useState('Truyện');
    // State để lưu thông tin người dùng admin
    const [adminUser, setAdminUser] = useState(null);
    // Sử dụng navigate để chuyển trang
    const navigate = useNavigate();
    // Lấy thông tin về đường dẫn hiện tại
    const location = useLocation();

    // Lấy thông tin người dùng từ sessionStorage khi component được render
    useEffect(() => {
        const userDataString = sessionStorage.getItem('currentUser');
        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                setAdminUser(userData);
            } catch (error) {
                console.error("Lỗi khi đọc thông tin người dùng:", error);
            }
        }
    }, []);

    // Cập nhật tiêu đề trang dựa trên đường dẫn hiện tại khi component được mount hoặc đường dẫn thay đổi
    useEffect(() => {
        // Xác định section hiện tại từ đường dẫn
        // if (location.pathname === '/admin') {
        //     setCurrentSection('Truyên');
        // } else 
        if (location.pathname === '/admin/stories') {
            setCurrentSection('Truyện');
        } else if (location.pathname === '/admin/categories') {
            setCurrentSection('Thể loại');
        } else if (location.pathname === '/admin/users') {
            setCurrentSection('Người dùng');
        } else if (location.pathname === '/admin/comments') {
            setCurrentSection('Bình luận');
        }
    }, [location.pathname]);

    // Hàm xử lý khi menu thay đổi
    const handleMenuChange = (menuName) => {
        // Điều hướng tới trang tương ứng
        switch(menuName) {
            // case 'dashboard':
            //     navigate('/admin');
            //     break;
            case 'stories':
                navigate('/admin/stories');
                break;
            case 'categories':
                navigate('/admin/categories');
                break;
            case 'users':
                navigate('/admin/users');
                break;
            case 'comments':
                navigate('/admin/comments');
                break;
            default:
                navigate('/admin/stories');
        }
    };

    return (
        <div className="Admin">
            <div className='admin-header'>
                <HeaderAdmin />
                <NavAdmin onMenuChange={handleMenuChange} />
            </div>
            <div className='admin-content'>
                <div className="header-content">
                    <div className="HC-container">
                        <h2>{currentSection}</h2>
                        <div className="HC-user">
                            <span>{adminUser?.username || 'Admin'}</span>
                            <img 
                                src={adminAvatar} 
                                alt="Admin Avatar" 
                                className="admin-avatar"
                            />
                        </div>
                    </div>
                </div>
                <Routes>
                    {/* <Route path="/admin" element={<MainAdminContent />} /> */}
                    <Route path="/admin/stories" element={<StoriesAdmin />} />
                    <Route path="/admin/categories" element={<CategoriesAdmin />} />
                    <Route path="/admin/users" element={<UsersAdmin />} />
                    <Route path="/admin/comments" element={<CommentsAdmin />} />
                    <Route path="/admin/stories/:id" element={<StoryEditor />} />
                </Routes>
            </div>
        </div>
    );
}

export default Admin;