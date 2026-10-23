import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function createSmoothScroll({ root = document.documentElement } = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const lenis = new Lenis({ autoRaf: false, smoothWheel: true, syncTouch: false });
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);
  ScrollTrigger.scrollerProxy(root, { scrollTop(value) { if (arguments.length) lenis.scrollTo(value, { immediate: true }); return window.scrollY; }, getBoundingClientRect: () => ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }) });
  return () => { lenis.destroy(); gsap.ticker.remove(tick); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); };
}

export function revealOnScroll(elements, options = {}) {
  const items = Array.from(elements || []);
  const context = gsap.context(() => { items.forEach((element) => gsap.fromTo(element, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', once: true, ...options } })); });
  return () => context.revert();
}

export { gsap, ScrollTrigger };
