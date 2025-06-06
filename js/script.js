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
            
            // FormSpree提交
            const formSubmitURL = "https://formspree.io/f/mjkrvkve"; // FormSpree表单ID
            
            // 表单提交中状态
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = '提交中...';
            
            fetch(formSubmitURL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('网络响应失败');
            })
            .then(data => {
                // 提交成功
                contactForm.reset();
                
                // 重定向到感谢页面
                window.location.href = './thanks.html';
            })
            .catch(error => {
                // 处理错误
                console.error('提交错误:', error);
                alert('抱歉，表单提交失败，请稍后再试或通过其他方式联系我们。');
            })
            .finally(() => {
                // 恢复按钮状态
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
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
    const track = document.getElementById('gallery-track');
    const items = track.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const dots = document.querySelectorAll('.gallery-dot');
    const galleryContent = document.querySelector('.gallery-content');
    const slider = document.getElementById('gallery-slider');
    const sliderTicks = document.querySelectorAll('.gallery-slider-tick');
    
    let currentIndex = 0;
    const totalItems = items.length;
    
    // 计算圆柱体半径 - 增加半径让卡片之间间距更大
    const isMobile = window.innerWidth <= 768;
    const cylinderWidth = isMobile ? 1500 : 2200;
    let radius = cylinderWidth / (2 * Math.PI);
    
    // 自动旋转相关变量
    let autoRotate = false;
    let rotateDirection = 0; // -1左旋转，0停止，1右旋转
    let autoRotateSpeed = 0.25; // 进一步减慢旋转速度
    
    // 拖拽相关变量
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let currentRotation = 0;
    let targetRotation = 0;
    let lastDragTime = 0;
    let dragVelocity = 0;
    
    // 滑块拖拽相关
    let isDraggingSlider = false;
    
    // 自动播放
    let autoplayInterval;
    const autoplayEnabled = true;
    const autoplayDelay = 3000;
    
    // 更新画廊位置
    function updateGalleryPosition(animate = true) {
        const anglePerItem = 360 / totalItems;
        
        // 计算当前旋转角度
        const rotationAngle = currentRotation;
        
        if (animate) {
            track.style.transition = 'transform 0.5s ease';
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translateZ(${-radius}px) rotateY(${rotationAngle}deg)`;
        
        // 更新活跃项和当前索引
        let activeIndex = 0;
        
        items.forEach((item, index) => {
            const itemAngle = index * anglePerItem;
            const offsetAngle = ((itemAngle + rotationAngle) % 360 + 360) % 360;
            const isActive = offsetAngle < 30 || offsetAngle > 330;
            
            if (isActive) {
                item.classList.add('active');
                // 更新当前索引
                activeIndex = index;
                
                // 更新分页指示器
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === activeIndex);
                });
                
                // 更新滑块刻度标记
                if (sliderTicks && sliderTicks.length) {
                    sliderTicks.forEach((tick, i) => {
                        tick.classList.toggle('active', i === activeIndex);
                    });
                }
            } else {
                item.classList.remove('active');
            }
            
            // 定位每个项目在圆柱体上
            item.style.transform = `rotateY(${itemAngle}deg) translateZ(${radius}px)`;
            
            // 计算每个卡片的可见性（根据旋转角度）
            const visibilityAngle = Math.abs(offsetAngle - 180);
            const opacity = visibilityAngle > 90 ? 1 - (180 - visibilityAngle) / 90 * 0.4 : 0.6;
            item.style.opacity = opacity;
        });
        
        currentIndex = activeIndex;
        
        // 更新滑块位置（避免循环更新）
        if (!isDraggingSlider && slider) {
            const normalizedRotation = ((rotationAngle % 360) + 360) % 360;
            const sliderValue = (normalizedRotation / anglePerItem) % totalItems;
            
            // 反向计算滑块位置
            const invertedValue = (totalItems - sliderValue) % totalItems;
            slider.value = invertedValue.toString();
        }
    }
    
    // 初始化项目位置
    function initItemPositions() {
        const anglePerItem = 360 / totalItems;
        
        items.forEach((item, index) => {
            // 设置在圆柱体表面的位置
            const angle = index * anglePerItem;
            item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });
        
        // 初始设置活跃项
        updateGalleryPosition(false);
    }
    
    // 下一张
    function nextSlide() {
        const anglePerItem = 360 / totalItems;
        currentRotation += anglePerItem;
        targetRotation = currentRotation;
        updateGalleryPosition();
    }
    
    // 上一张
    function prevSlide() {
        const anglePerItem = 360 / totalItems;
        currentRotation -= anglePerItem;
        targetRotation = currentRotation;
        updateGalleryPosition();
    }
    
    // 绑定按钮事件
    prevBtn.addEventListener('click', function() {
        prevSlide();
        resetAutoplay();
    });
    
    nextBtn.addEventListener('click', function() {
        nextSlide();
        resetAutoplay();
    });
    
    // 点击分页指示器
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            const targetIndex = parseInt(dot.dataset.index);
            const anglePerItem = 360 / totalItems;
            const currentAnglePos = currentRotation % 360;
            const targetAnglePos = targetIndex * anglePerItem;
            const diff = (targetAnglePos - currentAnglePos + 540) % 360 - 180;
            
            currentRotation += diff;
            targetRotation = currentRotation;
            updateGalleryPosition();
            resetAutoplay();
        });
    });
    
    // 点击刻度标记
    if (sliderTicks && sliderTicks.length) {
        sliderTicks.forEach((tick, index) => {
            tick.addEventListener('click', function() {
                const targetIndex = parseInt(tick.dataset.index);
                const anglePerItem = 360 / totalItems;
                const currentAnglePos = currentRotation % 360;
                const targetAnglePos = targetIndex * anglePerItem;
                const diff = (targetAnglePos - currentAnglePos + 540) % 360 - 180;
                
                currentRotation += diff;
                targetRotation = currentRotation;
                updateGalleryPosition();
                resetAutoplay();
                
                // 更新滑块位置
                if (slider) {
                    slider.value = targetIndex.toString();
                }
            });
        });
    }
    
    // 滑块拖拽
    if (slider) {
        slider.addEventListener('input', function() {
            isDraggingSlider = true;
            
            const anglePerItem = 360 / totalItems;
            const sliderValue = parseFloat(this.value);
            
            // 反转滑块值为旋转角度
            const targetRotationDegrees = (totalItems - sliderValue) * anglePerItem;
            
            // 设置旋转角度
            currentRotation = targetRotationDegrees;
            targetRotation = currentRotation;
            
            updateGalleryPosition();
            
            // 暂停自动播放
            clearInterval(autoplayInterval);
        });
        
        slider.addEventListener('change', function() {
            isDraggingSlider = false;
            resetAutoplay();
        });
    } else {
        console.warn("滑块元素未找到");
    }
    
    // 处理拖拽
    function dragStart(e) {
        if (e.type.includes('mouse') && e.button !== 0) return; // 只响应鼠标左键
        
        isDragging = true;
        startPosition = getPositionX(e);
        track.classList.add('grabbing');
        track.style.transition = 'none';
        lastDragTime = Date.now();
        dragVelocity = 0;
        
        // 停止自动播放和自动旋转
        clearInterval(autoplayInterval);
        autoRotate = false;
        
        // 防止文本选择
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(e);
        currentTranslate = currentPosition - startPosition;
        
        // 计算拖拽速度
        const now = Date.now();
        const timeElapsed = now - lastDragTime;
        if (timeElapsed > 0) {
            dragVelocity = currentTranslate / timeElapsed * 10;
            lastDragTime = now;
            startPosition = currentPosition;
        }
        
        // 转换拖拽距离为旋转角度
        const dragFactor = 0.2;
        const rotationChange = currentTranslate * dragFactor;
        currentRotation = targetRotation + rotationChange;
        
        updateGalleryPosition(false);
        
        // 防止页面滚动
        e.preventDefault();
    }
    
    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('grabbing');
        
        // 根据拖拽速度确定惯性滚动
        const inertiaFactor = 20;
        const velocity = Math.abs(dragVelocity) > 0.5 ? dragVelocity * inertiaFactor : 0;
        
        // 如果有足够的惯性，继续滚动一段距离
        if (velocity !== 0) {
            const anglePerItem = 360 / totalItems;
            const inertiaRotation = velocity;
            
            // 添加惯性旋转
            currentRotation = targetRotation + inertiaRotation;
            
            // 舍入到最近的项
            const angleModulo = ((currentRotation % 360) + 360) % 360;
            const itemIndex = Math.round(angleModulo / anglePerItem);
            currentRotation = itemIndex * anglePerItem;
        }
        
        targetRotation = currentRotation;
        updateGalleryPosition();
        
        // 重启自动播放
        resetAutoplay();
    }
    
    function getPositionX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }
    
    // 添加鼠标悬停区域自动旋转功能
    function handleMouseMove(e) {
        if (isDragging) return; // 拖拽时不触发自动旋转
        
        const containerRect = galleryContent.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerCenterX = containerRect.left + containerWidth / 2;
        const mouseX = e.clientX;
        
        // 确定鼠标位置相对于中心的位置
        const distanceFromCenter = mouseX - containerCenterX;
        const threshold = 80; // 中间不旋转的区域宽度
        
        if (distanceFromCenter < -threshold) {
            // 鼠标在左半区，向左旋转
            rotateDirection = -1;
            // 速度随距离变化，但整体降低
            autoRotateSpeed = Math.min(1, 0.25 + Math.abs(distanceFromCenter - threshold) / containerWidth * 2);
            
            if (!autoRotate) {
                autoRotate = true;
                startAutoRotate();
            }
        } else if (distanceFromCenter > threshold) {
            // 鼠标在右半区，向右旋转
            rotateDirection = 1;
            // 速度随距离变化，但整体降低
            autoRotateSpeed = Math.min(1, 0.25 + Math.abs(distanceFromCenter - threshold) / containerWidth * 2);
            
            if (!autoRotate) {
                autoRotate = true;
                startAutoRotate();
            }
        } else {
            // 鼠标在中间区域，停止旋转
            rotateDirection = 0;
            autoRotate = false;
        }
    }
    
    // 自动旋转函数
    function startAutoRotate() {
        if (!autoRotate) return;
        
        const anglePerItem = 360 / totalItems / 30; // 更加平滑的旋转
        
        // 根据旋转方向更新角度
        if (rotateDirection < 0) {
            // 向左旋转
            currentRotation -= anglePerItem * autoRotateSpeed;
        } else if (rotateDirection > 0) {
            // 向右旋转
            currentRotation += anglePerItem * autoRotateSpeed;
        }
        
        targetRotation = currentRotation;
        updateGalleryPosition();
        
        // 下一帧继续旋转
        if (autoRotate) {
            requestAnimationFrame(startAutoRotate);
        }
    }
    
    // 添加鼠标移动事件
    galleryContent.addEventListener('mousemove', handleMouseMove);
    
    // 鼠标离开时停止自动旋转
    galleryContent.addEventListener('mouseleave', function() {
        autoRotate = false;
        if (autoplayEnabled) {
            startAutoplay();
        }
    });
    
    // 添加拖拽事件
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('mouseleave', dragEnd);
    
    // 阻止触摸时的默认行为
    track.addEventListener('touchstart', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // 点击项目导航到详情
    items.forEach(item => {
        item.addEventListener('click', function(e) {
            if (isDragging || Math.abs(currentTranslate) > 10) {
                e.preventDefault();
                return; // 拖拽时或有明显位移时不触发点击
            }
            
            const targetId = this.dataset.target;
            if (!targetId) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 添加点击动画
                this.animate([
                    { transform: `${this.style.transform} scale(0.95)` },
                    { transform: `${this.style.transform} scale(1.05)` },
                    { transform: this.style.transform }
                ], {
                    duration: 300,
                    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                });
                
                // 滚动到目标详情
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 768;
        const newCylinderWidth = isMobile ? 1500 : 2200;
        const newRadius = newCylinderWidth / (2 * Math.PI);
        
        // 更新半径
        radius = newRadius;
        initItemPositions();
    });
    
    // 自动播放函数
    function startAutoplay() {
        if (autoplayEnabled) {
            autoplayInterval = setInterval(() => {
                // 降低自动旋转速度，3秒转1个
                const anglePerItem = 360 / totalItems;
                currentRotation += anglePerItem / 9; // 更平滑的旋转，9次更新完成一次旋转
                targetRotation = currentRotation;
                updateGalleryPosition();
            }, 1000 / 3); // 3次更新/秒
        }
    }
    
    // 重置自动播放
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // 鼠标悬停暂停自动播放
    track.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    track.addEventListener('mouseleave', () => {
        if (autoplayEnabled && !autoRotate) {
            startAutoplay();
        }
    });
    
    // 键盘左右箭头控制
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });
    
    // 初始化
    initItemPositions();
    startAutoplay();
    
    // 在控制台输出调试信息
    console.log("画廊初始化完成，滑块元素：", slider ? "已找到" : "未找到");
    console.log("刻度标记元素：", sliderTicks.length ? `已找到 ${sliderTicks.length} 个` : "未找到");
} 