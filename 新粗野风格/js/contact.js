// 联系页面 JavaScript - 学生个人网站

document.addEventListener('DOMContentLoaded', function() {
    
    // 导入通用功能
    // 移动端导航菜单切换
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // 联系表单处理
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // 验证表单
            if (!data.name || !data.email || !data.message) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            // 模拟发送过程
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = '<span>发送中...</span><div class="btn-effect"></div>';
            
            setTimeout(() => {
                // 模拟成功发送
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                submitBtn.innerHTML = '<span>发送成功!</span><div class="btn-effect"></div>';
                
                showNotification('消息发送成功！我会尽快回复你。', 'success');
                contactForm.reset();
                
                // 重置按钮状态
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                    submitBtn.innerHTML = '<span>发送消息</span><div class="btn-effect"></div>';
                }, 3000);
                
            }, 2000);
        });
    }
    
    // FAQ 折叠功能
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('open');
            
            // 关闭所有其他FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.faq-toggle').textContent = '+';
                }
            });
            
            // 切换当前FAQ
            if (isOpen) {
                item.classList.remove('open');
                toggle.textContent = '+';
            } else {
                item.classList.add('open');
                toggle.textContent = '−';
            }
        });
    });
    
    // 状态指示器动画
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        setInterval(() => {
            statusDot.style.animation = 'none';
            setTimeout(() => {
                statusDot.style.animation = 'pulse 2s infinite';
            }, 10);
        }, 5000);
    }
    
    // 表单字段动画
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // 检查预填充的值
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // 社交链接悬停效果
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(-5deg) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
        });
    });
    
    // 通知系统
    function showNotification(message, type = 'info') {
        // 移除现有通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 创建新通知
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff40' : type === 'error' ? '#ff0040' : '#0040ff'};
            color: #000;
            padding: 15px 20px;
            border: 3px solid #000;
            font-weight: 700;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 关闭按钮
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // 自动关闭
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // 页面加载动画
    const animateElements = document.querySelectorAll('.method-card, .info-card, .faq-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = entry.target.style.transform.replace('translateY(30px)', 'translateY(0)');
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform += ' translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
    
    // 邮箱链接点击统计
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('邮箱链接被点击');
            // 这里可以添加统计代码
        });
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 按 'C' 键快速聚焦到联系表单
        if (e.key.toLowerCase() === 'c' && !e.ctrlKey) {
            const nameInput = document.getElementById('name');
            if (nameInput) {
                nameInput.focus();
                nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // 按 'Escape' 键关闭FAQ
        if (e.key === 'Escape') {
            faqItems.forEach(item => {
                item.classList.remove('open');
                item.querySelector('.faq-toggle').textContent = '+';
            });
        }
    });
    
    console.log('📞 联系页面已加载');
    console.log('💡 快捷键: C = 聚焦表单, Escape = 关闭FAQ');
});