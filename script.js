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

// Message List for rotation
const quotes = [
    "오늘도 힘내세요!",
    "당신의 도전을 마음 깊이 응원합니다.",
    "포기하지 않는 당신의 모습이 가장 아름답습니다.",
    "할 수 있어요, 조금 서툴고 느려도 괜찮습니다.",
    "오늘 하루도 정말 수고 많으셨습니다.",
    "가장 빛나는 별은 아직 뜨지 않았습니다."
];
let currentQuoteIndex = 0;

// Button gradients corresponding to each quote
const btnGradients = [
    { start: "#ff7e5f", end: "#feb47b", glow: "rgba(255, 126, 95, 0.3)", glowHover: "rgba(255, 126, 95, 0.5)" }, // 오렌지/핑크 (따뜻함)
    { start: "#06b6d4", end: "#3b82f6", glow: "rgba(6, 182, 212, 0.3)", glowHover: "rgba(6, 182, 212, 0.5)" }, // 시안/블루 (응원)
    { start: "#ec4899", end: "#8b5cf6", glow: "rgba(236, 72, 153, 0.3)", glowHover: "rgba(236, 72, 153, 0.5)" }, // 핑크/퍼플 (아름다움)
    { start: "#10b981", end: "#3b82f6", glow: "rgba(16, 185, 129, 0.3)", glowHover: "rgba(16, 185, 129, 0.5)" }, // 그린/블루 (성장)
    { start: "#f59e0b", end: "#ef4444", glow: "rgba(245, 158, 11, 0.3)", glowHover: "rgba(245, 158, 11, 0.5)" }, // 옐로우/레드 (수고)
    { start: "#1e3a8a", end: "#4f46e5", glow: "rgba(79, 70, 229, 0.3)", glowHover: "rgba(79, 70, 229, 0.5)" }  // 네이비/인디고 (별/우주)
];

// Button Click Burst Effect & Message Rotation
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
    
    // Rotate messages with fade effect & Change button colors
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        subtitle.classList.add('fade-out');
        setTimeout(() => {
            subtitle.textContent = quotes[currentQuoteIndex];
            
            // Set dynamic button gradient styles
            const gradient = btnGradients[currentQuoteIndex];
            btn.style.setProperty('--btn-color-1', gradient.start);
            btn.style.setProperty('--btn-color-2', gradient.end);
            btn.style.setProperty('--btn-glow', gradient.glow);
            btn.style.setProperty('--btn-glow-hover', gradient.glowHover);

            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            subtitle.classList.remove('fade-out');
        }, 300);
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
