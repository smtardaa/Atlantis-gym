# ATLANTİS SPOR MERKEZİ web sitesi – teslim notları

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # yayın dosyaları: dist/
npm run preview  # derlenmiş siteyi yerelde açar
```

Astro 7 ile tek sayfalık statik site. `dist/` klasörü herhangi bir statik barındırmaya (Netlify, Vercel, Cloudflare Pages, GitHub Pages vb.) yüklenebilir. Alt klasörde yayınlanacaksa derlemeden önce `SITE_URL` ve `BASE_PATH` ortam değişkenleri verilebilir.

## GitHub Pages'te yayınlama (GitHub Actions)

`.github/workflows/deploy.yml` hazır. `main` dalına her gönderimde site derlenir ve yayınlanır.

**1. Kodu GitHub'a gönderin.** GitHub'da boş bir repo açın, sonra proje klasöründe:

```bash
git init
git add .
git commit -m "Atlantis Spor Merkezi web sitesi"
git branch -M main
git remote add origin https://github.com/KULLANICI/REPO-ADI.git
git push -u origin main
```

`node_modules`, `dist`, `.astro` ve `.env` dosyaları `.gitignore` sayesinde gönderilmez.

**2. Pages'i açın:** Repo > **Settings > Pages > Build and deployment > Source: "GitHub Actions"** seçin.

**3. Yayını izleyin:** **Actions** sekmesindeki "GitHub Pages'e yayınla" iş akışı bitince site `https://KULLANICI.github.io/REPO-ADI/` adresinde yayında olur. İlk gönderim 2. adımdan önce yapıldıysa iş akışı hata verebilir; Pages'i açtıktan sonra Actions sekmesinden **Re-run** ile yeniden çalıştırın.

**Adres ayarı otomatik:** İş akışı yayın adresini GitHub'dan öğrenir. Bağlantılar, görseller, favicon'lar ve paylaşım görseli hem `kullanici.github.io/repo-adi` alt adresinde hem kendi alan adınızda doğru üretilir; elle ayar gerekmez.

**Kendi alan adı (atlantisspormerkezi.com):** Settings > Pages > **Custom domain** alanına alan adını yazın. Alan adı sağlayıcınızda GitHub'ın gösterdiği DNS kayıtlarını ekleyin ve **Enforce HTTPS** seçeneğini açın. Böylece eski sitedeki sertifika sorunu da ortadan kalkar. Alan adını yönlendirmeden önce eski sitenin barındırmasıyla ilgili işletmeye danışın.

**Form servisi:** Repo > **Settings > Secrets and variables > Actions > Variables** bölümünde `PUBLIC_FORM_ENDPOINT` değişkenini tanımlayın ve iş akışını yeniden çalıştırın. Tanımlanmazsa form telefon/e-posta seçeneklerini gösterir.

## Bölümler

Header (Koçluk / Salonumuz / Üyelik / İletişim + Bilgi Al) → Hero → Özellik şeridi → Programını birlikte hazırlayalım (`#kocluk`) → İyi hisset. Güçlü yaşa. (`#salonumuz`) → Salon galerisi ve hizmetler (`#galeri`) → Üyelik (`#uyelik`) → İletişim (`#iletisim`) → Footer.

Tüm işletme bilgileri, fiyatlar ve menü `src/data/site.ts` dosyasında tek yerde durur.

## Bağlanması gereken: form gönderim servisi

Bilgi talebi formuna **gerçek bir gönderim servisi bağlı değil.** Bu yüzden form başarı mesajı göstermez. Doğrulamadan geçen talep için ziyaretçiye şu seçenekler sunulur:

- telefon bağlantısı (0312 432 09 15),
- e-posta bağlantısı,
- formdaki bilgilerle doldurulmuş bir e-posta taslağı ("Bilgilerini e-posta uygulamanla gönder").

Bağlamak için `.env.example` dosyasını `.env` olarak kopyalayın, `PUBLIC_FORM_ENDPOINT` değerini girin (Formspree, Web3Forms veya kendi API'niz) ve siteyi yeniden derleyin. Form `POST` ile `FormData` gönderir ve `Accept: application/json` ekler. Başarı mesajı yalnızca sunucu 2xx döndüğünde gösterilir.

Gönderilen alanlar: `adSoyad`, `telefon`, `eposta` (isteğe bağlı), `konu`, `uyelikSuresi` (yalnızca konu "Üyelik" ise), `mesaj`, `formTuru`, `_subject`.

**KVKK:** Form ad, telefon ve e-posta topluyor. Yayına almadan önce KVKK aydınlatma metni ve bağlantısı eklenmeli; kaynak sitede böyle bir metin yok.

## Kaynaktan alınan ve doğrulanan bilgiler

Kaynak: atlantisspormerkezi.com – ana sayfa, `/kurumsal.html`, `/contact.html`, `/fiyatListe.html`, `/galleri.html` (08.11.2026'da canlı olarak okundu).

| Bilgi | Değer | Kaynak sayfa |
|---|---|---|
| Adres | Mithatpaşa Caddesi 61-Z, Kızılay, Çankaya / Ankara | contact.html |
| Telefon | 0312 432 09 15 | contact.html |
| E-posta | info@atlantisspormerkezi.com | contact.html |
| Kuruluş | 2001, Ankara Kızılay | kurumsal.html, ana sayfa |
| Hizmetler | Fitness, Cardio, Body Building | ana sayfa, kurumsal.html |
| Saatler | Pzt–Cuma 09.00–21.00, Cumartesi 09.00–20.00, Pazar kapalı | ana sayfa (saat tablosu) |

### Fiyatlar

`/fiyatListe.html` canlı sayfasındaki liste kullanıldı. Aynı liste `/kurumsal.html` yan panelinde de birebir yer alıyor. İndirim oranları aylık ücretle tutarlı:

| Üyelik | Fiyat | Kaynaktaki not |
|---|---|---|
| Aylık | 2.500 TL | "Aylık Ücret Hergün" |
| 3 Aylık | 6.000 TL | %20 indirim |
| 6 Aylık | 10.500 TL | %30 indirim |
| 12 Aylık | 18.000 TL | %40 indirim |

- Her üyelik kartında, kaynak listede yer alan üç alan gösterilir: Fitness, Kardiyo, Vücut geliştirme.
- Kartların altında "Fiyatlar değişebilir. Güncel fiyat ve kampanyalar için bilgi alın." notu var.
- Eski sitenin telif yılı 2014 ve site uzun süredir güncellenmemiş görünüyor. **Fiyatları işletmeyle teyit edin.**
- Fiyatları gizlemek için `src/data/site.ts` içinde `showPrices = false` yapın. Kartlarda "Güncel fiyat için bilgi alın" yazar.
- **Kullanılmayan kampanya:** `kurumsal.html` yan panelinde "Sezona özel %25 indirim !!" ve "Kampanya" etiketi var. Hangi pakete uygulandığı ve geçerlilik süresi belirsiz. Fiyat sayfasında da yer almadığı için eklenmedi.

## Görseller

- Logo, kaynak sitedeki gerçek logodur (`img/logo.png`). Orijinal dosya 317×80 px. Header'da 40 px yükseklikte, 2× ekranda bile net görünür. **Daha büyük bir logo dosyası** (SVG veya yüksek çözünürlüklü PNG) bulunursa `src/assets/logo.png` değiştirilmeli.
- Favicon'lar ve paylaşım görseli (`public/og-image.jpg`) bu logodan ve salon fotoğrafından üretildi.
- Tüm salon fotoğrafları kaynak sitenin galerisindeki **gerçek salon fotoğraflarıdır** (20 fotoğraftan 17'si kullanıldı, birbirine çok benzeyenler elendi). Hepsi 1250×833, 3:2 oranında. Oranlar korundu.
- Astro derleme sırasında fotoğraflardan WebP ve duyarlı boyutlar üretir. İlk ekranın altındaki görseller tembel yüklenir.
- Kaynak sitedeki temsili stok görseller (manken/kadın sporcu fotoğrafları, siyah-beyaz slider görselleri) kullanılmadı.
- Galeri fotoğrafları eski olabilir (kaynak sitede tarih yok). Salonun güncel fotoğrafları çekilirse `src/assets/photos/` klasöründeki dosyalar aynı adla değiştirilebilir.

## Bilinçli olarak eklenmeyenler

- **WhatsApp:** Kaynak sitede WhatsApp bağlantısı yok. Sabit hattan bağlantı üretilmedi. İletişimde "Hemen Ara" ve "E-posta Gönder" kullanıldı.
- **Sosyal medya:** Kaynaktaki Instagram/Twitter/Facebook ikonları `#` adresine gidiyordu. Gerçek hesap bulunamadığı için eklenmedi.
- **Eğitmen, üye sayısı, başarı oranı, şube:** Kaynakta yok, eklenmedi.
- **Koçluk:** Kaynakta yalnızca "donanımlı ve profesyonel ekip" ifadesi var. Ücretli birebir eğitim, beslenme danışmanlığı veya sürekli takip gibi hizmet vaatleri yazılmadı. Kaynağın fiyat sayfasındaki "Kişisel Eğitim – %80", "Beslenme – %100" çubukları şablondan kalma süs öğeleri gibi görünüyor; kullanılmadı.
- **"Duyuru & Etkinlik" sayfası:** Kapsam dışı bırakıldı.

## Erişim ve teknik notlar

- Kaynak sitenin **HTTPS sertifikası alan adıyla eşleşmiyor** (tarayıcı "güvenli değil" uyarısı verir). İçerik HTTP üzerinden okundu. Yeni site yayına alınırken geçerli bir SSL sertifikası kurulmalı.
- Talimatta e-posta bağlantısı `mailto@atlantisspormerkezi.com` olarak yazılmıştı. Doğru biçim olan `mailto:info@atlantisspormerkezi.com` kullanıldı.
- "Yol Tarifi Al", Google Haritalar'da adrese yol tarifi açar. Haritada işletmenin konumunu bir kez kontrol edin.
- Referans tasarım görseli bu çalışmaya ekli değildi. Düzen, aynı referansla hazırlanan önceki çalışmadaki bölüm yapısı (koyu header, fotoğraflı hero, açık özellik şeridi, kart dizilimi, ikiye bölünmüş salon alanı, kartlı üyelik, koyu iletişim) esas alınarak kuruldu.

## Erişilebilirlik ve davranış

- Görünür form etiketleri, Türkçe hata mesajları, ilk hatalı alana odak.
- Galeri: görseller bağlantıdır (JavaScript olmadan da büyük görsel açılır). Büyütme penceresi klavyeyle (Tab, ← →, Esc) ve mobilde kaydırarak kullanılabilir. Kapanınca odak tıklanan görsele döner.
- Üyelik kartındaki "Bilgi Al", formda konuyu "Üyelik" ve ilgili süreyi seçili getirir. Süre alanı yalnızca konu "Üyelik" iken görünür.
- `prefers-reduced-motion` desteklenir: kaydırma animasyonları ve hover hareketleri kapanır.
