/**
 * RAJAT NEGI - SEO & Performance Marketing Portfolio
 * Main Interactive Application Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initSkillTabs();
  initFunnelTabs();
  initRoasCalculator();
  initCounters();
  initClipboardUtils();
  initContactForm();
});

/* --- Navbar Scroll Effect --- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy for Active Nav Link
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --- Mobile Menu Drawer --- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.innerHTML = '☰';
    });
  });
}

/* --- Skill Tabs Filter --- */
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --- Case Study Funnel Accordion Tabs --- */
function initFunnelTabs() {
  const funnelBtns = document.querySelectorAll('.funnel-tab');
  const funnelPanels = document.querySelectorAll('.funnel-panel');

  funnelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      funnelBtns.forEach(b => b.classList.remove('active'));
      funnelPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* --- Interactive ROAS & Revenue Calculator --- */
function initRoasCalculator() {
  const spendSlider = document.getElementById('adSpendSlider');
  const spendDisplay = document.getElementById('adSpendVal');
  const channelBtns = document.querySelectorAll('.channel-btn');
  
  const estRevDisplay = document.getElementById('calcRevenue');
  const estRoasDisplay = document.getElementById('calcRoas');
  const estCpaDisplay = document.getElementById('calcCpa');

  let currentChannel = 'integrated'; // default multiplier

  const multipliers = {
    meta: { roas: 4.5, cpaRatio: 28 },
    google: { roas: 5.5, cpaRatio: 24 },
    integrated: { roas: 5.2, cpaRatio: 22 }
  };

  function updateCalculator() {
    if (!spendSlider) return;

    const spend = parseInt(spendSlider.value);
    spendDisplay.textContent = `$${spend.toLocaleString()}`;

    const config = multipliers[currentChannel];
    const revenue = Math.round(spend * config.roas);
    const estimatedOrders = Math.max(1, Math.round(spend / config.cpaRatio));
    const avgCpa = Math.round(spend / estimatedOrders);

    estRevDisplay.textContent = `$${revenue.toLocaleString()}`;
    estRoasDisplay.textContent = `${config.roas}x`;
    estCpaDisplay.textContent = `$${avgCpa}`;
  }

  if (spendSlider) {
    spendSlider.addEventListener('input', updateCalculator);
  }

  channelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      channelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentChannel = btn.getAttribute('data-channel');
      updateCalculator();
    });
  });

  updateCalculator();
}

/* --- Counter Animations on Scroll --- */
function initCounters() {
  const counterElements = document.querySelectorAll('.counter-val');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counterElements.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const suffix = counter.getAttribute('data-suffix') || '';
          const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
          let current = 0;
          const duration = 1500;
          const step = (target / duration) * 16;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = current.toFixed(decimals) + suffix;
          }, 16);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-banner-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* --- Copy to Clipboard & Toast Helper --- */
function initClipboardUtils() {
  const copyBtns = document.querySelectorAll('.copy-trigger');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(err => {
          showToast(`Failed to copy: ${err}`, true);
        });
      }
    });
  });
}

function showToast(message, isError = false) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (isError) toast.style.borderColor = '#ff5252';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* --- Interactive Contact Form Handler --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('formName');
    const name = nameInput ? nameInput.value.trim() : 'Marketer';

    showToast(`Thank you, ${name}! Your message has been sent to Rajat Negi.`);
    form.reset();
  });
}
