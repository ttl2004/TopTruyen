import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings, List, ZoomIn, ZoomOut, LayoutGrid, Maximize, Minimize } from 'lucide-react';
import './ReadStor.css';

const ReadStory = () => {
    // State cho các thiết lập đọc truyện tranh
    const { storyId } = useParams();
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const [zoomLevel, setZoomLevel] = useState(100);
    const [showSettings, setShowSettings] = useState(false);
    const [showTableOfContents, setShowTableOfContents] = useState(false);
    const [pageMode, setPageMode] = useState('vertical');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    
    // State cho dữ liệu truyện
    const [chapterData, setChapterData] = useState(null);
    const [chapterList, setChapterList] = useState([]);
    const [storyTitle, setStoryTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch story title
    useEffect(() => {
        const fetchStoryTitle = async () => {
            try {
                const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}`);
                if (!response.ok) throw new Error('Failed to fetch story data');
                const data = await response.json();
                setStoryTitle(data.tenTruyen || '');
            } catch (err) {
                setError(err.message);
            }
        };

        fetchStoryTitle();
    }, [storyId]);

    // Fetch chapter data
    useEffect(() => {
        const fetchChapterData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}/chapters/${chapterId}`);
                if (!response.ok) throw new Error('Failed to fetch chapter data');
                const data = await response.json();
                setChapterData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchChapterData();
    }, [storyId, chapterId]);

    // Fetch chapter list
    useEffect(() => {
        const fetchChapterList = async () => {
            try {
                const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}/chapters?sort=ngayThem,desc`);
                if (!response.ok) throw new Error('Failed to fetch chapter list');
                const data = await response.json();
                console.log('Chapter list response:', data); // Debug log
                
                // Kiểm tra và xử lý dữ liệu
                if (data && data.content) {
                    // Nếu API trả về dạng Page
                    setChapterList(data.content);
                } else if (Array.isArray(data)) {
                    // Nếu API trả về trực tiếp mảng
                    setChapterList(data);
                } else {
                    console.error('Unexpected chapter list format:', data);
                    setChapterList([]);
                }
            } catch (err) {
                console.error('Error fetching chapter list:', err);
                setError(err.message);
                setChapterList([]);
            }
        };

        fetchChapterList();
    }, [storyId]);

    // Xử lý zoom ảnh
    const handleZoomChange = (newZoom) => {
        if (newZoom >= 50 && newZoom <= 100) {
            setZoomLevel(newZoom);
        }
    };

    // Xử lý đổi trang
    const nextPage = () => {
        if (chapterData && currentPage < chapterData.noiDung.split(',').length - 1) {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 0);
        }
    };

    // Xử lý chuyển chương
    const navigateToChapter = (newChapterId) => {
        window.location.href = `/read/${storyId}/${newChapterId}`;
    };

    const getNextChapter = () => {
        if (!Array.isArray(chapterList) || chapterList.length === 0) return null;
        // Sắp xếp danh sách chương theo maChuong tăng dần
        const sortedChapters = [...chapterList].sort((a, b) => a.maChuong - b.maChuong);
        const currentIndex = sortedChapters.findIndex(chapter => chapter.maChuong === parseInt(chapterId));
        if (currentIndex < sortedChapters.length - 1) {
            return sortedChapters[currentIndex + 1].maChuong;
        }
        return null;
    };

    const getPrevChapter = () => {
        if (!Array.isArray(chapterList) || chapterList.length === 0) return null;
        // Sắp xếp danh sách chương theo maChuong tăng dần
        const sortedChapters = [...chapterList].sort((a, b) => a.maChuong - b.maChuong);
        const currentIndex = sortedChapters.findIndex(chapter => chapter.maChuong === parseInt(chapterId));
        if (currentIndex > 0) {
            return sortedChapters[currentIndex - 1].maChuong;
        }
        return null;
    };

    // Xử lý fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    // Xử lý phím tắt
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                nextPage();
            } else if (e.key === 'ArrowLeft') {
                prevPage();
            } else if (e.key === 'f') {
                toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPage]);

    // Xử lý change page mode
    const togglePageMode = () => {
        setPageMode(pageMode === 'vertical' ? 'single' : 'vertical');
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        navigate(`/read/${storyId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!chapterData) return <div>No chapter data available</div>;

    const pages = chapterData.noiDung.split(',');

    return (
        <div className="ReadStory1">
            {/* Header */}
            <div className="ReadStory2">
                <div className="ReadStory3">
                    <a href="#" className="ReadStory4" onClick={handleBackClick}>
                        <ChevronLeft size={24} />
                    </a>
                    <div>
                        <h1 className="ReadStory5">{storyTitle}</h1>
                        <div className="ReadStory6">
                            {chapterData?.tenChuong} 
                        </div>
                    </div>
                </div>
                
                <div className="ReadStory7">
                    <button 
                        className="ReadStory8"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <Settings size={20} />
                    </button>
                    <button 
                        className="ReadStory8"
                        onClick={() => setShowTableOfContents(!showTableOfContents)}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Table of Contents Sidebar */}
            {showTableOfContents && (
                <div className="ReadStory9">
                    <div className="ReadStory10">
                        <h3 className="ReadStory11">Mục lục</h3>
                        <button 
                            className="ReadStory12"
                            onClick={() => setShowTableOfContents(false)}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <div className="ReadStory13">
                        {chapterList && chapterList.length > 0 ? (
                            chapterList.map(chapter => (
                                <div 
                                    key={chapter.maChuong} 
                                    className={`ReadStory14 ${
                                        chapter.maChuong === parseInt(chapterId) 
                                            ? 'ReadStory15' 
                                            : ''
                                    }`}
                                    onClick={() => navigateToChapter(chapter.maChuong)}
                                >
                                    <span className="ReadStory16">Tên chương</span>
                                    <span className="ReadStory17">{chapter.tenChuong}</span>
                                </div>
                            ))
                        ) : (
                            <div className="ReadStory14">Không có dữ liệu chương</div>
                        )}
                    </div>
                </div>
            )}

            {/* Reading Settings Panel */}
            {showSettings && (
                <div className="ReadStory18">
                    <div className="ReadStory19">
                        <h3 className="ReadStory20">Cài đặt đọc</h3>
                        <button 
                            className="ReadStory21"
                            onClick={() => setShowSettings(false)}
                        >
                            &times;
                        </button>
                    </div>
                    
                    <div className="ReadStory22">
                        <h4 className="ReadStory23">Phóng to</h4>
                        <div className="ReadStory24">
                            <button 
                                className="ReadStory25"
                                onClick={() => handleZoomChange(zoomLevel - 10)}
                            >
                                <ZoomOut size={18} />
                            </button>
                            <span className="ReadStory26">{zoomLevel}%</span>
                            <button 
                                className="ReadStory25"
                                onClick={() => handleZoomChange(zoomLevel + 10)}
                            >
                                <ZoomIn size={18} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="ReadStory22">
                        <h4 className="ReadStory23">Chế độ đọc</h4>
                        <button 
                            className="ReadStory27"
                            onClick={togglePageMode}
                        >
                            <span>{pageMode === 'vertical' ? 'Cuộn dọc' : 'Từng trang'}</span>
                            <LayoutGrid size={18} />
                        </button>
                    </div>

                    <div>
                        <h4 className="ReadStory23">Toàn màn hình</h4>
                        <button 
                            className="ReadStory27"
                            onClick={toggleFullscreen}
                        >
                            <span>{isFullscreen ? 'Thoát toàn màn hình' : 'Chế độ toàn màn hình'}</span>
                            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Reading Area */}
            {pageMode === 'vertical' ? (
                <div className="ReadStory28">
                    <h2 className="ReadStory29">{chapterData.tenChuong}</h2>
                    {pages.map((page, index) => (
                        <div key={index} className="ReadStory30">
                            <img 
                                src={page}
                                alt={`Trang ${index + 1}`}
                                className="ReadStory31"
                                style={{ maxWidth: `${zoomLevel}%` }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="ReadStory32">
                    <h2 className="ReadStory29">{chapterData.tenChuong}</h2>
                    <div className="ReadStory33">
                        <img 
                            src={pages[currentPage]}
                            alt={`Trang ${currentPage + 1}`}
                            className="ReadStory31"
                            style={{ maxWidth: `${zoomLevel}%` }}
                        />
                        
                        <div className="ReadStory34">
                            {currentPage > 0 && (
                                <button 
                                    onClick={prevPage}
                                    className="ReadStory35"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            {currentPage < pages.length - 1 && (
                                <button 
                                    onClick={nextPage}
                                    className="ReadStory36"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>
                        
                        <div className="ReadStory37">
                            {currentPage + 1} / {pages.length}
                        </div>
                    </div>
                </div>
            )}

            {/* Chapter Navigation */}
            <div className="ReadStory38">
                {getPrevChapter() && (
                    <a 
                        href="#" 
                        className="ReadStory39"
                        onClick={(e) => {
                            e.preventDefault();
                            navigateToChapter(getPrevChapter());
                        }}
                    >
                        <ChevronLeft size={20} className="ReadStory40" />
                        Chương trước
                    </a>
                )}
                {getNextChapter() && (
                    <a 
                        href="#" 
                        className="ReadStory41"
                        onClick={(e) => {
                            e.preventDefault();
                            navigateToChapter(getNextChapter());
                        }}
                    >
                        Chương sau
                        <ChevronRight size={20} className="ReadStory42" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default ReadStory;