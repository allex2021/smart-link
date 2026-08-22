import React, { useEffect, useRef } from 'react';

interface MysticParticlesProps {
  mode?: 'cursed' | 'blessed';
}

export const MysticParticles: React.FC<MysticParticlesProps> = ({ mode = 'cursed' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    let width = (canvas.width = parent.offsetWidth);
    let height = (canvas.height = parent.offsetHeight);

    const handleResize = () => {
      if (parent) {
        width = canvas.width = parent.offsetWidth;
        height = canvas.height = parent.offsetHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Particle Configuration
    const particleCount = 45;
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.6 + 0.2), // Upward floating (Anti-gravity)
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.7 + 0.2,
      fadeSpeed: Math.random() * 0.008 + 0.002
    }));

    const color = mode === 'cursed' ? '239, 68, 68' : '245, 158, 11'; // Red or Amber

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity -= p.fadeSpeed;

        // Reset particle position when it goes out of view or fades out
        if (p.y < 0 || p.opacity <= 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
          p.opacity = Math.random() * 0.7 + 0.3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${color}, 0.8)`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};
export default MysticParticles;
