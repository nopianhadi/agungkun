import { supabase } from './supabase';

const initialProjects = [
  {
    title: "Mekar Bersemi",
    location: "London",
    main_img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",
    tag: "Editorial",
    description: "Seri yang mengeksplorasi warna-warna cerah dan tekstur halus musim semi di jantung kota London. Diabadikan selama jam emas untuk menekankan cahaya alami flora perkotaan.",
    detail_images: [
      "https://images.unsplash.com/photo-1515347619152-c6bf2e535e05?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523264629844-40dd6bf17c2b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512496015851-a1cbf275512a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop"
    ],
    order: 0
  },
  {
    title: "Keanggunan yang Mengakar",
    location: "Glasgow",
    main_img: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1200&auto=format&fit=crop",
    tag: "Potret",
    description: "Potret intim yang diabadikan di lanskap Glasgow yang tangguh. Koleksi ini berfokus pada emosi mentah dan keanggunan abadi jiwa manusia dengan latar belakang alam.",
    detail_images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1200&auto=format&fit=crop"
    ],
    detail_images_v2: [], // Placeholder to avoid confusion if v2 is needed
    order: 1
  },
  {
    title: "Perairan Tenang",
    location: "Berlin",
    main_img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1200&auto=format&fit=crop",
    tag: "Alam",
    description: "Perjalanan tenang melalui perairan yang damai dan hutan rimbun di pinggiran Berlin. Gambar-gambar ini menangkap kekuatan sunyi dan keindahan abadi dunia alam.",
    detail_images: [
      "https://images.unsplash.com/photo-1464863979621-258859e62245?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1455218873509-8097305ee378?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1200&auto=format&fit=crop"
    ],
    order: 2
  },
  {
    title: "Gema Perkotaan",
    location: "Tokyo",
    main_img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
    tag: "Jalanan",
    description: "Denyut ritmis jalanan Tokyo, diabadikan melalui lensa yang mencari hal luar biasa dalam keseharian. Sebuah studi tentang cahaya, bayangan, dan geometri perkotaan.",
    detail_images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop"
    ],
    order: 3
  },
  {
    title: "Cinematic Oslo",
    location: "Oslo",
    main_img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    tag: "Sinematik",
    description: "Perjalanan visual melalui arsitektur dan suasana kota Oslo di musim dingin. Menangkap kontras antara minimalisme modern dan cahaya alami yang dramatis.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Example video
    detail_images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496442226666-8d4d38e60f11?q=80&w=800&auto=format&fit=crop"
    ],
    order: 4
  },
  {
    title: "Di Balik Lensa",
    location: "Berbagai Lokasi",
    main_img: "https://images.unsplash.com/photo-1452721226468-f95fb66ebf83?q=80&w=1200&auto=format&fit=crop",
    tag: "Dokumenter",
    description: "Dokumentasi proses kreatif dan petualangan di balik layar setiap pengambilan gambar. Melihat bagaimana momen ditangkap dari perspektif fotografer.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Example video
    detail_images: [
      "https://images.unsplash.com/photo-1452721226468-f95fb66ebf83?q=80&w=800&auto=format&fit=crop"
    ],
    order: 5
  },
  {
    title: "Janji Suci di Uluwatu",
    location: "Bali",
    main_img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    tag: "Wedding",
    description: "Kisah cinta abadi yang diabadikan di tebing Uluwatu yang megah. Menangkap momen-momen sakral dan emosional di tengah deburan ombak Samudera Hindia.",
    detail_images: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522673607200-164883eeba55?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop"
    ],
    order: 6
  },
  {
    title: "Cinta Abadi di Pelataran",
    location: "Yogyakarta",
    main_img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
    tag: "Wedding Video",
    description: "Sebuah mahakarya sinematik yang menceritakan penyatuan dua jiwa dengan latar belakang Candi Borobudur yang magis. Dokumentasi emosi yang tulus dalam format video yang indah.",
    video_url: "https://www.youtube.com/watch?v=lY2H28itjmc",
    detail_images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop"
    ],
    order: 7
  }
];

const initialPackages = [
  // Wedding
  {
    title: "Wedding Basic",
    description: "Dokumentasi inti hari pernikahan Anda dengan satu fotografer profesional.",
    price: "5.000.000",
    category: "Wedding",
    features: ["6 Jam Liputan", "1 Fotografer", "100 Foto Edit", "Flashdisk File Mentah", "1 Album Cetak"],
    order: 0
  },
  {
    title: "Wedding Silver",
    description: "Paket lengkap dengan videografi inti untuk mengabadikan momen spesial Anda.",
    price: "8.500.000",
    category: "Wedding",
    features: ["8 Jam Liputan", "1 Fotografer & 1 Videografer", "150 Foto Edit", "Cinematic Teaser (1 Menit)", "Flashdisk & Album Box"],
    order: 1
  },
  {
    title: "Wedding Gold",
    description: "Layanan dokumentasi premium paling lengkap untuk pernikahan megah Anda.",
    price: "15.000.000",
    category: "Wedding",
    features: ["Full Day Liputan", "2 Fotografer & 2 Videografer", "Semua Foto Edit", "Wedding Film (5 Menit)", "Drone Footage", "Exclusive Photo Book"],
    order: 2
  },
  // Prewedding
  {
    title: "Prewedding Nature",
    description: "Sesi foto romantis dengan latar belakang keindahan alam terbuka.",
    price: "3.500.000",
    category: "Prewedding",
    features: ["4 Jam Sesi", "1 Lokasi Outdoor", "20 Foto Edit", "Cetak Kanvas 40x60", "Make Up Standar"],
    order: 3
  },
  {
    title: "Prewedding Urban",
    description: "Konsep foto prewedding modern dan stylish di tengah hiruk pikuk kota.",
    price: "3.000.000",
    category: "Prewedding",
    features: ["3 Jam Sesi", "Lanskap Kota/Kafe", "15 Foto Edit", "Semua File Original", "Styling Guide"],
    order: 4
  },
  {
    title: "Prewedding Premium",
    description: "Pengalaman prewedding eksklusif dengan konsep kustom dan tim lengkap.",
    price: "7.000.000",
    category: "Prewedding",
    features: ["Full Day Sesi", "Multi Lokasi", "40 Foto Edit", "Cinematic Video Slide", "Professional MUA & Hairdo", "Exclusive Album"],
    order: 5
  },
  // Personal & Others
  {
    title: "Sesi Personal",
    description: "Sesi potret individu untuk portofolio, media sosial, atau kenangan pribadi.",
    price: "1.500.000",
    category: "Personal",
    features: ["2 Jam Sesi", "1 Lokasi", "10 Foto Edit", "Semua File Mentah"],
    order: 6
  },
  {
    title: "Lamaran (Engagement)",
    description: "Abadikan momen bersejarah pengikatan janji suci Anda bersama keluarga.",
    price: "2.500.000",
    category: "Event",
    features: ["4 Jam Liputan", "1 Fotografer", "50 Foto Edit", "Online Gallery"],
    order: 7
  },
  {
    title: "Birthday Party",
    description: "Buat pesta ulang tahun Anda (atau anak Anda) tak terlupakan selamanya.",
    price: "2.000.000",
    category: "Event",
    features: ["3 Jam Liputan", "Dokumentasi Candid", "Semua File Original", "Highlight Video (30 Detik)"],
    order: 8
  },
  {
    title: "Editorial Fashion",
    description: "Kebutuhan visual komersial untuk brand, katalog, atau kampanye fashion.",
    price: "4.000.000",
    category: "Commercial",
    features: ["Sesi Studio/Outdoor", "High-End Retouching", "Creative Direction", "Moodboard"],
    order: 9
  },
  {
    title: "Maternity Session",
    description: "Sesi foto hangat untuk merayakan perjalanan indah kehamilan Anda.",
    price: "1.800.000",
    category: "Personal",
    features: ["1.5 Jam Sesi", "Home/Studio", "12 Foto Edit", "Properti Dasar"],
    order: 10
  }
];

const initialSiteContent = [
  // Branding & Hero
  { key: 'brand_name', value: 'Agung Kun', type: 'text', label: 'Nama Brand', section: 'hero' },
  { key: 'hero_title', value: 'moment', type: 'text', label: 'Hero Title', section: 'hero' },
  { key: 'hero_subtitle', value: 'Oleh Agung Kun', type: 'text', label: 'Hero Subtitle', section: 'hero' },
  { key: 'hero_image', value: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop', type: 'image', label: 'Hero Image', section: 'hero' },
  
  // Profil
  { key: 'about_title', value: 'Portofolio ini adalah buku harian visual dari tempat, orang, dan momen yang saya kumpulkan melalui lensa.', type: 'textarea', label: 'Judul Profil', section: 'profil' },
  { key: 'about_description', value: '“Saya memotret foto-foto yang autentik dan ekspresif, yang menangkap esensi dari setiap momen.”', type: 'textarea', label: 'Deskripsi Profil', section: 'profil' },
  { key: 'about_image', value: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', type: 'image', label: 'Foto Profil', section: 'profil' },
  { key: 'about_location', value: 'Kyoto', type: 'text', label: 'Lokasi Foto Profil', section: 'profil' },
  
  // Showcase & Gallery
  { key: 'showcase_badge', value: 'Showcase', type: 'text', label: 'Badge Showcase', section: 'gallery' },
  { key: 'showcase_header', value: 'Album Pexels paling banyak dilihat', type: 'text', label: 'Header Showcase', section: 'gallery' },
  { key: 'showcase_link_text', value: 'Lihat album', type: 'text', label: 'Teks Link Showcase', section: 'gallery' },
  { key: 'showcase_link_url', value: '#', type: 'text', label: 'URL Link Showcase', section: 'gallery' },
  { key: 'gallery_badge', value: 'Galeri', type: 'text', label: 'Badge Galeri', section: 'gallery' },
  { key: 'gallery_header_small', value: 'Karya terpilih', type: 'text', label: 'Header Kecil Galeri', section: 'gallery' },
  { key: 'gallery_header_big', value: 'Buku Harian Visual', type: 'text', label: 'Header Besar Galeri', section: 'gallery' },
  { key: 'gallery_footer_text', value: 'Ingin melihat lebih banyak?', type: 'text', label: 'Teks Footer Galeri', section: 'gallery' },
  { key: 'gallery_footer_button', value: 'Lihat galeri lengkap', type: 'text', label: 'Teks Tombol Footer Galeri', section: 'gallery' },
  
  // Contact & Social
  { key: 'contact_whatsapp', value: '6287802023377', type: 'text', label: 'WhatsApp', section: 'contact' },
  { key: 'contact_email', value: 'aguangkun@gmail.com', type: 'text', label: 'Email', section: 'contact' },
  { key: 'contact_instagram', value: 'agungkunn', type: 'text', label: 'Instagram Username', section: 'contact' },
  { key: 'contact_footer_title', value: 'Mari kita abadikan kisah Anda bersama.', type: 'textarea', label: 'Judul Footer Kontak', section: 'contact' }
];

export async function seedDatabase() {
  try {
    // Seed Site Content (Upsert strategy to preserve values but update metadata)
    console.log('Sinkronisasi konten situs...');
    const { data: existingContent } = await supabase
      .from('site_content')
      .select('*');

    const contentToUpsert = initialSiteContent.map(newItem => {
      const existing = existingContent?.find(e => e.key === newItem.key);
      return {
        ...newItem,
        value: existing ? existing.value : newItem.value // Preserve existing value if it exists
      };
    });

    const { error: contentSeedError } = await supabase
      .from('site_content')
      .upsert(contentToUpsert, { onConflict: 'key' });

    if (contentSeedError) throw contentSeedError;
    console.log('Konten situs berhasil disinkronkan!');

    // Seed Projects
    const { data: existingProjects, error: fetchError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (fetchError) throw fetchError;

    if (!existingProjects || existingProjects.length === 0) {
      console.log('Mengisi data proyek...');
      const { error: seedError } = await supabase
        .from('projects')
        .insert(initialProjects);

      if (seedError) throw seedError;
      console.log('Data proyek berhasil diisi!');
    }

    // Seed Packages (Separate Insert and Update to avoid ID constraint issues)
    console.log('Sinkronisasi data paket...');
    const { data: existingPkgs } = await supabase
      .from('packages')
      .select('*');

    const toUpdate = [];
    const toInsert = [];

    for (const newPkg of initialPackages) {
      const existing = existingPkgs?.find(e => e.title === newPkg.title);
      if (existing) {
        toUpdate.push({
          ...newPkg,
          id: existing.id,
          updated_at: new Date().toISOString()
        });
      } else {
        toInsert.push(newPkg);
      }
    }

    if (toUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from('packages')
        .upsert(toUpdate);
      if (updateError) throw updateError;
    }

    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('packages')
        .insert(toInsert);
      if (insertError) throw insertError;
    }

    console.log('Data paket berhasil disinkronkan!');
  } catch (error) {
    console.error('Terjadi kesalahan saat mengisi pangkalan data:', error);
  }
}

