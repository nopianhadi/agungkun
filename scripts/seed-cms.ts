import 'dotenv/config';
import { supabase } from '../src/lib/supabase';

const testimonials = [
  {
    name: "Anna Pechuro",
    quote: "Saya biasanya benci difoto, tapi kali ini terasa sangat berbeda. Sangat santai, tidak ada yang dipaksakan. Hasil fotonya benar-benar terlihat seperti saya, bukan versi saya yang berusaha terlalu keras.",
    location: "Prague",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    order: 1
  },
  {
    name: "Marcus Aurelius",
    quote: "Kualitas sinematiknya luar biasa. Mereka tidak hanya mengambil foto, mereka menangkap perasaan. Setiap kali saya melihat albumnya, saya kembali ke hari itu.",
    location: "Rome",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    order: 2
  },
  {
    name: "Elena Gabor",
    quote: "Tim yang sangat profesional. Mereka tahu cara menempatkan kita agar merasa nyaman di depan kamera. Hasilnya melampaui ekspektasi saya.",
    location: "Paris",
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    order: 3
  }
];

const services = [
  {
    num: "01",
    title: "Editorial Photography",
    description: "Storytelling visual yang kuat untuk majalah, kampanye fashion, dan konten branded dengan estetika tinggi.",
    order: 1
  },
  {
    num: "02",
    title: "Intimate Portraiture",
    description: "Menangkap esensi mentah dan emosi murni dalam suasana yang tenang dan personal, menciptakan kenangan abadi.",
    order: 2
  },
  {
    num: "03",
    title: "Brand Visuals",
    description: "Estetika yang dikurasi untuk membantu brand Anda berkomunikasi dengan kejujuran, gaya, dan profesionalisme.",
    order: 3
  }
];

const showcase = [
  {
    image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop",
    title: "Editorial 01",
    order: 1
  },
  {
    image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    title: "Portrait 01",
    order: 2
  },
  {
    image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop",
    title: "Lifestyle 01",
    order: 3
  },
  {
    image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
    title: "Editorial 02",
    order: 4
  }
];

async function seedCMS() {
  console.log('Menambahkan mock data ke CMS...');

  // Clear existing (optional) and insert
  const { error: tErr } = await supabase.from('testimonials').insert(testimonials);
  const { error: sErr } = await supabase.from('site_services').insert(services);
  const { error: shErr } = await supabase.from('showcase').insert(showcase);

  if (tErr || sErr || shErr) {
    console.error('Terjadi kesalahan saat seeding:', tErr?.message, sErr?.message, shErr?.message);
  } else {
    console.log('✅ Mock data berhasil ditambahkan ke semua tabel CMS!');
  }
}

seedCMS();
