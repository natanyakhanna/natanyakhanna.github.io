// ============================================
// Portfolio Website JavaScript
// Natanya Khanna - Psychology Portfolio
// ============================================

// ============================================
// 1. NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }

    lastScrollTop = scrollTop;
});

// ============================================
// 2. MOBILE MENU TOGGLE
// ============================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    });
});

// ============================================
// 3. SMOOTH SCROLL FOR NAVIGATION
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// 4. SCROLL-REVEAL ANIMATIONS
// ============================================
const revealElements = document.querySelectorAll('.reveal');
const fadeInElements = document.querySelectorAll('.fade-in');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optionally unobserve after reveal
            // revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all reveal elements
revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Observe fade-in elements
fadeInElements.forEach(element => {
    revealObserver.observe(element);
});

// ============================================
// 5. MEDIUM BLOG INTEGRATION
// ============================================
const blogPostsContainer = document.getElementById('blog-posts');
const blogLoading = document.getElementById('blog-loading');
const blogError = document.getElementById('blog-error');

// Fetch Medium articles via RSS2JSON API
async function fetchMediumPosts() {
    const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@natanyakhanna5';

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
            // Take the first 3 posts
            const posts = data.items.slice(0, 3);
            renderBlogPosts(posts);
        } else {
            showBlogError();
        }
    } catch (error) {
        console.error('Error fetching Medium posts:', error);
        showBlogError();
    }
}

// Render blog posts to the DOM
function renderBlogPosts(posts) {
    blogLoading.classList.add('hidden');
    blogPostsContainer.classList.remove('hidden');

    posts.forEach(post => {
        const postCard = createBlogCard(post);
        blogPostsContainer.appendChild(postCard);
    });

    // Apply reveal animation to newly added cards
    const newCards = blogPostsContainer.querySelectorAll('.blog-card');
    newCards.forEach(card => {
        revealObserver.observe(card);
    });
}

// Create individual blog card
function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card reveal bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105';

    // Extract image from content (Medium includes images in description)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.description;
    const imgElement = tempDiv.querySelector('img');
    const thumbnail = imgElement ? imgElement.src : 'https://via.placeholder.com/400x250/14B8A6/ffffff?text=Article';

    // Extract text excerpt (remove HTML tags)
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    const excerpt = textContent.substring(0, 150) + '...';

    // Format date
    const postDate = new Date(post.pubDate);
    const formattedDate = postDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="aspect-video bg-gradient-to-br from-teal-100 to-sage-100 overflow-hidden">
            <img src="${thumbnail}" alt="${post.title}" 
                class="w-full h-full object-cover"
                onerror="this.src='https://via.placeholder.com/400x250/14B8A6/ffffff?text=Article'">
        </div>
        <div class="p-6">
            <p class="text-sm text-teal-500 font-medium mb-2">${formattedDate}</p>
            <h3 class="text-xl font-heading font-semibold mb-3 text-neutral-warm-600 line-clamp-2">${post.title}</h3>
            <p class="text-neutral-warm-600 mb-4 leading-relaxed line-clamp-3">${excerpt}</p>
            <a href="${post.link}" target="_blank" rel="noopener noreferrer" 
                class="inline-flex items-center text-teal-500 hover:text-teal-600 font-medium transition-colors duration-300">
                Read More
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
    `;

    return card;
}

// Show error state
function showBlogError() {
    blogLoading.classList.add('hidden');
    blogError.classList.remove('hidden');
}

// Initialize blog posts on page load
fetchMediumPosts();

// ============================================
// 6. CONTACT FORM VALIDATION & HANDLING
// ============================================
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Here you would typically send the form data to a backend service
    // For now, we'll just show a success message

    // Show success message
    formSuccess.classList.remove('hidden');

    // Reset form
    contactForm.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
        formSuccess.classList.add('hidden');
    }, 5000);

    // In a real implementation, you might use:
    // - EmailJS (https://www.emailjs.com/)
    // - Formspree (https://formspree.io/)
    // - Your own backend API

    console.log('Form submitted:', { name, email, message });
});

// ============================================
// 7. DYNAMIC YEAR IN FOOTER
// ============================================
document.getElementById('current-year').textContent = new Date().getFullYear();

// ============================================
// 8. PERFORMANCE OPTIMIZATION
// ============================================
// Debounce scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        // Scroll-based logic is handled above
    });
}, { passive: true });

// ============================================
// 9. ACCESSIBILITY ENHANCEMENTS
// ============================================
// Add keyboard navigation for mobile menu
mobileMenuBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mobileMenuBtn.click();
    }
});

// ============================================
// 10. INIT MESSAGE
// ============================================
console.log('🎓 Natanya Khanna - Psychology Portfolio');
console.log('💚 Website loaded successfully!');
console.log('🔗 Connect: https://medium.com/@natanyakhanna5');

// ============================================
// 11. NEURAL NETWORK BACKGROUND ANIMATION
// ============================================
class NeuralNetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('neural-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.initParticles();
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
            this.initParticles();
        });

        // Mouse interaction
        this.mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        this.particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 15000), 100);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse interaction (repel)
            if (this.mouse.x != null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    const angle = Math.atan2(dy, dx);
                    // Push away
                    p.vx -= Math.cos(angle) * 0.02;
                    p.vy -= Math.sin(angle) * 0.02;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(20, 184, 166, 0.4)'; // Teal-500
            this.ctx.fill();
        });

        // Draw connections
        this.connectParticles();

        requestAnimationFrame(() => this.animate());
    }

    connectParticles() {
        const maxDistance = 150;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(20, 184, 166, ${0.3 * (1 - distance / maxDistance)})`; // Fade out
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

// Initialize only if canvas exists
if (document.getElementById('neural-canvas')) {
    // Small delay to ensure container size is correct
    setTimeout(() => {
        new NeuralNetworkAnimation();
    }, 100);
}
