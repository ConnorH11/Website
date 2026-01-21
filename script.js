// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 10px 30px -10px rgba(2, 12, 27, 0.7)";
            navbar.style.height = "70px";
        } else {
            navbar.style.boxShadow = "none";
            navbar.style.height = "80px";
        }
    });

    // Intersection Observer for Section Animations ("The Flow")
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-section');
                // Optional: Stop observing once shown if you want it to trigger only once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenSections = document.querySelectorAll('.hidden-section');
    hiddenSections.forEach((el) => observer.observe(el));

    // Active Link Highlighting - Improved scroll-spy
    const navSections = ['home', 'projects', 'articles', 'experience', 'about', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + window.innerHeight * 0.4;
        let currentSection = 'home';

        // Find the nav section we're currently in or past
        for (let i = navSections.length - 1; i >= 0; i--) {
            const section = document.getElementById(navSections[i]);
            if (section && scrollPos >= section.offsetTop) {
                currentSection = navSections[i];
                break;
            }
        }

        // Update desktop nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // Update mobile nav links
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call

    // Mobile Menu
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Projects Carousel Logic
    const track = document.querySelector('.projects-track');
    // If track doesn't exist (e.g. if we are on a page without it), skip logic
    if (track) {
        const prevButton = document.querySelector('.prev-btn');
        const nextButton = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.carousel-dots');

        // --- SEAMLESS LOOOP SETUP ---
        // 1. Get original cards
        let originalCards = Array.from(document.querySelectorAll('.project-card'));
        const totalOriginal = originalCards.length;

        // 2. Clone cards for infinite effect
        // We clone the ENTIRE set and append it to end, and prepend to start.
        // Structure: [Clone Set Prev] [Original Set] [Clone Set Next]
        // This ensures that we always have content to scroll into.

        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        // Prepend clones (reverse order adding or just map)
        originalCards.slice().reverse().forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.insertBefore(clone, track.firstChild);
        });

        // Now we have 3x the cards.
        // The "real" set starts at index = totalOriginal.
        let currentIndex = totalOriginal;
        let isTransitioning = false;

        // Re-query all cards (original + clones)
        let allCards = document.querySelectorAll('.project-card');

        // --- DOTS (Only for original count) ---
        function createDots() {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalOriginal; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active'); // Start at 0 relative
                dot.addEventListener('click', () => {
                    if (isTransitioning) return;
                    // Jump to the specific card in the Middle (Primary) Set
                    currentIndex = totalOriginal + i;
                    track.style.transition = 'transform 0.5s ease-in-out';
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        }
        createDots();

        function updateDots() {
            // Determine "real" index (0 to totalOriginal-1)
            // logicalIndex maps any currentIndex to the 0..3 range
            let realIndex = (currentIndex - totalOriginal) % totalOriginal;

            // Javascript modulo of negative numbers is weird, but our index should stay positive 
            // with the reset logic. If it does dip below, handle it:
            if (realIndex < 0) realIndex += totalOriginal;

            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === realIndex);
            });
        }

        function updateCarousel() {
            const card = allCards[0];
            const cardWidth = card.getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 32;
            const itemWidth = cardWidth + gap;

            track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            updateDots();
        }

        // --- BUTTONS ---
        nextButton.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            track.style.transition = 'transform 0.5s ease-in-out';
            currentIndex++;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            track.style.transition = 'transform 0.5s ease-in-out';
            currentIndex--;
            updateCarousel();
        });

        // --- TRANSITION END (The Jump) ---
        track.addEventListener('transitionend', () => {
            isTransitioning = false;

            // Check boundaries
            // [Clone Prev (0..N-1)] [Original (N..2N-1)] [Clone Next (2N..3N-1)]

            // If we moved into [Clone Next], jump back to [Original]
            // The start of Clone Next is index 2 * totalOriginal
            if (currentIndex >= 2 * totalOriginal) {
                track.style.transition = 'none'; // Disable animation for jump
                currentIndex = currentIndex - totalOriginal;
                updateCarousel();
            }

            // If we moved into [Clone Prev], jump forward to [Original]
            // The end of Clone Prev is index totalOriginal - 1. 
            // So if currentIndex < totalOriginal, we are in prev zone.
            if (currentIndex < totalOriginal) {
                track.style.transition = 'none';
                currentIndex = currentIndex + totalOriginal;
                updateCarousel();
            }
        });

        // Initialize (Start at the first card of the middle set)
        // setTimeout to allow layout to settle
        setTimeout(() => {
            allCards = document.querySelectorAll('.project-card'); // ensure we grab them all
            track.style.transition = 'none'; // Initial positioning no anim
            updateCarousel();
        }, 100);

        // Update on resize
        window.addEventListener('resize', () => {
            track.style.transition = 'none'; // prevent wobble during resize
            updateCarousel();
        });
    }
});
