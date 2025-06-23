// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏响应式菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('responsive');
        });
    }

    // 滚动效果
    window.addEventListener('scroll', function() {
        const header = document.querySelector('#header');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                if (nav.classList.contains('responsive')) {
                    nav.classList.remove('responsive');
                }
            }
        });
    });

    // 表单提交处理
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const formValues = {};
            
            formData.forEach((value, key) => {
                formValues[key] = value;
            });
            
            // 表单验证
            let isValid = true;
            let errorMessage = '';
            
            if (!formValues.name || formValues.name.trim() === '') {
                isValid = false;
                errorMessage = '请输入您的姓名';
            } else if (!formValues.email || !/^\S+@\S+\.\S+$/.test(formValues.email)) {
                isValid = false;
                errorMessage = '请输入有效的邮箱地址';
            } else if (!formValues.message || formValues.message.trim() === '') {
                isValid = false;
                errorMessage = '请输入留言内容';
            }
            
            if (!isValid) {
                alert(errorMessage);
                return;
            }
            
            // 模拟表单提交成功
            alert('感谢您的留言！我们会尽快回复您。');
            contactForm.reset();
        });
    }

    // 图片延迟加载
    const lazyImages = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.removeAttribute('data-src');
                    }
                    observer.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    } else {
        // 降级处理
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }

    // 添加简单动画效果
    const animateElements = document.querySelectorAll('.service-item, .product-item, .feature-box');
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // 项目卡片堆叠效果增强
    const serviceItems = document.querySelectorAll('.service-item');
    const projectDetailItems = document.querySelectorAll('.project-detail-item');
    
    // 为项目卡片添加鼠标移动视差效果
    serviceItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            this.style.transform = `translateY(-15px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            setTimeout(() => {
                this.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
            }, 100);
        });
        
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.1s ease';
            
            // 添加轻微弹起效果
            this.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(-20px)' },
                { transform: 'translateY(-15px)' }
            ], {
                duration: 300,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            });
        });
    });
    
    // 为项目详情添加入场动画
    function checkVisible() {
        projectDetailItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0);
            
            if (isVisible) {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }
    
    // 初始化项目详情样式
    projectDetailItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // 检查可见性
    checkVisible();
    window.addEventListener('scroll', checkVisible);

    // 3D旋转画廊实现
    initGallery();
    
    // 为项目详情添加动画效果
    const projectDetails = document.querySelectorAll('.project-detail-item');
    projectDetails.forEach(detail => {
        detail.style.opacity = '0';
        detail.style.transform = 'translateY(30px)';
        detail.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // 监听滚动，显示项目详情
    window.addEventListener('scroll', function() {
        projectDetails.forEach(detail => {
            const rect = detail.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
            
            if (isVisible) {
                detail.style.opacity = '1';
                detail.style.transform = 'translateY(0)';
            }
        });
    });
    
    // 初始触发一次滚动检测
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 500);

    // Team card download logic
    const downloadBtn = document.getElementById('download-team-card-btn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = 'images/Loralore with cmu.png';
            link.download = 'Loralore-with-CMU.png';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});

// 3D旋转画廊
function initGallery() {
    const galleryData = [
        {
            img: "./images/service1.jpg",
            title: "Apass密码管理",
            description: "安全便捷的账号密码管理微信小程序，具备密码生成、安全检测、自动备份等功能",
            tags: ["微信小程序", "安全", "工具类"],
            target: "#project-apass"
        },
        {
            img: "./images/service2.jpg",
            title: "Lovalovea情侣空间",
            description: "专为情侣打造的私密社交空间，记录美好瞬间，分享生活点滴，愿景：alove，不再alone",
            tags: ["Web应用", "Node.js", "社交类"],
            target: "#project-lovalovea"
        },
        {
            img: "./images/service3.jpg",
            title: "字符大师",
            description: "将普通图片转换为ASCII字符艺术的创意微信小程序，支持多种转换参数调整和样式自定义",
            tags: ["微信小程序", "创意类", "图像处理"],
            target: "#project-ascii-wx"
        },
        {
            img: "./images/service4.png",
            title: "ASCII艺术桌面版",
            description: "桌面端ASCII艺术转换工具，支持图片和视频处理，视频实时转换为字符动画",
            tags: ["桌面应用", "Qt", "多媒体"],
            target: "#project-ascii-qt"
        },
        {
            img: "./images/service5.jpg",
            title: "UDP交流互动软件",
            description: "基于UDP协议的网络交流平台，实现低延迟即时通讯、共享绘图画布等功能",
            tags: ["桌面应用", "C++", "网络通信"],
            target: "#project-julia"
        },
        {
            img: "./images/service6.jpg",
            title: "微积分计算器",
            description: "基于MATLAB开发的高级微积分计算工具，支持复杂函数求导、积分、图形可视化",
            tags: ["数学工具", "MATLAB", "教育类"],
            target: "#project-calculus"
        }
    ];

    // 创建画廊HTML结构
    const projectsSection = document.querySelector('#projects .container');
    
    // 移除旧的轮播
    const oldCarousel = projectsSection.querySelector('.carousel-container');
    if (oldCarousel) {
        oldCarousel.remove();
    }
    
    // 创建新的画廊容器
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-container';
    
    // 添加渐变边缘
    const leftGradient = document.createElement('div');
    leftGradient.className = 'gallery-gradient gallery-gradient-left';
    galleryContainer.appendChild(leftGradient);
    
    const rightGradient = document.createElement('div');
    rightGradient.className = 'gallery-gradient gallery-gradient-right';
    galleryContainer.appendChild(rightGradient);
    
    // 创建画廊内容
    const galleryContent = document.createElement('div');
    galleryContent.className = 'gallery-content';
    galleryContainer.appendChild(galleryContent);
    
    // 创建轨道
    const galleryTrack = document.createElement('div');
    galleryTrack.className = 'gallery-track';
    galleryTrack.id = 'gallery-track';
    galleryContent.appendChild(galleryTrack);
    
    // 添加卡片
    galleryData.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.index = index;
        galleryItem.dataset.target = item.target;
        
        // 添加图片
        const img = document.createElement('img');
        img.className = 'gallery-img';
        img.src = item.img;
        img.alt = item.title;
        galleryItem.appendChild(img);
        
        // 添加内容
        const content = document.createElement('div');
        content.className = 'gallery-item-content';
        
        const title = document.createElement('h3');
        title.textContent = item.title;
        content.appendChild(title);
        
        const desc = document.createElement('p');
        desc.textContent = item.description;
        content.appendChild(desc);
        
        // 添加标签
        const tagContainer = document.createElement('div');
        tagContainer.className = 'gallery-tags';
        
        item.tags.forEach(tagText => {
            const tag = document.createElement('span');
            tag.className = 'gallery-tag';
            tag.textContent = tagText;
            tagContainer.appendChild(tag);
        });
        
        content.appendChild(tagContainer);
        galleryItem.appendChild(content);
        galleryTrack.appendChild(galleryItem);
    });
    
    // 添加控制按钮
    const controls = document.createElement('div');
    controls.className = 'gallery-controls';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'gallery-btn';
    prevBtn.id = 'gallery-prev';
    prevBtn.innerHTML = '<i class="fa fa-angle-left"></i>';
    controls.appendChild(prevBtn);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'gallery-btn';
    nextBtn.id = 'gallery-next';
    nextBtn.innerHTML = '<i class="fa fa-angle-right"></i>';
    controls.appendChild(nextBtn);
    
    galleryContainer.appendChild(controls);
    
    // 添加拖拽条
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'gallery-slider-container';
    
    const sliderLabel = document.createElement('span');
    sliderLabel.className = 'gallery-slider-label';
    sliderLabel.textContent = '拖动滑块旋转画廊';
    sliderContainer.appendChild(sliderLabel);
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = galleryData.length - 1;
    slider.value = '0';
    slider.step = '0.01';
    slider.className = 'gallery-slider';
    slider.id = 'gallery-slider';
    sliderContainer.appendChild(slider);
    
    // 添加刻度标记
    const sliderTicks = document.createElement('div');
    sliderTicks.className = 'gallery-slider-ticks';
    
    // 为每个项目添加一个刻度
    galleryData.forEach((_, i) => {
        const tick = document.createElement('div');
        tick.className = 'gallery-slider-tick';
        if (i === 0) tick.classList.add('active');
        tick.dataset.index = i;
        sliderTicks.appendChild(tick);
    });
    
    sliderContainer.appendChild(sliderTicks);
    galleryContainer.appendChild(sliderContainer);
    
    // 添加分页指示器
    const pagination = document.createElement('div');
    pagination.className = 'gallery-pagination';
    pagination.id = 'gallery-pagination';
    
    galleryData.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'gallery-dot';
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        pagination.appendChild(dot);
    });
    
    galleryContainer.appendChild(pagination);
    
    // 添加旋转提示
    const rotationHint = document.createElement('div');
    rotationHint.className = 'rotation-hint';
    rotationHint.innerHTML = '<i class="fa fa-mouse-pointer"></i> 将鼠标移至左右两侧可旋转画廊';
    galleryContainer.appendChild(rotationHint);
    
    // 3秒后隐藏提示
    setTimeout(() => {
        rotationHint.style.opacity = '0';
        setTimeout(() => {
            rotationHint.style.display = 'none';
        }, 300);
    }, 5000);
    
    // 将画廊插入到DOM中
    const servicesContainer = projectsSection.querySelector('.services-container');
    projectsSection.insertBefore(galleryContainer, servicesContainer);
    
    // 初始化3D旋转效果
    initGallery3D();
}

function initGallery3D() {
    const galleryContainer = document.querySelector('.gallery-container');
    const track = document.getElementById('gallery-track');
    const items = track.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const slider = document.getElementById('gallery-slider');

    if (!track || items.length === 0) {
        console.error("3D画廊元素未找到。");
        return;
    }

    const totalItems = items.length;
    const anglePerItem = 360 / totalItems;
    const isMobile = window.innerWidth <= 768;
    const cylinderWidth = isMobile ? 1500 : 2300;
    const radius = cylinderWidth / (2 * Math.PI);
    
    let currentRotation = 0;
    let targetRotation = 0;
    let rotationVelocity = 0;

    let isDragging = false;
    let dragStartRotation = 0; // 用于计算拖拽结束时的速度
    let lastDragPosition = 0;
    let isHovering = false;
    let startPosition = 0;
    
    const autoRotateSpeed = -0.05; // 负值为向左旋转

    // 1. 初始化项目位置和交互
    items.forEach((item, index) => {
        const angle = index * anglePerItem;
        item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        item.addEventListener('click', (e) => {
            // isDragging 会在 dragEnd 后才变为 false，需要额外判断
            const movedDistance = Math.abs(getPositionX(e) - startPosition);
            if (isDragging && movedDistance > 5) {
                return;
            }

            // 1. 平滑旋转到点击的item
            const itemAngle = -index * anglePerItem;
            targetRotation = Math.round(currentRotation / 360) * 360 + itemAngle;
            rotationVelocity = 0; // 点击后停止惯性

            // 2. 滚动到对应的详情区域
            const targetId = item.dataset.target;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300); // 延迟滚动，让旋转动画先开始
            }
        });
    });

    // 2. 核心动画循环
    function animate() {
        // 自动旋转逻辑
        if (!isDragging && !isHovering) {
            targetRotation += autoRotateSpeed;
        }

        // 惯性逻辑
        if (rotationVelocity !== 0 && !isDragging) {
            targetRotation += rotationVelocity;
            rotationVelocity *= 0.95; // 阻尼系数
            if (Math.abs(rotationVelocity) < 0.001) {
                rotationVelocity = 0;
            }
        }
        
        // 缓动动画
        currentRotation += (targetRotation - currentRotation) * 0.08;

        // 应用变换
        track.style.transform = `translateZ(${-radius}px) rotateY(${currentRotation}deg)`;

        // 更新卡片状态
        updateItemsState();

        requestAnimationFrame(animate);
    }

    // 3. 更新项目状态（透明度、激活态）
    function updateItemsState() {
        let closestItemIndex = -1;
        let minAngleDiff = 360;

        items.forEach((item, index) => {
            const itemAngle = index * anglePerItem;
            // 将当前旋转角度标准化到 0-360 度范围
            const normalizedCurrentRotation = (currentRotation % 360 + 360) % 360;
            const diff = Math.abs(itemAngle - normalizedCurrentRotation);
            const angleDiff = Math.min(diff, 360 - diff);

            // 根据角度差计算透明度
            const opacity = Math.max(0.4, 1 - angleDiff / 90);
            item.style.opacity = opacity;

            // 找到最正对前方的项目
            if (angleDiff < minAngleDiff) {
                minAngleDiff = angleDiff;
                closestItemIndex = index;
            }
        });

        // 更新滑块和激活状态
        if (slider) {
            //  让滑块的值与旋转方向对应
            const sliderValue = (-currentRotation / 360 * totalItems);
            slider.value = sliderValue.toString();
        }
        items.forEach((item, index) => item.classList.toggle('active', index === closestItemIndex));
    }


    // 4. 事件处理
    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    }

    function dragStart(e) {
        e.preventDefault();
        isDragging = true;
        rotationVelocity = 0;
        startPosition = getPositionX(e);
        dragStartRotation = currentRotation;
        lastDragPosition = startPosition;
        track.style.cursor = 'grabbing';
    }

    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = getPositionX(e);
        const move = (currentPosition - startPosition);
        targetRotation = dragStartRotation + move * 0.25; // 调整拖拽灵敏度
        
        // 为了计算惯性速度
        rotationVelocity = (currentPosition - lastDragPosition) * 0.05;
        lastDragPosition = currentPosition;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
    }

    // 绑定事件监听器
    track.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('mouseleave', dragEnd); // 处理鼠标移出窗口的情况

    track.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('touchmove', dragMove, { passive: false });
    window.addEventListener('touchend', dragEnd);

    galleryContainer.addEventListener('mouseover', () => isHovering = true);
    galleryContainer.addEventListener('mouseout', () => isHovering = false);
    
    prevBtn.addEventListener('click', () => {
        targetRotation = Math.round(currentRotation / anglePerItem) * anglePerItem - anglePerItem;
        rotationVelocity = 0;
    });

    nextBtn.addEventListener('click', () => {
        targetRotation = Math.round(currentRotation / anglePerItem) * anglePerItem + anglePerItem;
        rotationVelocity = 0;
    });

    if (slider) {
        slider.min = -360;
        slider.max = 360;
        slider.step = 0.1;
        slider.addEventListener('input', () => {
            rotationVelocity = 0; // 使用滑块时禁用惯性
            isHovering = true; // 暂时禁用自动旋转
            const sliderValue = parseFloat(slider.value);
            targetRotation = -sliderValue * (360 / totalItems);
        });
         slider.addEventListener('mouseup', () => {
            isHovering = false;
        });
    }

    // 启动动画
    animate();
} 