// 新粗野风格 JavaScript - LORALORE TEAM

document.addEventListener('DOMContentLoaded', function() {
    
    // 移动端导航菜单切换
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // 滚动时导航栏效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.nav-brutal');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 页面加载动画
    const animateElements = document.querySelectorAll('.team-member, .service-item, .visual-element');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = entry.target.style.transform.replace('translateY(50px)', 'translateY(0)');
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform += ' translateY(50px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
    
    // 鼠标跟随效果
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 创建自定义光标
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: #ff0040;
        border: 2px solid #000;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // 链接悬停效果
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = '#ffffff';
        });
        
        link.addEventListener('mouseleave', function() {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = '#ff0040';
        });
    });
    
    // 随机故障效果
    function glitchEffect() {
        const glitchElements = document.querySelectorAll('.about-title, .section-heading');
        
        glitchElements.forEach(element => {
            if (Math.random() < 0.1) { // 10% 概率触发故障效果
                element.style.textShadow = `
                    ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #ff0040,
                    ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #00ff40,
                    ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #0040ff
                `;
                
                setTimeout(() => {
                    element.style.textShadow = '';
                }, 100);
            }
        });
    }
    
    // 每5秒随机触发故障效果
    setInterval(glitchEffect, 5000);
    
    // 平滑滚动
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 按 'B' 键切换粗野模式（增强对比度）
        if (e.key.toLowerCase() === 'b') {
            document.body.classList.toggle('brutal-mode');
        }
        
        // 按 'G' 键触发全局故障效果
        if (e.key.toLowerCase() === 'g') {
            document.body.style.filter = 'hue-rotate(180deg) invert(1)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 200);
        }
    });
    
    // 添加粗野模式样式
    const brutalModeStyle = document.createElement('style');
    brutalModeStyle.textContent = `
        .brutal-mode {
            filter: contrast(150%) saturate(200%);
        }
        .brutal-mode * {
            text-shadow: 2px 2px 0 #ff0040 !important;
        }
    `;
    document.head.appendChild(brutalModeStyle);
    
    console.log('🔥 LORALORE TEAM - 新粗野风格已加载');
    console.log('💡 快捷键: B = 粗野模式, G = 故障效果');
});