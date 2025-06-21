import './LoginContent.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function LoginContent() {
    // State để chuyển đổi hiển thị mật khẩu
    const [showMatKhau, setShowMatKhau] = useState(false);
    
    // State để quản lý dữ liệu form
    const [formData, setFormData] = useState({
        tenDangNhap: '',
        matKhau: ''
    });

    // State để hiển thị thông báo lỗi
    const [error, setError] = useState('');
    
    // State để hiển thị trạng thái đang xử lý
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Hook để điều hướng chương trình
    const navigate = useNavigate();
    
    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Xóa thông báo lỗi khi người dùng thay đổi nội dung
        setError('');
    };
    
    // Lấy thông tin người dùng sử dụng token
    const fetchUserInfo = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/webreadstory/users/myInfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('User Info data:', data);
                
                // Kiểm tra nếu API trả về cấu trúc có code và result
                if (data && data.code === 0 && data.result) {
                    return data.result;  // Trả về phần result chứa thông tin người dùng
                } 
                else {
                    console.error('API trả về dữ liệu không đúng định dạng:', data);
                    return null;
                }
            } 
            else {
                console.error('Không thể lấy thông tin người dùng');
                return null;
            }
        } 
        catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            return null;
        }
    };
    
    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        const { tenDangNhap, matKhau } = formData;
        
        // Kiểm tra nếu trường rỗng
        if (!tenDangNhap || !matKhau) {
            setError('Vui lòng nhập đầy đủ thông tin');
            setIsSubmitting(false);
            return;
        }
        
        try {
            // Gọi API đăng nhập
            const response = await fetch('http://localhost:8080/webreadstory/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenDangNhap,
                    matKhau
                })
            });
            
            const data = await response.json();

            if (response.ok && data.code === 0 && data.result.authenticated) {
                // Lưu token vào localStorage để sử dụng cho các request sau này
                const token = data.result.token;
                localStorage.setItem('authToken', token);
                
                // Gọi API để lấy thông tin chi tiết của người dùng
                const userInfo = await fetchUserInfo(token);
                
                if (userInfo) {
                    // Lưu thông tin người dùng đầy đủ vào localStorage
                    // Điều chỉnh theo cấu trúc API trả về
                    const userData = {
                        id: userInfo.maNguoiDung,
                        username: userInfo.tenDangNhap,
                        fullName: userInfo.tenNguoiDung,
                        email: userInfo.email || '',
                        role: userInfo.quyenHan,
                        level: userInfo.capBac || '',
                        avatar: userInfo.anhDaiDien || '' // Nếu API không trả về anhDaiDien, sẽ để trống
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    // Phát sự kiện để thông báo thay đổi trạng thái đăng nhập
                    window.dispatchEvent(new CustomEvent('login-status-changed'));
                    
                    // Chuyển hướng dựa trên vai trò
                    if (userInfo.quyenHan === 'ADMIN') {
                        navigate('/admin/stories');
                    } else {
                        navigate('/');
                    }
                } else {
                    // Xử lý khi không lấy được thông tin người dùng
                    setError('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
                    localStorage.removeItem('authToken'); // Xóa token vì không sử dụng được
                    setIsSubmitting(false);
                }
            } else {
                // Hiển thị thông báo lỗi từ API hoặc thông báo mặc định
                setError(data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác');
                setIsSubmitting(false);
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.');
            console.error('Login error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Chuyển đổi hiển thị mật khẩu
    const toggleMatKhauVisibility = () => {
        setShowMatKhau(!showMatKhau);
    };

    // Xử lý điều hướng đến trang đăng ký
    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/register');
    };

    // Xử lý điều hướng đến trang quên mật khẩu
    const handleForgotPass = (e) => {
        e.preventDefault();
        navigate('/forgotPass');
    };

    return (
        <>
            <div className='login-content'>
                <div className='login-form'>
                    <div className="form-header">
                        <h1>Đăng nhập</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-alert">{error}</div>}
                        
                        <div className="input-group">
                            <h5>Tên tài khoản</h5>
                            
                            <input 
                                type='text' 
                                id='tenDangNhap' 
                                name='tenDangNhap' 
                                placeholder='Tên đăng nhập'
                                value={formData.tenDangNhap}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="input-group">
                            <h5>Mật khẩu</h5>
                            
                            <input 
                                type={showMatKhau ? 'text' : 'password'} 
                                id='matKhau' 
                                name='matKhau' 
                                placeholder='Mật khẩu'
                                value={formData.matKhau}
                                onChange={handleChange}
                                required
                            />
                            <div 
                                className="password-toggle" 
                                onClick={toggleMatKhauVisibility}
                            >
                                <FontAwesomeIcon icon={showMatKhau ? faEyeSlash : faEye} />
                            </div>
                        </div>
                        
                        <div className="other-options">
                            <a href="#" onClick={handleForgotPass}>Quên mật khẩu?</a>
                            <a href="#" onClick={handleRegister}>Đăng ký</a>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                            <button 
                                type='submit' 
                                className="login-button" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginContent;