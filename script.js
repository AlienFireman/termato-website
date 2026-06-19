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

// copy install command
const copyBtn = document.getElementById('copyBtn');
const installCmd = document.getElementById('installCmd');
copyBtn.addEventListener('click', async () => {
  const text = installCmd.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const r = document.createRange();
    r.selectNode(installCmd);
    const sel = window.getSelection();
    sel.removeAllRanges(); sel.addRange(r);
    document.execCommand('copy'); sel.removeAllRanges();
  }
  copyBtn.textContent = 'Copied!';
  copyBtn.classList.add('copied');
  setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1600);
});

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.usp, .feat, .sec, .stat, .section-head, .perf-copy, .start-card')
  .forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = (i % 3) * 60 + 'ms'; io.observe(el); });

// feature card spotlight
document.querySelectorAll('.feat').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* ===== animated hero terminal ===== */
const termBody = document.getElementById('termBody');

// each step: typed prompt line, then instant output lines
const script = [
  { type: 'cmd', prompt: '~/orbit ❯ ', text: 'git status' },
  { type: 'out', cls: 'dim', text: 'On branch feature/auth · 3 files changed' },
  { type: 'gap' },
  { type: 'cmd', prompt: '~/orbit ❯ ', text: 'ask termato to add password reset', ai: true },
  { type: 'out', cls: 'ai', text: '✦ Reading auth.js, mailer.js, routes/…' },
  { type: 'out', cls: 'ai', text: '✦ Adding /reset endpoint + scrypt token flow' },
  { type: 'out', cls: 'ai', text: '✦ Wiring email template & tests' },
  { type: 'out', cls: 'ok',  text: '✓ Done — 4 files edited, 12 tests passing' },
  { type: 'gap' },
  { type: 'cmd', prompt: '~/orbit ❯ ', text: 'npm run dev' },
  { type: 'out', cls: 'ok',  text: '▸ preview live · synced to phone + tablet' },
];

let si = 0, ci = 0;
const cursor = '<span class="cursor"></span>';

function appendLine(html) {
  const div = document.createElement('div');
  div.className = 'ln';
  div.innerHTML = html;
  termBody.appendChild(div);
  return div;
}

function run() {
  if (si >= script.length) {
    // hold, then restart
    setTimeout(() => { termBody.innerHTML = ''; si = 0; ci = 0; run(); }, 4200);
    return;
  }
  const step = script[si];

  if (step.type === 'gap') {
    appendLine('&nbsp;');
    si++; ci = 0;
    setTimeout(run, 220);
    return;
  }

  if (step.type === 'out') {
    appendLine(`<span class="${step.cls || ''}">${step.text}</span>`);
    si++; ci = 0;
    setTimeout(run, 360);
    return;
  }

  // cmd: type char by char
  if (ci === 0) {
    const line = appendLine(`<span class="prompt">${step.prompt}</span><span class="typed ${step.ai ? 'ai' : 'user'}"></span>${cursor}`);
    step._el = line.querySelector('.typed');
  }
  if (ci < step.text.length) {
    step._el.textContent += step.text[ci];
    ci++;
    setTimeout(run, 38 + Math.random() * 45);
  } else {
    // remove cursor from this finished line
    const c = step._el.parentElement.querySelector('.cursor');
    if (c) c.remove();
    si++; ci = 0;
    setTimeout(run, 480);
  }
}
run();
