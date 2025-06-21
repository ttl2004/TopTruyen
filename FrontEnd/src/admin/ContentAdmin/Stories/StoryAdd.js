import React, { useState, useRef, useEffect } from 'react';
import './StoryAdd.css';
import {Trash2} from 'lucide-react';

const StoryAdd = ({onCancel }) => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    // Danh sách thể loại từ API
    const [categories, setCategories] = useState([]);
    // Khởi tạo state với dữ liệu truyện được cung cấp hoặc mặc định
    const [storyData, setStoryData] = useState({
        title:'',
        author: '',
        status: 'Đã xuất bản',
        condition: 'Đang diễn ra',
        genres:  [], // [{id, name}]
        description: '',
        imageFile: null,
    });
    // Các chương mới sẽ được thêm
    const [newChapters, setNewChapters] = useState([]);
    // Thể loại được chọn để xóa
    const [selectedGenre, setSelectedGenre] = useState(null);
    // Tham chiếu đầu vào file
    const fileInputRef = useRef(null);
    const chapterInputRef = useRef(null);

    // Lấy danh sách thể loại từ API khi mở form
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const res = await fetch('http://localhost:8080/webreadstory/categorys', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error('Không lấy được thể loại');
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : (data.content || []));
            } catch (err) {
                console.error("Error fetching categories:", err);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    // Xử lý thay đổi trường biểu mẫu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStoryData({
            ...storyData,
            [name]: value
        });
    };

    // Xử lý chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                alert('Kích thước file phải nhỏ hơn 3MB');
                return;
            }
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                alert('Chỉ cho phép file JPG và PNG');
                return;
            }
            setStoryData({
                ...storyData,
                imageFile: file
            });
        }
    };

    // Xử lý chọn thể loại (theo id)
    const handleGenreSelect = () => {
        const select = document.getElementById('genreSelect');
        const selectedId = select.value;
        
        if (!selectedId) return;
        
        const selectedObj = categories.find(c => String(c.maTheLoai) === selectedId);
        
        if (!selectedObj) return;
        
        // Check if genre already exists in the list
        if (!storyData.genres.some(g => String(g.id) === String(selectedObj.maTheLoai))) {
            const newGenres = [
                ...storyData.genres, 
                { 
                    id: selectedObj.maTheLoai, 
                    name: selectedObj.tenTheLoai 
                }
            ];
            
            setStoryData({
                ...storyData,
                genres: newGenres
            });
        }
    };

    // Xử lý click thể loại (để chọn)
    const handleGenreClick = (genre) => {
        setSelectedGenre(genre === selectedGenre ? null : genre);
    };

    // Delete selected genre
    const handleDeleteGenre = () => {
        if (selectedGenre) {
            setStoryData({
                ...storyData,
                genres: storyData.genres.filter(g => g.id !== selectedGenre.id)
            });
            setSelectedGenre(null);
        } else {
            setStoryData({
                ...storyData,
                genres: []
            });
        }
    };

    // Lưu thay đổi (gửi API thêm truyện)
    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const formData = new FormData();
            
            // Tạo object info
            const info = {
                tenTruyen: storyData.title,
                tenTacGia: storyData.author,
                trangThai: storyData.status,
                tinhTrang: storyData.condition,
                moTa: storyData.description,
                theLoaiIds: storyData.genres.map(g => g.id)
            };
            console.log("Info object gửi đi:", info);
            formData.append('info', new Blob([JSON.stringify(info)], { type: 'application/json' }));
            
            if (storyData.imageFile) {
                formData.append('image', storyData.imageFile);
            }
            
            const res = await fetch('http://localhost:8080/webreadstory/storys', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (!res.ok) throw new Error('Thêm truyện thất bại');
            
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            setTimeout(() => onCancel(), 5000);
        } catch (err) {
            alert('Có lỗi khi thêm truyện: ' + err.message);
        }
    };

    // Xử lý hủy/bỏ
    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="story-editor">
            {showSuccessMessage && (
                <div className="success-message">
                    Thay đổi đã được lưu thành công
                </div>
            )}
            <h1 className="editor-title">Thêm truyện</h1>
            <div className="editor-form">
                <div className="form-group">
                    <label htmlFor="title">Tên truyện</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={storyData.title}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-row-first">
                    <div className="form-group half">
                        <label htmlFor="author">Tác giả</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={storyData.author}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Trạng thái</label>
                        <select
                            id="status"
                            name="status"
                            value={storyData.status}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="Đã xuất bản">Đã xuất bản</option>
                            <option value="Bản nháp">Bản nháp</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="condition">Tình trạng</label>
                        <select
                            id="condition"
                            name="condition"
                            value={storyData.condition}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="Đang diễn ra">Đang diễn ra</option>
                            <option value="Đã hoàn thành">Đã hoàn thành</option>
                        </select>
                    </div>
                </div>
                <div className="form-row-third">
                    <div className="form-group half">
                        <label htmlFor="genre">Thể loại</label>
                        <div className="genre-container">
                        <div className="genre-list">
                            {storyData.genres.map((genre, index) => (
                            <span 
                                key={index} 
                                className={`genre-tag ${selectedGenre === genre ? 'selected' : ''}`}
                                onClick={() => handleGenreClick(genre)}
                            >
                                {genre.name}
                            </span>
                            ))}
                        </div>
                        <div className="genre-actions">
                            <select 
                            id="genreSelect" 
                            className="form-control genre-select"
                            defaultValue=""
                            >
                            <option value="" disabled>Chọn thể loại</option>
                            {categories.map((genre, index) => (
                                <option key={index} value={genre.maTheLoai}>
                                    {genre.tenTheLoai}
                                </option>
                            ))}
                            </select>
                            <button 
                            type="button" 
                            className="add-genre-btn"
                            onClick={handleGenreSelect}
                            >
                            Thêm thể loại
                            </button>
                            <button 
                            type="button" 
                            className="delete-genre-btn"
                            onClick={handleDeleteGenre}
                            >
                            Xoá thể loại
                            </button>
                        </div>
                        </div>
                    </div>
                    <div className="form-group half">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            id="description"
                            name="description"
                            value={storyData.description}
                            onChange={handleChange}
                            className="form-control"
                            rows="5"
                        ></textarea>
                    </div>
                </div>
                <div className="form-row-second">
                    <div className="form-row">
                        <div className="image-upload-container" style={{ height: '100%' }}>
                            <div className="image-preview" style={{ height: '93%' }}>
                                {storyData.imageFile ? (
                                    <img src={URL.createObjectURL(storyData.imageFile)} alt="Story cover" />
                                ) : (
                                    <div className="empty-preview">No image selected</div>
                                )}
                            </div>
                            <div className="image-upload-controls">
                                <button 
                                    type="button" 
                                    className="upload-image-btn"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Chọn ảnh truyện
                                </button>
                                <div className="file-info">
                                    File ảnh:
                                    <br />
                                    jpg, png &lt;= 3MB
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept=".jpg,.jpeg,.png"
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='half' style={{display: 'flex', justifyContent: 'end'}}>
                    <div className="form-actions">
                        <button 
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            Huỷ
                        </button>
                        <button 
                            type="button"
                            className="save-btn"
                            onClick={handleSaveChanges}
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryAdd;