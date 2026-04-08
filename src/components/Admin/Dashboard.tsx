import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  X, 
  Save, 
  FileText, 
  ChevronRight, 
  Download, 
  Upload,
  ExternalLink
} from 'lucide-react';
import { seedDatabase } from '../../lib/seed';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceTemplate } from './InvoiceTemplate';

interface Project {
  id: string;
  title: string;
  location: string;
  mainImg: string;
  tag: string;
  description: string;
  video_url?: string;
  detailImages: string[];
  order: number;
}

interface Booking {
  id: string;
  client_name: string;
  whatsapp: string;
  email: string;
  instagram: string;
  event_type: string;
  event_date: string;
  city: string;
  address: string;
  package_id: string;
  addons: string;
  promo_code: string;
  total_price: number;
  dp_amount: number;
  final_payment_amount: number;
  final_payment_proof_url: string;
  bank_ref: string;
  proof_url: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface Package {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  order: number;
}

const handleSupabaseError = (error: any, operationType: OperationType, path: string | null) => {
  console.error(`Supabase Error (${operationType}) on ${path}:`, error.message || error);
  throw error;
};

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'packages' | 'bookings'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const invoiceRef = React.useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  
  // Pelunasan State
  const [finalPaymentAmount, setFinalPaymentAmount] = useState<number>(0);
  const [finalPaymentProof, setFinalPaymentProof] = useState<File | null>(null);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    mainImg: '',
    tag: '',
    description: '',
    videoUrl: '',
    detailImages: '',
    order: 0
  });

  const [packageData, setPackageData] = useState({
    title: '',
    description: '',
    price: '',
    features: '',
    order: 0
  });

  useEffect(() => {
    seedDatabase().then(() => {
      fetchProjects();
      fetchPackages();
      fetchBookings();
    });
  }, []);

  useEffect(() => {
    if (selectedBooking) {
      setFinalPaymentAmount(selectedBooking.final_payment_amount || 0);
      setFinalPaymentProof(null);
    }
  }, [selectedBooking]);

  const handleDownloadInvoice = async () => {
    if (!selectedBooking || !invoiceRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'px'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-Moment-${selectedBooking.client_name.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal membuat invoice. Silakan coba lagi.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSavePelunasan = async () => {
    if (!selectedBooking) return;
    setIsUpdatingPayment(true);
    
    try {
      let proofUrl = selectedBooking.final_payment_proof_url;

      if (finalPaymentProof) {
        const fileExt = finalPaymentProof.name.split('.').pop();
        const fileName = `pelunasan-${selectedBooking.id}-${Math.random()}.${fileExt}`;
        const filePath = `proofs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('proofs')
          .upload(filePath, finalPaymentProof);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('proofs')
          .getPublicUrl(filePath);
        
        proofUrl = publicUrl;
      }

      const { error } = await supabase
        .from('bookings')
        .update({ 
          final_payment_amount: finalPaymentAmount,
          final_payment_proof_url: proofUrl,
          status: finalPaymentAmount + selectedBooking.dp_amount >= selectedBooking.total_price ? 'completed' : selectedBooking.status
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;
      
      const updatedBooking = { 
        ...selectedBooking, 
        final_payment_amount: finalPaymentAmount,
        final_payment_proof_url: proofUrl,
        status: finalPaymentAmount + selectedBooking.dp_amount >= selectedBooking.total_price ? 'completed' : selectedBooking.status
      } as Booking;

      setBookings(bookings.map(b => b.id === selectedBooking.id ? updatedBooking : b));
      setSelectedBooking(updatedBooking);
      alert('Pelunasan berhasil disimpan.');
    } catch (error) {
      console.error('Error saving pelunasan:', error);
      alert('Gagal menyimpan pelunasan.');
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      handleSupabaseError(error, OperationType.GET, 'bookings');
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      
      const mappedProjects = (data || []).map(p => ({
        id: p.id,
        title: p.title,
        location: p.location,
        mainImg: p.main_img,
        tag: p.tag,
        description: p.description || '',
        video_url: p.video_url || '',
        detailImages: p.detail_images || [],
        order: p.order
      }));
      setProjects(mappedProjects);
    } catch (error) {
      handleSupabaseError(error, OperationType.GET, 'projects');
    }
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      handleSupabaseError(error, OperationType.GET, 'packages');
    }
  };

  useEffect(() => {
    const projectChannel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    const packageChannel = supabase
      .channel('packages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, () => {
        fetchPackages();
      })
      .subscribe();

    const bookingChannel = supabase
      .channel('bookings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectChannel);
      supabase.removeChannel(packageChannel);
      supabase.removeChannel(bookingChannel);
    };
  }, []);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        location: project.location,
        mainImg: project.mainImg,
        tag: project.tag,
        description: project.description || '',
        videoUrl: project.video_url || '',
        detailImages: project.detailImages.join(', '),
        order: project.order
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        location: '',
        mainImg: '',
        tag: '',
        description: '',
        videoUrl: '',
        detailImages: '',
        order: projects.length
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      location: formData.location,
      main_img: formData.mainImg,
      tag: formData.tag,
      description: formData.description,
      video_url: formData.videoUrl,
      detail_images: formData.detailImages.split(',').map(s => s.trim()).filter(s => s !== ''),
      order: formData.order,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
      }
      setIsModalOpen(false);
    } catch (error) {
      handleSupabaseError(error, OperationType.WRITE, 'projects');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        handleSupabaseError(error, OperationType.DELETE, `projects/${id}`);
      }
    }
  };

  const handleOpenPackageModal = (pkg?: Package) => {
    if (pkg) {
      setEditingPackage(pkg);
      setPackageData({
        title: pkg.title,
        description: pkg.description || '',
        price: pkg.price || '',
        features: pkg.features.join(', '),
        order: pkg.order
      });
    } else {
      setEditingPackage(null);
      setPackageData({
        title: '',
        description: '',
        price: '',
        features: '',
        order: packages.length
      });
    }
    setIsPackageModalOpen(true);
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: packageData.title,
      description: packageData.description,
      price: packageData.price,
      features: packageData.features.split(',').map(s => s.trim()).filter(s => s !== ''),
      order: packageData.order,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingPackage) {
        const { error } = await supabase
          .from('packages')
          .update(payload)
          .eq('id', editingPackage.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('packages')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
      }
      setIsPackageModalOpen(false);
    } catch (error) {
      handleSupabaseError(error, OperationType.WRITE, 'packages');
    }
  };

  const handlePackageDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      try {
        const { error } = await supabase
          .from('packages')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        handleSupabaseError(error, OperationType.DELETE, `packages/${id}`);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-medium tracking-tighter mb-2">Dasbor</h1>
            <p className="text-gray-500">Kelola konten portofolio Anda</p>
            
            <div className="flex gap-8 mt-8 border-b border-gray-100">
              <button 
                onClick={() => setActiveTab('projects')}
                className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'projects' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Proyek
                {activeTab === 'projects' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
              </button>
              <button 
                onClick={() => setActiveTab('packages')}
                className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'packages' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Paket Layanan
                {activeTab === 'packages' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
              </button>
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'bookings' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Pesanan
                {activeTab === 'bookings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            {activeTab === 'projects' ? (
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-[#1F2021] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
              >
                <Plus size={18} /> Tambah Proyek
              </button>
            ) : activeTab === 'packages' ? (
              <button 
                onClick={() => handleOpenPackageModal()}
                className="flex items-center gap-2 bg-[#1F2021] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
              >
                <Plus size={18} /> Tambah Paket
              </button>
            ) : null}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-full text-sm font-medium hover:bg-white transition-all"
            >
              <LogOut size={18} /> Keluar
            </button>
          </div>
        </div>

        {activeTab === 'projects' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div 
                layout
                key={project.id}
                className="bg-white rounded-sm overflow-hidden shadow-sm border border-gray-100 group"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={project.mainImg} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(project)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-medium tracking-tight">{project.title}</h3>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {project.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Dipotret di {project.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : activeTab === 'packages' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <motion.div 
                layout
                key={pkg.id}
                className="bg-white rounded-sm overflow-hidden shadow-sm border border-gray-100 p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-medium tracking-tight">{pkg.title}</h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenPackageModal(pkg)}
                        className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handlePackageDelete(pkg.id)}
                        className="p-2 bg-gray-50 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">{pkg.description}</p>
                  <p className="text-xl font-medium mb-6">{pkg.price}</p>
                  <ul className="space-y-3">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 text-[10px] uppercase tracking-[0.2em] text-gray-300">
                  Urutan: {pkg.order}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    <th className="px-6 py-4 font-bold">Klien</th>
                    <th className="px-6 py-4 font-bold">Acara</th>
                    <th className="px-6 py-4 font-bold">Tanggal</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-6">
                        <p className="font-medium">{booking.client_name}</p>
                        <p className="text-xs text-gray-400">{booking.whatsapp}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm">{booking.event_type}</p>
                        <p className="text-xs text-gray-400">{booking.city}</p>
                      </td>
                      <td className="px-6 py-6 text-sm">
                        {new Date(booking.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                          booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                          booking.status === 'completed' ? 'bg-blue-50 text-blue-600' :
                          booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                          'bg-orange-50 text-orange-600'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedBooking(booking)}
                            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                          >
                            Detail
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm('Hapus pesanan ini?')) {
                                const { error } = await supabase.from('bookings').delete().eq('id', booking.id);
                                if (error) handleSupabaseError(error, OperationType.DELETE, `bookings/${booking.id}`);
                              }
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">Belum ada pesanan masuk.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-2xl font-medium tracking-tighter">
                    {editingProject ? 'Edit Proyek' : 'Proyek Baru'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400">Judul</label>
                      <input 
                        required
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                        placeholder="Judul proyek"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400">Lokasi</label>
                      <input 
                        required
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                        placeholder="Kota, Negara"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400">Tag</label>
                      <input 
                        required
                        type="text" 
                        value={formData.tag}
                        onChange={(e) => setFormData({...formData, tag: e.target.value})}
                        className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                        placeholder="misal: Editorial, Potret"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400">Urutan</label>
                      <input 
                        required
                        type="number" 
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                        className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">Deskripsi</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-gray-200 p-4 rounded-sm focus:border-black outline-none transition-colors resize-none"
                      placeholder="Deskripsi proyek..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">URL Video (YouTube - Opsional)</label>
                    <input 
                      type="text" 
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                      className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-[10px] text-gray-400 italic">Biarkan kosong jika ini adalah proyek foto saja.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">URL Gambar Utama</label>
                    <div className="flex gap-4">
                      <input 
                        required
                        type="text" 
                        value={formData.mainImg}
                        onChange={(e) => setFormData({...formData, mainImg: e.target.value})}
                        className="flex-1 border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                        placeholder="https://images.unsplash.com/..."
                      />
                      {formData.mainImg && (
                        <div className="w-12 h-12 rounded-sm overflow-hidden bg-gray-100">
                          <img src={formData.mainImg} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">URL Gambar Detail (pisahkan dengan koma)</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.detailImages}
                      onChange={(e) => setFormData({...formData, detailImages: e.target.value})}
                      className="w-full border border-gray-200 p-4 rounded-sm focus:border-black outline-none transition-colors resize-none"
                      placeholder="url1, url2, url3..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#1F2021] text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all"
                  >
                    <Save size={18} /> Simpan Proyek
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPackageModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPackageModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-2xl font-medium tracking-tighter">
                    {editingPackage ? 'Edit Paket' : 'Paket Baru'}
                  </h2>
                  <button onClick={() => setIsPackageModalOpen(false)} className="text-gray-400 hover:text-black">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handlePackageSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">Nama Paket</label>
                    <input 
                      required
                      type="text" 
                      value={packageData.title}
                      onChange={(e) => setPackageData({...packageData, title: e.target.value})}
                      className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                      placeholder="misal: Wedding Bronze"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400">Harga</label>
                      <input 
                        type="text" 
                        value={packageData.price}
                        onChange={(e) => setPackageData({...packageData, price: e.target.value})}
                        className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                        placeholder="misal: Rp 5.000.000 atau Mulai dari..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400">Urutan</label>
                      <input 
                        required
                        type="number" 
                        value={packageData.order}
                        onChange={(e) => setPackageData({...packageData, order: parseInt(e.target.value)})}
                        className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">Deskripsi Singkat</label>
                    <textarea 
                      rows={2}
                      value={packageData.description}
                      onChange={(e) => setPackageData({...packageData, description: e.target.value})}
                      className="w-full border border-gray-200 p-4 rounded-sm focus:border-black outline-none transition-colors resize-none"
                      placeholder="Penjelasan singkat paket..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">Fitur / Apa yang didapat (pisahkan dengan koma)</label>
                    <textarea 
                      required
                      rows={4}
                      value={packageData.features}
                      onChange={(e) => setPackageData({...packageData, features: e.target.value})}
                      className="w-full border border-gray-200 p-4 rounded-sm focus:border-black outline-none transition-colors resize-none"
                      placeholder="50 Foto Edit, 2 Jam Sesi, Semua File Mentah, dsb..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#1F2021] text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all"
                  >
                    <Save size={18} /> Simpan Paket
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedBooking && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedBooking(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-2xl font-medium tracking-tighter">Detail Pesanan</h2>
                  <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-black"><X size={24} /></button>
                </div>
                <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Klien</p>
                      <p className="font-medium">{selectedBooking.client_name}</p>
                      <p className="text-sm text-gray-500">{selectedBooking.whatsapp}</p>
                      <p className="text-sm text-gray-500">{selectedBooking.email || '-'}</p>
                      <p className="text-sm text-gray-500">{selectedBooking.instagram || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Acara</p>
                      <p className="font-medium">{selectedBooking.event_type}</p>
                      <p className="text-sm text-gray-500">{selectedBooking.city}</p>
                      <p className="text-sm text-gray-500">{selectedBooking.address}</p>
                      <p className="text-sm text-gray-500">{new Date(selectedBooking.event_date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-sm">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Layanan & Pembayaran</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Total Biaya</span>
                        <span className="font-medium">Rp {selectedBooking.total_price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jumlah DP (30%)</span>
                        <span className="font-medium text-green-600">- Rp {selectedBooking.dp_amount.toLocaleString('id-ID')}</span>
                      </div>
                      {selectedBooking.final_payment_amount > 0 && (
                        <div className="flex justify-between">
                          <span>Pelunasan Dibayar</span>
                          <span className="font-medium text-green-600">- Rp {selectedBooking.final_payment_amount.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-gray-200 pt-3">
                        <span className="font-bold">Sisa Tagihan</span>
                        <span className="font-bold text-red-600">
                          Rp {(selectedBooking.total_price - selectedBooking.dp_amount - selectedBooking.final_payment_amount).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 pt-2 italic">
                        <span>Ref Rekening DP</span>
                        <span className="font-mono">{selectedBooking.bank_ref}</span>
                      </div>
                    </div>
                  </div>

                  {/* Input Pelunasan Section */}
                  <div className="p-6 border border-gray-100 rounded-sm space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 bg-[#1F2021] rounded-full" />
                      <p className="text-[10px] uppercase tracking-widest font-bold">Input Pelunasan (Opsional)</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Nominal Pelunasan</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm">Rp</span>
                          <input 
                            type="number"
                            value={finalPaymentAmount || ''}
                            onChange={(e) => setFinalPaymentAmount(parseInt(e.target.value) || 0)}
                            className="w-full bg-white border border-gray-200 px-10 py-3 rounded-sm text-sm focus:border-black outline-none transition-all"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Bukti Pelunasan</label>
                        <div className="relative border border-gray-200 rounded-sm p-3 flex items-center justify-between group hover:border-gray-300 transition-all">
                          <input 
                            type="file"
                            onChange={(e) => setFinalPaymentProof(e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <span className="text-xs text-gray-500 truncate pr-8">
                            {finalPaymentProof ? finalPaymentProof.name : (selectedBooking.final_payment_proof_url ? 'Pilih file baru untuk ganti' : 'Pilih file...')}
                          </span>
                          <Upload size={14} className="text-gray-300 group-hover:text-black transition-colors" />
                        </div>
                      </div>
                    </div>

                    {selectedBooking.final_payment_proof_url && !finalPaymentProof && (
                      <div className="pt-2">
                        <a 
                          href={selectedBooking.final_payment_proof_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-black flex items-center gap-2"
                        >
                          <ExternalLink size={10} /> Lihat Bukti Pelunasan Saat Ini
                        </a>
                      </div>
                    )}

                    <button 
                      onClick={handleSavePelunasan}
                      disabled={isUpdatingPayment}
                      className="w-full py-4 bg-gray-50 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#1F2021] hover:text-white transition-all disabled:opacity-50"
                    >
                      {isUpdatingPayment ? 'Menyimpan...' : 'Simpan Data Pelunasan'}
                    </button>
                  </div>

                  {selectedBooking.proof_url && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Bukti Transfer</p>
                      <a href={selectedBooking.proof_url} target="_blank" rel="noreferrer" className="block w-full aspect-video rounded-sm overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity">
                        <img src={selectedBooking.proof_url} alt="Proof" className="w-full h-full object-contain" />
                      </a>
                    </div>
                  )}

                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={async () => {
                            const { error } = await supabase.from('bookings').update({ status }).eq('id', selectedBooking.id);
                            if (!error) setSelectedBooking({ ...selectedBooking, status: status as any });
                          }}
                          className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                            selectedBooking.status === status ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                      <button 
                        onClick={handleDownloadInvoice}
                        disabled={isGeneratingPDF}
                        className="flex-1 bg-[#1F2021] text-white py-4 rounded-sm text-sm font-medium hover:bg-black transition-all flex items-center justify-center gap-2"
                      >
                        {isGeneratingPDF ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <FileText size={18} /> Unduh Invoice (PDF)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {selectedBooking && (
          <div className="fixed -left-[9999px]">
            <InvoiceTemplate 
              ref={invoiceRef}
              booking={selectedBooking}
              pkg={packages.find(p => p.id === selectedBooking.package_id)}
              invoiceNumber={`${selectedBooking.id.substring(0, 8).toUpperCase()}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
