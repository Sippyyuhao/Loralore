import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <i className="fas fa-camera"></i>
          <span>影廊</span>
        </Link>

        {/* Navigation */}
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <i className="fas fa-home"></i>
            发现
          </Link>
          <Link 
            to="/albums" 
            className={`nav-link ${location.pathname === '/albums' ? 'active' : ''}`}
          >
            <i className="fas fa-folder"></i>
            相册
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            <i className="fas fa-info-circle"></i>
            关于
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input 
              type="text" 
              placeholder="搜索精彩作品..." 
              className="search-input"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="user-actions">
          <button className="btn btn-ghost btn-sm">
            <i className="fas fa-upload"></i>
            上传
          </button>
          <button className="btn btn-ghost btn-sm">
            <i className="fas fa-bell"></i>
          </button>
          <div className="user-avatar">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
              alt="用户头像" 
              className="avatar-img"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;