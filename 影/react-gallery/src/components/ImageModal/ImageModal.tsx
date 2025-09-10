import React, { useEffect } from 'react';
import { useGalleryStore } from '../../store/useGalleryStore';
import type { Image } from '../../types';
import './ImageModal.css';

const ImageModal: React.FC = () => {
  const { selectedImage, setSelectedImage, toggleLike } = useGalleryStore();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, setSelectedImage]);

  if (!selectedImage) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedImage(null);
    }
  };

  const handleLike = () => {
    toggleLike(selectedImage.id);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = selectedImage.src;
    link.download = `${selectedImage.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedImage.title,
          text: selectedImage.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('分享失败:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  return (
    <div className={`modal-overlay ${selectedImage ? 'visible' : ''}`} onClick={handleOverlayClick}>
      <div className="image-modal">
        {/* Close Button */}
        <button 
          className="modal-close-btn"
          onClick={() => setSelectedImage(null)}
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Main Content */}
        <div className="modal-content-wrapper">
          {/* Image Section */}
          <div className="modal-image-section">
            <div className="image-wrapper">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="modal-image"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="modal-info-section">
            {/* Header */}
            <div className="modal-header">
              <div className="photographer-profile">
                <img 
                  src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face&random=${selectedImage.id}`}
                  alt={selectedImage.photographer}
                  className="profile-avatar"
                />
                <div className="profile-info">
                  <h3 className="photographer-name">{selectedImage.photographer}</h3>
                  <p className="upload-date">
                    {selectedImage.uploadDate.toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <button className="btn btn-primary btn-sm">
                <i className="fas fa-plus"></i>
                关注
              </button>
            </div>

            {/* Title and Description */}
            <div className="modal-body">
              <h1 className="image-title">{selectedImage.title}</h1>
              <p className="image-description">{selectedImage.description}</p>

              {/* Tags */}
              <div className="tags-section">
                <h4>标签</h4>
                <div className="tags-list">
                  {selectedImage.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* EXIF Data */}
              <div className="exif-section">
                <h4>拍摄信息</h4>
                <div className="exif-grid">
                  <div className="exif-item">
                    <span className="exif-label">相机</span>
                    <span className="exif-value">{selectedImage.camera}</span>
                  </div>
                  <div className="exif-item">
                    <span className="exif-label">镜头</span>
                    <span className="exif-value">{selectedImage.lens}</span>
                  </div>
                  <div className="exif-item">
                    <span className="exif-label">参数</span>
                    <span className="exif-value">{selectedImage.settings}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-section">
                <div className="stat-item">
                  <i className="fas fa-heart"></i>
                  <span>{selectedImage.likes} 点赞</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-eye"></i>
                  <span>{Math.floor(selectedImage.likes * 3.5)} 浏览</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-comment"></i>
                  <span>{Math.floor(selectedImage.likes * 0.1)} 评论</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button 
                className={`action-btn like-btn ${selectedImage.isLiked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                <i className={`${selectedImage.isLiked ? 'fas' : 'far'} fa-heart`}></i>
                {selectedImage.isLiked ? '已点赞' : '点赞'}
              </button>
              
              <button className="action-btn" onClick={handleDownload}>
                <i className="fas fa-download"></i>
                下载
              </button>
              
              <button className="action-btn" onClick={handleShare}>
                <i className="fas fa-share"></i>
                分享
              </button>
              
              <button className="action-btn">
                <i className="fas fa-bookmark"></i>
                收藏
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;