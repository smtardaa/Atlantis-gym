/**
 * Tüm işletme bilgileri burada tek yerde durur.
 * Kaynak: atlantisspormerkezi.com (ana sayfa, kurumsal.html, contact.html, fiyatListe.html) – 08.11.2026 tarihinde kontrol edildi.
 */
export const site = {
  name: 'Atlantis Spor Merkezi',
  url: 'https://atlantisspormerkezi.com',
  title: 'Atlantis Spor Merkezi | Kızılay, Ankara Spor Salonu',
  description:
    '2001’den beri Ankara Kızılay’da fitness, kardiyo ve vücut geliştirme. Atlantis Spor Merkezi’nde hedeflerini konuş, üyelik seçenekleri hakkında bilgi al.',
  foundingYear: 2001,
  phone: { display: '0312 432 09 15', href: 'tel:+903124320915', e164: '+903124320915' },
  email: { display: 'info@atlantisspormerkezi.com', href: 'mailto:info@atlantisspormerkezi.com' },
  address: {
    street: 'Mithatpaşa Caddesi 61-Z',
    district: 'Kızılay, Çankaya',
    city: 'Ankara',
    full: 'Mithatpaşa Caddesi 61-Z, Kızılay, Çankaya / Ankara',
  },
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent('Atlantis Spor Merkezi, Mithatpaşa Caddesi 61-Z, Kızılay, Çankaya, Ankara'),
  hours: [
    { days: 'Pazartesi – Cuma', time: '09.00 – 21.00' },
    { days: 'Cumartesi', time: '09.00 – 20.00' },
    { days: 'Pazar', time: 'Kapalı' },
  ],
} as const;

/**
 * Üyelik seçenekleri – fiyatlar fiyatListe.html sayfasındaki canlı listeden alındı.
 * Fiyat göstermek istemezseniz `showPrices` değerini false yapın; kartlarda
 * "Güncel fiyat için bilgi alın" yazar.
 */
export const showPrices = true;

export const plans = [
  { id: 'aylik', title: 'Aylık', note: 'Her gün kullanım', price: '2.500 TL' },
  { id: '3-aylik', title: '3 Aylık', note: 'Aylık ücrete göre %20 indirimli', price: '6.000 TL' },
  { id: '6-aylik', title: '6 Aylık', note: 'Aylık ücrete göre %30 indirimli', price: '10.500 TL' },
  { id: '12-aylik', title: '12 Aylık', note: 'Aylık ücrete göre %40 indirimli', price: '18.000 TL' },
] as const;

/** Kaynak fiyat listesinde her üyelikte yer alan alanlar. */
export const planIncludes = ['Fitness', 'Kardiyo', 'Vücut geliştirme'] as const;

export const topics = ['Koçluk', 'Üyelik', 'Salon Hakkında Bilgi'] as const;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const withBase = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;

export const nav = [
  { label: 'Koçluk', href: withBase('/#kocluk') },
  { label: 'Salonumuz', href: withBase('/#salonumuz') },
  { label: 'Üyelik', href: withBase('/#uyelik') },
  { label: 'İletişim', href: withBase('/#iletisim') },
];
