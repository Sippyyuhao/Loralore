// 作品集页面 JavaScript - 学生个人网站

document.addEventListener('DOMContentLoaded', function() {
    
    // 作品筛选功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选作品项目
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category.includes(filter)) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // 技能统计动画
    const statFills = document.querySelectorAll('.stat-fill');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.getAttribute('data-width');
                fill.style.width = width;
            }
        });
    }, observerOptions);
    
    statFills.forEach(fill => {
        fill.style.width = '0%';
        fill.style.transition = 'width 2s ease-out';
        statsObserver.observe(fill);
    });
    
    // 作品项目悬停效果
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        
        item.addEventListener('mouseenter', function() {
            overlay.style.opacity = '1';
            this.style.transform = 'scale(1.02) rotate(0deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            overlay.style.opacity = '0';
            this.style.transform = 'scale(1) rotate(1deg)';
        });
    });
    
    // 页面加载动画
    const animateElements = document.querySelectorAll('.portfolio-item, .stat-card');
    
    const loadObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = entry.target.style.transform.replace('translateY(30px)', 'translateY(0)');
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform += ' translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        loadObserver.observe(element);
    });
    
    console.log('🎨 作品集页面已加载');
});

// 项目详情数据
const projectData = {
    project1: {
        title: '咖啡店品牌设计',
        icon: '☕',
        description: '为本地精品咖啡店"香醇时光"设计的完整品牌视觉识别系统，包括logo设计、色彩方案、字体选择、包装设计等。设计理念融合了现代简约与温暖舒适的元素，体现咖啡文化的精致与生活的美好。',
        type: '品牌视觉设计',
        time: '2024年3月',
        tools: 'Adobe Illustrator, Photoshop, InDesign',
        tags: ['品牌设计', '视觉识别', 'Logo设计', '包装设计']
    },
    project2: {
        title: '响应式网站设计',
        icon: '🌐',
        description: '为科技创业公司设计的现代化企业官网，采用响应式设计确保在各种设备上的完美展示。网站注重用户体验，通过清晰的信息架构和直观的导航设计，有效传达企业价值和产品优势。',
        type: '网页设计开发',
        time: '2024年2月',
        tools: 'Figma, HTML/CSS, JavaScript, React',
        tags: ['网页设计', '响应式', '前端开发', 'UX设计']
    },
    project3: {
        title: '学习管理App',
        icon: '📚',
        description: '专为大学生设计的学习管理移动应用，帮助学生更好地组织课程、管理作业和跟踪学习进度。界面设计简洁直观，功能布局合理，提供个性化的学习体验。',
        type: '移动应用设计',
        time: '2024年1月',
        tools: 'Sketch, Principle, Zeplin',
        tags: ['UI设计', '移动端', '用户体验', '原型设计']
    },
    project4: {
        title: '海报设计系列',
        icon: '🎪',
        description: '为城市音乐节设计的系列主题海报，运用大胆的色彩搭配和动感的排版设计，完美诠释音乐的节奏感和青春活力。每张海报都有独特的视觉风格，同时保持整体的统一性。',
        type: '平面设计',
        time: '2023年12月',
        tools: 'Adobe Photoshop, Illustrator',
        tags: ['平面设计', '海报', '视觉传达', '艺术设计']
    },
    project5: {
        title: '电商平台界面',
        icon: '🛍️',
        description: '为时尚电商平台设计的用户界面，注重购物流程的优化和用户体验的提升。通过精心设计的商品展示、购物车和结账流程，提高用户的购买转化率。',
        type: '电商界面设计',
        time: '2023年11月',
        tools: 'Figma, Adobe XD, Photoshop',
        tags: ['UX设计', '电商', '界面设计', '用户体验']
    },
    project6: {
        title: '音乐播放器App',
        icon: '🎵',
        description: '设计了一款沉浸式音乐播放器应用，界面简洁优雅，注重音乐播放时的视觉体验。通过动态的专辑封面展示和直观的播放控制，为用户创造愉悦的听音乐体验。',
        type: '移动应用设计',
        time: '2023年10月',
        tools: 'Sketch, After Effects, Principle',
        tags: ['界面设计', '音乐', '动效设计', '移动端']
    }
};

// 打开项目详情模态框
function openModal(projectId) {
    const modal = document.getElementById('projectModal');
    const project = projectData[projectId];
    
    if (project) {
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalIcon').textContent = project.icon;
        document.getElementById('modalDescription').textContent = project.description;
        document.getElementById('modalType').textContent = project.type;
        document.getElementById('modalTime').textContent = project.time;
        document.getElementById('modalTools').textContent = project.tools;
        
        // 添加标签
        const tagsContainer = document.getElementById('modalTags');
        tagsContainer.innerHTML = '';
        project.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // 添加打开动画
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// 点击模态框外部关闭
document.getElementById('projectModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});