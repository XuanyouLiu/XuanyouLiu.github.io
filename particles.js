// Minimalist geometric shapes with mouse interaction
(function() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let mouseX = -1000, mouseY = -1000;
    let targetMouseX = -1000, targetMouseY = -1000;
    let time = 0;
    let shapes = [];
    
    // Resize canvas
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initShapes();
    }
    
    // Shape class
    class Shape {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 40 + 20;
            this.baseSize = this.size;
            this.rotation = Math.random() * Math.PI * 2;
            this.baseRotation = this.rotation;
            this.rotationSpeed = (Math.random() - 0.5) * 0.005;
            this.type = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
            this.phase = Math.random() * Math.PI * 2;
            this.floatSpeed = Math.random() * 0.3 + 0.1;
            this.opacity = Math.random() * 0.15 + 0.15;
        }
        
        update() {
            // Gentle floating motion
            const floatX = Math.sin(time * this.floatSpeed + this.phase) * 15;
            const floatY = Math.cos(time * this.floatSpeed * 0.7 + this.phase) * 10;
            
            // Mouse influence
            const dx = mouseX - this.baseX;
            const dy = mouseY - this.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 300;
            
            let pushX = 0, pushY = 0, sizeChange = 0, rotationChange = 0;
            
            if (dist < maxDist && mouseX > 0) {
                const force = (1 - dist / maxDist);
                const angle = Math.atan2(dy, dx);
                
                // Push away from mouse
                pushX = -Math.cos(angle) * force * 50;
                pushY = -Math.sin(angle) * force * 50;
                
                // Scale up slightly near mouse
                sizeChange = force * 15;
                
                // Rotate towards mouse
                rotationChange = force * 0.5;
            }
            
            this.x = this.baseX + floatX + pushX;
            this.y = this.baseY + floatY + pushY;
            this.size = this.baseSize + sizeChange;
            this.rotation = this.baseRotation + time * this.rotationSpeed + rotationChange;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                           document.documentElement.getAttribute('data-theme') !== 'light');
            const color = isDark ? '180, 170, 160' : '140, 130, 115';
            ctx.strokeStyle = `rgba(${color}, ${this.opacity})`;
            ctx.lineWidth = 1;
            
            switch(this.type) {
                case 0: // Circle
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                    
                case 1: // Square
                    ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    break;
                    
                case 2: // Triangle
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(this.size / 2, this.size / 2);
                    ctx.lineTo(-this.size / 2, this.size / 2);
                    ctx.closePath();
                    ctx.stroke();
                    break;
            }
            
            ctx.restore();
        }
    }
    
    // Initialize shapes
    function initShapes() {
        shapes = [];
        const count = Math.floor((width * height) / 25000); // More shapes
        for (let i = 0; i < Math.max(count, 15); i++) {
            shapes.push(new Shape());
        }
    }
    
    // Draw connecting lines between nearby shapes
    function drawConnections() {
        const maxDist = 250;
        
        for (let i = 0; i < shapes.length; i++) {
            for (let j = i + 1; j < shapes.length; j++) {
                const dx = shapes[i].x - shapes[j].x;
                const dy = shapes[i].y - shapes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(shapes[i].x, shapes[i].y);
                    ctx.lineTo(shapes[j].x, shapes[j].y);
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                              (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                               document.documentElement.getAttribute('data-theme') !== 'light');
                    const color = isDark ? '180, 170, 160' : '140, 130, 115';
                    ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        time += 0.01;
        
        // Smooth mouse following
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;
        
        // Draw connections first (behind shapes)
        drawConnections();
        
        // Update and draw shapes
        shapes.forEach(shape => {
            shape.update();
            shape.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Event listeners
    window.addEventListener('resize', resize);
    
    window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
        targetMouseX = -1000;
        targetMouseY = -1000;
    });
    
    // Touch support
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            targetMouseX = e.touches[0].clientX;
            targetMouseY = e.touches[0].clientY;
        }
    });
    
    window.addEventListener('touchend', () => {
        targetMouseX = -1000;
        targetMouseY = -1000;
    });
    
    // Initialize
    resize();
    animate();
})();
