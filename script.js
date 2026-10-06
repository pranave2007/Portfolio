// ===================== THEME TOGGLE =====================
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

// ===================== NAVBAR SCROLL STATE =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('show', window.scrollY > 500);
}, { passive: true });

// ===================== MOBILE MENU =====================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===================== ACTIVE NAV LINK ON SCROLL =====================
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => sectionObserver.observe(s));

// ===================== SCROLL REVEAL =====================
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealItems.forEach(el => revealObserver.observe(el));

// ===================== SKILL BAR FILL =====================
const bars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.level + '%';
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
bars.forEach(b => barObserver.observe(b));

// ===================== HERO TYPING ANIMATION =====================
const roles = ['for the web.', 'with AI.', 'full stack apps.', 'clean, working code.'];
const typedEl = document.getElementById('typed');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 75);
}
typeLoop();

// ===================== TERMINAL "whoami" SEQUENCE =====================
const terminalBody = document.getElementById('terminalBody');
const whoamiLines = [
  { key: 'name', value: 'Pranav Ethapay' },
  { key: 'role', value: 'Full Stack Developer & AI Enthusiast' },
  { key: 'year', value: 'Second-Year B.Tech · CSE' },
  { key: 'stack', value: 'C · Python · Java · SQL · JavaScript' },
  { key: 'status', value: 'Open to internships' }
];

function typeText(el, text, speed = 22) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) { clearInterval(interval); resolve(); }
    }, speed);
  });
}

async function runTerminal() {
  await new Promise(r => setTimeout(r, 700));
  for (const line of whoamiLines) {
    const p = document.createElement('p');
    const keySpan = document.createElement('span');
    keySpan.className = 'out-key';
    keySpan.textContent = `${line.key}: `;
    p.appendChild(keySpan);
    const valSpan = document.createElement('span');
    p.appendChild(valSpan);
    terminalBody.appendChild(p);
    await typeText(valSpan, line.value, 18);
    await new Promise(r => setTimeout(r, 200));
  }
  const promptLine = document.createElement('p');
  promptLine.innerHTML = `<span class="prompt">$</span> <span class="terminal-cursor"></span>`;
  terminalBody.appendChild(promptLine);
}
runTerminal();

// ===================== CURSOR GLOW =====================
const cursorGlow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
}, { passive: true });

// ===================== GITHUB STATS (LIVE) =====================
async function loadGithubStats() {
  try {
    const res = await fetch('https://api.github.com/users/pranave2007');
    if (!res.ok) throw new Error('GitHub API error');
    const data = await res.json();
    animateCount('statRepos', data.public_repos ?? 0);
    animateCount('statFollowers', data.followers ?? 0);
    animateCount('statFollowing', data.following ?? 0);
  } catch (err) {
    ['statRepos', 'statFollowers', 'statFollowing'].forEach(id => {
      document.getElementById(id).textContent = '—';
    });
  }
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 30));
  const interval = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = current;
  }, 40);
}
loadGithubStats();

// ===================== CONTACT FORM =====================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    formNote.textContent = 'Please fill in every field before sending.';
    return;
  }

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:pranav.example@gmail.com?subject=${subject}&body=${body}`;
  formNote.textContent = 'Opening your email client...';
  contactForm.reset();
});

// ===================== BACK TO TOP =====================
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== FOOTER YEAR =====================
document.getElementById('year').textContent = new Date().getFullYear();
