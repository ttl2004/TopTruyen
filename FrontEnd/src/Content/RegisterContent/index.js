import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterContent.css';
import { Eye, EyeOff } from 'lucide-react'; 

const RegisterContent = () => {
  // Khai báo trạng thái lưu trữ dữ liệu từ form nhập (tên, email, tên tài khoản, mật khẩu)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  // Thêm state để kiểm soát hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  // Thêm state để hiển thị thông báo thành công
  const [successMessage, setSuccessMessage] = useState('');

  // Khai báo trạng thái để lưu trữ các lỗi nhập liệu
  const [errors, setErrors] = useState({});

  // Khai báo trạng thái để theo dõi xem form đang được gửi đi hay không
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook điều hướng để chuyển trang khi cần thiết
  const navigate = useNavigate();

   // Hàm toggle hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Hàm xử lý khi người dùng nhập dữ liệu vào các ô input
  const handleChange = (e) => {
    const { name, value } = e.target; // Lấy tên và giá trị của ô input hiện tại
    
    // Cập nhật trạng thái formData với giá trị mới nhập
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Xóa lỗi tương ứng khi người dùng bắt đầu nhập lại dữ liệu vào ô đó
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Hàm kiểm tra tính hợp lệ của dữ liệu trong form
  const validateForm = () => {
    const newErrors = {};
    
    // Kiểm tra tên - phải có ít nhất 4 ký tự
    if (!formData.name) {
      newErrors.name = "Vui lòng nhập tên";
    } else if (formData.name.length < 4) {
      newErrors.name = "Tên phải có ít nhất 4 ký tự";
    }
    
    // Kiểm tra email - phải có định dạng hợp lệ
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) { // Kiểm tra định dạng email theo chuẩn
      newErrors.email = "Email không hợp lệ";
    }
    
    // Kiểm tra tên tài khoản - phải có ít nhất 8 ký tự
    if (!formData.username) {
      newErrors.username = "Vui lòng nhập tên tài khoản";
    } else if (formData.username.length < 8) {
      newErrors.username = "Tên tài khoản phải có ít nhất 8 ký tự";
    }
    
    // Kiểm tra mật khẩu - phải có ít nhất 8 ký tự
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }
    
    return newErrors; // Trả về các lỗi đã phát hiện (nếu có)
  };

    // Hàm xử lý khi người dùng nhấn nút "Đăng ký"
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    // Nếu phát hiện lỗi, cập nhật trạng thái lỗi và không gửi dữ liệu
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    // Xóa tất cả các thông báo lỗi trước khi bắt đầu gửi request
    setErrors({});
    
    try {
      // Chuẩn bị dữ liệu để gửi đến API
      const userData = {
        tenNguoiDung: formData.name,
        tenDangNhap: formData.username,
        matKhau: formData.password,
        email: formData.email
      };
      
      // Gọi API đăng ký
      const response = await fetch('http://localhost:8080/webreadstory/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      // Kiểm tra phản hồi từ API
      if (response.ok && data.code === 1000) {
        console.log('Đăng ký thành công:', data);
        // Thay đổi: Hiển thị thông báo thành công trong form
        setSuccessMessage('Đăng ký thành công! Đang chuyển hướng...');
        
        // Đặt timeout để chuyển hướng sau 2 giây
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } 
      else {
        console.error('Đăng ký không thành công:', data);
        // Xử lý các lỗi từ API
        const apiError = data.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        
        // Xử lý các lỗi cụ thể
        if (apiError.includes('Tên đăng nhập đã tồn tại')) {
          setErrors({
            ...errors,
            username: 'Tên đăng nhập đã được sử dụng'
          });
        } else if (apiError.includes('Email đã tồn tại')) {
          setErrors({
            ...errors,
            email: 'Email đã được sử dụng'
          });
        } else {
          // Hiển thị lỗi chung nếu không xác định được lỗi cụ thể
          setErrors({
            ...errors,
            general: apiError
          });
        
        }
      }
    } catch (error) {
      // Xử lý lỗi kết nối
      console.error('Lỗi khi đăng ký:', error);
      setErrors({
        ...errors,
        general: 'Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xử lý khi người dùng nhấn nút "Đăng nhập"
  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/login'); // Chuyển hướng tới trang đăng nhập
  };


  return (
    <div className="register-container">
      <div className="register-form-container">
        <div className="form-header-2">
            <h2>Đăng ký</h2>
        </div>
        
        {/* Hiển thị thông báo thành công nếu có */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {/* Hiển thị thông báo lỗi chung nếu có */}
        {errors.general && (
          <div className="error-general">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
            <div className='input-group'>
                <h5>Name</h5> 
                <input 
                  type='text' 
                  id='name' 
                  name='name' 
                  placeholder='Name' 
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'invalid' : ''}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            <div className='input-group'>
                <h5>Email</h5>
                
                <input 
                  type='email' 
                  id='email' 
                  name='email' 
                  placeholder='Email' 
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'invalid' : ''}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            <div className='input-group'>
                <h5>Tên tài khoản</h5>
                
                <input 
                  type='text' 
                  id='username' 
                  name='username' 
                  placeholder='Tên đăng nhập' 
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'invalid' : ''}
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
            </div>
            <div className='input-group'>
                <h5>Password</h5>
                
                <div className="password-input-container">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id='password' 
                    name='password' 
                    placeholder='Password' 
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'invalid' : ''}
                  />
                  <button 
                    type="button" 
                    className="toggle-password-btn" 
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="other-options">
                <a href="#" onClick={handleLogin}>Đăng nhập</a>
            </div>

            <div style={{display: 'flex',justifyContent: 'center', alignContent: 'center' }}>
                <button 
                  type='submit' 
                  className="register-button" 
                  disabled={isSubmitting || successMessage}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterContent;
