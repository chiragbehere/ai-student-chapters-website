import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // On touch/mobile devices, native scroll is already smooth and fast.
    // Lenis on mobile with touchMultiplier fights the browser and causes jank.
    const isTouchDevice = window.innerWidth <= 768 || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) return; // let native scroll handle it on mobile

    const lenis = new Lenis({
      duration: 1.0,        // slightly quicker feel (was 1.2)
      easing: (t) => 1 - Math.pow(1 - t, 3), // cubic ease-out — snappier
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9, // slightly less than 1 for a controlled feel
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId); // properly cancel on unmount
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
