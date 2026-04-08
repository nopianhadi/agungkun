import 'dotenv/config';
import { supabase } from '../src/lib/supabase';

const weddingProjects = [
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

async function seedWeddingData() {
  console.log('Menambahkan data pernikahan baru ke pangkalan data...');
  
  const { error } = await supabase
    .from('projects')
    .insert(weddingProjects);

  if (error) {
    console.error('Gagal menambahkan data pernikahan:', error.message);
  } else {
    console.log('Data pernikahan berhasil ditambahkan!');
    console.log('1. Janji Suci di Uluwatu (Wedding Photo)');
    console.log('2. Cinta Abadi di Pelataran (Wedding Video)');
  }
}

seedWeddingData();
