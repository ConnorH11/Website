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
});
