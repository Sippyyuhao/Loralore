import React from 'react';
import type { SearchBarProps } from '../../types';
import './SearchBar.css';

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onUpload
}) => {
  return (
    <div className="search-toolbar">
      <div className="search-section">
        <div className="search-input-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="搜索精彩作品、摄影师或标签..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      <div className="filter-section">
        <div className="sort-dropdown">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="sort-select"
          >
            <option value="latest">最新发布</option>
            <option value="oldest">最早发布</option>
            <option value="liked">最多点赞</option>
          </select>
        </div>

        <div className="view-options">
          <button className="view-btn active">
            <i className="fas fa-th"></i>
          </button>
          <button className="view-btn">
            <i className="fas fa-list"></i>
          </button>
        </div>

        <button className="btn btn-primary upload-btn" onClick={onUpload}>
          <i className="fas fa-plus"></i>
          <span>上传作品</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;