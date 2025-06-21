import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';
import './SearchStory.css';

const SearchStory = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    // State cho phân trang và tìm kiếm
    const [currentPage, setCurrentPage] = useState(0);
    const [stories, setStories] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho các bộ lọc
    const [selectedSort, setSelectedSort] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Fetch stories
    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            try {
                let url;
                if (keyword) {
                    url = `http://localhost:8080/webreadstory/storys/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&size=8`;
                } else {
                    url = `http://localhost:8080/webreadstory/storys?page=${currentPage}&size=8`;
                }

                // Add status filter if selected
                if (selectedStatus !== 'all') {
                    url += `&status=${selectedStatus}`;
                }

                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Stories response:', data);
                    if (data && Array.isArray(data.content)) {
                        // Sort stories based on selected sort option
                        let sortedStories = [...data.content];
                        switch (selectedSort) {
                            case 'dateAddedAsc':
                                sortedStories.sort((a, b) => new Date(a.ngayThem) - new Date(b.ngayThem));
                                break;
                            case 'dateAddedDesc':
                                sortedStories.sort((a, b) => new Date(b.ngayThem) - new Date(a.ngayThem));
                                break;
                            case 'dateUpdatedAsc':
                                sortedStories.sort((a, b) => new Date(a.ngayCapNhat) - new Date(b.ngayCapNhat));
                                break;
                            case 'dateUpdatedDesc':
                                sortedStories.sort((a, b) => new Date(b.ngayCapNhat) - new Date(a.ngayCapNhat));
                                break;
                            default:
                                break;
                        }
                        setStories(sortedStories);
                        setTotalPages(data.totalPages || 0);
                    } else {
                        console.error('Unexpected stories data format:', data);
                        setStories([]);
                        setTotalPages(0);
                    }
                }
            } catch (error) {
                console.error('Error fetching stories:', error);
                setStories([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [currentPage, keyword, selectedStatus]);

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // Xử lý chọn sắp xếp
    const handleSortChange = (sortType) => {
        setSelectedSort(sortType);
        // Sort the current stories without fetching from API
        let sortedStories = [...stories];
        switch (sortType) {
            case 'dateAddedAsc':
                sortedStories.sort((a, b) => new Date(a.ngayThem) - new Date(b.ngayThem));
                break;
            case 'dateAddedDesc':
                sortedStories.sort((a, b) => new Date(b.ngayThem) - new Date(a.ngayThem));
                break;
            case 'dateUpdatedAsc':
                sortedStories.sort((a, b) => new Date(a.ngayCapNhat) - new Date(b.ngayCapNhat));
                break;
            case 'dateUpdatedDesc':
                sortedStories.sort((a, b) => new Date(b.ngayCapNhat) - new Date(a.ngayCapNhat));
                break;
            default:
                break;
        }
        setStories(sortedStories);
    };

    // Xử lý chọn trạng thái
    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setCurrentPage(0);
    };

    return (
        <div className="SearchStory1">
            {/* Tiêu đề và từ khóa tìm kiếm */}
            {keyword && (
                <div className="SearchStory2">
                    <h1 className="SearchStory3">
                        Kết quả tìm kiếm cho: <span style={{ color: '#FF4D6D' }}>{keyword}</span>
                    </h1>
                </div>
            )}

            {/* Thanh bộ lọc */}
            <div className="SearchStory8">
                <div className="SearchStory9">
                    <h3 className="SearchStory10">Sắp xếp theo</h3>
                    <div className="SearchStory11">
                        <button 
                            className={`SearchStory12 ${selectedSort === 'dateAddedAsc' ? 'SearchStory13' : ''}`}
                            onClick={() => handleSortChange('dateAddedAsc')}
                        >
                            Ngày thêm A {'->'} Z
                        </button>
                        <button 
                            className={`SearchStory12 ${selectedSort === 'dateAddedDesc' ? 'SearchStory13' : ''}`}
                            onClick={() => handleSortChange('dateAddedDesc')}
                        >
                            Ngày thêm Z {'->'} A
                        </button>
                        <button 
                            className={`SearchStory12 ${selectedSort === 'dateUpdatedAsc' ? 'SearchStory13' : ''}`}
                            onClick={() => handleSortChange('dateUpdatedAsc')}
                        >
                            Ngày cập nhật A {'->'} Z
                        </button>
                        <button 
                            className={`SearchStory12 ${selectedSort === 'dateUpdatedDesc' ? 'SearchStory13' : ''}`}
                            onClick={() => handleSortChange('dateUpdatedDesc')}
                        >
                            Ngày cập nhật Z {'->'} A
                        </button>
                    </div>
                </div>

                <div className="SearchStory9">
                    <h3 className="SearchStory10">Tình trạng</h3>
                    <div className="SearchStory11">
                        <button 
                            className={`SearchStory12 ${selectedStatus === 'all' ? 'SearchStory13' : ''}`}
                            onClick={() => handleStatusChange('all')}
                        >
                            Tất cả
                        </button>
                        <button 
                            className={`SearchStory12 ${selectedStatus === 'ongoing' ? 'SearchStory13' : ''}`}
                            onClick={() => handleStatusChange('ongoing')}
                        >
                            Đang diễn ra
                        </button>
                        <button 
                            className={`SearchStory12 ${selectedStatus === 'completed' ? 'SearchStory13' : ''}`}
                            onClick={() => handleStatusChange('completed')}
                        >
                            Đã hoàn thành
                        </button>
                    </div>
                </div>
            </div>

            {/* Hiển thị kết quả lọc */}
            <div className="SearchStory25">
                <p>Hiển thị {stories.length} kết quả</p>
            </div>

            {/* Danh sách truyện */}
            <div className="SearchStory14">
                {loading ? (
                    <div>Đang tải...</div>
                ) : stories.length === 0 ? (
                    <div>Không tìm thấy truyện</div>
                ) : (
                    stories.map(story => (
                        <div key={story.maTruyen} className="SearchStory15">
                            <Link to={`/read/${story.maTruyen}`} className="SearchStory16">
                                <div className="SearchStory17">
                                    <img 
                                        src={story.anhDaiDien} 
                                        alt={story.tenTruyen} 
                                        className="SearchStory18"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/150x200?text=No+Image';
                                        }}
                                    />
                                </div>
                                <h3 className="SearchStory19">{story.tenTruyen}</h3>
                            </Link>
                            <div className="SearchStory20">
                                <div className="SearchStory22">
                                    <span className="SearchStory23">Lượt đọc: {story.luotDoc}</span>
                                    <span className="SearchStory24">Số chương: {story.soChuong}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button 
                        className="pagination-arrow"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        &laquo;
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i).map(number => (
                        <button
                            key={number}
                            className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                            onClick={() => handlePageChange(number)}
                        >
                            {number + 1}
                        </button>
                    ))}
                    
                    <button 
                        className="pagination-arrow"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        &raquo;
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchStory;