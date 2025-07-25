document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const uploadBtn = document.getElementById('upload-btn');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.querySelector('.search-box input');

    const imageDetailModal = document.getElementById('image-detail-modal');
    const modalImageElement = document.getElementById('modal-image-element');
    const downloadBtn = document.querySelector('.download-btn');
    const imageDetailCloseBtn = imageDetailModal.querySelector('.modal-close');
    const modalImageTitle = document.getElementById('modal-image-title');
    const metaDate = document.getElementById('meta-date');
    const metaSize = document.getElementById('meta-size');

    let galleryImages = [];

    // --- Create placeholder images ---
    function createInitialImages() {
        const placeholders = [];
        for (let i = 1; i <= 8; i++) {
            placeholders.push(createNewImage(i, true));
        }
        return placeholders;
    }
    
    function createNewImage(id, isInitial = false) {
        const width = 300 + Math.floor(Math.random() * 200);
        const height = 200 + Math.floor(Math.random() * 300);
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Random gradient background
        const hue = Math.floor(Math.random() * 360);
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `hsl(${hue}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${hue + 40}, 70%, 40%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add text
        ctx.font = `bold ${Math.min(width, height) / 5}px Arial`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`测试图像 ${id}`, width / 2, height / 2);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        return {
            id: id,
            src: dataUrl,
            liked: isInitial && i % 3 === 0, // Like some initial images
            date: new Date(Date.now() - (isInitial ? (8 - i) * 86400000 : 0)),
            size: (width * height * 0.1) / 1024,
            title: `测试图像 ${id}`
        };
    }

    // --- Gallery Loading ---
    function loadGallery(filter = 'latest', searchTerm = '') {
        gallery.innerHTML = '<div class="loader"></div>';
        
        // Use a short delay to ensure loader is visible
        setTimeout(() => {
            let imagesToLoad = [...galleryImages];

            // Filter by search term
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                imagesToLoad = imagesToLoad.filter(img => img.title.toLowerCase().includes(term));
            }

            // Sort and filter
            if (filter === 'latest') {
                imagesToLoad.sort((a, b) => b.date - a.date);
            } else if (filter === 'oldest') {
                imagesToLoad.sort((a, b) => a.date - b.date);
            } else if (filter === 'liked') {
                imagesToLoad = imagesToLoad.filter(img => img.liked);
            }
            
            gallery.innerHTML = '';

            if (imagesToLoad.length === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.textContent = '没有找到匹配的图片';
                gallery.appendChild(noResults);
                return;
            }

            imagesToLoad.forEach(imageData => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.dataset.id = imageData.id;
                
                const likeIcon = document.createElement('i');
                likeIcon.className = 'fas fa-heart like-icon'; // Change to heart icon
                if (imageData.liked) {
                    likeIcon.classList.add('liked');
                }
                likeIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    imageData.liked = !imageData.liked;
                    likeIcon.classList.toggle('liked');
                });

                const img = new Image();
                img.src = imageData.src;
                
                img.onload = () => {
                    item.appendChild(img);
                    item.appendChild(likeIcon);
                    gallery.appendChild(item);
                    positionGalleryItems();
                };

                item.addEventListener('click', () => {
                    showImageDetail(imageData);
                });
            });
        }, 100);
    }

    // --- Waterfall Layout Logic ---
    function positionGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length === 0) return;
        
        const computedStyle = getComputedStyle(document.documentElement);
        const gap = parseInt(computedStyle.getPropertyValue('--gallery-gap')) || 20;
        
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (!img || !img.complete) return;
            const rowSpan = Math.ceil((img.offsetHeight + gap) / (10 + gap));
            item.style.gridRowEnd = `span ${rowSpan}`;
        });
    }

    // --- Event Listeners ---
    uploadBtn.addEventListener('click', () => {
        const newId = galleryImages.length > 0 ? Math.max(...galleryImages.map(img => img.id)) + 1 : 1;
        const newImage = createNewImage(newId);
        galleryImages.unshift(newImage); // Add to the beginning
        loadGallery(sortFilter.value, searchInput.value);
    });
    
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadGallery(sortFilter.value, e.target.value);
        }, 300);
    });

    sortFilter.addEventListener('change', (e) => {
        loadGallery(e.target.value, searchInput.value);
    });

    function showImageDetail(imageData) {
        modalImageElement.src = imageData.src;
        modalImageTitle.textContent = imageData.title || '无标题';
        downloadBtn.href = imageData.src;
        metaDate.textContent = `创建于: ${imageData.date.toLocaleDateString()}`;
        metaSize.textContent = `大小: ${imageData.size.toFixed(2)} KB`;
        downloadBtn.download = `loralore_image_${imageData.id}.jpg`;
        imageDetailModal.classList.add('visible');
        document.body.classList.add('blurred'); // 添加模糊
    }

    function hideImageDetail() {
        imageDetailModal.classList.remove('visible');
        document.body.classList.remove('blurred'); // 移除模糊
    }

    imageDetailCloseBtn.addEventListener('click', hideImageDetail);
    imageDetailModal.addEventListener('click', (e) => {
        if (e.target === imageDetailModal) {
            hideImageDetail();
        }
    });

    // --- Initial Load ---
    galleryImages = createInitialImages();
    loadGallery();

    // --- Responsive Repositioning ---
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(positionGalleryItems, 200);
    });
});
