// 1. Cinematic Loading Screen
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => { loader.style.display = 'none'; }, 1000); 
        }, 1500); 
    }
});

document.addEventListener("DOMContentLoaded", () => {
    
    // --- CUSTOM CURSOR LOGIC ---
    const cursor = document.getElementById("cursor");
    const cursorBlur = document.getElementById("cursor-blur");

    if (cursor && cursorBlur && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
            cursorBlur.style.left = e.clientX + "px";
            cursorBlur.style.top = e.clientY + "px";
        });

        const hoverElements = document.querySelectorAll('a, button, .movie-poster, .news-card, .gallery-item, input, textarea, select');
        hoverElements.forEach(el => {
            el.addEventListener("mouseenter", () => cursor.classList.add("hover-active"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("hover-active"));
        });
    }

    // --- 3D CARD TILT LOGIC ---
    const tiltElements = document.querySelectorAll('.movie-poster, .news-card');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // --- TEXT SCRAMBLE REVEAL ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    
    function scrambleText(element) {
        let iterations = 0;
        const originalText = element.dataset.value || element.innerText;
        element.dataset.value = originalText; 
        
        const interval = setInterval(() => {
            element.innerText = originalText.split("").map((letter, index) => {
                if(index < iterations) return originalText[index];
                return letters[Math.floor(Math.random() * letters.length)];
            }).join("");
            
            if(iterations >= originalText.length) clearInterval(interval);
            iterations += 1 / 3; 
        }, 30);
    }

    const scrambleHeaders = document.querySelectorAll('h2');
    scrambleHeaders.forEach(h2 => h2.classList.add('scramble-text'));

    // --- SCROLL REVEAL ANIMATION ---
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                const h2 = entry.target.tagName === 'H2' ? entry.target : entry.target.querySelector('h2');
                if(h2 && h2.classList.contains('scramble-text') && !h2.dataset.scrambled) {
                    scrambleText(h2);
                    h2.dataset.scrambled = "true"; 
                }
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden, h2');
    hiddenElements.forEach(el => observer.observe(el));


    // --- FUNCTIONAL AUDIO PLAYER ---
    const tracks = document.querySelectorAll('.track');
    let currentAudio = null;

    tracks.forEach(track => {
        const btn = track.querySelector('.listen-btn');
        const audio = track.querySelector('audio');
        const equalizer = track.querySelector('.equalizer');

        if(btn && audio) {
            btn.addEventListener('click', () => {
                if (currentAudio === audio && !audio.paused) {
                    audio.pause();
                    btn.innerText = "LISTEN";
                    btn.classList.remove('playing');
                    equalizer.classList.remove('active');
                    return;
                }

                document.querySelectorAll('audio').forEach(a => a.pause());
                document.querySelectorAll('.listen-btn').forEach(b => {
                    b.innerText = "LISTEN";
                    b.classList.remove('playing');
                });
                document.querySelectorAll('.equalizer').forEach(eq => eq.classList.remove('active'));

                audio.play().catch(e => console.log("Audio play blocked: ", e));
                currentAudio = audio;
                btn.innerText = "PAUSE";
                btn.classList.add('playing');
                equalizer.classList.add('active');
            });
        }
    });

    // --- BTS LIGHTBOX GALLERY ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    if (lightbox && closeLightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                lightboxImg.src = imgSrc;
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
            });
        });

        const closeGallery = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        closeLightbox.addEventListener('click', closeGallery);
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) closeGallery();
        });
    }

    // --- CINEMATIC TRAILER MODAL LOGIC ---
    const trailerModal = document.getElementById('trailer-modal');
    const trailerFrame = document.getElementById('trailer-frame');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    if (trailerModal && closeModalBtn) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = trigger.getAttribute('data-trailer');
                trailerFrame.src = videoUrl; 
                trailerModal.classList.add('active');
                trailerModal.setAttribute('aria-hidden', 'false');
            });
        });

        const closeModal = () => {
            trailerModal.classList.remove('active');
            trailerModal.setAttribute('aria-hidden', 'true');
            setTimeout(() => { trailerFrame.src = ""; }, 400); // Stop video audio
        };

        closeModalBtn.addEventListener('click', closeModal);

        trailerModal.addEventListener('click', (e) => {
            if (e.target === trailerModal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (trailerModal.classList.contains('active')) closeModal();
                if (lightbox && lightbox.classList.contains('active')) {
                    lightbox.classList.remove('active');
                    lightbox.setAttribute('aria-hidden', 'true');
                }
            }
        });
    }
});