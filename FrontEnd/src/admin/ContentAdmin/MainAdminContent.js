import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MainAdminContent.css';

function MainAdminContent() {
    // Dữ liệu truyện mẫu
    const allStories = [
        {
            id: 1,
            title: "Đấu La Đại Lục",
            author: "Đường Gia Tam Thiếu",
            category: "Xuyên không",
            date: "15/02/2025",
            status: "published",
            statusLabel: "Đã xuất bản"
        },
        {
            id: 2,
            title: "Bách Luyện Thành Thần",
            author: "Ân tứ giải thoát",
            category: "Tu tiên",
            date: "21/01/2025",
            status: "published",
            statusLabel: "Đã xuất bản"
        },
        {
            id: 3,
            title: "Kiếm lai",
            author: "Phong Hoả",
            category: "Tu tiên, Kiếm hiệp",
            date: "12/01/2025",
            status: "published",
            statusLabel: "Đã xuất bản"
        },
        {
            id: 4,
            title: "Ma thần thiên tôn",
            author: "Trường Lưu Thuỷ",
            category: "Dị giới, Huyền huyễn",
            date: "11/01/2025",
            status: "published",
            statusLabel: "Đã xuất bản"
        },
        {
            id: 5,
            title: "Đấu thiên",
            author: "Thiên Tuyệt Nhiên",
            category: "Đô thị",
            date: "09/01/2025",
            status: "published",
            statusLabel: "Đã xuất bản"
        },
        {
            id: 6,
            title: "Nguyên Tôn",
            author: "Thiên Tàm Thổ Đậu",
            category: "Tu Tiên, Huyền Ảo",
            date: "28/02/2025",
            status: "draft",
            statusLabel: "Bản nháp"
        },
        {
            id: 7,
            title: "Vũ Động Càn Khôn",
            author: "Thiên Tàm Thổ Đậu",
            category: "Huyền Huyễn, Tu Tiên",
            date: "25/02/2025",
            status: "draft",
            statusLabel: "Bản nháp"
        },
    ];
    const allUsers = [
        {
            id: 1,
            username: "nvanh123",
            email: "nvanh123@example.com",
            registrationDate: "15/02/2025",
            storiesRead: 45,
            comments: 60
        },
        {
            id: 2,
            username: "tvbinh12",
            email: "tvbinh12@example.com",
            registrationDate: "20/12/2024",
            storiesRead: 39,
            comments: 50
        },
        {
            id: 3,
            username: "lehuong92",
            email: "lehuong92@example.com",
            registrationDate: "12/01/2025",
            storiesRead: 35,
            comments: 43
        },
        {
            id: 4,
            username: "thienlinh02",
            email: "thienlinh02@example.com",
            registrationDate: "15/09/2023",
            storiesRead: 26,
            comments: 42
        },
        {
            id: 5,
            username: "hoangthanh24",
            email: "hoangthanh24@example.com",
            registrationDate: "31/01/2025",
            storiesRead: 20,
            comments: 35
        },
        {
            id: 6,
            username: "doanvanf",
            email: "doanvanf@example.com",
            registrationDate: "25/01/2025",
            storiesRead: 40,
            comments: 30
        },
        {
            id: 7,
            username: "ngothig",
            email: "ngothig@example.com",
            registrationDate: "30/01/2025",
            storiesRead: 45,
            comments: 35
        }
    ];
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageUser, setCurrentPageUser] = useState(1);
    const storiesPerPage = 4;

    // Tính toán các truyện hiển thị trên trang hiện tại
    const indexOfLastStory = currentPage * storiesPerPage;
    const indexOfFirstStory = indexOfLastStory - storiesPerPage;
    const currentStories = allStories.slice(indexOfFirstStory, indexOfLastStory);

    // Tính toán các người dùng hiển thị trên trang hiện tại
    const indexOfLastUser = currentPageUser * storiesPerPage;
    const indexOfFirstUser = indexOfLastUser - storiesPerPage;
    const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Tổng số trang truyện
    const totalPages = Math.ceil(allStories.length / storiesPerPage);

    // Tổng số trang người dùng
    const totalPagesUser = Math.ceil(allUsers.length / storiesPerPage);

    // Hàm xử lý chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => prev < totalPages ? prev + 1 : prev);
    const prevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : prev);

     // Hàm xử lý chuyển trang user
     const paginate_2 = (pageNumber) => setCurrentPageUser(pageNumber);
     const nextPage_2 = () => setCurrentPageUser(prev => prev < totalPagesUser ? prev + 1 : prev);
     const prevPage_2= () => setCurrentPageUser(prev => prev > 1 ? prev - 1 : prev);

    // Generate mảng số trang
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Generate mảng số trang user
    const pageNumbersUser = [];
    for (let i = 1; i <= totalPagesUser; i++) {
        pageNumbersUser.push(i);
    }

    return (
        <>
            <div className="main-admin-content">
                <div className='statistics'>
                    <div className="stat-card">
                     
                        <div className="stat-info">
                            <h3>Tổng số truyện</h3>
                            <div className="stat-number">90</div>
                            <div className="stat-trend positive">
                                <i className="fas fa-arrow-up"></i> 12% so với tháng trước
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        
                        <div className="stat-info">
                            <h3>Tổng lượt đọc</h3>
                            <div className="stat-number">12K</div>
                            <div className="stat-trend positive">
                                <i className="fas fa-arrow-up"></i> 5% so với tháng trước
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        
                        <div className="stat-info">
                            <h3>Tổng người dùng</h3>
                            <div className="stat-number">320</div>
                            <div className="stat-trend positive">
                                <i className="fas fa-arrow-up"></i> 3% so với tháng trước
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        
                        <div className="stat-info">
                            <h3>Bình luận mới</h3>
                            <div className="stat-number">3.2K</div>
                            <div className="stat-trend negative">
                                <i className="fas fa-arrow-down"></i> 4% so với tháng trước
                            </div>
                        </div>
                    </div>
                </div>
                 
                <div className='recent-stories-section'>
                    <div className="section-card">
                        <div className="section-header">
                            <Link to="/admin/stories" className="header-link">
                                <h3>Truyện mới thêm gần đây</h3>
                            </Link>
                            <div className="view-all-link">
                                <Link to="/admin/stories">
                                    Xem tất cả <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                        
                        <div className="section-content">
                            <table className="stories-table">
                                <thead>
                                    <tr>
                                        <th>Tên truyện</th>
                                        <th>Tác giả</th>
                                        <th>Thể loại</th>
                                        <th>Ngày thêm</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStories.map(story => (
                                        <tr key={story.id}>
                                            <td>
                                                <div className="story-info">
                                                    <span className="story-title">{story.title}</span>
                                                </div>
                                            </td>
                                            <td>{story.author}</td>
                                            <td>{story.category}</td>
                                            <td>{story.date}</td>
                                            <td>
                                                <span className={`status ${story.status}`}>
                                                    {story.statusLabel}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            <div className="pagination">
                                
                                <div className="pagination-controls">
                                    <button 
                                        className="pagination-btn prev" 
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    
                                    {pageNumbers.map(number => (
                                        <button 
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        className="pagination-btn next" 
                                        onClick={nextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='recent-users-section'>
                <div className="section-card">
                        <div className="section-header">
                            <Link to="/admin/users" className="header-link">
                                <h3>Người dùng tích cực</h3>
                            </Link>
                            <div className="view-all-link">
                                <Link to="/admin/users">
                                    Xem tất cả <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                        
                        <div className="section-content">
                            <table className="stories-table">
                                <thead>
                                    <tr>
                                        <th>Tên người dùng</th>
                                        <th>Email</th>
                                        <th>Ngày đăng ký</th>
                                        <th>Số truyện đã đọc</th>
                                        <th>Số bình luận</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="story-info">
                                                    <span className="story-title">{user.username}</span>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{user.registrationDate}</td>
                                            <td>{user.storiesRead}</td>
                                            <td>{user.comments}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            <div className="pagination">
                                
                                <div className="pagination-controls">
                                    <button 
                                        className="pagination-btn prev" 
                                        onClick={prevPage_2}
                                        disabled={currentPageUser === 1}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    
                                    {pageNumbersUser.map(number => (
                                        <button 
                                            key={number}
                                            onClick={() => paginate_2(number)}
                                            className={`pagination-btn ${currentPageUser === number ? 'active' : ''}`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        className="pagination-btn next" 
                                        onClick={nextPage_2}
                                        disabled={currentPageUser === totalPagesUser}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainAdminContent;