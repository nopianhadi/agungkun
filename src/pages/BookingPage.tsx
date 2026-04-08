import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Instagram, 
  Smartphone, 
  MapPin, 
  Calendar, 
  Package as PackageIcon, 
  Plus, 
  Tag, 
  Wallet, 
  Upload, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FadeIn } from '../components/UI/FadeIn';

interface Package {
  id: string;
  title: string;
  price: string;
  features: string[];
}
export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const preSelectedPackageId = searchParams.get('package');
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    client_name: '',
    whatsapp: '',
    email: '',
    instagram: '',
    event_type: 'Wedding',
    event_date: '',
    city: '',
    address: '',
    package_id: '',
    addons: '',
    promo_code: '',
    dp_amount: 0,
    bank_ref: '',
  });

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [selectedPackagePrice, setSelectedPackagePrice] = useState(0);

  useEffect(() => {
    fetchPackages();
    window.scrollTo(0, 0);
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      setPackages(data || []);

      // Pre-select package if ID is in URL
      if (preSelectedPackageId && data) {
        const pkg = data.find((p: any) => p.id === preSelectedPackageId);
        if (pkg) {
          setFormData(prev => ({ ...prev, package_id: pkg.id }));
          setSelectedPackagePrice(parsePrice(pkg.price));
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkgId = e.target.value;
    const pkg = packages.find(p => p.id === pkgId);
    const price = pkg ? parsePrice(pkg.price) : 0;
    
    setFormData({ ...formData, package_id: pkgId });
    setSelectedPackagePrice(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let proofUrl = '';

      // 1. Upload proof if exists
      if (proofFile) {
        const fileExt = proofFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `proofs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('proofs')
          .upload(filePath, proofFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('proofs')
          .getPublicUrl(filePath);
        
        proofUrl = publicUrl;
      }

      // 2. Insert Booking
      const { error } = await supabase
        .from('bookings')
        .insert([{
          ...formData,
          total_price: selectedPackagePrice,
          proof_url: proofUrl,
          status: 'pending'
        }]);

      if (error) throw error;
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Terjadi kesalahan. Pastikan tabel & bucket "proofs" sudah dibuat di Supabase.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <FadeIn direction="up">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tighter mb-6">Pemesanan Terkirim.</h1>
          <p className="text-gray-400 max-w-md mx-auto mb-12">
            Terima kasih telah mempercayakan momen Anda kepada kami. Kami akan segera menghubungi Anda melalui WhatsApp untuk konfirmasi selanjutnya.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="/" className="px-10 py-4 border border-[#1F2021] rounded-full text-sm font-medium hover:bg-[#1F2021] hover:text-white transition-all">
              Kembali ke Beranda
            </a>
            <a 
              href={`https://wa.me/6287802023377?text=Halo, saya baru saja mengirimkan formulir pemesanan atas nama ${formData.client_name}.`}
              target="_blank"
              className="px-10 py-4 bg-[#1F2021] text-white rounded-full text-sm font-medium flex items-center gap-2 hover:scale-105 transition-all"
            >
              Konfirmasi via WhatsApp <ArrowRight size={16} />
            </a>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-40 px-6 max-w-[1000px] mx-auto"
    >
      <FadeIn direction="up">
        <div className="text-sm mb-16 flex items-center gap-2 opacity-40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
          Formulir Pemesanan / (04)
        </div>
        <h1 className="text-5xl md:text-8xl font-medium tracking-tighter mb-16 leading-[0.9]">
          Rencanakan <br /> Momen Anda.
        </h1>
      </FadeIn>

      <form onSubmit={handleSubmit} className="space-y-24">
        {/* --- Section 1: Identitas --- */}
        <section>
          <div className="flex items-center gap-4 mb-12 opacity-40">
            <span className="text-[10px] uppercase tracking-widest font-bold">01 / Identitas Klien</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Nama Pengantin / Klien</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  required
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full bg-gray-50 border-none px-12 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none"
                  value={formData.client_name}
                  onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">WhatsApp (Nomor Aktif)</label>
              <div className="relative">
                <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  required
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  className="w-full bg-gray-50 border-none px-12 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Email (Opsional)</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-gray-50 border-none px-12 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Username Instagram (Opsional)</label>
              <div className="relative">
                <Instagram size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  placeholder="@username"
                  className="w-full bg-gray-50 border-none px-12 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none"
                  value={formData.instagram}
                  onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 2: Detail Acara --- */}
        <section>
          <div className="flex items-center gap-4 mb-12 opacity-40">
            <span className="text-[10px] uppercase tracking-widest font-bold">02 / Detail Acara</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Jenis Acara</label>
              <select
                className="w-full bg-gray-50 border-none px-6 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none appearance-none cursor-pointer"
                value={formData.event_type}
                onChange={e => setFormData({ ...formData, event_type: e.target.value })}
              >
                <option value="Wedding">Wedding (Akad/Resepsi)</option>
                <option value="Corporate">Corporate / Brand</option>
                <option value="Engagement">Lamaran / Engagement</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Event">Lainnya / Event</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Tanggal Acara</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  required
                  type="date"
                  className="w-full bg-gray-50 border-none px-12 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none"
                  value={formData.event_date}
                  onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Lokasi (Kota)</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  required
                  type="text"
                  placeholder="Contoh: Jakarta"
                  className="w-full bg-gray-50 border-none px-12 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Alamat Lengkap / Gedung</label>
              <input
                required
                type="text"
                placeholder="Jl. Gatot Subroto No. 1 / Gedung Mulia"
                className="w-full bg-gray-50 border-none px-6 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* --- Section 3: Layanan --- */}
        <section>
          <div className="flex items-center gap-4 mb-12 opacity-40">
            <span className="text-[10px] uppercase tracking-widest font-bold">03 / Layanan & Paket</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Pilih Paket</label>
              <div className="relative">
                <PackageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <select
                  required
                  className="w-full bg-gray-50 border-none px-12 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none appearance-none cursor-pointer"
                  value={formData.package_id}
                  onChange={handlePackageChange}
                >
                  <option value="">Pilih Package...</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.title} ({pkg.price})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Add-On (Opsional)</label>
              <div className="relative">
                <Plus size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  placeholder="Contoh: Album Cetak, Videografer Tambahan"
                  className="w-full bg-gray-50 border-none px-12 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none"
                  value={formData.addons}
                  onChange={e => setFormData({ ...formData, addons: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Kode Promo (Opsional)</label>
              <div className="relative">
                <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  placeholder="Kode Promo"
                  className="w-full bg-gray-50 border-none px-12 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none"
                  value={formData.promo_code}
                  onChange={e => setFormData({ ...formData, promo_code: e.target.value })}
                />
              </div>
            </div>
            <div className="bg-[#1F2021] text-white p-8 rounded-sm flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-2">Total Estimasi Biaya</span>
              <span className="text-3xl font-medium tracking-tighter">
                {selectedPackagePrice > 0 
                  ? `Rp ${selectedPackagePrice.toLocaleString('id-ID')}` 
                  : 'Rp 0'}
              </span>
            </div>
          </div>
        </section>

        {/* --- Section 4: Pembayaran --- */}
        <section>
          <div className="flex items-center gap-4 mb-12 opacity-40">
            <span className="text-[10px] uppercase tracking-widest font-bold">04 / Konfirmasi Pembayaran</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          
          <div className="bg-orange-50/50 border border-orange-100 p-8 rounded-sm mb-12 flex gap-6 items-start">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
              <Wallet size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Informasi Pembayaran (DP 30%)</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Untuk mengamankan jadwal, silakan melakukan transfer Uang Muka (DP) minimal sebesar 30% dari total biaya ke rekening berikut:
              </p>
              <div className="bg-white p-6 rounded-sm space-y-2 border border-orange-100">
                <p className="text-xs uppercase tracking-widest text-gray-400">Tujuan Transfer:</p>
                <p className="text-xl font-medium tracking-tighter">BCA 1234 567 890</p>
                <p className="text-sm">A/N Agung Kun Photography</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Jumlah DP yang Ditransfer</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm font-medium">Rp</span>
                  <input
                    required
                    type="number"
                    placeholder="0"
                    className="w-full bg-gray-50 border-none px-12 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none font-medium"
                    value={formData.dp_amount || ''}
                    onChange={e => setFormData({ ...formData, dp_amount: parseInt(e.target.value) || 0 })}
                  />
                </div>
                {selectedPackagePrice > 0 && (
                  <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                    <Info size={10} /> Saran DP (30%): Rp {(selectedPackagePrice * 0.3).toLocaleString('id-ID')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">4 Digit Terakhir Rekening</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: 1234"
                  maxLength={4}
                  className="w-full bg-gray-50 border-none px-6 py-4 rounded-sm focus:ring-2 focus:ring-[#1F2021] transition-all outline-none"
                  value={formData.bank_ref}
                  onChange={e => setFormData({ ...formData, bank_ref: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Bukti Transfer DP (Opsional)</label>
              <div 
                className={`relative h-full min-h-[140px] border-2 border-dashed rounded-sm transition-all flex flex-col items-center justify-center p-6 ${proofFile ? 'border-[#1F2021] bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={e => setProofFile(e.target.files?.[0] || null)}
                />
                <Upload size={24} className={`mb-2 ${proofFile ? 'text-[#1F2021]' : 'text-gray-300'}`} />
                <p className="text-xs font-medium text-center">
                  {proofFile ? proofFile.name : 'Klik untuk Unggah atau Tarik File'}
                </p>
                <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest">PNG, JPG hingga 10MB</p>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-20">
          <button
            disabled={submitting || loading}
            type="submit"
            className="w-full md:w-auto px-16 py-8 bg-[#1F2021] text-white rounded-full text-xl font-medium tracking-tighter hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting ? 'Sedang Mengirim...' : 'Kirim Formulir Pemesanan'}
            <ArrowRight size={24} />
          </button>
          <p className="text-center md:text-left text-[10px] uppercase tracking-widest text-gray-400 mt-8">
            Dengan mengirimkan formulir ini, Anda menyetujui syarat & ketentuan layanan kami.
          </p>
        </div>
      </form>
    </motion.div>
  );
};
