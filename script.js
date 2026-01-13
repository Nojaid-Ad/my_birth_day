const gift = document.getElementById("gift");
const card = document.getElementById("card");
const canvas = document.getElementById("splash");
const ctx = canvas.getContext("2d");
const audio = document.getElementById("audio");
const bg = document.getElementById("bg");
const bctx = bg.getContext("2d");

let particles = [];
let bw, bh;
let mouse = { x: null, y: null };
let blast = null;

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  bw = bg.width = innerWidth;
  bh = bg.height = innerHeight;
}
resize();
addEventListener("resize", resize);

addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

addEventListener("touchmove", e => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 4 + 2;
    this.life = 450;
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * 6 + 2;
    this.vx = Math.cos(a) * s;
    this.vy = Math.sin(a) * s;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,199,122,${this.life / 450})`;
    ctx.fill();
  }
}

function splash(x, y) {
  for (let i = 0; i < 160; i++) {
    particles.push(new Particle(x, y));
  }
}

function animateSplash() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateSplash);
}
animateSplash();

class Dot {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * bw;
    this.y = Math.random() * bh;
    this.r = Math.random() * 2.2 + 0.8;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > bw || this.y < 0 || this.y > bh) {
      this.reset();
    }

    if (mouse.x !== null) {
      this.repel(mouse.x, mouse.y, 180, 3.2);
    }

    if (blast) {
      this.repel(blast.x, blast.y, 260, blast.force);
    }
  }

  repel(cx, cy, radius, power) {
    const dx = this.x - cx;
    const dy = this.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius && dist > 0) {
      const f = (radius - dist) / radius;
      this.x += (dx / dist) * f * power;
      this.y += (dy / dist) * f * power;
    }
  }

  draw() {
    bctx.beginPath();
    bctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    bctx.fillStyle = "rgba(245,199,122,0.35)";
    bctx.fill();
  }
}

const dots = Array.from({ length: 280 }, () => new Dot());

function animateBG() {
  bctx.clearRect(0, 0, bw, bh);
  dots.forEach(d => {
    d.update();
    d.draw();
  });
  requestAnimationFrame(animateBG);
}
animateBG();

gift.addEventListener("click", () => {
  gift.classList.remove("shake");
  void gift.offsetWidth;
  gift.classList.add("shake");

  setTimeout(() => {
    const r = gift.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;

    splash(x, y);
    blast = { x, y, force: 6 };

    audio.currentTime = 0;
    audio.play();

    setTimeout(() => {
      blast = null;
    }, 900);
  }, 750);

  setTimeout(() => {
    card.classList.add("show");
    gift.style.display = "none";
  }, 900);
});

card.addEventListener("click", e => {
  if (e.target.closest("button")) return;
  card.classList.toggle("flip");
});

document.querySelectorAll("[data-share]").forEach(btn => {
  btn.addEventListener("click", e => {
    const url = location.href;
    const t = e.target.dataset.share;
    if (t === "copy") navigator.clipboard.writeText(url);
    if (t === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
    if (t === "telegram") window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}`);
  });
});
