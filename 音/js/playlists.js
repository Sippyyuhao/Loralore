document.addEventListener('DOMContentLoaded', () => {
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    const playlistGrid = document.getElementById('playlist-list');
    const uploadBtnDummy = document.getElementById('upload-btn-dummy');

    if (createPlaylistBtn && playlistGrid) {
        let newPlaylistCounter = 1;
        const icons = ['fa-record-vinyl', 'fa-guitar', 'fa-compact-disc', 'fa-star'];

        createPlaylistBtn.addEventListener('click', () => {
            const iconClass = icons[Math.floor(Math.random() * icons.length)];
            const newPlaylistHTML = `
                <div class="playlist-item">
                    <div class="playlist-cover">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="playlist-info">
                        <div class="playlist-title">新测试歌单 ${newPlaylistCounter}</div>
                        <div class="playlist-desc">包含0首歌曲</div>
                    </div>
                </div>`;
            
            playlistGrid.insertAdjacentHTML('beforeend', newPlaylistHTML);
            newPlaylistCounter++;
        });
    }

    if (uploadBtnDummy) {
        uploadBtnDummy.addEventListener('click', () => {
            alert('这是一个模板页面，无法上传音乐。请返回 "所有音乐" 页面进行操作。');
        });
    }
});