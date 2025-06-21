import './NavMenu.css';
import Reacr, {useState} from 'react';
import { Link } from 'react-router-dom';
function NavMenu() {
    const css ={
        display: 'grid',
        gridTemplateColumns: '1fr 930px 1fr',
        height: '60px',
        backgroundColor: '#FB7185',
    };

    const [isOpen, setIsOpen] = useState(false);

    // Danh sach the loai
    const genres = [
        "Tất cả", "Anime", "Cổ đại", "Manga", "Manhwa", "Thể thao", "Truyện màu", "Tu tiên",
        "Chuyển sinh", "Đô thị", "Manhua", "Ngôn tình", "Thiếu nhi", "Trinh thám", "Xuyên không"
    ];

    // Chia danh sach the loai thanh 2 cot
    const midIndex = Math.ceil(genres.length / 2);
    const column1 = genres.slice(0, midIndex);
    const column2 = genres.slice(midIndex);

    return (
        <>
            <div style={css}> 
                <div className="nav-menu">
                    <ul className='nav-menu-ul'>
                        <li><a href="/">Trang chủ</a></li>
                        <li><Link to='/followStory'>Theo dõi</Link></li>
                        <li>
                            <Link to='/history'>Lịch sử</Link>
                        </li>
                        
                        {/* <li className='dropdown'
                            onMouseEnter={() => setIsOpen(true)}
                            onMouseLeave={() => setIsOpen(false)}
                        >
                            <button className='dropbtn'>Thể loại</button>
                            {isOpen && (
                                <div className="dropdown-content">
                                    <div className="column">
                                        {column1.map((genre, i) => (
                                            <a key={i} href="/">{genre}</a>
                                        ))}
                                    </div>
                                    <div className="column">
                                        {column2.map((genre, i) => (
                                            <a key={i} href="/">{genre}</a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li> */}
                        <li><Link to='/SearchStory'>Tìm truyện</Link></li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default NavMenu;