import React from 'react';
import '../styles/pages.css';
import '../styles/albums-preview.css';

const Albums: React.FC = () => {
  return (
    <div className="albums-page">
      <div className="albums-container">
        <div className="albums-hero">
          <h1 className="albums-title">相册功能</h1>
          <p className="albums-subtitle">
            整理和分类您的摄影作品，创建专属相册集合
          </p>
          <div className="coming-soon">
            <i className="fas fa-rocket"></i>
            即将上线
          </div>
        </div>

        {/* Preview Features */}
        <div className="preview-features">
          <div className="preview-grid">
            <div className="preview-item">
              <div className="preview-icon">
                <i className="fas fa-folder-plus"></i>
              </div>
              <h3>创建相册</h3>
              <p>按主题、地点或时间创建不同的相册分类</p>
            </div>
            <div className="preview-item">
              <div className="preview-icon">
                <i className="fas fa-images"></i>
              </div>
              <h3>批量管理</h3>
              <p>一次性上传和管理多张照片，提高工作效率</p>
            </div>
            <div className="preview-item">
              <div className="preview-icon">
                <i className="fas fa-share-alt"></i>
              </div>
              <h3>分享相册</h3>
              <p>与朋友和同事分享您的摄影作品集合</p>
            </div>
            <div className="preview-item">
              <div className="preview-icon">
                <i className="fas fa-lock"></i>
              </div>
              <h3>隐私控制</h3>
              <p>设置相册的公开或私密状态，保护您的作品</p>
            </div>
          </div>
        </div>

        {/* Mockup Preview */}
        <div className="mockup-section">
          <h2 className="section-title">功能预览</h2>
          <div className="mockup-container">
            <div className="mockup-image">
              <img 
                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=500&fit=crop" 
                alt="相册功能预览"
                className="mockup-img"
              />
              <div className="mockup-overlay">
                <div className="mockup-content">
                  <h3>智能相册管理</h3>
                  <p>即将为您带来更强大的相册功能</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Albums;