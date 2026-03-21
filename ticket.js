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
    
    const bgImage = new Image();
    
    // ==========================================
    // 2. 核心逻辑：随机抽取图片
    // ==========================================
    // 根据当前电影名去图库池里找对应的数组
    let imageArray = movieBackgrounds[currentMovie];
    
    // 容错处理：如果没找到对应的电影，或者数组是空的，就用默认占位图
    if (!imageArray || imageArray.length === 0) {
        imageArray = ['images/ticket-placeholder.jpg'];
    }
    
    // 生成一个随机索引 (比如有3张图，就是 0, 1, 或 2)
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    
    // 把抽到的图片路径赋值给画布
    bgImage.src = imageArray[randomIndex]; 
    
    bgImage.onload = function() {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        drawText(ctx, nameInput);
    };

    bgImage.onerror = function() {
        // 如果你的图片路径写错了或者图片还没传上去，就用代码画个红黑框兜底
        ctx.fillStyle = '#1a1111'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#8b0000'; 
        ctx.lineWidth = 10;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        drawText(ctx, nameInput);
    };
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
