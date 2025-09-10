import {
  Component,
  ElementRef,
  NgZone,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements AfterViewInit, OnDestroy {
  open = false;      // mobile menu
  overHero = false;  // true only while the hero/sentinel is behind the bar
  hidden = false;    // hide-on-scroll state

  private io?: IntersectionObserver;
  private removeScrollListener?: () => void;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private lastY = 0;
  private ticking = false;

  // Tuning knobs
  private readonly MIN_DELTA = 6;        // ignore tiny scroll jitter
  private readonly SHOW_AT_TOP = 24;     // always show when within 24px from top
  private readonly REVEAL_OFFSET = 32;   // reveal after this much upward move

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {}

  toggle() {
    this.open = !this.open;
    if (this.isBrowser) document.documentElement.style.overflow = this.open ? 'hidden' : '';
    // Keep header visible when sheet is open
    if (this.open) this.hidden = false;
  }
  closeAll() {
    this.open = false;
    if (this.isBrowser) document.documentElement.style.overflow = '';
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // --- Hero overlap detection (your existing behavior) ---
    const sentinel =
      document.getElementById('nav-sentinel') ??
      document.querySelector<HTMLElement>('section.hero');

    if (!sentinel) { this.overHero = false; }
    else {
      this.zone.runOutsideAngular(() => {
        this.io = new IntersectionObserver(
          (entries) => {
            const e = entries[0];
            const isOver = e.isIntersecting && e.intersectionRatio > 0.01;
            this.zone.run(() => (this.overHero = isOver));
          },
          {
            root: null,
            threshold: [0, 0.01, 0.1, 1],
            rootMargin: '-72px 0px 0px 0px', // match header height
          }
        );
        this.io.observe(sentinel);
      });
    }

    // --- Hide-on-scroll (new) ---
    this.initHideOnScroll();
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    if (this.isBrowser) document.documentElement.style.overflow = '';
    this.removeScrollListener?.();
  }

  // Keyboard: arrow navigation across desktop links
  onMenuKeys(ev: KeyboardEvent) {
    const target = ev.target as HTMLElement;
    if (!target?.classList.contains('link')) return;
    const list = Array.from(
      this.el.nativeElement.querySelectorAll<HTMLElement>('.menu .link')
    );
    const i = list.indexOf(target);
    const prev = list[(i - 1 + list.length) % list.length];
    const next = list[(i + 1) % list.length];

    if (ev.key === 'ArrowRight') { ev.preventDefault(); next?.focus(); }
    if (ev.key === 'ArrowLeft')  { ev.preventDefault(); prev?.focus(); }
  }

  // --- NEW: hide-on-scroll implementation ---
  private initHideOnScroll() {
    const onScroll = () => {
      // throttle with rAF to avoid change detection storms
      if (this.ticking) return;
      this.ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const dy = y - this.lastY;

        // Always show near the very top
        if (y <= this.SHOW_AT_TOP) {
          this.setHidden(false);
          this.lastY = y;
          this.ticking = false;
          return;
        }

        // Don't hide while mobile sheet is open
        if (this.open) {
          this.setHidden(false);
          this.lastY = y;
          this.ticking = false;
          return;
        }

        // Ignore tiny movements
        if (Math.abs(dy) <= this.MIN_DELTA) {
          this.ticking = false;
          return;
        }

        // Scrolling down → hide; scrolling up enough → show
        if (dy > 0) {
          this.setHidden(true);
        } else {
          // Only reveal after a minimum upward move to prevent flicker
          if (this.lastY - y >= this.REVEAL_OFFSET) this.setHidden(false);
        }

        this.lastY = y;
        this.ticking = false;
      });
    };

    // passive listener for perf
    window.addEventListener('scroll', onScroll, { passive: true });
    this.removeScrollListener = () => window.removeEventListener('scroll', onScroll);
  }

  private setHidden(v: boolean) {
    if (this.hidden === v) return;
    this.zone.run(() => { this.hidden = v; });
  }
}
