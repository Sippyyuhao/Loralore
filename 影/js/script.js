document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const uploadBtn = document.getElementById('upload-btn');
    const modal = document.getElementById('upload-modal');
    const modalClose = document.querySelector('.modal-close');
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('file-input');
    const sortFilter = document.getElementById('sort-filter');
    const uploadConfirmBtn = document.querySelector('.upload-form .btn');
    const uploadPreviewContainer = document.querySelector('.upload-preview');
    const searchInput = document.querySelector('.search-box input');

    const imageDetailModal = document.getElementById('image-detail-modal');
    const modalImageElement = document.getElementById('modal-image-element');
    const downloadBtn = document.querySelector('.download-btn');
    const imageDetailCloseBtn = imageDetailModal.querySelector('.modal-close');
    const modalImageTitle = document.getElementById('modal-image-title');
    const metaDate = document.getElementById('meta-date');
    const metaSize = document.getElementById('meta-size');

    let newFiles = [];
    let isTemplateMode = true; // Flag to determine if we're in template mode

    // --- Create placeholder images ---
    function createPlaceholderImages() {
        const placeholders = [];
        for (let i = 1; i <= 4; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            
            // Fill with a gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsl(${i * 60}, 70%, 60%)`);
            gradient.addColorStop(1, `hsl(${i * 60 + 30}, 70%, 40%)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add text
            ctx.font = 'bold 48px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`测试图像 ${i}`, canvas.width / 2, canvas.height / 2);
            
            // Convert to data URL
            const dataUrl = canvas.toDataURL('image/jpeg');
            placeholders.push({
                id: i,
                src: dataUrl,
                collected: i % 2 === 0, // Make every second image collected for demo
                date: new Date(),
                size: 100 + i * 50,
                title: `测试图像 ${i}`,
                isTemplate: true // Mark as template image
            });
        }
        return placeholders;
    }

    // --- Placeholder Data ---
    let placeholderImages = createPlaceholderImages();
    
    // Try to load user images from localStorage
    const savedImages = localStorage.getItem('userImages');
    if (savedImages) {
        try {
            const parsedImages = JSON.parse(savedImages);
            // Convert string dates back to Date objects
            parsedImages.forEach(img => {
                img.date = new Date(img.date);
            });
            // Add user images to the placeholders
            placeholderImages = [...parsedImages, ...placeholderImages];
        } catch (e) {
            console.error('Error loading saved images:', e);
        }
    }

    // --- Gallery Loading ---
    function loadGallery(filter = 'latest', searchTerm = '') {
        gallery.innerHTML = '<div class="loader"></div>';
        document.querySelector('.loader').style.display = 'block';

        let imagesToLoad = [...placeholderImages];

        // Filter by search term if provided
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            imagesToLoad = imagesToLoad.filter(img => 
                img.title.toLowerCase().includes(term) || 
                (img.description && img.description.toLowerCase().includes(term))
            );
        }

        // Sorting and filtering logic
        if (filter === 'latest') {
            imagesToLoad.sort((a, b) => b.date - a.date);
        } else if (filter === 'oldest') {
            imagesToLoad.sort((a, b) => a.date - b.date);
        } else if (filter === 'collected') {
            imagesToLoad = imagesToLoad.filter(img => img.collected);
        }
        
        // In template mode, always show template images
        if (isTemplateMode) {
            // If we're not showing collected, make sure template images are included
            if (filter !== 'collected') {
                const templateImages = placeholderImages.filter(img => img.isTemplate);
                // Remove any template images that might be in the filtered list already
                imagesToLoad = imagesToLoad.filter(img => !img.isTemplate);
                // Add template images at the beginning
                imagesToLoad = [...templateImages, ...imagesToLoad];
            }
        }
        
        gallery.innerHTML = ''; // Clear loader and previous items

        if (imagesToLoad.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = searchTerm ? '没有找到匹配的图片' : '没有图片可显示';
            gallery.appendChild(noResults);
            return;
        }

        imagesToLoad.forEach(imageData => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.id = imageData.id;
            
            const favIcon = document.createElement('i');
            favIcon.className = 'fas fa-heart favorite-icon';
            if (imageData.collected) {
                favIcon.classList.add('collected');
            }
            favIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                imageData.collected = !imageData.collected;
                favIcon.classList.toggle('collected');
                saveUserImages();
            });

            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash-alt delete-icon';
            deleteIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteImage(imageData.id);
            });

            const img = new Image();
            img.src = imageData.src;
            
            img.onload = () => {
                item.appendChild(img);
                item.appendChild(favIcon);
                item.appendChild(deleteIcon);
                gallery.appendChild(item);
                positionGalleryItems();
            };

            item.addEventListener('click', () => {
                showImageDetail(imageData);
            });
        });
    }

    // --- Save user images to localStorage ---
    function saveUserImages() {
        // Only save user uploaded images, not template images
        const userImages = placeholderImages.filter(img => !img.isTemplate);
        localStorage.setItem('userImages', JSON.stringify(userImages));
    }

    // --- Delete Image Function ---
    function deleteImage(id) {
        if (confirm('确定要删除这张图片吗？')) {
            // Find the image to delete
            const imageToDelete = placeholderImages.find(img => img.id === id);
            if (!imageToDelete) return;

            // Don't allow deleting template images in template mode
            if (isTemplateMode && imageToDelete.isTemplate) {
                alert('模板图片不能删除');
                return;
            }

            // Remove from array
            placeholderImages = placeholderImages.filter(img => img.id !== id);
            
            // Remove from DOM
            const itemToRemove = document.querySelector(`.gallery-item[data-id="${id}"]`);
            if (itemToRemove) {
                itemToRemove.remove();
                positionGalleryItems();
            }
            
            // Save updated images
            saveUserImages();
            
            console.log(`Deleted image: ${imageToDelete.title} (ID: ${id})`);
        }
    }

    // --- Waterfall Layout Logic ---
    function positionGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length === 0) return;
        
        // Get computed style to use CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        const gap = parseInt(computedStyle.getPropertyValue('--gallery-gap')) || 20;
        
        // Calculate column width based on the first item's width
        const columnWidth = galleryItems[0].offsetWidth;
        
        // Calculate number of columns based on gallery width and column width
        const galleryWidth = gallery.offsetWidth;
        const numColumns = Math.floor(galleryWidth / columnWidth);
        
        if (numColumns <= 0) return; // Avoid division by zero
        
        const columnHeights = Array(numColumns).fill(0);

        galleryItems.forEach(item => {
            // Wait for image to load to get proper height
            const img = item.querySelector('img');
            if (!img.complete) {
                img.onload = () => positionGalleryItems();
                return;
            }
            
            const itemHeight = img.offsetHeight;
            if (itemHeight <= 0) return; // Skip items with no height
            
            // Find the shortest column
            const minHeight = Math.min(...columnHeights);
            const minIndex = columnHeights.indexOf(minHeight);

            // Calculate row span based on image height and grid row height (10px)
            const rowSpan = Math.ceil((itemHeight + gap) / (10 + gap));
            item.style.gridRowEnd = `span ${rowSpan}`;
            
            // Update column height
            columnHeights[minIndex] += itemHeight + gap;
        });
    }

    // --- Modal Handling ---
    function showModal() {
        modal.classList.add('visible');
    }

    function hideModal() {
        modal.classList.remove('visible');
    }

    // --- Event Listeners ---
    uploadBtn.addEventListener('click', showModal);
    modalClose.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--light-gray-color)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--light-gray-color)';
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        newFiles = [...files];
        uploadPreviewContainer.innerHTML = '';
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-thumbnail';
                uploadPreviewContainer.appendChild(img);
            }
            reader.readAsDataURL(file);
        });
    }

    uploadConfirmBtn.addEventListener('click', () => {
        const title = document.querySelector('.upload-form input[type="text"]').value;
        const description = document.querySelector('.upload-form textarea').value;

        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // In a real application, we would upload the file to the server here
                // and get back a URL to the stored file
                // For now, we'll use the data URL
                const newId = Date.now() + Math.floor(Math.random() * 1000); // More unique ID
                const newImage = {
                    id: newId,
                    src: e.target.result,
                    collected: false,
                    date: new Date(),
                    size: file.size / 1024, // Store size in KB
                    title: title || `上传图像 ${new Date().toLocaleTimeString()}`,
                    description: description,
                    isTemplate: false // Mark as user image
                };
                placeholderImages.unshift(newImage);
                
                // Save to localStorage
                saveUserImages();
            }
            reader.readAsDataURL(file);
        });

        setTimeout(() => {
            loadGallery(sortFilter.value, searchInput.value);
            hideModal();
            // Reset form
            newFiles = [];
            uploadPreviewContainer.innerHTML = '';
            document.querySelector('.upload-form').reset();

        }, 500); // Give time for file reading
    });

    // --- Search functionality ---
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
        metaDate.textContent = `上传于: ${imageData.date.toLocaleDateString()}`;
        metaSize.textContent = `大小: ${imageData.size.toFixed(2)} KB`;
        downloadBtn.download = `loralore_image_${imageData.id}.jpg`;
        imageDetailModal.classList.add('visible');
    }

    function hideImageDetail() {
        imageDetailModal.classList.remove('visible');
    }

    imageDetailCloseBtn.addEventListener('click', hideImageDetail);
    imageDetailModal.addEventListener('click', (e) => {
        if (e.target === imageDetailModal) {
            hideImageDetail();
        }
    });

    // --- Toggle Template Mode ---
    const fab = document.getElementById('fab');
    if (fab) {
        fab.addEventListener('click', () => {
            isTemplateMode = !isTemplateMode;
            fab.classList.toggle('active');
            if (isTemplateMode) {
                fab.innerHTML = '<i class="fas fa-magic"></i>';
                fab.title = '模板模式（展示所有示例图片）';
            } else {
                fab.innerHTML = '<i class="fas fa-user"></i>';
                fab.title = '用户模式（仅展示用户上传图片）';
            }
            loadGallery(sortFilter.value, searchInput.value);
        });
        // Set initial state
        fab.innerHTML = '<i class="fas fa-magic"></i>';
        fab.title = '模板模式（展示所有示例图片）';
    }

    // --- Initial Load ---
    loadGallery();

    // --- Responsive Repositioning ---
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(positionGalleryItems, 200);
    });
});
