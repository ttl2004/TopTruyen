import React, { useState, useEffect } from 'react';
import Header from './Header';
import NavigationMenu from './NavigationMenu';
import Content from './Content';
import Footer from './Footer';
import './App.css';
import Admin from './admin';

function App() {
   
  const [currentUser, setCurrentUser] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi component được tạo
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const userDataString = localStorage.getItem('currentUser');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Lỗi khi đọc dữ liệu đăng nhập:', error);
        setCurrentUser(null);
      }
    };

    // Kiểm tra khi component được tạo
    checkAuthStatus();

    // Lắng nghe sự kiện đăng nhập/đăng xuất
    const handleLoginEvent = () => {
      checkAuthStatus();
    };

    window.addEventListener('login-status-changed', handleLoginEvent);

    return () => {
      window.removeEventListener('login-status-changed', handleLoginEvent);
    };
  }, []);

  // Hiển thị giao diện admin
  if (currentUser && currentUser.role === 'ADMIN') {
    return (
      <div className="appAdmin">
        <Admin />
        {/* Thêm các component khác cho giao diện Admin */}
      </div>
    );
  }

  // Hiển thị giao diện người dùng thông thường (khi chưa đăng nhập hoặc đăng nhập là user)
  return (
    <div className="App">
      <Header />
      <NavigationMenu />
      <Content />
      <Footer />
    </div>
  );
}

export default App;