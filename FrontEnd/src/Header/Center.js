import logo from '../Assets/logo.png';
import './Center.css';
import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../Assets/anhdaidien.png';
import { User, UserPlus, Bookmark, LogOut, UserCircle } from 'lucide-react';
function Center(){
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const css = {
        backgroundColor: '#F43F5E',
        width: '100%',
        maxWidth: '930px',
        gridColumn: '2 / 3',
        display: 'grid',
        gridTemplateColumns: '3fr 2fr 1fr',
        justifyContent: 'space-between',
        alignItems: 'center',
        position : 'relative',
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '100%',
        right: 30,
        backgroundColor: 'white',
        border: '2px solid #F43F5E',
        borderRadius: '7px 0px 7px 14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 10,
        width: '170px',  // Tăng độ rộng để có đủ chỗ cho mục truyện theo dõi
        display: isDropdownOpen ? 'block' : 'none',
    };

    const dropdownItemStyle = {
        padding: '10px 15px',
        cursor: 'pointer',
        borderBottom: '1px solid #ffffff',
        borderRadius: '0px 0px 7px 14px',
    };

    // Kiểm tra người dùng đã đăng nhập từ sessionStorage
    useEffect(() => {
        // Hàm kiểm tra đăng nhập - có thể gọi lại khi cần
        const checkLoginStatus = () => {
            const userDataString = localStorage.getItem('currentUser');
            if (userDataString) {
                try {
                    const userData = JSON.parse(userDataString);
            
                    // Kiểm tra dữ liệu cần thiết cho một người dùng hợp lệ
                    if (userData && userData.id && userData.username) {
                        console.log("User data loaded successfully");
                        setCurrentUser(userData);
                    } else {
                        console.log("Invalid user data format, logging out");
                        // Nếu dữ liệu không hợp lệ, xóa sessionStorage và cập nhật state
                        localStorage.removeItem('authToken');
                        sessionStorage.removeItem('currentUser');
                        setCurrentUser(null);
                    }
                } catch (error) {
                    console.error('Lỗi khi đọc dữ liệu đăng nhập:', error);
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
        };
        
        // Kiểm tra khi component được tạo
        checkLoginStatus();
        
        // Đăng ký sự kiện lắng nghe thay đổi sessionStorage
        const handleStorageChange = (e) => {
            if (e.key === 'currentUser') {
                checkLoginStatus();
            }
        };
        
        // Lắng nghe sự kiện storage
        window.addEventListener('storage', handleStorageChange);
        
        // Lắng nghe sự kiện tùy chỉnh để cập nhật trạng thái đăng nhập
        const handleLoginEvent = () => {
            checkLoginStatus();
        };
        
        window.addEventListener('login-status-changed', handleLoginEvent);
        
        // Cleanup khi unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('login-status-changed', handleLoginEvent);
        };
    }, []);
    console.log(currentUser);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Xử lý đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.user')) {
                setIsDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Xử lý đăng xuất
    const handleLogout = () => {
        // Xóa dữ liệu người dùng từ sessionStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        
        // Cập nhật state
        setCurrentUser(null);
        setIsDropdownOpen(false);
        
        // Phát sự kiện để các component khác biết trạng thái đăng nhập đã thay đổi
        window.dispatchEvent(new CustomEvent('login-status-changed'));
        
        // Điều hướng về trang chủ
        navigate('/');
    };

    return(
        <>
            <div style={css}>
                <div className="logo">
                    <img src={logo} alt="logo" />
                    <span>TopTruyen</span>
                </div>
                
                <div className='user' onClick={toggleDropdown}>
                    {currentUser ? (
                        // Hiển thị khi đã đăng nhập
                        <>
                            <span>{currentUser.fullName}</span>
                           
                        </>
                    ) : (
                        // Hiển thị khi chưa đăng nhập
                        <>
                            <span>Tài khoản</span>
                            
                        
                        </>
                    )}

                    <div style={dropdownStyle}>
                        {currentUser ? (
                            // Menu dropdown cho người dùng đã đăng nhập
                            <>
                                <div style={dropdownItemStyle} className='dropdownUser'>
                                    <User size={16} />
                                    <Link to="/user" style={{textDecoration: 'none'}}><span>Thông tin cá nhân</span></Link>
                                </div>
                                
                                {/* Thêm tùy chọn truyện theo dõi */}
                                <div style={dropdownItemStyle} className='dropdownUser'>
                                    <Bookmark size={16} />
                                    <Link to="/followStory" style={{textDecoration: 'none'}}><span>Truyện theo dõi</span></Link>
                                </div>   
                                <div 
                                    style={dropdownItemStyle} 
                                    className='dropdownUser'
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    <span>Đăng xuất</span>
                                </div>
                            </>
                        ) : (
                            // Menu dropdown cho người dùng chưa đăng nhập
                            <>
                                <div style={dropdownItemStyle} className='dropdownUser'>
                                    <User size={16} />
                                    <Link to="/login" style={{textDecoration: 'none'}}><span>Đăng nhập</span></Link>
                                </div>
                                <div style={dropdownItemStyle} className='dropdownUser'>
                                    <UserPlus size={16} />
                                    <Link to="/register" style={{textDecoration: 'none'}}><span>Đăng ký</span></Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Center;