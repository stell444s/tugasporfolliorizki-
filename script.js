document.addEventListener("DOMContentLoaded", function() {
    
    // --- HAMBURGER MENU LOGIC ---
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            if(hamburger) hamburger.classList.remove('toggle');
        });
    });

    // --- HIGH-PERFORMANCE SLIDING CAPSULE INDICATOR ---
    const indicator = document.querySelector('.nav-indicator');
    const sections = document.querySelectorAll('section, .hero-section');
    let isManualClick = false;

    function moveIndicator(element) {
        if (!element || !indicator) return;
        const targetLeft = element.offsetLeft;
        const targetWidth = element.offsetWidth;
        
        indicator.style.width = `${targetWidth}px`;
        indicator.style.transform = `translate3d(${targetLeft}px, 0, 0)`;
    }

    setTimeout(() => {
        const activeItem = document.querySelector('.nav-links a.active');
        if (activeItem) moveIndicator(activeItem);
    }, 50);

    navLinksItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            moveIndicator(e.target);
        });

        item.addEventListener('click', (e) => {
            isManualClick = true;
            navLinksItems.forEach(a => a.classList.remove('active'));
            e.target.classList.add('active');
            moveIndicator(e.target);
            
            setTimeout(() => {
                isManualClick = false;
            }, 600);
        });
    });

    navLinksContainer.addEventListener('mouseleave', () => {
        const activeItem = document.querySelector('.nav-links a.active');
        if (activeItem) moveIndicator(activeItem);
    });

    // Scroll Spy
    let isTicking = false;
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                if (!isManualClick) {
                    let current = '';
                    
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.clientHeight;
                        if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                            current = section.getAttribute('id');
                        }
                    });

                    navLinksItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('href') === `#${current}`) {
                            item.classList.add('active');
                            if (!navLinksContainer.matches(':hover')) {
                                moveIndicator(item);
                            }
                        }
                    });
                }
                isTicking = false;
            });
            isTicking = true;
        }
    });

    // --- ANIMASI SCROLL FADE-IN ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- FORM SUBMIT AJAX (SEAMLESS TANPA RELOAD) ---
    const form = document.getElementById("portfolio-form");
    const status = document.getElementById("form-status");
    const submitBtn = document.getElementById("btn-submit");

    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();
            const data = new FormData(event.target);
            
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    status.style.display = "block";
                    status.style.color = "#4ade80"; // Hijau
                    status.innerHTML = "✓ Pesan kamu berhasil dikirim! Terima kasih.";
                    form.reset();
                } else {
                    status.style.display = "block";
                    status.style.color = "#f87171"; // Merah
                    status.innerHTML = "Gagal mengirim pesan. Silakan coba lagi.";
                }
            } catch (error) {
                status.style.display = "block";
                status.style.color = "#f87171";
                status.innerHTML = "Terjadi masalah jaringan. Coba lagi nanti.";
            } finally {
                submitBtn.innerText = "Send Message";
                submitBtn.disabled = false;
            }
        });
    }
});