import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Trash2, Search, RotateCcw } from 'lucide-react';
import './StoriesAdmin.css';
import { useNavigate } from 'react-router-dom';
import StoryEditor from './Stories/StoryEditor';
import StoryAdd from './Stories/StoryAdd';

const StoriesAdmin = () => {
  const navigate = useNavigate();
  // State for showing the editor
  const [showEditor, setShowEditor] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showAddStory, setShowAddStory] = useState(false);

  // API states
  const [stories, setStories] = useState([]);
  const [totalStories, setTotalStories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-based pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
  const storiesPerPage = 10;
  const [totalViews, setTotalViews] = useState(0);

  // Stats
  const stats = [
    { label: 'Tổng số truyện', value: totalStories, percent: '12%', compared: 'so với tháng trước' },
    { label: 'Tổng lượt đọc', value: totalViews, percent: '5%', compared: 'so với tháng trước' }
    // { label: 'Số truyện tranh', value: 70, percent: '1%', compared: 'so với tháng trước' },
    // { label: 'Số truyện cập nhật hôm nay', value: 20, percent: '2%', compared: 'so với hôm qua' },
  ];

  // Fetch stories with pagination
  const fetchStories = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const url = `http://localhost:8080/webreadstory/storys?page=${page}&size=${storiesPerPage}`;

      console.log('Fetching stories URL:', url);
      console.log('Token:', token);

      const response = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.content) {
        console.error('No content in response:', data);
        return;
      }

      const storiesData = data.content;
      console.log('Stories data:', storiesData);
      
      setTotalStories(data.totalElements);
      setStories(storiesData);
      // Tính tổng lượt đọc
      const total = storiesData.reduce((sum, story) => sum + (story.luotDoc || 0), 0);
      setTotalViews(total);

    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    console.log('Initial fetch triggered');
    fetchStories(currentPage);
  }, [currentPage]);

  // Delete story function
  const handleDeleteStory = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa truyện này không?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/webreadstory/storys/${id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Reload stories after successful deletion
        fetchStories(currentPage);
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  // Handler for edit button click
  const handleEditStory = (story) => {
    setSelectedStory(story);
    navigate(`/admin/stories/${story.maTruyen}`);
  };

  // Handler for returning from editor
  const handleEditorReturn = () => {
    setShowEditor(false);
    setSelectedStory(null);
  };

  // Handler for add button click
  const handleAddStory = () => {
    setShowAddStory(true);
  };

  // Handler for returning from add story
  const handleAddStoryReturn = () => {
    setShowAddStory(false);
  };

  // If editor is shown, render the StoryEditor component
  if (showEditor) {
    return <StoryEditor story={selectedStory} onReturn={handleEditorReturn} />;
  }

  // If add story form is shown, render the StoryAdd component
  if (showAddStory) {
    return <StoryAdd onCancel={handleAddStoryReturn} />;
  }

  return (
    <div className="story-management">
      {/* Stats Cards */}
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className='stat-info'>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-comparison">
                <span className="up-arrow">↑</span> {stat.percent} {stat.compared}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="controls-container">
        <div className="search-container">
          <div className='search-items'>
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm truyện"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>Tất cả trạng thái</option>
          <option>Đã xuất bản</option>
          <option>Bản nháp</option>
        </select>
        
        <button className="add-button" onClick={handleAddStory}>
          Thêm truyện mới
        </button>
        <button 
          className="reload-button" 
          style={{marginLeft: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px', height: 50, background: '#FFE4E6', border: 'none', cursor: 'pointer'}} 
          onClick={() => fetchStories(currentPage)}
          title="Tải lại danh sách truyện"
        >
          <RotateCcw size={22} />
        </button>
      </div>

      {/* Recent Stories Section */}
      <div className="table-header">
        <h2 className="table-title">Truyện mới thêm gần đây</h2>
      </div>

      <div style={{backgroundColor: 'var(--color_3', borderBottomLeftRadius: '10px',borderBottomRightRadius: '10px'}}>
        {/* Stories Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-message">Đang tải...</div>
          ) : stories.length === 0 ? (
            <div className="empty-message">Không có truyện nào.</div>
          ) : (
            <table className="stories-table">
              <thead>
                <tr>
                  <th>Tên truyện</th>
                  <th>Tác giả</th>
                  <th>Tình trạng</th>
                  <th>Số chapter</th>
                  <th>Lượt đọc</th>
                  <th>Ngày cập nhật</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr key={story.maTruyen}>
                    <td className="story-title">{story.tenTruyen}</td>
                    <td>{story.tenTacGia || 'Chưa cập nhật'}</td>
                    <td>{story.tinhTrang}</td>
                    <td>{story.soChuong}</td>
                    <td>{story.luotDoc}</td>
                    <td>{new Date(story.ngayCapNhat).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`status-badge ${story.trangThai === 'Đã xuất bản' ? 'published' : 'draft'}`}>
                        {story.trangThai}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <button 
                          className="edit-button"
                          onClick={() => handleEditStory(story)}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteStory(story.maTruyen)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && stories.length > 0 && (
          <div className="pagination">
            <div className="pagination-controls">
              <button 
                className="pagination-btn prev" 
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft size={16} />
              </button>
              
              <button 
                className="pagination-btn next" 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={stories.length < storiesPerPage}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesAdmin;