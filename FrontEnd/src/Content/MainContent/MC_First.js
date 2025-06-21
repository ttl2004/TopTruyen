import './MC_First.css';
import { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

function MC_First() {
    const navigate = useNavigate();
    const css = {
        backgroundColor: '#FFFFFF',
        gridColumn: '2 / 3',
        gridRow: '1 / 2',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
    };

    const [topComics, setTopComics] = useState([]);
    const [currentTopIndex, setCurrentTopIndex] = useState(0);
    const [autoSlide, setAutoSlide] = useState(true);
    const timerRef = useRef(null);

    // Fetch random stories
    useEffect(() => {
        const fetchRandomStories = async () => {
            try {
                const response = await fetch('http://localhost:8080/webreadstory/storys/random8');
                const data = await response.json();
                setTopComics(data);
            } catch (error) {
                console.error('Error fetching random stories:', error);
            }
        };

        fetchRandomStories();
    }, []);

    // Handle story click
    const handleStoryClick = (maTruyen) => {
        navigate(`/read/${maTruyen}`);
    };

    // Xử lý autoSlide cho truyện đề cử
    useEffect(() => {
        if (autoSlide && topComics.length > 0) {
            timerRef.current = setInterval(() => {
                setCurrentTopIndex((prevIndex) => (prevIndex + 1) % (topComics.length - 3));
            }, 4000);
        }
        
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [autoSlide, topComics.length]);

    // Xử lý khi nhấn nút trước/sau cho truyện đề cử
    const handleTopPrev = () => {
        setAutoSlide(false);
        setCurrentTopIndex((prevIndex) => (prevIndex === 0 ? topComics.length - 4 : prevIndex - 1));
    };

    const handleTopNext = () => {
        setAutoSlide(false);
        setCurrentTopIndex((prevIndex) => (prevIndex + 1) % (topComics.length - 3));
    };

    // Hiển thị 4 truyện đề cử dựa trên currentTopIndex
    const displayTopComics = topComics.slice(currentTopIndex, currentTopIndex + 4);
    
    return (
        <>
            <div style={css}>
                <h1>Top Truyện đề cử »</h1>
                <div className="top-comics-slider">
                    <button className="slider-button prev" onClick={handleTopPrev}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div className="top-comics-container">
                        {displayTopComics.map((comic) => (
                            <div 
                                className="comic-card-featured" 
                                key={comic.maTruyen}
                                onClick={() => handleStoryClick(comic.maTruyen)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="comic-image">
                                    <img src={comic.anhDaiDien} alt={comic.tenTruyen} />
                                </div>
                                <div className="comic-info">
                                    <h3>{comic.tenTruyen}</h3>
                                    <div className="comic-chapter">
                                        <p>Số chapter: {comic.soChuong}</p>
                                        <p>{comic.tinhTrang}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="slider-button next" onClick={handleTopNext}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </>
    );
}

export default MC_First;