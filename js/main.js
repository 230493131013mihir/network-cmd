// ── Network canvas animation ──
function initNetCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const nodes = Array.from({ length: 28 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 1.5 + Math.random() * 2
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach((a, i) => {
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
      if (a.y < 0 || a.y > canvas.height) a.vy *= -1;
      nodes.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(29,158,117,${(1 - dist / 140) * 0.45})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      });
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(29,158,117,0.65)';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Quiz logic ──
function initQuiz(containerId, correctIndex) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const options = container.querySelectorAll('.quiz-option');
  const feedback = container.querySelector('.quiz-feedback');
  let answered = false;

  options.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      if (i === correctIndex) {
        btn.classList.add('correct');
        feedback.textContent = '✓ Correct!';
        feedback.className = 'quiz-feedback';
      } else {
        btn.classList.add('wrong');
        options[correctIndex].classList.add('correct');
        feedback.textContent = '✗ Not quite — see the correct answer highlighted.';
        feedback.className = 'quiz-feedback wrong';
      }
    });
  });
}

// ── Mark active nav link ──
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    if (link.href === window.location.href) link.classList.add('active');
  });
  initNetCanvas('netCanvas');
});
