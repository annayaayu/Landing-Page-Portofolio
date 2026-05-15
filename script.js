AOS.init({
  once: true,
  duration: 800,
  easing: 'ease-out-cubic',
});

// SIDEBAR-NAV 
const sections = document.querySelectorAll('section[id]');
const navIcons = document.querySelectorAll('.nav-icon');

function updateActiveNav() {
  let currentId = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= window.innerHeight * 0.5) currentId = sec.id;
  });
  navIcons.forEach(icon => {
    const href = icon.getAttribute('href').replace('#', '');
    icon.classList.toggle('active', href === currentId);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

// SKILL-BAR-ANIMATE 
const skillBars = document.querySelectorAll('.skill-bar');

const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;

      bar.style.width = bar.dataset.width + '%';
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

// PROJECT-SLIDER
const slider = document.getElementById('projectSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsWrap = document.getElementById('sliderDots');
const cards = slider ? slider.querySelectorAll('.project-card') : [];

function getCardsPerView() {
  if (window.innerWidth >= 992) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

let currentSlide = 0;
let totalSlides = Math.ceil(cards.length / getCardsPerView());

function buildDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  totalSlides = Math.ceil(cards.length / getCardsPerView());
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === currentSlide ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }
}

// [GO-TO-SLIDE] Pindah ke slide tertentu
function goToSlide(index) {
  const perView = getCardsPerView();
  const cardW = slider.offsetWidth / perView;
  currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
  slider.scrollLeft = currentSlide * cardW * perView;
  // Update dots aktif
  dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Rebuild dots saat resize
window.addEventListener('resize', () => {
  buildDots();
  goToSlide(0);
});

buildDots();

// CONTACT-FORM] Tombol send form + toast notifikasi
const sendBtn = document.getElementById('sendBtn');

const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const phoneInput = document.getElementById('phoneInput');
const messageInput = document.getElementById('messageInput');

const toast = document.getElementById('toastNotif');
const toastText = document.getElementById('toastText');

function showToast(message, success = true) {

  toastText.textContent = message;

  // Ganti warna notif
  if (success) {
    toast.style.background =
      'linear-gradient(135deg, #3b82c4, #2563a8)';
  } else {
    toast.style.background =
      'linear-gradient(135deg, #ef4444, #b91c1c)';
  }

  toast.classList.add('show');

  // Hilangkan otomatis
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

sendBtn.addEventListener('click', function (e) {

  e.preventDefault();

  // Validasi form kosong
  if (
    nameInput.value.trim() === '' ||
    emailInput.value.trim() === '' ||
    phoneInput.value.trim() === '' ||
    messageInput.value.trim() === ''
  ) {

    showToast('All fields must be filled in!', false);
    return;
  }

  showToast('Message sent successfully!', true);

  // Reset form
  nameInput.value = '';
  emailInput.value = '';
  phoneInput.value = '';
  messageInput.value = '';
});

//SMOOTH-SCROLL] Smooth scroll untuk semua link anchor
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

//SCROLL-REVEAL] Efek judul section muncul dengan warna
const titleObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section-title').forEach(title => {
  title.style.opacity = '0';
  title.style.transform = 'translateY(24px)';
  title.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  titleObserver.observe(title);
});

//HERO-TYPING] Efek ketik teks di hero greeting
const greetEl = document.querySelector('.hero-greeting');
if (greetEl) {
  const text = greetEl.textContent;
  greetEl.textContent = '';
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      greetEl.textContent += text[i++];
      setTimeout(typeChar, 80);
    }
  }
  setTimeout(typeChar, 400);
}

//SCROLL-TOP] Tombol scroll ke atas (muncul setelah scroll 300px)
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
scrollTopBtn.id = 'scrollTopBtn';
scrollTopBtn.style.cssText = `
  position:fixed; bottom:32px; left:32px; z-index:990;
  width:44px; height:44px; border-radius:50%;
  background:linear-gradient(135deg,#3b82c4,#2563a8);
  color:#fff; border:none; font-size:1.1rem;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 4px 16px rgba(59,130,196,0.35);
  cursor:pointer; opacity:0; transform:translateY(20px);
  transition:all 0.35s cubic-bezier(.4,0,.2,1);
`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.opacity = '1';
    scrollTopBtn.style.transform = 'translateY(0)';
  } else {
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.transform = 'translateY(20px)';
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar-nav");
const overlay = document.getElementById("sidebarOverlay");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});