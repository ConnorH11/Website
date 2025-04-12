const navbar = document.getElementById("navbar");
const nav = document.querySelector("nav");
let lastScrollTop = 0;



window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY === 0) {
    navbar.style.top = '0';
  } else {
    navbar.style.top = '-100px'; // Adjust this value based on your navbar's height
  }
});
// Toggle mobile menu
document.getElementById('hamburger').addEventListener('click', function() {
  document.getElementById('mobileMenu').classList.toggle('active');
});



