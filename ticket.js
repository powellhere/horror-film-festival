// ==========================================
// 1. 建立电影专属图库池 (Image Pool)
// ==========================================
// 请把你准备好的底图放到 images 文件夹里，并在这里填上正确的路径
const movieBackgrounds = {
    'Frankenstein': [
        'images/frank-bg-1.jpg',
        'images/frank-bg-2.jpg'
    ],
    'Psycho': [
        'images/psycho-bg-1.jpg',
        'images/psycho-bg-2.jpg',
        'images/psycho-bg-3.jpg'
    ],
    'Rosemary\'s Baby': [
        'images/rosemary-bg-1.jpg',
        'images/rosemary-bg-2.jpg'
    ],
    'The Exorcist': [
        'images/exorcist-bg-1.jpg',
        'images/exorcist-bg-2.jpg'
    ],
    'The Shining': [
        'images/shining-bg-1.jpg',
        'images/shining-bg-2.jpg'
    ]
};

let currentMovie = ""; 

function openTicketModal(movieTitle) {
    currentMovie = movieTitle;
    document.getElementById('ticketModal').style.display = 'block';
    document.getElementById('ticketPreviewContainer').style.display = 'none';
    
    const nameInput = document.getElementById('viewerName');
    nameInput.value = '';
    // 让输入框瞬间获得焦点，增强“直接跳转”的体验
    nameInput.focus(); 
}

function closeTicketModal() {
    document.getElementById('ticketModal').style.display = 'none';
}

function generateTicket() {
    const nameInput = document.getElementById('viewerName').value.trim() || 'GUEST';
    const canvas = document.getElementById('ticketCanvas');
    const ctx = canvas.getContext('2d');
    
    let imageArray = movieBackgrounds[currentMovie];
    if (!imageArray || imageArray.length === 0) {
        imageArray = ['images/ticket-placeholder.jpg']; // 确保有一张兜底图
    }
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    
    const bgImage = new Image();
    
    // 💡 必须先写 onload
    bgImage.onload = function() {
        const imgRatio = bgImage.width / bgImage.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
            drawHeight = canvas.height;
            drawWidth = bgImage.width * (canvas.height / bgImage.height);
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = canvas.width;
            drawHeight = bgImage.height * (canvas.width / bgImage.width);
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImage, offsetX, offsetY, drawWidth, drawHeight);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawText(ctx, nameInput);
    };

    bgImage.onerror = function() {
        console.error("图片加载失败，请检查路径:", bgImage.src);
        // 图片加载失败时的纯色兜底
        ctx.fillStyle = '#1a1111'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawText(ctx, nameInput);
    };

    // 💡 最后再给 src 赋值，触发上面的 onload
    bgImage.src = imageArray[randomIndex]; 
}

function drawText(ctx, userName) {
    const canvas = document.getElementById('ticketCanvas');
    
    ctx.fillStyle = '#e0d8c3'; 
    ctx.textAlign = 'left';

    ctx.font = 'bold 24px serif';
    ctx.fillText('SHADOWS & CELLULOID FESTIVAL', 50, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 40px serif';
    ctx.fillText(currentMovie, 50, 130);

    ctx.fillStyle = '#8c7b7b';
    ctx.font = '20px monospace';
    ctx.fillText('ADMIT ONE:', 50, 200);
    
    ctx.fillStyle = '#8b0000'; 
    ctx.font = 'bold 28px monospace';
    ctx.fillText(userName.toUpperCase(), 180, 200);

    ctx.fillStyle = '#8c7b7b';
    ctx.font = '16px monospace';
    ctx.fillText('TIME: MIDNIGHT MATINEE', 50, 250);
    ctx.fillText('SEAT: ROW 13, SEAT 4', 300, 250);

    const dataURL = canvas.toDataURL('image/jpeg', 0.9);
    
    document.getElementById('ticketPreviewImage').src = dataURL;
    document.getElementById('downloadLink').href = dataURL;
    document.getElementById('ticketPreviewContainer').style.display = 'block';
}
