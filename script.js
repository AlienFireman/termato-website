/* ===== Termato landing — interactions ===== */

// year
document.getElementById('year').textContent = new Date().getFullYear();

// nav: scrolled state + mobile menu
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => nav.classList.toggle('menu-open'));
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('menu-open'))
);

// copy install command — every .copy-btn copies the <code> next to it,
// then flips the copy icon to a check for a moment.
document.querySelectorAll('.copy-btn').forEach(btn => {
  const code = btn.parentElement.querySelector('code');
  if (!code) return;
  btn.addEventListener('click', async () => {
    const text = code.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const r = document.createRange();
      r.selectNode(code);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(r);
      document.execCommand('copy'); sel.removeAllRanges();
    }
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 1600);
  });
});

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.usp, .feat, .sec, .section-head, .exp-grid li, .start-card')
  .forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = (i % 3) * 60 + 'ms'; io.observe(el); });

// feature card spotlight
document.querySelectorAll('.feat').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* ===== animated hero — a mock of a Termato terminal session ===== */
const termBody = document.getElementById('termBody');
const appDev = document.getElementById('appDev');

// the story: a session on desktop → hand off to phone mid-task →
// queue a message → the agent finishes and opens the preview in-workspace.
const prompt = '~/orbit ❯ ';
const steps = [
  { kind: 'device', label: '⌘ Desktop' },
  { kind: 'cmd', text: 'npm run dev' },
  { kind: 'out', cls: 'ok',  text: '▸ dev server ready · localhost:5173' },
  { kind: 'gap' },
  { kind: 'cmd', text: 'claude "add a password reset flow"', ai: true },
  { kind: 'out', cls: 'ai',  text: '✦ editing auth.js · mailer.js · routes/' },
  { kind: 'out', cls: 'ok',  text: '✓ done — 4 files changed, tests passing' },
  { kind: 'note',  text: '⇄ Picked up on iPhone — same session, mid-task' },
  { kind: 'device', label: '􀟜 iPhone' },
  { kind: 'cmd', text: 'claude "now add rate limiting"', ai: true, phone: true },
  { kind: 'queue', text: '⧗ Queued on your machine — fires when this turn ends · phone can close' },
  { kind: 'out', cls: 'ai',  text: '✦ adding rate limiter + tests' },
  { kind: 'out', cls: 'ok',  text: '✓ rate limiting added · all green' },
  { kind: 'preview', title: 'localhost:5173 · opened in this workspace' },
];

let si = 0, ci = 0;
const cursor = '<span class="b-cursor"></span>';

function addLine(html, cls) {
  const div = document.createElement('div');
  div.className = 'tl' + (cls ? ' ' + cls : '');
  div.innerHTML = html;
  termBody.appendChild(div);
  termBody.scrollTop = termBody.scrollHeight;
  return div;
}

function run() {
  if (si >= steps.length) {
    setTimeout(() => { termBody.innerHTML = ''; si = 0; ci = 0; appDev.textContent = '⌘ Desktop'; run(); }, 4600);
    return;
  }
  const step = steps[si];

  if (step.kind === 'device') {
    appDev.textContent = step.label;
    appDev.classList.remove('flash'); void appDev.offsetWidth; appDev.classList.add('flash');
    si++; ci = 0;
    setTimeout(run, 280);
    return;
  }

  if (step.kind === 'gap') {
    addLine('&nbsp;');
    si++; ci = 0;
    setTimeout(run, 200);
    return;
  }

  if (step.kind === 'out') {
    addLine(`<span class="${step.cls || ''}">${step.text}</span>`);
    si++; ci = 0;
    setTimeout(run, 520);
    return;
  }

  if (step.kind === 'note' || step.kind === 'queue') {
    addLine(step.text, step.kind === 'queue' ? 'sys queue' : 'sys note');
    si++; ci = 0;
    setTimeout(run, step.kind === 'queue' ? 1200 : 1000);
    return;
  }

  if (step.kind === 'preview') {
    addLine(`<div class="b-prev"><div class="b-prev-bar"><span></span><span></span><span></span><em>${step.title}</em></div><div class="b-prev-body"><div class="b-prev-line w1"></div><div class="b-prev-line w2"></div><div class="b-prev-btn"></div></div></div>`, 'prev');
    si++; ci = 0;
    setTimeout(run, 1500);
    return;
  }

  // cmd — typed char by char after the prompt
  if (ci === 0) {
    const line = addLine(`<span class="prompt">${prompt}</span><span class="typed ${step.ai ? 'ai' : 'user'}"></span>${cursor}`,
      step.phone ? 'from-phone' : '');
    step._typed = line.querySelector('.typed');
    step._line = line;
  }
  if (ci < step.text.length) {
    step._typed.textContent += step.text[ci];
    ci++;
    setTimeout(run, 38 + Math.random() * 48);
  } else {
    const c = step._line.querySelector('.b-cursor');
    if (c) c.remove();
    si++; ci = 0;
    setTimeout(run, 560);
  }
}
run();
