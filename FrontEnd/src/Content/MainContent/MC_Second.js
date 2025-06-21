import './MC_Second.css';
import React, {useState, useEffect} from 'react';
import image from '../../Assets/image.png';
import { Link } from 'react-router-dom';

function MC_Second() {
  const css = {
    backgroundColor: '#FFFFFF',
    gridColumn: '2 / 3',
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridTemplateRows: 'repeat(7, 1fr) 50px',
    gap: '30px',
  };

  // Danh sách truyện top
  const comicData = {
    month: [
      { 
      id: 1, 
      title: 'Ta Có 90 Tỷ Tiên Liêm Câu!', 
      chapter: 506, 
      views: 138,
      image: image // Hình ảnh giữ chỗ
      },
      { 
      id: 2, 
      title: 'Ta Có Một Sơn Trại', 
      chapter: 1087, 
      views: 130,
      image: image
      },
      { 
      id: 3, 
      title: 'Vạn Cổ Chí Tôn', 
      chapter: 396, 
      views: 87,
      image: image
      },
      { 
      id: 4, 
      title: 'Võ Luyến Đình Phong', 
      chapter: 3820, 
      views: 100,
      image: image
      },
      { 
      id: 5, 
      title: 'Cao Võ: Hạ Cánh Đến Một Vạn năm sau', 
      chapter: 194, 
      views: 27,
      image: image
      },
      { 
      id: 6, 
      title: 'Toàn Cầu Bằng Phong: Ta...', 
      chapter: 598, 
      views: 45,
      image: image
      }
    ],
    week: [
      { 
        id: 1, 
        title: 'Ta Có 90 Tỷ Tiên Liêm Câu!', 
        chapter: 506, 
        views: 138,
        image: image // Hình ảnh giữ chỗ
        },
        { 
        id: 2, 
        title: 'Ta Có Một Sơn Trại', 
        chapter: 1087, 
        views: 130,
        image: image
        },
        { 
        id: 3, 
        title: 'Vạn Cổ Chí Tôn', 
        chapter: 396, 
        views: 87,
        image: image
        },
        { 
        id: 4, 
        title: 'Võ Luyến Đình Phong', 
        chapter: 3820, 
        views: 100,
        image: image
        },
    ],
    day: [
      { 
        id: 1, 
        title: 'Ta Có 90 Tỷ Tiên Liêm Câu!', 
        chapter: 506, 
        views: 138,
        image: image // Hình ảnh giữ chỗ
        },
        { 
        id: 2, 
        title: 'Ta Có Một Sơn Trại', 
        chapter: 1087, 
        views: 130,
        image: image
        },
        { 
        id: 3, 
        title: 'Vạn Cổ Chí Tôn', 
        chapter: 396, 
        views: 87,
        image: image
        },
    ]
  };
  const novelData = {
    month: [
    { 
      id: 1, 
      title: 'Võ Luyện Đỉnh Phong', 
      chapter: 2506, 
      views: 238,
      image: image
    },
    { 
      id: 2, 
      title: 'Đấu Phá Thương Khung', 
      chapter: 1287, 
      views: 198,
      image: image
    },
    // Thêm sách văn bản khác ở đây
    ],
    week: [
      // Dữ liệu tuần cho sách văn bản
    ],
    day: [
      // Dữ liệu ngày cho sách văn bản
    ]
  };
  // Tất cả truyện tranh
  const allComics = [
    { id: 1, title: 'One Piece', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '18 giờ trước'}], genre: 'Phiêu lưu' },
    { id: 2, title: 'Naruto', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Hành động' },
    { id: 3, title: 'Dragon Ball Super', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Võ thuật' },
    { id: 4, title: 'Kimetsu no Yaiba', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Kinh dị' },
    { id: 5, title: 'Jujutsu Kaisen', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Siêu nhiên' },
    { id: 6, title: 'Attack on Titan', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Giả tưởng' },
    { id: 7, title: 'My Hero Academia', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Anh hùng' },
    { id: 8, title: 'Black Clover', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Phép thuật' },
    { id: 9, title: 'Tokyo Revengers', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Hành động' },
    { id: 10, title: 'Spy x Family', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Hài hước' },
    { id: 11, title: 'Chainsaw Man', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Kinh dị' },
    { id: 12, title: 'Blue Lock', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Thể thao' },
    { id: 13, title: 'Haikyuu!!', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Thể thao' },
    { id: 14, title: 'Hunter x Hunter', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Phiêu lưu' },
    { id: 15, title: 'Bleach', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Siêu nhiên' },
    { id: 16, title: 'Dr. Stone', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Khoa học' },
    { id: 17, title: 'One Piece', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '18 giờ trước'}], genre: 'Phiêu lưu' },
    { id: 18, title: 'Naruto', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Hành động' },
    { id: 19, title: 'Dragon Ball Super', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Võ thuật' },
    { id: 20, title: 'Kimetsu no Yaiba', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Kinh dị' },
    { id: 21, title: 'Jujutsu Kaisen', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Siêu nhiên' },
    { id: 22, title: 'Attack on Titan', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Giả tưởng' },
    { id: 23, title: 'My Hero Academia', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Anh hùng' },
    { id: 24, title: 'Black Clover', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Phép thuật' },
    { id: 25, title: 'Tokyo Revengers', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Hành động' },
    { id: 26, title: 'Spy x Family', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Hài hước' },
    { id: 27, title: 'Chainsaw Man', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Kinh dị' },
    { id: 28, title: 'Blue Lock', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Thể thao' },
    { id: 29, title: 'Haikyuu!!', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Thể thao' },
    { id: 30, title: 'Hunter x Hunter', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Phiêu lưu' },
    { id: 31, title: 'Bleach', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Siêu nhiên' },
    { id: 32, title: 'Dr. Stone', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Khoa học' },
    { id: 28, title: 'Blue Lock', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Thể thao' },
    { id: 29, title: 'Haikyuu!!', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Thể thao' },
    { id: 30, title: 'Hunter x Hunter', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Phiêu lưu' },
    { id: 31, title: 'Bleach', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Siêu nhiên' },
    { id: 32, title: 'Blue Lock', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Thể thao' },
    { id: 33, title: 'Haikyuu!!', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Thể thao' },
    { id: 34, title: 'Hunter x Hunter', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Phiêu lưu' },
    { id: 35, title: 'Bleach', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Siêu nhiên' },
    { id: 36, title: 'Blue Lock', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Thể thao' },
    { id: 37, title: 'Haikyuu!!', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Thể thao' },
    { id: 38, title: 'Hunter x Hunter', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Phiêu lưu' },
    { id: 39, title: 'Bleach', image: image, chapter: [{chap: 100, time_up: '3 giờ trước'}, {chap: 99, time_up: '7 giờ trước'},{chap: 98, time_up: '8 giờ trước'}], genre: 'Siêu nhiên' }
  ];

  
  const [activeTab, setActiveTab] = useState('month');
  const [comicType, setComicType] = useState('comic');
  const [topStories, setTopStories] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);

  // Fetch top stories
  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        setLoadingTop(true);
        const response = await fetch('http://localhost:8080/webreadstory/storys/topMonth');
        if (!response.ok) {
          throw new Error('Failed to fetch top stories');
        }
        const data = await response.json();
        setTopStories(data);
      } catch (error) {
        console.error('Error fetching top stories:', error);
      } finally {
        setLoadingTop(false);
      }
    };

    fetchTopStories();
  }, []);

  // Remove rankingData since we're only using API data now
  const rankingListStyle = {
    height: '490px',
  };

  // State for stories from API
  const [stories, setStories] = useState([]);
  const [storyChapters, setStoryChapters] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const storiesPerPage = 8;

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/webreadstory/storys?page=${currentPage}&size=${storiesPerPage}&sort=ngayCapNhat,desc`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }

        const data = await response.json();
        setStories(data.content);
        setTotalPages(data.totalPages);

        // Fetch chapters for each story
        const chaptersPromises = data.content.map(story => fetchChapters(story.maTruyen));
        const chaptersResults = await Promise.all(chaptersPromises);
        
        const chaptersMap = {};
        data.content.forEach((story, index) => {
          chaptersMap[story.maTruyen] = chaptersResults[index];
        });
        
        setStoryChapters(chaptersMap);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [currentPage]);

  // Function to fetch chapters for a story
  const fetchChapters = async (storyId) => {
    try {
      const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}/chapters?page=0&size=3`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chapters');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error(`Error fetching chapters for story ${storyId}:`, error);
      return [];
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Pagination handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div style={css}>
        <div className="div-1">
          <h3>Top Truyện - Truyện mới cập nhật online »</h3>
        </div>

        {/* Remove comic type buttons since we're only showing one type */}
        <div className="div-2">
        </div>
        
        {/* Ranking */}
        <div className="div-3">
          <div className="ranking-tabs">
            <button className="active">
              Top tháng
            </button>
          </div>
          <div className="ranking-list" style={rankingListStyle}>
            {loadingTop ? (
              <div>Loading...</div>
            ) : (
              topStories.map((story, index) => (
                <Link 
                  to={`/read/${story.maTruyen}`} 
                  key={story.maTruyen}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="ranking-item" style={{ cursor: 'pointer' }}>
                    <div className="rank-number">{String(index + 1).padStart(2, '0')}</div>
                    <div className="manga-image">
                      <img src={story.anhDaiDien} alt={story.tenTruyen} />
                    </div>
                    <div className="manga-details">
                      <h4>{story.tenTruyen}</h4>
                      <div className="view-count">
                        <span>{story.luotDocThang} lượt đọc</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Updated stories section using API data */}
        <div className="div_4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="comics-grid">
                {stories.map(story => (
                  <div className="comic-card" key={story.maTruyen}>
                    <div className="comic-thumbnail">
                      <img src={story.anhDaiDien} alt={story.tenTruyen} />
                    </div>
                    
                    <div className="comic-info-2">
                      <Link to={`/read/${story.maTruyen}`} className="comic-title-link" style={{textDecoration: 'none', color: 'black'}}>
                        <h4 className="comic-title">{story.tenTruyen}</h4>
                      </Link>
                      <div className="comic-chapters-list">
                        {storyChapters[story.maTruyen]?.map((chapter, index) => (
                          <div key={index} className="chapter-item">
                            <span className="chapter-number">{chapter.tenChuong}</span>
                            <span className="chapter-time">{formatDate(chapter.ngayThem)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pagination-controls">
                <button 
                  className="pagination-arrow" 
                  onClick={prevPage} 
                  disabled={currentPage === 0}
                >
                  &larr;
                </button>
                
                {pageNumbers.map(number => (
                  <button 
                    key={number}
                    className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                    onClick={() => goToPage(number)}
                  >
                    {number + 1}
                  </button>
                ))}
                
                <button 
                  className="pagination-arrow" 
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  &rarr;
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MC_Second;