import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class ContactComponent {
  submitting = signal(false);
  resultMsg = signal<string | null>(null);
  mapInteractive = signal(false);

  enableMap() { this.mapInteractive.set(true); }

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
        this.resultMsg.set('✅ Thanks! We received your message.');
        form.reset();
      } else {
        this.resultMsg.set('❌ Something went wrong. Please try again.');
      }
    } catch {
      this.resultMsg.set('⚠️ Network error. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}



export { ContactComponent as Contact };