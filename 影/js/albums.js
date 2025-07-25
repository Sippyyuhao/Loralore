document.addEventListener('DOMContentLoaded', () => {
    // Main Album View Elements
    const addAlbumBtn = document.getElementById('add-album-btn');
    const modal = document.getElementById('add-album-modal');
    const modalClose = modal.querySelector('.modal-close');
    const confirmAddAlbumBtn = document.getElementById('confirm-add-album');
    const albumNameInput = document.getElementById('album-name');
    const albumGrid = document.querySelector('.album-grid');

    // Album Detail View Elements
    const albumDetailView = document.getElementById('album-detail-view');
    const backToAlbumsBtn = document.getElementById('back-to-albums');
    const albumDetailTitle = document.getElementById('album-detail-title');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const albumDetailGrid = document.getElementById('album-detail-grid');

    let albums = [];
    let currentAlbum = null;

    // --- Utility function to create a test image ---
    function createTestImage(albumName) {
        const width = 200 + Math.floor(Math.random() * 200);
        const height = 150 + Math.floor(Math.random() * 200);
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        const hue = Math.floor(Math.random() * 360);
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `hsl(${hue}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${hue + 40}, 70%, 40%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        ctx.font = `bold ${Math.min(width, height) / 6}px Arial`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(albumName, width / 2, height / 2);
        
        return canvas.toDataURL('image/jpeg');
    }

    // --- Render albums to the DOM ---
    function renderAlbums() {
        albumGrid.innerHTML = '';
        albums.forEach(album => {
            const albumItem = document.createElement('div');
            albumItem.className = 'album-item';
            albumItem.addEventListener('click', () => showAlbumDetail(album));
            
            albumItem.innerHTML = `
                <div class="album-cover">
                    <img src="${album.images[0] || 'images/placeholder1.jpg'}" alt="Album Cover">
                    <div class="album-overlay">
                        <i class="fas fa-images"></i>
                    </div>
                </div>
                <div class="album-info">
                    <h3>${album.name}</h3>
                    <p>${album.images.length} 张照片</p>
                </div>
            `;
            albumGrid.appendChild(albumItem);
        });
    }
    
    // --- Album Detail View Logic ---
    function showAlbumDetail(album) {
        currentAlbum = album;
        albumDetailTitle.textContent = album.name;
        renderAlbumPhotos();
        albumDetailView.classList.add('visible');
    }

    function hideAlbumDetail() {
        albumDetailView.classList.remove('visible');
        currentAlbum = null;
    }

    function renderAlbumPhotos() {
        albumDetailGrid.innerHTML = '';
        currentAlbum.images.forEach((imageSrc, idx) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${imageSrc}" alt="Photo">`;
            // 新增：点击图片弹窗预览
            item.addEventListener('click', () => {
                showAlbumImageDetail(imageSrc, currentAlbum.name, idx);
            });
            albumDetailGrid.appendChild(item);
        });
        
        // Use a timeout to ensure images are in the DOM before positioning
        setTimeout(positionDetailPhotos, 100);
    }

    function positionDetailPhotos() {
        const galleryItems = albumDetailGrid.querySelectorAll('.gallery-item');
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

    // 新增：大图弹窗逻辑
    const albumImageDetailModal = document.getElementById('album-image-detail-modal');
    const albumModalImageElement = document.getElementById('album-modal-image-element');
    const albumModalImageTitle = document.getElementById('album-modal-image-title');
    const albumMetaDate = document.getElementById('album-meta-date');
    const albumMetaSize = document.getElementById('album-meta-size');
    const albumDownloadBtn = document.getElementById('album-download-btn');
    const albumImageDetailCloseBtn = albumImageDetailModal.querySelector('.modal-close');

    function showAlbumImageDetail(imageSrc, title, idx) {
        albumModalImageElement.src = imageSrc;
        albumModalImageTitle.textContent = title || '无标题';
        albumDownloadBtn.href = imageSrc;
        albumDownloadBtn.download = `album_image_${idx + 1}.jpg`;
        albumMetaDate.textContent = '';
        albumMetaSize.textContent = '';
        albumImageDetailModal.classList.add('visible');
        document.body.classList.add('blurred');
    }
    function hideAlbumImageDetail() {
        albumImageDetailModal.classList.remove('visible');
        document.body.classList.remove('blurred');
    }
    albumImageDetailCloseBtn.addEventListener('click', hideAlbumImageDetail);
    albumImageDetailModal.addEventListener('click', (e) => {
        if (e.target === albumImageDetailModal) {
            hideAlbumImageDetail();
        }
    });

    // --- Modal Handling ---
    function showModal() {
        modal.classList.add('visible');
    }

    function hideModal() {
        modal.classList.remove('visible');
        albumNameInput.value = ''; // Clear input
    }

    // --- Event Listeners ---
    addAlbumBtn.addEventListener('click', showModal);
    modalClose.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    confirmAddAlbumBtn.addEventListener('click', () => {
        const name = albumNameInput.value.trim();
        if (name) {
            const newAlbum = {
                id: Date.now(),
                name: name,
                images: []
            };
            
            for (let i = 0; i < 3 + Math.floor(Math.random() * 5); i++) {
                newAlbum.images.push(createTestImage(name));
            }
            
            albums.push(newAlbum);
            renderAlbums();
            hideModal();
        } else {
            alert('请输入相册名称');
        }
    });

    backToAlbumsBtn.addEventListener('click', hideAlbumDetail);

    addPhotoBtn.addEventListener('click', () => {
        if (currentAlbum) {
            currentAlbum.images.push(createTestImage(currentAlbum.name));
            renderAlbumPhotos();
        }
    });

    albumDetailTitle.addEventListener('blur', () => {
        if (currentAlbum) {
            currentAlbum.name = albumDetailTitle.textContent;
            // Update the main album list view in the background
            const albumInList = albums.find(a => a.id === currentAlbum.id);
            if (albumInList) {
                albumInList.name = currentAlbum.name;
                renderAlbums();
            }
        }
    });

    // --- Initial Load ---
    function initialize() {
        const initialAlbums = [
            { id: 1, name: '风景', images: [] },
            { id: 2, name: '人像', images: [] },
            { id: 3, name: '生活', images: [] }
        ];

        initialAlbums.forEach(album => {
            for (let i = 0; i < 5 + Math.floor(Math.random() * 8); i++) {
                album.images.push(createTestImage(album.name));
            }
        });
        
        albums = initialAlbums;
        renderAlbums();
    }
    
    initialize();
});
