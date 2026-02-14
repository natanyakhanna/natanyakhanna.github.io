// 1. ADVANCED PARTICLE SYSTEM (NEURAL CONSTELLATION)
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let connections = [];
let width, height;

// Configuration for "Deep Space" theme
const CONFIG = {
    particleCount: 150, // Higher density
    connectionDistance: 120,
    mouseDistance: 200,
    colors: ['124, 58, 237', '244, 63, 94', '226, 232, 240'] // Violet, Rose, White
};

// Resize Handling
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resize();
    initParticles();
});

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; // Slow, floating movement
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (Gentle repulsion/attraction)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONFIG.mouseDistance) {
            const force = (CONFIG.mouseDistance - distance) / CONFIG.mouseDistance;
            const angle = Math.atan2(dy, dx);
            // Gentle attraction
            this.x += Math.cos(angle) * force * 0.5;
            this.y += Math.sin(angle) * force * 0.5;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
    }
}

// Mouse State
const mouse = { x: -1000, y: -1000 };
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function initParticles() {
    particles = [];
    // Adjust density based on screen size
    const pCount = window.innerWidth < 768 ? 60 : CONFIG.particleCount;
    for (let i = 0; i < pCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and Draw Particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw Connections
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.connectionDistance) {
                const opacity = 1 - (distance / CONFIG.connectionDistance);
                ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.4})`; // Violet connections
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Initialize
resize();
initParticles();
animate();


// 2. SCROLL REVEAL (SCROLLYTELLING)
// ============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Stagger childcare elements if they exist
            const children = entry.target.querySelectorAll('.stagger-item');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('active');
                }, index * 100);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// 3. NAVIGATION (GLASS EFFECT)
// ============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-[#0F0F23]/80', 'backdrop-blur-md', 'border-white/10', 'shadow-lg');
        navbar.classList.remove('border-transparent');
    } else {
        navbar.classList.remove('bg-[#0F0F23]/80', 'backdrop-blur-md', 'border-white/10', 'shadow-lg');
        navbar.classList.add('border-transparent');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

mobileMenuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
});

// Close menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    });
});


// 4. MEDIUM BLOG INTEGRATION
// ============================================
const RSS_URL = 'https://medium.com/feed/@natanyakhanna5';
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

async function fetchMediumPosts() {
    const loadingEl = document.getElementById('blog-loading');
    const postsEl = document.getElementById('blog-posts');
    const errorEl = document.getElementById('blog-error');

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status === 'ok') {
            loadingEl.classList.add('hidden');
            postsEl.classList.remove('hidden');

            // Limit to 3 posts
            const posts = data.items.slice(0, 3);

            posts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'glass-card rounded-2xl p-6 group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full';

                // Extract image (or use placeholder)
                let imgMatch = post.description.match(/<img[^>]+src="([^">]+)"/);
                let imgUrl = imgMatch ? imgMatch[1] : 'assets/images/placeholder-blog.jpg';

                // Clean description
                let cleanDesc = post.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

                card.innerHTML = `
                    <div class="h-48 mb-6 overflow-hidden rounded-xl bg-gray-800">
                        <img src="${imgUrl}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100">
                    </div>
                    <div class="flex-1 flex flex-col">
                        <div class="text-xs text-electric-400 font-bold uppercase tracking-widest mb-2">${new Date(post.pubDate).toLocaleDateString()}</div>
                        <h3 class="text-xl font-heading font-bold text-white mb-3 leading-tight group-hover:text-neon-500 transition-colors">${post.title}</h3>
                        <p class="text-gray-400 text-sm mb-6 flex-1">${cleanDesc}</p>
                        <a href="${post.link}" target="_blank" class="inline-flex items-center text-white font-medium hover:text-electric-400 transition-colors mt-auto">
                            Read Full Article <span class="ml-2">→</span>
                        </a>
                    </div>
                `;
                postsEl.appendChild(card);
            });
        } else {
            throw new Error('API Error');
        }
    } catch (error) {
        console.error('Blog fetch failed:', error);
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
    }
}

// Initialize Blog Fetch
fetchMediumPosts();

// Year Update
document.getElementById('current-year').textContent = new Date().getFullYear();
