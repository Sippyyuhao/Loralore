import React from 'react';
import '../styles/pages.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero Section */}
        <div className="about-hero">
          <div className="hero-content">
            <h1 className="hero-title">关于影廊</h1>
            <p className="hero-subtitle">
              一个专为摄影师和摄影爱好者打造的作品展示平台
            </p>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=400&fit=crop" 
              alt="摄影师工作场景"
              className="hero-img"
            />
          </div>
        </div>

        {/* Mission Section */}
        <div className="about-section">
          <h2 className="section-title">我们的使命</h2>
          <div className="mission-grid">
            <div className="mission-item">
              <div className="mission-icon">
                <i className="fas fa-camera"></i>
              </div>
              <h3>展示精彩作品</h3>
              <p>为摄影师提供一个专业的平台，展示他们的创意和技艺</p>
            </div>
            <div className="mission-item">
              <div className="mission-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>连接摄影社区</h3>
              <p>建立一个活跃的摄影师社区，促进交流与学习</p>
            </div>
            <div className="mission-item">
              <div className="mission-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>激发创作灵感</h3>
              <p>通过优秀作品的展示，激发更多人的摄影创作热情</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="about-section">
          <h2 className="section-title">平台特色</h2>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-th-large"></i>
              </div>
              <div className="feature-content">
                <h3>瀑布流展示</h3>
                <p>采用瀑布流布局，完美展示不同尺寸的摄影作品，让每张照片都能得到最佳的展示效果。</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-search"></i>
              </div>
              <div className="feature-content">
                <h3>智能搜索</h3>
                <p>支持按标题、标签、摄影师等多维度搜索，快速找到您感兴趣的作品。</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-heart"></i>
              </div>
              <div className="feature-content">
                <h3>互动点赞</h3>
                <p>为喜欢的作品点赞，与摄影师互动，建立摄影社区的连接。</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="feature-content">
                <h3>详细信息</h3>
                <p>查看作品的拍摄参数、器材信息等详细数据，学习摄影技巧。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="about-section">
          <h2 className="section-title">技术栈</h2>
          <div className="tech-grid">
            <div className="tech-category">
              <h3>前端技术</h3>
              <div className="tech-items">
                <span className="tech-item">React 18</span>
                <span className="tech-item">TypeScript</span>
                <span className="tech-item">CSS3</span>
                <span className="tech-item">Vite</span>
              </div>
            </div>
            <div className="tech-category">
              <h3>状态管理</h3>
              <div className="tech-items">
                <span className="tech-item">Zustand</span>
                <span className="tech-item">React Hooks</span>
              </div>
            </div>
            <div className="tech-category">
              <h3>路由导航</h3>
              <div className="tech-items">
                <span className="tech-item">React Router</span>
              </div>
            </div>
            <div className="tech-category">
              <h3>设计系统</h3>
              <div className="tech-items">
                <span className="tech-item">CSS Variables</span>
                <span className="tech-item">Responsive Design</span>
                <span className="tech-item">Font Awesome</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="about-section">
          <h2 className="section-title">平台数据</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1,000+</div>
              <div className="stat-label">精彩作品</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">活跃摄影师</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">用户点赞</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">摄影分类</div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="about-section">
          <h2 className="section-title">联系我们</h2>
          <div className="contact-info">
            <p>如果您有任何问题或建议，欢迎与我们联系：</p>
            <div className="contact-methods">
              <a href="mailto:contact@yinglang.com" className="contact-method">
                <i className="fas fa-envelope"></i>
                contact@yinglang.com
              </a>
              <a href="#" className="contact-method">
                <i className="fab fa-github"></i>
                GitHub
              </a>
              <a href="#" className="contact-method">
                <i className="fab fa-twitter"></i>
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;