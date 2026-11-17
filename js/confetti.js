// confetti.js - Lightweight Canvas Confetti Generator
class ConfettiCannon {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animId = null;
        if (document.body) {
            this.initCanvas();
        } else {
            window.addEventListener('DOMContentLoaded', () => this.initCanvas());
        }
    }

    initCanvas() {
        if (this.canvas) return;
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        // CRITICAL: Ensure canvas is completely transparent and hidden until fired!
        // This prevents black screen / black overlay on GPUs or mobile browsers!
        this.canvas.style.background = 'transparent';
        this.canvas.style.display = 'none';

        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.resize();
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    fire(options = {}) {
        if (!this.canvas) {
            this.initCanvas();
        }
        if (!this.canvas || !this.ctx) return;

        // Show canvas only while particles are active
        this.canvas.style.display = 'block';

        const count = options.count || 120;
        const colors = options.colors || [
            '#0055A4', // French Blue
            '#EF4135', // French Red
            '#FFFFFF', // White
            '#F59E0B', // Gold
            '#10B981', // Emerald
            '#8B5CF6'  // Purple
        ];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 5 + Math.random() * 8;
            this.particles.push({
                x: options.originX || window.innerWidth / 2,
                y: options.originY || window.innerHeight / 2,
                vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 4,
                vy: Math.sin(angle) * velocity - 6 - Math.random() * 4,
                size: 6 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                opacity: 1,
                decay: 0.008 + Math.random() * 0.008,
                gravity: 0.22,
                shape: Math.random() > 0.4 ? 'rect' : 'circle'
            });
        }

        if (!this.animId) {
            this.animate();
        }
    }

    animate() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.98;
            p.rotation += p.rotSpeed;
            p.opacity -= p.decay;

            if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animId = requestAnimationFrame(() => this.animate());
        } else {
            this.animId = null;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Hide canvas completely when animation ends
            this.canvas.style.display = 'none';
        }
    }
}

// Global instance immediately available
window.confetti = new ConfettiCannon();
