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
  {
    title: "Sesi Personal",
    description: "Sesi potret individu dengan fokus pada karakter dan kepribadian serta pencahayaan alami yang indah.",
    price: "Rp 1.500.000",
    features: ["2 Jam Sesi", "15 Foto Edit", "Semua File Mentah", "1 Lokasi"],
    order: 0
  },
  {
    title: "Wedding Cinematic",
    description: "Dokumentasi lengkap hari bahagia Anda dengan gaya sinematik yang abadi dan penuh emosi.",
    price: "Rp 7.500.000",
    features: ["8 Jam Liputan", "Wedding Film (3-5 menit)", "Teaser Instagram", "2 Videografer"],
    order: 1
  },
  {
    title: "Editorial Fashion",
    description: "Produksi visual tingkat tinggi untuk kebutuhan brand dan fashion dengan standar industri.",
    price: "Rp 3.000.000",
    features: ["Sesi Studio/Outdoor", "10 Foto Retouch Pro", "Moodboard", "Creative Direction"],
    order: 2
  }
];

export async function seedDatabase() {
  try {
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

    // Seed Packages
    const { data: existingPackages, error: packageFetchError } = await supabase
      .from('packages')
      .select('id')
      .limit(1);

    if (packageFetchError) throw packageFetchError;

    if (!existingPackages || existingPackages.length === 0) {
      console.log('Mengisi data paket...');
      const { error: packageSeedError } = await supabase
        .from('packages')
        .insert(initialPackages);

      if (packageSeedError) throw packageSeedError;
      console.log('Data paket berhasil diisi!');
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengisi pangkalan data:', error);
  }
}

