import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavSearch.css';

function NavSearch() {
    const css = {
        display: 'grid',
        gridTemplateColumns: '1fr 930px 1fr',
        height: '50px',
        backgroundColor: '#FFE4E6',
    };
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            navigate(`/searchStory?keyword=${encodeURIComponent(searchTerm)}`);
        }
    };
    return (
        <>
            <div style={css}>
                <div className='search'>
                    <div className='search-input-container'>
                        <i className="fas fa-search"></i>
                        <input
                            type='text'
                            placeholder='Tìm kiếm'
                            value={searchTerm}
                            onChange={handleChange}
                            onFocus={(e) => e.target.classList.add('focused')}
                            onBlur={(e) => e.target.classList.remove('focused')}
                            onKeyDown={handleKeyDown}
                            className='search-input'
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default NavSearch;