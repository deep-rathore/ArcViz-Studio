// Register plugins
gsap.registerPlugin(ScrollTrigger);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// Hero headline animation — stagger each .line
gsap.from('.hero-headline .line', {
    y: 80, 
    opacity: 0, 
    duration: 1.2,
    stagger: 0.15, 
    ease: 'expo.out', 
    delay: 0.5
});
gsap.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.8, delay: 0.3 });
gsap.from('.hero-sub', { y: 20, opacity: 0, duration: 0.8, delay: 1.0 });
gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, delay: 1.2 });
gsap.from('.hero-stats .stat', {
    y: 20, 
    opacity: 0, 
    duration: 0.8, 
    stagger: 0.1, 
    delay: 1.4
});
gsap.from('.scroll-indicator', { opacity: 0, duration: 1, delay: 2 });

// Navbar mobile menu
document.querySelector('.hamburger').addEventListener('click', () => {
    document.getElementById('mobileOverlay').classList.add('open');
});

function closeMobile() {
    document.getElementById('mobileOverlay').classList.remove('open');
}

document.querySelector('.mobile-close').addEventListener('click', closeMobile);

// Services — alternating slide-in
gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        x: i % 2 === 0 ? -60 : 60,
        opacity: 0, 
        duration: 0.9, 
        ease: 'power2.out'
    });
});

// Projects list — stagger fade in
gsap.from('.project-item', {
    scrollTrigger: { trigger: '.projects-list', start: 'top 70%' },
    y: 40, 
    opacity: 0, 
    stagger: 0.12, 
    duration: 0.8, 
    ease: 'power2.out'
});

// Project hover — name turns gold
document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item.querySelector('.project-name'), { color: '#B8955A', duration: 0.3 });
        gsap.to(item, { borderLeftColor: '#B8955A', duration: 0.3 });
    });
    item.addEventListener('mouseleave', () => {
        gsap.to(item.querySelector('.project-name'), { color: '', duration: 0.3 });
        gsap.to(item, { borderLeftColor: 'transparent', duration: 0.3 });
    });
});

// HORIZONTAL SCROLL — Process section
const processTrack = document.querySelector('.process-track');
if (processTrack) {
    if (window.innerWidth > 768) {
        const steps = document.querySelectorAll('.process-step');
        if (steps.length > 0) {
            const stepWidth = steps[0].offsetWidth + 40; // card width + gap
            const totalWidth = (stepWidth * steps.length) - window.innerWidth + (window.innerWidth * 0.1);

            gsap.to(processTrack, {
                x: -totalWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#process',
                    start: 'top top',
                    end: '+=' + totalWidth,
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        const fill = document.querySelector('.process-progress-fill');
                        if (fill) fill.style.width = (self.progress * 100) + '%';
                    }
                }
            });
        }
    } else {
        // on mobile just fade in each step
        gsap.from('.process-step', {
            scrollTrigger: { trigger: '.process-track', start: 'top 80%' },
            y: 40, opacity: 0, stagger: 0.15, duration: 0.8
        });
    }
}

// Contact headline word reveal
const contactHeadline = document.querySelector('.contact-headline');
if (contactHeadline) {
    const contactWords = contactHeadline.textContent.split(' ');
    contactHeadline.innerHTML = contactWords.map(w => 
        `<span class="word" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${w}</span></span>`
    ).join(' ');
    
    gsap.from('.contact-headline .word span', {
        scrollTrigger: { trigger: '#contact', start: 'top 70%' },
        y: '100%', 
        opacity: 0, 
        stagger: 0.05, 
        duration: 0.8, 
        ease: 'power3.out'
    });
}

// Contact details list items
gsap.from('.contact-item', {
    scrollTrigger: { trigger: '.contact-info', start: 'top 70%' },
    x: -30, 
    opacity: 0, 
    stagger: 0.1, 
    duration: 0.7, 
    ease: 'power2.out'
});
