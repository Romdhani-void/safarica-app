import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  submitting = signal(false);
  resultMsg = signal<string | null>(null);

  private keyHandler = (e: KeyboardEvent) => {
    const keys = ['PageDown', 'PageUp', ' '];
    if (!keys.includes(e.key)) return;

    const container = document.querySelector('.snap') as HTMLElement | null;
    if (!container) return;

    e.preventDefault();
    const sections = Array.from(
      container.querySelectorAll<HTMLElement>('.snap-section')
    );
    const y = container.scrollTop;
    const vh = container.clientHeight;

    const idx = Math.round(y / vh);
    const next =
      e.key === 'PageUp' ? Math.max(0, idx - 1) : Math.min(sections.length - 1, idx + 1);
    sections[next].scrollIntoView({ behavior: 'smooth' });
  };

  ngOnInit() {
    window.addEventListener('keydown', this.keyHandler, { passive: false });
  }
  ngOnDestroy() {
    window.removeEventListener('keydown', this.keyHandler);
  }

  scrollTo(selector: string) {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  async submit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const endpoint = 'https://formspree.io/f/xnnqoqze';

    this.submitting.set(true);
    this.resultMsg.set(null);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        this.resultMsg.set('Thanks! We received your message.');
        form.reset();
      } else {
        this.resultMsg.set('Something went wrong. Please try again.');
      }
    } catch {
      this.resultMsg.set('Network error. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}

// keep export alias as you had
export { HomeComponent as Home };
