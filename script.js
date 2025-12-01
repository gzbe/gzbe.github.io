const canvas = document.getElementById('floating-dots');
const ctx = canvas.getContext('2d');

// Resize canvas to fit window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dots = [];
const numDots = 80;
const maxDistance = 200;

// Dot class
class Dot {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }
}

// Initialize dots
for (let i = 0; i < numDots; i++) {
  dots.push(new Dot(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2
  ));
}

let cursor = { x: 0, y: 0 };

// Track mouse movement
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
});

// Draw lines between nearby dots and cursor
function drawLines() {
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    const cursorDist = Math.hypot(dot.x - cursor.x, dot.y - cursor.y);
    if (cursorDist < maxDistance) {
      ctx.beginPath();
      ctx.moveTo(dot.x, dot.y);
      ctx.lineTo(cursor.x, cursor.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - cursorDist / maxDistance})`;
      ctx.stroke();
      ctx.closePath();
    }
    for (let j = i + 1; j < dots.length; j++) {
      const otherDot = dots[j];
      const dist = Math.hypot(dot.x - otherDot.x, dot.y - otherDot.y);
      if (dist < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(otherDot.x, otherDot.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / maxDistance})`;
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.forEach(dot => {
    dot.update();
    dot.draw();
  });
  drawLines();
  requestAnimationFrame(animate);
}

animate();

// Resize canvas when the window is resized
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});