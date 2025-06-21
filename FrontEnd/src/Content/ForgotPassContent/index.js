import React, { useState } from 'react';
import './ForgotPassContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ForgotPassContent = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Xác thực email đơn giản
        if (!email) {
            setError('Vui lòng nhập địa chỉ email của bạn');
            return;
        }
        
        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Địa chỉ email không hợp lệ');
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        
        try {
            const response = await fetch(`http://localhost:8080/webreadstory/users/forgot-password?email=${email}`, {
                method: 'GET'
            });

            const data = await response.text();

            if (data.startsWith('Mật khẩu là:')) {
                setMessage(data);
            } else if (data === 'Email không tồn tại, vui lòng thử lại!') {
                setError(data);
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToLogin = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    const handleConfirm = () => {
        setMessage('');
        navigate('/login');
    };

    return (
        <>
            <div className="forgot-container">
                <div className="forgot-form-container">
                    <div className="form-header-3">
                        <h2>Quên mật khẩu</h2>
                    </div>
                    
                    {message && (
                        <div className="success-message">
                            <p>{message}</p>
                            <button 
                                className="confirm-button"
                                onClick={handleConfirm}
                            >
                                Xác nhận
                            </button>
                        </div>
                    )}
                    
                    {!message && (
                        <form onSubmit={handleSubmit}>
                            <div className='input-group'>
                                <h5>Email</h5>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={handleChange}
                                    className={error ? 'invalid' : ''}
                                    required
                                />
                                {error && <div className="error-message">{error}</div>}
                            </div>
                            
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="reset-button1"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                                </button>
                                
                                <button 
                                    className="back-button"
                                    onClick={handleBackToLogin}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} /> Quay lại đăng nhập
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForgotPassContent;