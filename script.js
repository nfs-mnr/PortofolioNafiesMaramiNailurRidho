/* =============================================
   PORTFOLIO — script.js
   ============================================= */

// ── 1. NAVBAR: sticky + active link highlight ──────────────────────────────
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-links a');
const sections  = document.querySelectorAll('section[id]');
const navToggle = document.getElementById('navToggle');
const navList   = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  // Tambah class "scrolled" saat scroll > 50px
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Highlight nav link sesuai section yang sedang terlihat
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });

  // Tombol back-to-top
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

// ── 2. MOBILE NAV TOGGLE ──────────────────────────────────────────────────
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navList.classList.toggle('open');
});

// Tutup menu saat klik salah satu link
navLinks.forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navList.classList.remove('open');
  });
});

// ── 3. TYPING ANIMATION ───────────────────────────────────────────────────
const roles = [
  'Telecommunication Engineering',
  'Radio Frequency Engineering',
  'Research Assistant Nano Satellite Laboratory',
  'Satellite Enthusiast',
];

const typedEl = document.getElementById('typedText');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentRole.length) {
    // Selesai mengetik — tunggu sebelum hapus
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Selesai menghapus — pindah ke role berikutnya
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

type();

// ── 4. COUNTER ANIMASI (About stats) ─────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

// ── 5. INTERSECTION OBSERVER — reveal + trigger skill bars & counters ─────
const revealEls = document.querySelectorAll('.section, .project-card, .timeline-item, .skill-category');
const skillBars = document.querySelectorAll('.skill-bar-fill');
const counters  = document.querySelectorAll('.stat-number');

// Tambahkan class reveal ke semua elemen animatable
revealEls.forEach(el => el.classList.add('reveal'));

const observerOptions = { threshold: 0.15 };

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, observerOptions);

revealEls.forEach(el => revealObserver.observe(el));

// Skill bars — animate width saat masuk viewport
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const bar = entry.target;
    bar.style.width = bar.dataset.width + '%';
    barObserver.unobserve(bar);
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

// Counters — animate saat masuk viewport
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ── 6. PROJECT FILTER TABS ────────────────────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        // Kecil animasi masuk
        card.style.animation = 'none';
        card.offsetHeight; // reflow trick
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── 7. CONTACT FORM VALIDATION ────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const btnText     = document.getElementById('btnText');
const formSuccess = document.getElementById('formSuccess');

function validateField(inputId, errorId, validator) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  const msg   = validator(input.value.trim());

  if (msg) {
    error.textContent = msg;
    input.classList.add('error');
    return false;
  }
  error.textContent = '';
  input.classList.remove('error');
  return true;
}

const validators = {
  name:    v => !v ? 'Nama tidak boleh kosong.' : v.length < 2 ? 'Nama terlalu pendek.' : '',
  email:   v => !v ? 'Email tidak boleh kosong.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Format email tidak valid.' : '',
  subject: v => !v ? 'Subjek tidak boleh kosong.' : '',
  message: v => !v ? 'Pesan tidak boleh kosong.' : v.length < 10 ? 'Pesan terlalu pendek (min 10 karakter).' : '',
};

// Live validation saat user selesai mengisi field
['name', 'email', 'subject', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('blur', () => {
    validateField(id, `${id}Error`, validators[id]);
  });
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validasi semua field
  const isValid = ['name', 'email', 'subject', 'message']
    .map(id => validateField(id, `${id}Error`, validators[id]))
    .every(Boolean);

  if (!isValid) return;

  submitBtn.disabled = true;
  btnText.textContent = 'Mengirim...';

  try {
    const response = await fetch('https://formspree.io/f/xykrkgqn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    document.getElementById('name').value,
        email:   document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
      }),
    });

    if (response.ok) {
      contactForm.reset();
      formSuccess.classList.add('visible');
      setTimeout(() => formSuccess.classList.remove('visible'), 5000);
    } else {
      btnText.textContent = 'Gagal kirim, coba lagi.';
    }
  } catch (err) {
    btnText.textContent = 'Gagal kirim, coba lagi.';
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = 'Kirim Pesan 🚀';
  }
});

// ── 8. BACK TO TOP ────────────────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 9. FOOTER YEAR ────────────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── 10. SMOOTH SCROLL untuk semua anchor ──────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // tinggi navbar
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
