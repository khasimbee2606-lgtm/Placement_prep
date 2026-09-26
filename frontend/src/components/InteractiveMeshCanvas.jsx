import React, { useEffect, useRef } from 'react';

/**
 * InteractiveMeshCanvas
 * Inspired by "Sylva – Living Green" modern aesthetic.
 * Ultra-lightweight 2D Canvas featuring floating luminous green particles,
 * organic depth layers, soft connections, and subtle mouse physics.
 * Optimized for 60fps performance without heavy WebGL runtimes.
 */
const InteractiveMeshCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Living Green palette
    const colors = [
      { fill: '#16A34A', glow: 'rgba(22, 163, 74, 0.4)' },
      { fill: '#22C55E', glow: 'rgba(34, 197, 94, 0.45)' },
      { fill: '#065F46', glow: 'rgba(6, 95, 70, 0.35)' },
      { fill: '#86EFAC', glow: 'rgba(134, 239, 172, 0.5)' },
    ];

    // Minimal particle count (strictly lightweight)
    const particleCount = Math.min(Math.floor((width * height) / 16000), 55);
    const particles = [];

    const mouse = {
      x: width / 2,
      y: height / 3,
      targetX: width / 2,
      targetY: height / 3,
      radius: 170,
    };

    class LivingParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.depth = Math.random() * 0.7 + 0.3; // 3D depth layer
        this.baseSize = (Math.random() * 2.2 + 1.2) * this.depth;
        this.colorObj = colors[Math.floor(Math.random() * colors.length)];
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.015 + Math.random() * 0.015;
      }

      update() {
        this.x += this.vx * this.depth;
        this.y += this.vy * this.depth;
        this.pulse += this.pulseSpeed;

        if (this.x < 0) this.x = width;
        else if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        else if (this.y > height) this.y = 0;

        // Interactive organic displacement on mouse proximity
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 2 * this.depth;
          this.x -= (dx / dist) * force;
          this.y -= (dy / dist) * force;
        }
      }

      draw() {
        const size = this.baseSize + Math.sin(this.pulse) * 0.4;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(size, 0.8), 0, Math.PI * 2);
        ctx.fillStyle = this.colorObj.fill;
        ctx.shadowColor = this.colorObj.glow;
        ctx.shadowBlur = 8 * this.depth;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new LivingParticle());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Pause rendering when tab is hidden to ensure zero performance overhead
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) loop();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const maxLineDist = 135;

    const loop = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Soft living green radial aura around mouse
      const aura = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        mouse.radius * 1.6
      );
      aura.addColorStop(0, 'rgba(22, 163, 74, 0.07)');
      aura.addColorStop(0.6, 'rgba(220, 252, 231, 0.03)');
      aura.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // Connect filaments between close living nodes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxLineDist) {
            const alpha = (1 - dist / maxLineDist) * 0.16 * particles[i].depth;
            ctx.strokeStyle = `rgba(22, 163, 74, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="mesh-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default InteractiveMeshCanvas;
