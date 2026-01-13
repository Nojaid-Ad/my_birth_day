const gift = document.getElementById("gift");
const card = document.getElementById("card");
const canvas = document.getElementById("splash");
const ctx = canvas.getContext("2d");
const audio = document.getElementById("audio");

let particles = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

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

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

gift.addEventListener("click", () => {
  gift.classList.remove("shake");
  void gift.offsetWidth;
  gift.classList.add("shake");

  setTimeout(() => {
    const r = gift.getBoundingClientRect();
    splash(r.left + r.width / 2, r.top + r.height / 2);
    audio.currentTime = 0;
    audio.play();
  }, 750);

  setTimeout(() => {
    card.classList.add("show");
    gift.style.display = "none";
  }, 900);
});

/* Mobile tap flip */
card.addEventListener("click", () => {
  card.classList.toggle("flip");
});

/* Share buttons */
document.querySelectorAll("[data-share]").forEach(btn => {
  btn.addEventListener("click", e => {
    const url = location.href;
    const type = e.target.dataset.share;

    if (type === "copy") {
      navigator.clipboard.writeText(url);
    }

    if (type === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
    }

    if (type === "telegram") {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}`);
    }
  });
});
