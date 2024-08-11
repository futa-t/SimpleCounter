// effects.js

// パーティクル用の変数
let particles: any[] = [];
let confetti: any[] = [];

// パーティクルの作成
function createParticles() {
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            size: Math.random() * 5 + 1,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * 6 - 3
        });
    }
}

// パーティクルのアニメーション
function animateParticles(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.size *= 0.95;

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        if (particle.size < 0.1) {
            particles.splice(index, 1);
        }
    });

    if (particles.length > 0) {
        requestAnimationFrame(() => animateParticles(ctx));
    }
}

// 紙吹雪の作成
function createConfetti() {
    confetti = [];
    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: Math.random() * window.innerWidth,
            y: -20,
            size: Math.random() * 5 + 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            speed: Math.random() * 3 + 1,
            angle: Math.random() * Math.PI * 2,
            rotation: Math.random() * 0.2 - 0.1,
            rotationSpeed: Math.random() * 0.01 - 0.005
        });
    }
}

// 紙吹雪のアニメーション
function animateConfetti(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    confetti.forEach((piece, index) => {
        piece.y += piece.speed * 1;
        piece.x += Math.sin(piece.angle) * 0.5;
        piece.rotation += piece.rotationSpeed * 1.2;

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();

        if (piece.y > window.innerHeight) {
            confetti.splice(index, 1);
        }
    });

    if (confetti.length > 0) {
        requestAnimationFrame(() => animateConfetti(ctx));
    }
}

// エフェクトの実行関数
function runParticleEffect(ctx: CanvasRenderingContext2D) {
    createParticles();
    animateParticles(ctx);
}

function runConfettiEffect(ctx: CanvasRenderingContext2D) {
    createConfetti();
    animateConfetti(ctx);
}

// エクスポート
export { runParticleEffect, runConfettiEffect };