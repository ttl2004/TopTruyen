import './MC_Third.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MC_Third() {
    const css = {
        backgroundColor: '#FFFFFF',
        gridColumn: '2 / 3',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: '60px repeat(7, 1fr)',
        gap: '30px',
        marginBottom: '90px'
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
                const response = await fetch(`http://localhost:8080/webreadstory/storys?page=${currentPage}&size=${storiesPerPage}`);
                
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
                <div className="div-5">
                    <h3>Top Truyện - Truyện tranh online »</h3>
                </div>

                <div className="div-6">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <div className="novels-grid">
                                {stories.map(story => (
                                    <div className="novel-card" key={story.maTruyen}>
                                        <div className="novel-thumbnail">
                                            <img src={story.anhDaiDien} alt={story.tenTruyen} />
                                        </div>

                                        <div className="novel-info-2">
                                            <Link to={`/read/${story.maTruyen}`} className="novel-title-link" style={{textDecoration: 'none', color: 'black'}}>
                                                <h4 className="novel-title">{story.tenTruyen}</h4>
                                            </Link>
                                            <div className="novel-chapters-list">
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

export default MC_Third;