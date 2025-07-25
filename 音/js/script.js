document.addEventListener('DOMContentLoaded', () => {
    // 测试歌曲占位数据
    let musicList = [
        {
            id: 1,
            title: '测试歌曲一',
            artist: 'Loralore',
            album: '云音乐站',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            cover: '',
            playlist: 'favorites'
        },
        {
            id: 2,
            title: '测试歌曲二',
            artist: 'Loralore',
            album: '云音乐站',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            cover: '',
            playlist: 'all'
        }
    ];
    let currentPlaylist = 'all';
    let searchTerm = '';

    const musicListEl = document.getElementById('music-list');
    const playlistFilter = document.getElementById('playlist-filter');
    const searchInput = document.querySelector('.search-box input');
    const playerModal = document.getElementById('music-player-modal');
    const audioPlayer = document.getElementById('audio-player');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playerAlbum = document.getElementById('player-album');
    const downloadMusicBtn = document.getElementById('download-music-btn');
    const playerCloseBtn = playerModal.querySelector('.modal-close');

    const uploadBtn = document.getElementById('upload-btn');
    // The following lines related to the upload modal are no longer needed
    // const uploadModal = document.getElementById('upload-modal');
    // const uploadCloseBtn = uploadModal.querySelector('.modal-close');
    // const uploadForm = document.getElementById('upload-form');
    const musicFileInput = document.getElementById('music-file');
    const musicTitleInput = document.getElementById('music-title');
    const musicArtistInput = document.getElementById('music-artist');
    const musicAlbumInput = document.getElementById('music-album');

    // 渲染音乐列表
    function renderMusicList() {
        let filtered = musicList.filter(m => {
            let matchPlaylist = currentPlaylist === 'all' || m.playlist === currentPlaylist || (currentPlaylist === 'favorites' && m.playlist === 'favorites');
            let matchSearch = !searchTerm || m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.artist.toLowerCase().includes(searchTerm.toLowerCase());
            return matchPlaylist && matchSearch;
        });
        musicListEl.innerHTML = '';
        if (filtered.length === 0) {
            musicListEl.innerHTML = '<div style="text-align:center;color:#888;padding:40px 0;">没有找到相关音乐</div>';
            return;
        }
        filtered.forEach(m => {
            const item = document.createElement('div');
            item.className = 'music-item';
            item.innerHTML = `
                <div class="music-cover"><i class="fas fa-music"></i></div>
                <div class="music-info">
                    <div class="music-title">${m.title}</div>
                    <div class="music-artist">${m.artist}</div>
                    <div class="music-meta">${m.album}</div>
                </div>
                <div class="music-actions">
                    <button class="btn btn-primary btn-play"><i class="fas fa-play"></i> <span>播放</span></button>
                    <button class="btn btn-primary btn-download"><i class="fas fa-download"></i></button>
                </div>
            `;

            // 播放
            item.querySelector('.btn-play').addEventListener('click', e => {
                e.stopPropagation();
                showPlayer(m);
            });
            // 下载
            item.querySelector('.btn-download').addEventListener('click', e => {
                e.stopPropagation();
                window.open(m.url, '_blank');
            });
            // 整行点击也可播放
            item.addEventListener('click', () => showPlayer(m));
            musicListEl.appendChild(item);
        });
    }

    // 播放器弹窗
    function showPlayer(music) {
        playerTitle.textContent = music.title;
        playerArtist.textContent = music.artist;
        playerAlbum.textContent = music.album;
        audioPlayer.src = music.url;
        downloadMusicBtn.href = music.url;
        playerModal.classList.add('visible');
        audioPlayer.play();
    }
    function hidePlayer() {
        playerModal.classList.remove('visible');
        audioPlayer.pause();
    }
    playerCloseBtn.addEventListener('click', hidePlayer);
    playerModal.addEventListener('click', e => {
        if (e.target === playerModal) hidePlayer();
    });

    // 搜索
    searchInput.addEventListener('input', e => {
        searchTerm = e.target.value;
        renderMusicList();
    });
    // 歌单筛选
    playlistFilter.addEventListener('change', e => {
        currentPlaylist = e.target.value;
        renderMusicList();
    });

    // --- MODIFIED: Upload button logic ---
    if (uploadBtn) {
        let newSongCounter = 3; // Start from 3 since there are already two test songs

        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default browser behavior

            const newSong = {
                id: Date.now(),
                title: `测试歌曲 ${newSongCounter}`,
                artist: 'Loralore',
                album: '云音乐站',
                url: '#', // Dummy URL as it won't play
                cover: '',
                playlist: 'all'
            };

            musicList.push(newSong);
            renderMusicList(); // Re-render the list with the new song
            newSongCounter++;
        });
    }

    // The old logic for showing the modal and handling the form is removed.
    // uploadBtn.addEventListener('click', () => { ... });
    // uploadCloseBtn.addEventListener('click', () => { ... });
    // uploadModal.addEventListener('click', e => { ... });
    // uploadForm.addEventListener('submit', e => { ... });

    // 初始渲染
    renderMusicList();
});

// The duplicate logic at the end of the file should be removed.
