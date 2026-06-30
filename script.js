// Particle Background System
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const particleCount = 60;

// Mouse coordinates
let mouse = {
    x: null,
    y: null,
    radius: 120
};

// Set Canvas Size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Constructor
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.baseX = this.x;
        this.baseY = this.y;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screens
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Mouse interaction (gentle push)
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;
                
                // Move away from mouse
                this.x -= directionX * force * 1.5;
                this.y -= directionY * force * 1.5;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${this.opacity})`;
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particlesArray = [];
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}

// Draw connection lines if particles are close (constellation effect)
function drawLines() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                opacityValue = (1 - (distance / 100)) * 0.15;
                ctx.strokeStyle = `rgba(165, 180, 252, ${opacityValue})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    drawLines();
    requestAnimationFrame(animate);
}

// Button Click Burst Effect
const btn = document.getElementById('explore-btn');
btn.addEventListener('click', () => {
    // Add temporary burst particles
    for (let i = 0; i < 30; i++) {
        let p = new Particle();
        // Spawn around the button
        const rect = btn.getBoundingClientRect();
        p.x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
        p.y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 40;
        
        // Faster speed for burst
        p.speedX = (Math.random() - 0.5) * 5;
        p.speedY = (Math.random() - 0.5) * 5;
        p.opacity = 1.0;
        
        // Decay speed
        const originalUpdate = p.update;
        p.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.02;
            if (this.opacity < 0) this.opacity = 0;
        };
        
        particlesArray.push(p);
    }
    
    // Smooth card pop animation on click
    const card = document.getElementById('main-card');
    card.style.transform = 'scale(0.98) translateY(-5px)';
    setTimeout(() => {
        card.style.transform = 'scale(1) translateY(-5px)';
    }, 150);
});

// Setup
resizeCanvas();
initParticles();
animate();
