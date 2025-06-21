import React, { useState, useRef, useEffect } from 'react';
import './StoryEditor.css';
import { Trash2, RefreshCw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const StoryEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const storyId = params?.id || params?.storyId; // Try both possible param names

  useEffect(() => {
    if (!storyId) {
      alert('Không tìm thấy ID truyện. Vui lòng quay lại trang danh sách.');
      navigate('/admin/stories');
      return;
    }
  }, [storyId, navigate]);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [storyData, setStoryData] = useState({
    title: '',
    author: '',
    status: 'Đã xuất bản',
    condition: 'Đang diễn ra',
    genres: [],
    description: '',
    currentImageUrl: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [chapters, setChapters] = useState([]);
  
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterZipFile, setNewChapterZipFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const fileInputRef = useRef(null);
  const chapterZipInputRef = useRef(null);

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


  const fetchChapters = async () => {
    if (!storyId) {
      console.warn("Story ID not available, cannot fetch chapters.");
      setChapters([]);
      return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Không có token xác thực. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}/chapters?sort=ngayThem,desc`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định khi tải danh sách chương' }));
        throw new Error(errorData.message || response.statusText);
      }

      const chaptersData = await response.json();
      const chaptersArray = Array.isArray(chaptersData) ? chaptersData : (chaptersData?.content || []);

      setChapters(chaptersArray.map(chapter => {
        return {
          id: chapter.chuongId || chapter.id || chapter.maChuong,
          name: chapter.tenChuong || chapter.name,
          ngayThem: chapter.ngayThem
        };
      }));
    } catch (error) {
      console.error('Error fetching chapters:', error);
      alert('Lỗi tải danh sách chương: ' + error.message);
      setChapters([]);
    }
  };

  useEffect(() => {
    // Fetch story details and chapters when storyId changes
    if (storyId) {
      fetchChapters();
      const fetchStoryDetails = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            alert('Không có token xác thực. Vui lòng đăng nhập lại.');
            return;
          }

          const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          
          if (!response.ok) throw new Error(`Failed to fetch story details: ${response.statusText}`);
          const data = await response.json();
          console.log('Story data:', data); // Debug log to see the response
          
          // Update storyData state with fetched data
          setStoryData(prevData => ({
            ...prevData,
            title: data.tenTruyen || data.name || '',
            author: data.tacGia || data.author || '',
            status: data.trangThai || 'Đã xuất bản',
            condition: data.tinhTrang || 'Đang diễn ra',
            genres: data.theLoai ? data.theLoai.map(g => ({
                id: g.id || g.maTheLoai,
                name: g.tenTheLoai || g.name
            })) : [],
            description: data.moTa || data.description || '',
          }));
        } catch (error) {
          console.error('Error fetching story details:', error);
          alert('Lỗi tải thông tin truyện: ' + error.message);
        }
      };
      fetchStoryDetails();
    }
  }, [storyId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoryData({
      ...storyData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size must be less than 3MB');
        e.target.value = null;
        setImageFile(null);
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPG and PNG files are allowed');
        e.target.value = null;
        setImageFile(null);
        return;
      }
      setImageFile(file);
      setStoryData({
        ...storyData,
        currentImageUrl: URL.createObjectURL(file)
      });
    } else {
      setImageFile(null);
      setStoryData(prevData => ({
        ...prevData,
        currentImageUrl: ''
      }));
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
  
  const handleNewChapterNameChange = (e) => {
    setNewChapterName(e.target.value);
  };

  const handleNewChapterZipFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
            alert('Chỉ chấp nhận file ZIP.');
            e.target.value = null; 
            setNewChapterZipFile(null);
            return;
        }
        setNewChapterZipFile(file);
    } else {
        setNewChapterZipFile(null);
    }
  };

  const handleAddChapter = async () => {
    if (!storyId || !newChapterName.trim() || !newChapterZipFile) {
      alert('Vui lòng nhập tên chương và chọn file ZIP.');
      return;
    }

    const chapterInfo = { tenChuong: newChapterName.trim() };

    const formData = new FormData();
    // Create a Blob with the JSON data for the chapter info
    const chapterInfoBlob = new Blob([JSON.stringify(chapterInfo)], {
      type: 'application/json'
    });
    formData.append('info', chapterInfoBlob); // Append the Blob
    formData.append('zipFile', newChapterZipFile);

    console.log(formData);
    // Get token from localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('Không có token xác thực. Vui lòng đăng nhập lại.');
        return;
    }

    try {
      const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}/chapters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
          // No need to set Content-Type for FormData
        },
        body: formData
      });
      console.log(response);

      if (!response.ok) {
        console.error('Failed to add chapter. Response status:', response.status);
        const errorBody = await response.text().catch(() => 'No response body');
        console.error('Failed to add chapter. Response body:', errorBody);
        
        let errorMessage = 'Lỗi không xác định khi thêm chương.';
        try {
            // Try to parse as JSON if it looks like JSON
            const errorJson = JSON.parse(errorBody);
            errorMessage = errorJson.message || JSON.stringify(errorJson);
        } catch (e) {
            // If not JSON, use the raw text or status
            errorMessage = errorBody.length > 0 && errorBody !== 'No response body' ? errorBody : `Lỗi từ server (Status: ${response.status})`;
        }
        
        throw new Error(`Failed to add chapter: ${errorMessage}`);
      }

      alert('Thêm chương thành công!');
      setNewChapterName('');
      setNewChapterZipFile(null);
      if(chapterZipInputRef.current) chapterZipInputRef.current.value = "";
      fetchChapters();
    } catch (error) {
      console.error('Error adding chapter:', error);
      alert('Lỗi thêm chương: ' + error.message);
    }
  };
  
  const handleDeleteChapter = async (chapterIdToDelete) => {
    if (!storyId || !chapterIdToDelete) {
      console.warn("Cannot delete chapter: Missing storyId or chapterIdToDelete", { storyId, chapterIdToDelete });
      return;
    }

    // Add confirmation dialog
    if (!window.confirm(`Bạn có chắc muốn xoá chương này (ID: ${chapterIdToDelete}) không?`)) {
      return; // Stop if user cancels
    }

    // Get token from localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('Không có token xác thực. Vui lòng đăng nhập lại.');
        return;
    }

    try {
      const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}/chapters/${chapterIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định khi xoá chương.' }));
        throw new Error(`Failed to delete chapter: ${errorData.message || response.statusText}`);
      }

      alert('Xoá chương thành công!');
      fetchChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      alert('Lỗi xoá chương: ' + error.message);
    }
  };
  
  const handleSaveChanges = async () => {
    if (!storyId) {
      alert("Không tìm thấy ID truyện để cập nhật.");
      return;
    }

    // Validate required fields
    if (!storyData.title.trim()) {
      alert("Vui lòng nhập tên truyện");
      return;
    }

    if (!storyData.author.trim()) {
      alert("Vui lòng nhập tác giả");
      return;
    }

    const storyInfo = {
      tenTruyen: storyData.title.trim(),
      tenTacGia: storyData.author.trim(),
      moTa: storyData.description.trim(),
      trangThai: storyData.status,
      tinhTrang: storyData.condition,
      theLoaiIds: storyData.genres.map(genre => genre.id)
    };

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Không có token xác thực. Vui lòng đăng nhập lại.');
      return;
    }

    const formData = new FormData();
    // Create a Blob with the JSON data and set its Content-Type
    const storyInfoBlob = new Blob([JSON.stringify(storyInfo)], {
      type: 'application/json'
    });
    formData.append('info', storyInfoBlob);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    // console.log(imageFile);
    console.log('Form data object:', formData);
    // Log FormData entries explicitly
    for (let pair of formData.entries()) {
        console.log(pair[0]+ ', '+ pair[1]);
    }

    try {
      const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
          // No need to set Content-Type for FormData
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định khi cập nhật truyện.' }));
        throw new Error(errorData.message || response.statusText);
      }

      const result = await response.json();
      console.log('Update response:', result);
      
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/admin/stories');
      }, 2000);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Lỗi lưu thay đổi: ' + error.message);
    }
  };
  
  const handleCancel = () => {
    navigate('/admin/stories');
  };
  
  const handleDeleteStory = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDeleteStory = async () => {
    if (!storyId) {
      alert("Không có ID truyện để xoá.");
      setShowDeleteConfirm(false);
      return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('Không có token xác thực. Vui lòng đăng nhập lại.');
        return;
    }

    try {
      const response = await fetch(`http://localhost:8080/webreadstory/storys/${storyId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định' }));
        throw new Error(`Không thể xoá truyện: ${errorData.message || response.statusText}`);
      }
      alert('Truyện đã được xoá thành công.');
      setShowDeleteConfirm(false);
      navigate('/admin/stories');
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Lỗi xoá truyện: ' + error.message);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="story-editor">
      {showSuccessMessage && (
        <div className="success-message">
          Thay đổi đã được lưu thành công
        </div>
      )}
      
      <h1 className="editor-title">Chỉnh sửa truyện {storyData.title && `- ${storyData.title}`}</h1>
      
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
            <div className="image-upload-container">
              <div className="image-preview">
                {storyData.currentImageUrl ? (
                  <img src={storyData.currentImageUrl} alt="Story cover" />
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
         
        <div className="chapter-section">
          <div className="chapter-header">
            <h2>Danh sách chương</h2>
            <button 
              onClick={fetchChapters} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
              title="Tải lại danh sách chương"
            >
              <RefreshCw size={18} /> Tải lại
            </button>
          </div>
          
          <div className='chapter-list'>
            <div className="chapter-list-container">
              <table className="chapter-table">
                <thead>
                  <tr>
                    <th>Tên chương</th>
                    <th>Ngày thêm</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.length > 0 ? chapters.map((chapter) => (
                    <tr key={chapter.id}>
                      <td>{chapter.name}</td>
                      <td>{chapter.ngayThem ? new Date(chapter.ngayThem).toLocaleDateString() : 'N/A'}</td>
                      <td className="chapter-action">
                        <button
                          type="button"
                          className="delete-chapter-btn"
                          onClick={() => handleDeleteChapter(chapter.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'center' }}>Chưa có chương nào hoặc đang tải...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className='div_1'>
              <div className="chapter-stats">
                <div className="chapter-stat half">
                  <label>Tổng số chương</label>
                  <input
                    type="number"
                    value={chapters.length} 
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="chapter-stat half">
                  <label>Chương cuối cập nhật</label>
                  <input
                    type="text"
                    value={chapters[0]?.ngayThem ? new Date(chapters[0].ngayThem).toLocaleDateString() : 'N/A'}
                    className="form-control"
                    disabled
                  />
                </div>
              </div>

              <div className="add-chapter-section">
                <h3>Thêm chương mới</h3>
                <div className="form-group">
                    <label htmlFor="newChapterName">Tên chương</label>
                    <input
                        type="text"
                        id="newChapterName"
                        name="newChapterName"
                        value={newChapterName}
                        onChange={handleNewChapterNameChange}
                        className="form-control"
                        placeholder="Ví dụ: Chương 1: Khởi đầu"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newChapterZipFile">File ZIP nội dung chương</label>
                    <input
                        type="file"
                        id="newChapterZipFile"
                        ref={chapterZipInputRef}
                        onChange={handleNewChapterZipFileChange}
                        accept=".zip,application/zip,application/x-zip-compressed"
                        className="form-control"
                    />
                    {newChapterZipFile && <p>Đã chọn file: {newChapterZipFile.name}</p>}
                </div>
                <button 
                  type="button"
                  className="update-chapters-btn"
                  onClick={handleAddChapter}
                  disabled={!newChapterName.trim() || !newChapterZipFile}
                >
                  Thêm chương này
                </button>
              </div>
            </div>
          </div>
        </div>
        

        <div className='div_2'>
          <div className="delete-story-container">
            
          </div>
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

export default StoryEditor;