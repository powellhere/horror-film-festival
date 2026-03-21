let currentMovie = ""; 

function openTicketModal(movieTitle) {
    currentMovie = movieTitle;
    document.getElementById('ticketModal').style.display = 'block';
    document.getElementById('ticketPreviewContainer').style.display = 'none';
    document.getElementById('viewerName').value = '';
}

function closeTicketModal() {
    document.getElementById('ticketModal').style.display = 'none';
}

function generateTicket() {
    const nameInput = document.getElementById('viewerName').value.trim() || 'GUEST';
    const canvas = document.getElementById('ticketCanvas');
    const ctx = canvas.getContext('2d');
    
    const bgImage = new Image();
    bgImage.src = 'images/ticket-placeholder.jpg'; 
    
    bgImage.onload = function() {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        drawText(ctx, nameInput);
    };

    bgImage.onerror = function() {
        ctx.fillStyle = '#2c2c2c'; 
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

    ctx.fillStyle = '#a89f91';
    ctx.font = '20px monospace';
    ctx.fillText('ADMIT ONE:', 50, 200);
    
    ctx.fillStyle = '#8b0000'; 
    ctx.font = 'bold 28px monospace';
    ctx.fillText(userName.toUpperCase(), 180, 200);

    ctx.fillStyle = '#a89f91';
    ctx.font = '16px monospace';
    ctx.fillText('TIME: MIDNIGHT MATINEE', 50, 250);
    ctx.fillText('SEAT: ROW 13, SEAT 4', 300, 250);

    const dataURL = canvas.toDataURL('image/jpeg', 0.9);
    
    document.getElementById('ticketPreviewImage').src = dataURL;
    document.getElementById('downloadLink').href = dataURL;
    document.getElementById('ticketPreviewContainer').style.display = 'block';
}
