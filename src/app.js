document.addEventListener('DOMContentLoaded', () => {
    let previousTrackInfo = null;

    async function updateUI(trackInfo) {
        const progress = (trackInfo.progress_ms / trackInfo.item.duration_ms) * 100;
    
        $('#track-name').text(`${trackInfo.item.name}`);
        $('#artist-name').text(`${trackInfo.item.artists[0].name}`);
        $('#progress-bar').css('width', `${progress}%`);
    
        const albumCover = $('#album-cover');
    
        if (!previousTrackInfo || trackInfo.item.id !== previousTrackInfo.item.id) {
            albumCover.fadeOut(500, function() {
                albumCover.attr('src', trackInfo.item.album.images[0].url).fadeIn(500);
            });
    
            previousTrackInfo = trackInfo;
        }
    
        const trackNameElement = document.getElementById('track-name');
        const artistNameElement = document.getElementById('artist-name');
        const trackInfoElement = document.querySelector('.track-info');
    
        if (trackNameElement.scrollWidth > trackInfoElement.clientWidth) {
            trackNameElement.classList.add('animate-left');
        } else {
            trackNameElement.classList.remove('animate-left');
        }
    
        if (artistNameElement.scrollWidth > trackInfoElement.clientWidth) {
            artistNameElement.classList.add('animate-left');
        } else {
            artistNameElement.classList.remove('animate-left');
        }
    
        const imageUrl = trackInfo.item.album.images[0].url;
        const dominantColor = await getDominantColor(imageUrl);
        const fontColor = getFontColor(dominantColor);
    
        document.documentElement.style.setProperty('--background-primary', dominantColor);
        document.documentElement.style.setProperty('--font-color-primary', fontColor);
        document.title = `${trackInfo.item.name} - ${trackInfo.item.artists[0].name}`;
    }

    async function getDominantColor(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageUrl;
            
            img.onload = () => {
                const vibrant = new Vibrant(img);
                const swatches = vibrant.swatches();
                
                const swatch = swatches.Vibrant || swatches.Muted || swatches.DarkVibrant || swatches.DarkMuted || swatches.LightVibrant || swatches.LightMuted;
                
                if (swatch) {
                    resolve(swatch.getHex());
                } else {
                    resolve('#191414');
                }
            };
            
            img.onerror = () => {
                resolve('#191414');
            };
        });
    }    
    
    function getFontColor(backgroundColor) {
        const hexToRgb = (hex) => {
            const bigint = parseInt(hex.substring(1), 16);
            return {
                r: (bigint >> 20) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255
            };
        };
    
        const rgb = hexToRgb(backgroundColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    
        return brightness > 125 ? '#000000' : '#ffffff';
    }

    async function displayCurrentlyPlaying() {
        try {
            const response = await fetch('/currently-playing');
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
            const data = await response.json();
            if (data.is_playing) {
                updateUI(data);
            } else {
                $('#track-name').text('No track currently playing');
                $('#artist-name').text('');
                $('#album-cover').attr('src', 'https://jccdallas.org/wp-content/uploads/2020/06/Spotify-Play-Button.png');
                $('.artwork-container').show();
            }
        } catch (error) {
            console.error('Error fetching currently playing track:', error);
        }
    }
    
    displayCurrentlyPlaying();
    setInterval(displayCurrentlyPlaying, 1000);
});