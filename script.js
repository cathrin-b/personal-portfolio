/* ═══════════════════════════════════════════
   RED × BLACK — SPA PORTFOLIO SCRIPT
   ═══════════════════════════════════════════ */

// ── State ────────────────────────────────────
let currentView = 'home';
let isTransitioning = false;

// ── DOM references ───────────────────────────
const views        = document.querySelectorAll('.view');
const navBtns      = document.querySelectorAll('.nav-btn');
const piDots       = document.querySelectorAll('.pi-dot');
const mobNavBtns   = document.querySelectorAll('.mob-nav-btn');
const transition   = document.getElementById('page-transition');
const mobToggle    = document.getElementById('mob-toggle');
const mobDrawer    = document.getElementById('mob-drawer');

// ── Custom Cursor ────────────────────────────
const cDot  = document.getElementById('cursor');
const cRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cDot.style.left = mx + 'px';
    cDot.style.top  = my + 'px';
});

(function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cRing.style.left = rx + 'px';
    cRing.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .proj-card, .int-chip, .tool-badge, .pi-dot, .nav-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cDot.style.width   = '16px';
        cDot.style.height  = '16px';
        cDot.style.background = 'rgba(232,25,44,0.6)';
        cRing.style.transform = 'translate(-50%,-50%) scale(1.6)';
        cRing.style.borderColor = 'rgba(232,25,44,0.8)';
    });
    el.addEventListener('mouseleave', () => {
        cDot.style.width   = '10px';
        cDot.style.height  = '10px';
        cDot.style.background = '#e8192c';
        cRing.style.transform = 'translate(-50%,-50%) scale(1)';
        cRing.style.borderColor = 'rgba(232,25,44,0.5)';
    });
});

// ── SPA Navigation (THE KEY FEATURE) ─────────
function goTo(viewId) {
    if (viewId === currentView || isTransitioning) return;
    isTransitioning = true;

    // Wipe IN
    transition.className = 'wipe-in';

    setTimeout(() => {
        // Hide current
        const prev = document.getElementById('view-' + currentView);
        if (prev) {
            prev.classList.remove('active', 'entering');
            prev.style.display = 'none';
        }

        // Show new
        const next = document.getElementById('view-' + viewId);
        if (next) {
            next.style.display = viewId === 'home' ? 'flex' : 'block';
            next.classList.remove('active');
            next.classList.add('entering');
            setTimeout(() => {
                next.classList.add('active');
                next.classList.remove('entering');
            }, 50);
        }

        currentView = viewId;
        updateNav(viewId);
        triggerViewAnimations(viewId);

        // Wipe OUT
        transition.className = 'wipe-out';
        setTimeout(() => {
            transition.className = '';
            isTransitioning = false;
        }, 380);
    }, 360);
}

function updateNav(viewId) {
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.view === viewId));
    piDots.forEach(d => d.classList.toggle('active', d.dataset.view === viewId));
    mobNavBtns.forEach(b => b.classList.toggle('active', b.dataset.view === viewId));
}

// ── Bind all nav triggers ─────────────────────
navBtns.forEach(btn => btn.addEventListener('click', () => goTo(btn.dataset.view)));
piDots.forEach(dot => dot.addEventListener('click', () => goTo(dot.dataset.view)));
mobNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        goTo(btn.dataset.view);
        closeMobMenu();
    });
});

// Inline buttons (Hero buttons)
document.querySelectorAll('[data-view]').forEach(el => {
    if (el.tagName === 'BUTTON' && !el.classList.contains('nav-btn') && !el.classList.contains('mob-nav-btn') && !el.classList.contains('pi-dot')) {
        el.addEventListener('click', () => goTo(el.dataset.view));
    }
});

// ── Mobile Menu ───────────────────────────────
function closeMobMenu() {
    mobToggle.classList.remove('open');
    mobDrawer.classList.remove('open');
    mobDrawer.style.display = '';
    document.body.style.overflow = '';
}

mobToggle.addEventListener('click', () => {
    mobToggle.classList.toggle('open');
    const isOpen = mobToggle.classList.contains('open');
    if (isOpen) {
        mobDrawer.style.display = 'flex';
        requestAnimationFrame(() => mobDrawer.classList.add('open'));
        document.body.style.overflow = 'hidden';
    } else {
        closeMobMenu();
    }
});

// ── View-specific animations ──────────────────
function triggerViewAnimations(viewId) {
    if (viewId === 'skills') {
        setTimeout(() => {
            document.querySelectorAll('#view-skills .sk-fill').forEach(bar => {
                bar.style.width = bar.dataset.w + '%';
            });
        }, 250);
    }
    if (viewId === 'home') {
        animateCounters();
    }
}

// ── Counter animation ─────────────────────────
function animateCounters() {
    document.querySelectorAll('.hstat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        let count = 0;
        el.textContent = '0';
        const interval = setInterval(() => {
            count += Math.ceil(target / 35);
            if (count >= target) {
                el.textContent = target;
                clearInterval(interval);
            } else {
                el.textContent = count;
            }
        }, 35);
    });
}

// ── Typewriter ────────────────────────────────
const roles = ['Data Analyst', 'Python Developer', 'BI Expert', 'SQL Specialist', 'Data Storyteller'];
const typeEl = document.getElementById('type-text');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeWriter() {
    if (!typeEl) return;
    const word = roles[roleIdx];
    typeEl.textContent = deleting ? word.slice(0, charIdx--) : word.slice(0, charIdx++);

    let delay = deleting ? 55 : 100;
    if (!deleting && charIdx > word.length)      { delay = 1800; deleting = true; }
    else if (deleting && charIdx < 0)             { deleting = false; charIdx = 0; roleIdx = (roleIdx + 1) % roles.length; delay = 400; }

    setTimeout(typeWriter, delay);
}
typeWriter();

// ── Init: show home ───────────────────────────
(function init() {
    // Ensure home is shown correctly
    const homeView = document.getElementById('view-home');
    if (homeView) {
        homeView.style.display = 'flex';
        homeView.classList.add('active');
    }

    // Reset all skill bars (animate on first visit)
    document.querySelectorAll('.sk-fill').forEach(b => b.style.width = '0%');

    // Initial navigation state
    updateNav('home');
    animateCounters();
})();

// ── Keyboard navigation ───────────────────────
const viewOrder = ['home', 'about', 'resume', 'skills', 'projects', 'contact'];
document.addEventListener('keydown', e => {
    const idx = viewOrder.indexOf(currentView);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (idx < viewOrder.length - 1) goTo(viewOrder[idx + 1]);
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (idx > 0) goTo(viewOrder[idx - 1]);
    }
});

// ── Contact form (visual only) ────────────────
const cSend = document.querySelector('.c-send');
if (cSend) {
    cSend.addEventListener('click', () => {
        cSend.innerHTML = '<i class="fas fa-check"></i> Sent!';
        cSend.style.background = '#22c55e';
        setTimeout(() => {
            cSend.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            cSend.style.background = '';
        }, 2500);
    });
}
