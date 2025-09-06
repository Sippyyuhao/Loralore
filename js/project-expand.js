// 项目详情展开收回功能
class ProjectExpander {
    constructor() {
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupExpandButtons());
        } else {
            this.setupExpandButtons();
        }
    }

    setupExpandButtons() {
        const projectItems = document.querySelectorAll('.project-detail-item');
        
        projectItems.forEach((item, index) => {
            this.setupProjectItem(item, index);
        });
    }

    setupProjectItem(item, index) {
        const header = item.querySelector('.project-detail-header');
        const content = item.querySelector('.project-detail-content');
        
        if (!header || !content) return;

        // 创建展开按钮
        const expandBtn = document.createElement('button');
        expandBtn.className = 'project-expand-btn';
        expandBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
        expandBtn.setAttribute('aria-label', '展开项目详情');
        
        // 添加按钮到标题区域
        header.appendChild(expandBtn);
        
        // 初始状态：收起
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
        content.style.opacity = '0';
        
        // 添加收起状态的类
        item.classList.add('collapsed');
        
        // 点击事件
        expandBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleProject(item, content, expandBtn);
        });

        // 点击标题区域也可以展开（除了按钮）
        header.addEventListener('click', (e) => {
            if (e.target !== expandBtn && !expandBtn.contains(e.target)) {
                this.toggleProject(item, content, expandBtn);
            }
        });
    }

    toggleProject(item, content, expandBtn) {
        const isExpanded = item.classList.contains('expanded');
        
        if (isExpanded) {
            // 收起
            this.collapseProject(item, content, expandBtn);
        } else {
            // 展开
            this.expandProject(item, content, expandBtn);
        }
    }

    expandProject(item, content, expandBtn) {
        // 移除收起状态，添加展开状态
        item.classList.remove('collapsed');
        item.classList.add('expanded');
        
        // 计算内容的实际高度
        content.style.maxHeight = 'none';
        const actualHeight = content.scrollHeight;
        content.style.maxHeight = '0';
        
        // 强制重绘
        content.offsetHeight;
        
        // 展开动画
        content.style.maxHeight = actualHeight + 'px';
        content.style.opacity = '1';
        
        // 更新按钮图标
        const icon = expandBtn.querySelector('i');
        icon.className = 'fa fa-chevron-up';
        expandBtn.setAttribute('aria-label', '收起项目详情');
        
        // 动画完成后设置为auto，以适应内容变化
        setTimeout(() => {
            if (item.classList.contains('expanded')) {
                content.style.maxHeight = 'auto';
            }
        }, 300);
    }

    collapseProject(item, content, expandBtn) {
        // 先设置具体高度，然后收起
        const currentHeight = content.scrollHeight;
        content.style.maxHeight = currentHeight + 'px';
        
        // 强制重绘
        content.offsetHeight;
        
        // 收起动画
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        
        // 更新状态类
        item.classList.remove('expanded');
        item.classList.add('collapsed');
        
        // 更新按钮图标
        const icon = expandBtn.querySelector('i');
        icon.className = 'fa fa-chevron-down';
        expandBtn.setAttribute('aria-label', '展开项目详情');
    }

    // 展开所有项目
    expandAll() {
        const projectItems = document.querySelectorAll('.project-detail-item');
        projectItems.forEach(item => {
            const content = item.querySelector('.project-detail-content');
            const expandBtn = item.querySelector('.project-expand-btn');
            if (content && expandBtn && item.classList.contains('collapsed')) {
                this.expandProject(item, content, expandBtn);
            }
        });
    }

    // 收起所有项目
    collapseAll() {
        const projectItems = document.querySelectorAll('.project-detail-item');
        projectItems.forEach(item => {
            const content = item.querySelector('.project-detail-content');
            const expandBtn = item.querySelector('.project-expand-btn');
            if (content && expandBtn && item.classList.contains('expanded')) {
                this.collapseProject(item, content, expandBtn);
            }
        });
    }
}

// 初始化项目展开器
const projectExpander = new ProjectExpander();

// 导出到全局作用域，方便其他脚本调用
window.projectExpander = projectExpander;