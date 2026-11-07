const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Mobil menü ---------- */
const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement | null;
const mobileMenu = document.getElementById('mobil-menu');

function setMenu(open: boolean) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  menuToggle.querySelector<HTMLElement>('[data-icon="open"]')!.hidden = open;
  menuToggle.querySelector<HTMLElement>('[data-icon="close"]')!.hidden = !open;
  mobileMenu.hidden = !open;
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

mobileMenu?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) setMenu(false);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});

window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});

/* ---------- Galeri ve büyütme penceresi ---------- */
const lightbox = document.getElementById('lightbox') as HTMLDialogElement | null;
const galleryLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-gallery-index]')];

if (lightbox && galleryLinks.length && typeof lightbox.showModal === 'function') {
  const img = document.getElementById('lightbox-img') as HTMLImageElement;
  const caption = document.getElementById('lightbox-caption')!;
  const count = document.getElementById('lightbox-count')!;
  let current = 0;
  let opener: HTMLElement | null = null;

  const show = (index: number) => {
    current = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[current];
    img.src = link.href;
    img.alt = link.dataset.caption ?? '';
    img.width = Number(link.dataset.width);
    img.height = Number(link.dataset.height);
    caption.textContent = link.dataset.caption ?? '';
    count.textContent = `${current + 1} / ${galleryLinks.length}`;
    // Bir sonraki fotoğrafı önceden yükle
    const next = galleryLinks[(current + 1) % galleryLinks.length];
    new Image().src = next.href;
  };

  galleryLinks.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      opener = link;
      show(i);
      lightbox.showModal();
      lightbox.querySelector<HTMLButtonElement>('[data-lightbox="close"]')?.focus();
    });
  });

  lightbox.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const action = target.closest<HTMLElement>('[data-lightbox]')?.dataset.lightbox;
    if (action === 'close') lightbox.close();
    else if (action === 'prev') show(current - 1);
    else if (action === 'next') show(current + 1);
    else if (!target.closest('img, figcaption')) lightbox.close();
  });

  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  let touchX: number | null = null;
  lightbox.addEventListener('touchstart', (e) => (touchX = e.touches[0].clientX), { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
    touchX = null;
  });

  lightbox.addEventListener('close', () => {
    opener?.focus();
    opener = null;
  });
}

/* ---------- Form ---------- */
type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const form = document.getElementById('bilgi-formu') as HTMLFormElement | null;
const topicSelect = document.getElementById('f-konu') as HTMLSelectElement | null;
const planSelect = document.getElementById('f-sure') as HTMLSelectElement | null;
const planField = document.getElementById('alan-sure');

const planVisible = () => topicSelect?.value === 'Üyelik';

function syncPlanField() {
  if (!planField || !planSelect) return;
  const visible = planVisible();
  planField.classList.toggle('is-visible', visible);
  planSelect.required = visible;
  if (!visible) clearError(planSelect);
}

topicSelect?.addEventListener('change', syncPlanField);
syncPlanField();

// Üyelik kartlarındaki "Bilgi Al" butonları konu ve süreyi formda seçili getirir.
document.querySelectorAll<HTMLElement>('[data-topic]').forEach((el) => {
  el.addEventListener('click', () => {
    if (!topicSelect) return;
    topicSelect.value = el.dataset.topic!;
    clearError(topicSelect);
    syncPlanField();
    if (el.dataset.plan && planSelect) {
      planSelect.value = el.dataset.plan;
      clearError(planSelect);
    }
  });
});

/** Boşluk, +90 ülke kodu, parantez, tire ve nokta içeren yaygın yazımları kabul eder. */
function isValidPhone(value: string) {
  if (!/^\+?[\d\s().-]+$/.test(value.trim())) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

const validators: Record<string, (value: string) => string> = {
  adSoyad: (v) => (v.trim().length >= 3 ? '' : 'Lütfen adınızı ve soyadınızı yazın.'),
  telefon: (v) =>
    !v.trim() ? 'Lütfen telefon numaranızı yazın.' : isValidPhone(v) ? '' : 'Lütfen geçerli bir telefon numarası yazın (ör. 0532 123 45 67).',
  eposta: (v) =>
    !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'E-posta adresi hatalı görünüyor; lütfen kontrol edin.',
  konu: (v) => (v ? '' : 'Lütfen bir konu seçin.'),
  uyelikSuresi: (v) => (!planVisible() || v ? '' : 'Lütfen ilgilendiğiniz üyelik süresini seçin.'),
};

function errorEl(field: Field) {
  const id = field.getAttribute('aria-describedby')?.split(' ')[0];
  return id ? document.getElementById(id) : null;
}

function clearError(field: Field) {
  field.removeAttribute('aria-invalid');
  const el = errorEl(field);
  if (el) {
    el.hidden = true;
    el.textContent = '';
  }
}

function validate(field: Field) {
  const message = validators[field.name]?.(field.value) ?? '';
  if (!message) {
    clearError(field);
    return true;
  }
  field.setAttribute('aria-invalid', 'true');
  const el = errorEl(field);
  if (el) {
    el.textContent = message;
    el.hidden = false;
  }
  return false;
}

function link(href: string, text: string) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  return a;
}

function mailtoFromForm(f: HTMLFormElement, to: string) {
  const data = new FormData(f);
  const lines = [
    `Ad Soyad: ${data.get('adSoyad')}`,
    `Telefon: ${data.get('telefon')}`,
    data.get('eposta') ? `E-posta: ${data.get('eposta')}` : '',
    `Konu: ${data.get('konu')}`,
    planVisible() ? `İlgilenilen üyelik süresi: ${data.get('uyelikSuresi')}` : '',
    data.get('mesaj') ? `\nMesaj:\n${data.get('mesaj')}` : '',
  ].filter(Boolean);
  const subject = `Bilgi Talebi – ${data.get('konu')}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

if (form) {
  const statusBox = form.querySelector<HTMLElement>('.form__status')!;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const fields = Object.keys(validators)
    .map((name) => form.elements.namedItem(name) as Field | null)
    .filter((f): f is Field => !!f);

  fields.forEach((field) => {
    const revalidate = () => {
      if (field.hasAttribute('aria-invalid')) validate(field);
    };
    field.addEventListener('input', revalidate);
    field.addEventListener('change', revalidate);
  });

  const showNotice = () => {
    const { phone, phoneHref, email } = form.dataset;
    const p1 = document.createElement('p');
    p1.append(
      'Talebin şu anda çevrimiçi olarak iletilemiyor. Bize telefonla veya e-postayla ulaşabilirsin: ',
      link(phoneHref!, phone!),
      ' · ',
      link(`mailto:${email}`, email!),
    );
    const p2 = document.createElement('p');
    p2.append(link(mailtoFromForm(form, email!), 'Bilgilerini e-posta uygulamanla gönder'));
    statusBox.className = 'form__status form__status--notice';
    statusBox.replaceChildren(p1, p2);
    statusBox.hidden = false;
  };

  const showSuccess = () => {
    const p = document.createElement('p');
    p.textContent = 'Talebin bize ulaştı. En kısa sürede seninle iletişime geçeceğiz.';
    statusBox.className = 'form__status form__status--success';
    statusBox.replaceChildren(p);
    statusBox.hidden = false;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusBox.hidden = true;

    const invalid = fields.filter((field) => !validate(field));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const data = new FormData(form);
    if (data.get('website')) return;
    if (!planVisible()) data.delete('uyelikSuresi');

    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      showNotice();
      return;
    }

    submit.disabled = true;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      syncPlanField();
      showSuccess();
    } catch {
      showNotice();
    } finally {
      submit.disabled = false;
    }
  });
}

/* ---------- Kısa kaydırma animasyonu ---------- */
const reveals = document.querySelectorAll('.reveal');
if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-in'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  reveals.forEach((el) => observer.observe(el));
}
