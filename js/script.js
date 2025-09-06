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
    const animateElements = document.querySelectorAll('.feature-highlight, .project-detail-item, .equipment-item, .template-item, .cert-item');
    
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

    // 项目详情相关逻辑
    const projectDetailItems = document.querySelectorAll('.project-detail-item');
    
    // 初始化项目详情样式并设置进场动画
    if (projectDetailItems.length > 0) {
        projectDetailItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

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
    
    checkVisible();
    window.addEventListener('scroll', checkVisible);
    }

    // 3D旋转画廊实现
    initGallery();

    // Team card download logic
    const downloadBtn = document.getElementById('download-team-card-btn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = 'images/Loralore with cmu.jpg';
            link.download = 'Loralore with cmu.jpg';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    
    // QR Code download logic
    const downloadQRCodeBtn = document.getElementById('download-qr-code-btn');
    if (downloadQRCodeBtn) {
        downloadQRCodeBtn.addEventListener('click', () => {
            const tempDiv = document.createElement('div');
            tempDiv.style.display = 'none';
            document.body.appendChild(tempDiv);

            new QRCode(tempDiv, {
                text: window.location.href,
                width: 256,
                height: 256,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });

            setTimeout(() => {
                const qrCanvas = tempDiv.querySelector('canvas');
                if (qrCanvas) {
                    const link = document.createElement('a');
                    link.href = qrCanvas.toDataURL("image/png");
                    link.download = 'Loralore_QRCode.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                document.body.removeChild(tempDiv);
            }, 100);
        });
    }

    // 动态导航高亮逻辑
    const sections = document.querySelectorAll('section[id]');
    const navLi = document.querySelectorAll('#header nav ul li');

    const updateActiveNav = () => {
        const scrollY = window.pageYOffset;
        let activeSectionId = '';

        // 找到当前在视口中最顶部的section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // 偏移量，使高亮更自然
            if (scrollY >= sectionTop) {
                activeSectionId = section.id;
            }
        });
        
        // 如果滚动到顶部，确保'首页'高亮
        if (scrollY < 200) {
            activeSectionId = 'showcase';
        }

        // 清除所有当前高亮
        navLi.forEach(li => li.classList.remove('current'));
        
        // 设置当前高亮
        navLi.forEach(li => {
            const link = li.querySelector('a');
            // 只处理包含<a>链接的<li>元素
            if (link) {
                const href = link.getAttribute('href');
                if (href === `#${activeSectionId}`) {
                    li.classList.add('current');
                }
            }
        });
    };

    // 延迟执行初始高亮，避免加载时的样式竞争问题
    setTimeout(updateActiveNav, 300);
    
    // 添加滚动事件监听器
    window.addEventListener('scroll', updateActiveNav);

    // 团队区：CMU卡片视差效果
    const cmuCard = document.querySelector('.cmu-special-card');
    if (cmuCard) {
        const updateParallax = () => {
            const rect = cmuCard.getBoundingClientRect();
            const viewportH = window.innerHeight || document.documentElement.clientHeight;
            // 视差量：元素在视口中越靠中间，偏移越小
            const centerOffset = (rect.top + rect.height / 2) - viewportH / 2;
            const parallax = Math.max(-20, Math.min(20, centerOffset * 0.04)); // 限制在 [-20, 20]px
            cmuCard.style.setProperty('--parallax-y', parallax + 'px');
        };
        updateParallax();
        window.addEventListener('scroll', updateParallax);
        window.addEventListener('resize', updateParallax);
    }

    // 鼠标移动动效 - 背景粒子跟随鼠标
    const teamSection = document.querySelector('#team');
    const teamContentWrapper = document.querySelector('.team-content-wrapper');
    
    if (teamSection && teamContentWrapper) {
        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;
        let animationFrame;

        const updateMousePosition = (e) => {
            const rect = teamSection.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width) * 100;
            mouseY = ((e.clientY - rect.top) / rect.height) * 100;
            
            if (!isMoving) {
                isMoving = true;
                animateMouseEffect();
            }
        };

        const animateMouseEffect = () => {
            // 更新CMU卡片的鼠标位置
            const cmuCard = document.querySelector('.cmu-special-card');
            if (cmuCard) {
                cmuCard.style.setProperty('--mouse-x', mouseX + '%');
                cmuCard.style.setProperty('--mouse-y', mouseY + '%');
            }

            // 更新团队内容包装器的背景粒子位置
            teamContentWrapper.style.setProperty('--mouse-x', mouseX + '%');
            teamContentWrapper.style.setProperty('--mouse-y', mouseY + '%');

            // 添加鼠标移动的视觉反馈
            const cards = document.querySelectorAll('.cmu-special-card, .school-card, .team-value-item');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;
                // 使用存储的鼠标位置而不是事件对象
                const currentMouseX = (mouseX / 100) * teamSection.getBoundingClientRect().width + teamSection.getBoundingClientRect().left;
                const currentMouseY = (mouseY / 100) * teamSection.getBoundingClientRect().height + teamSection.getBoundingClientRect().top;
                const distance = Math.sqrt(
                    Math.pow(currentMouseX - cardCenterX, 2) + 
                    Math.pow(currentMouseY - cardCenterY, 2)
                );
                
                if (distance < 200) {
                    const intensity = Math.max(0, 1 - distance / 200);
                    card.style.transform = `translateY(${intensity * -5}px) scale(${1 + intensity * 0.02})`;
                    card.style.boxShadow = `0 ${8 + intensity * 8}px ${24 + intensity * 16}px rgba(0, 0, 0, ${0.12 + intensity * 0.08})`;
                } else {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }
            });

            animationFrame = requestAnimationFrame(animateMouseEffect);
        };

        const stopAnimation = () => {
            isMoving = false;
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };

        // 添加鼠标移动事件监听器
        teamSection.addEventListener('mousemove', updateMousePosition);
        teamSection.addEventListener('mouseleave', stopAnimation);
        
        // 触摸设备支持
        teamSection.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                updateMousePosition(touch);
            }
        });
        
        teamSection.addEventListener('touchend', stopAnimation);
    }

        // ---- 团队区域：横向背景轮播（使用 images/live in cmu/*.webp） ----
        (function initTeamBgCarousel(){
            try {
                // 如果 HTML 已经包含静态 carousel，则不再动态创建
                if (document.querySelector('.team-bg-carousel')) {
                    return;
                }
                const images = [
                    './images/live in cmu/cmu1.webp',
                    './images/live in cmu/cmu2.webp',
                    './images/live in cmu/cmu3.webp',
                    './images/live in cmu/cmu4.webp',
                    './images/live in cmu/cmu5.webp',
                    './images/live in cmu/cmu6.webp'
                ];

                // create carousel container
                const carousel = document.createElement('div');
                carousel.className = 'team-bg-carousel';

                const track = document.createElement('div');
                track.className = 'team-bg-track';

                // duplicate set for seamless loop
                const buildSlides = (list) => {
                    list.forEach(src => {
                        const img = document.createElement('img');
                        img.className = 'team-bg-slide';
                        img.src = src;
                        img.alt = 'team background';
                        img.draggable = false;
                        track.appendChild(img);
                    });
                };

                buildSlides(images);
                buildSlides(images); // duplicated

                carousel.appendChild(track);

                // insert carousel into team section and ensure content wrapper sits above
                teamSection.insertBefore(carousel, teamSection.firstChild);
                teamSection.classList.add('has-bg-carousel');

                // pause when user hovers (improve accessibility)
                teamSection.addEventListener('mouseenter', () => carousel.classList.add('paused'));
                teamSection.addEventListener('mouseleave', () => carousel.classList.remove('paused'));

                // On small screens reduce motion by slowing/stopping animation
                const mq = window.matchMedia('(max-width: 480px)');
                function handleSmall(e){
                    if (e.matches) {
                        // pause animation to reduce CPU / bandwidth
                        carousel.classList.add('paused');
                    } else {
                        carousel.classList.remove('paused');
                    }
                }
                handleSmall(mq);
                mq.addListener(handleSmall);
            } catch (err) {
                console.log('欢迎来到Loralore！团队背景轮播正在优化中，为您提供更好的体验');
            }
        })();

    // CMU图片加载检测和错误处理
    const cmuLogo = document.querySelector('.cmu-logo-wrapper img');
    if (cmuLogo) {
        const cmuLogoWrapper = document.querySelector('.cmu-logo-wrapper');
        const cmuFallbackText = document.querySelector('.cmu-fallback-text');
        
        // 图片加载成功
        cmuLogo.addEventListener('load', function() {
            console.log(' 欢迎来到Loralore！CMU合作项目展示已准备就绪');
            this.style.opacity = '1';
            this.style.visibility = 'visible';
            this.style.display = 'block';
            
            // 隐藏备用文字
            if (cmuFallbackText) {
                cmuFallbackText.style.display = 'none';
            }
        });
        
        // 图片加载失败
        cmuLogo.addEventListener('error', function() {
            console.log('欢迎来到Loralore！正在为您准备最佳体验...');
            this.style.display = 'none';
            
            // 显示备用文字
            if (cmuFallbackText) {
                cmuFallbackText.style.display = 'block';
            }
            
            // 更新CSS变量
            if (cmuLogoWrapper) {
                cmuLogoWrapper.style.setProperty('--show-fallback', 'block');
            }
        });
        
        // 检查图片是否已经加载完成
        const checkImageStatus = () => {
            if (cmuLogo.complete && cmuLogo.naturalHeight !== 0) {
                console.log(' 欢迎来到Loralore！国际合作展示区已完美呈现');
                cmuLogo.style.opacity = '1';
                cmuLogo.style.visibility = 'visible';
                cmuLogo.style.display = 'block';
                
                // 隐藏备用文字
                if (cmuFallbackText) {
                    cmuFallbackText.style.display = 'none';
                }
                return true;
            } else {
                console.log('🚀 Loralore正在为您加载精彩内容...');
                return false;
            }
        };
        
        // 立即检查一次
        if (checkImageStatus()) {
            // 图片已经加载完成，不需要进一步处理
            console.log(' 欢迎来到Loralore！所有内容已准备完毕，开始您的探索之旅吧！');
        } else {
            // 图片还在加载中，设置初始状态
            console.log(' 欢迎来到Loralore！正在为您呈现最佳视觉效果...');
            cmuLogo.style.opacity = '0';
            cmuLogo.style.transition = 'opacity 0.3s ease';
        }
        
        // 延迟检查图片状态（仅在需要时）
        setTimeout(() => {
            if (!checkImageStatus()) {
                console.log(' 欢迎来到Loralore！感谢您的耐心等待，精彩内容即将呈现');
                // 如果图片仍然没有加载，显示备用文字
                if (cmuFallbackText) {
                    cmuFallbackText.style.display = 'block';
                }
            }
        }, 3000); // 增加到3秒，给图片更多加载时间
    }

    // 回到顶部浮动按钮显示/隐藏逻辑
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        const toggleBackToTop = () => {
            if (window.scrollY > 300) backToTop.classList.add('is-visible');
            else backToTop.classList.remove('is-visible');
        };
        toggleBackToTop();
        window.addEventListener('scroll', toggleBackToTop);
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// 3D旋转画廊
function initGallery() {
    const galleryData = [
        {
            img: "./images/service1.webp",
            title: "Apass密码管理",
            description: "安全便捷的账号密码管理微信小程序，具备密码生成、安全检测、自动备份等功能",
            tags: ["微信小程序", "安全", "工具类"],
            target: "#project-apass"
        },
        {
            img: "./images/service2.webp",
            title: "Lovalovea情侣空间",
            description: "专为情侣打造的私密社交空间，记录美好瞬间，分享生活点滴，愿景：alove，不再alone",
            tags: ["Web应用", "Node.js", "社交类"],
            target: "#project-lovalovea"
        },
        {
            img: "./images/service3.webp",
            title: "字符大师",
            description: "将普通图片转换为ASCII字符艺术的创意微信小程序，支持多种转换参数调整和样式自定义",
            tags: ["微信小程序", "创意类", "图像处理"],
            target: "#project-ascii-wx"
        },
        {
            img: "./images/service4.webp",
            title: "ASCII艺术桌面版",
            description: "基于Qt开发的桌面端ASCII艺术转换工具，能将图片甚至视频转换成字符动画",
            tags: ["桌面应用", "Qt", "C++", "FFmpeg"],
            target: "#project-ascii-qt"
        },
        {
            img: "./images/service5.webp",
            title: "UDP交流互动软件",
            description: "基于Qt开发的局域网UDP白板书画与聊天工具，支持多人实时互动与文件传输",
            tags: ["桌面应用", "Qt", "C++", "网络通信"],
            target: "#project-julia"
        },
        {
            img: "./images/service6.webp",
            title: "微积分计算器",
            description: "基于MATLAB开发的微积分计算与可视化工具，支持函数求导、积分、极限等高级运算",
            tags: ["MATLAB", "科学计算", "教育工具"],
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
        console.log("🎪 欢迎来到Loralore！3D项目展示画廊正在为您准备中...");
        return;
    }

    const totalItems = items.length;
    const anglePerItem = 360 / totalItems;
    // 优化半径计算，确保在不同屏幕尺寸下都有合适的旋转效果
    const isMobile = window.innerWidth <= 768;
    const cylinderWidth = Math.min(Math.max(window.innerWidth * 1.8, 1200), 2800);
    let radius = cylinderWidth / (2 * Math.PI);
    
    let currentRotation = 0;
    let targetRotation = 0;
    let rotationVelocity = 0;
    let isAnimating = false; // 新增：防止动画冲突
    let animationFrameId = null; // 新增：管理动画帧

    let isDragging = false;
    let dragStartRotation = 0; // 用于计算拖拽结束时的速度
    let lastDragPosition = 0;
    let isHovering = false;
    let startPosition = 0;
    let dragStartTime = 0; // 新增：记录拖拽开始时间
    
    const autoRotateSpeed = -0.03; // 降低自动旋转速度，更平滑

    // 1. 初始化项目位置和交互
    items.forEach((item, index) => {
        const angle = index * anglePerItem;
        item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        // 添加触摸事件支持
        item.addEventListener('touchstart', (e) => e.stopPropagation());
        item.addEventListener('click', (e) => {
            // 优化点击判断逻辑
            const movedDistance = Math.abs(getPositionX(e) - startPosition);
            const timeDiff = Date.now() - dragStartTime;
            if (isDragging && (movedDistance > 8 || timeDiff < 200)) {
                return;
            }

            // 1. 平滑旋转到点击的item
            const itemAngle = -index * anglePerItem;
            // 计算最短旋转路径
            let targetAngle = Math.round(currentRotation / 360) * 360 + itemAngle;
            const currentAngle = currentRotation % 360;
            const diff = targetAngle - currentAngle;
            if (Math.abs(diff) > 180) {
                targetAngle += diff > 0 ? -360 : 360;
            }
            targetRotation = targetAngle;
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
        if (isAnimating) return; // 防止重复调用
        isAnimating = true;
        
        // 自动旋转逻辑
        if (!isDragging && !isHovering) {
            targetRotation += autoRotateSpeed;
        }

        // 惯性逻辑
        if (rotationVelocity !== 0 && !isDragging) {
            targetRotation += rotationVelocity;
            rotationVelocity *= 0.92; // 调整阻尼系数，让惯性更自然
            if (Math.abs(rotationVelocity) < 0.001) {
                rotationVelocity = 0;
            }
        }
        
        // 缓动动画
        const easing = 0.06; // 降低缓动强度，让旋转更平滑
        currentRotation += (targetRotation - currentRotation) * easing;

        // 应用变换
        track.style.transform = `translateZ(${-radius}px) rotateY(${currentRotation}deg)`;

        // 更新卡片状态
        updateItemsState();

        animationFrameId = requestAnimationFrame(() => {
            isAnimating = false;
            animate();
        });
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
        dragStartTime = Date.now();
        rotationVelocity = 0;
        startPosition = getPositionX(e);
        dragStartRotation = currentRotation;
        lastDragPosition = startPosition;
        track.style.cursor = 'grabbing';
        track.style.userSelect = 'none'; // 防止拖拽时选中文本
    }

    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = getPositionX(e);
        const move = (currentPosition - startPosition);
        // 优化拖拽灵敏度，根据屏幕宽度调整
        const sensitivity = window.innerWidth <= 768 ? 0.35 : 0.25;
        targetRotation = dragStartRotation + move * sensitivity;
        
        // 为了计算惯性速度
        rotationVelocity = (currentPosition - lastDragPosition) * 0.08;
        lastDragPosition = currentPosition;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
        track.style.userSelect = 'auto';
        
        // 优化惯性结束后的对齐
        if (Math.abs(rotationVelocity) > 0.5) {
            // 如果有足够的速度，让惯性自然结束
        } else {
            // 速度较小时，自动对齐到最近的卡片
            const nearestAngle = Math.round(currentRotation / anglePerItem) * anglePerItem;
            targetRotation = nearestAngle;
        }
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
        // 优化按钮点击逻辑
        const currentAngle = Math.round(currentRotation / anglePerItem) * anglePerItem;
        targetRotation = currentAngle - anglePerItem;
        rotationVelocity = 0;
        isHovering = true; // 暂时禁用自动旋转
        setTimeout(() => { isHovering = false; }, 1000);
    });

    nextBtn.addEventListener('click', () => {
        const currentAngle = Math.round(currentRotation / anglePerItem) * anglePerItem;
        targetRotation = currentAngle + anglePerItem;
        rotationVelocity = 0;
        isHovering = true;
        setTimeout(() => { isHovering = false; }, 1000);
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
            // 滑块拖动时实时更新
            currentRotation = targetRotation;
        });
         slider.addEventListener('mouseup', () => {
            isHovering = false;
        });
    }

    // 新增：窗口大小改变时重新计算半径
    const handleResize = () => {
        const newCylinderWidth = Math.min(Math.max(window.innerWidth * 1.8, 1200), 2800);
        const newRadius = newCylinderWidth / (2 * Math.PI);
        if (Math.abs(newRadius - radius) > 50) {
            // 重新计算所有项目位置
            items.forEach((item, index) => {
                const angle = index * anglePerItem;
                item.style.transform = `rotateY(${angle}deg) translateZ(${newRadius}px)`;
            });
            radius = newRadius;
        }
    };
    
    window.addEventListener('resize', handleResize);

    // 启动动画
    animate();
    
    // 清理函数
    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('resize', handleResize);
    };
} 