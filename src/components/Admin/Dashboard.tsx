import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Plus, LogOut } from 'lucide-react';
import { seedDatabase } from '../../lib/seed';
import { useSiteContent } from '../../hooks/useSiteContent';

// Types
import { Project, Booking, Package, Testimonial, SiteService, ShowcaseItem, OperationType } from './Dashboard/types';

// Tab Components
import { ProjectsTab } from './Dashboard/tabs/ProjectsTab';
import { PackagesTab } from './Dashboard/tabs/PackagesTab';
import { BookingsTab } from './Dashboard/tabs/BookingsTab';
import { TestimonialsTab } from './Dashboard/tabs/TestimonialsTab';
import { ServicesTab } from './Dashboard/tabs/ServicesTab';
import { ShowcaseTab } from './Dashboard/tabs/ShowcaseTab';
import { SettingsTab } from './Dashboard/tabs/SettingsTab';

// Modal Components
import { ProjectModal } from './Dashboard/modals/ProjectModal';
import { PackageModal } from './Dashboard/modals/PackageModal';
import { BookingDetailModal } from './Dashboard/modals/BookingDetailModal';
import { TestimonialModal } from './Dashboard/modals/TestimonialModal';
import { ServiceModal } from './Dashboard/modals/ServiceModal';
import { ShowcaseModal } from './Dashboard/modals/ShowcaseModal';

const handleSupabaseError = (error: any, operationType: OperationType, path: string | null) => {
  console.error(`Supabase Error (${operationType}) on ${path}:`, error.message || error);
  throw error;
};

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'packages' | 'bookings' | 'testimonials' | 'services' | 'showcase' | 'settings'>('projects');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteServices, setSiteServices] = useState<SiteService[]>([]);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  
  // Site Content
  const { items: siteItems, refresh: refreshSite } = useSiteContent();
  const [editingContent, setEditingContent] = useState<Record<string, string>>({});
  const [isUpdatingSite, setIsUpdatingSite] = useState(false);

  // Modal Visibility State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isBookingDetailOpen, setIsBookingDetailOpen] = useState(false);
  const [isTestiModalOpen, setIsTestiModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isShowcaseModalOpen, setIsShowcaseModalOpen] = useState(false);

  // Editing Item State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingService, setEditingService] = useState<SiteService | null>(null);
  const [editingShowcase, setEditingShowcase] = useState<ShowcaseItem | null>(null);


  useEffect(() => {
    seedDatabase().then(() => {
      fetchAllData();
    });
  }, []);

  const fetchAllData = () => {
    fetchProjects();
    fetchPackages();
    fetchBookings();
    fetchTestimonials();
    fetchSiteServices();
    fetchShowcase();
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('order', { ascending: true });
    if (!error) setProjects((data || []).map(p => ({
      ...p,
      mainImg: p.main_img,
      detailImages: p.detail_images || [],
      video_url: p.video_url || ''
    })));
  };

  const fetchPackages = async () => {
    const { data, error } = await supabase.from('packages').select('*').order('order', { ascending: true });
    if (!error) setPackages(data || []);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (!error) setBookings(data || []);
  };

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('order', { ascending: true });
    if (!error) setTestimonials(data || []);
  };

  const fetchSiteServices = async () => {
    const { data, error } = await supabase.from('site_services').select('*').order('order', { ascending: true });
    if (!error) setSiteServices(data || []);
  };

  const fetchShowcase = async () => {
    const { data, error } = await supabase.from('showcase').select('*').order('order', { ascending: true });
    if (!error) setShowcaseItems(data || []);
  };

  useEffect(() => {
    if (siteItems) {
      const initial: Record<string, string> = {};
      siteItems.forEach(item => initial[item.key] = item.value);
      setEditingContent(initial);
    }
  }, [siteItems]);

  // Realtime Listeners
  useEffect(() => {
    const channels = [
      supabase.channel('projects_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchProjects),
      supabase.channel('packages_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, fetchPackages),
      supabase.channel('bookings_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchBookings),
      supabase.channel('testimonials_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, fetchTestimonials),
      supabase.channel('services_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'site_services' }, fetchSiteServices),
      supabase.channel('showcase_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'showcase' }, fetchShowcase)
    ].map(c => c.subscribe());

    return () => {
      channels.forEach(c => supabase.removeChannel(c));
    };
  }, []);

  // Handlers
  const handleProjectSubmit = async (formData: any) => {
    const payload = {
      title: formData.title,
      location: formData.location,
      main_img: formData.mainImg,
      tag: formData.tag,
      description: formData.description,
      video_url: formData.videoUrl,
      detail_images: formData.detailImages.split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
      order: formData.order,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingProject) {
        await supabase.from('projects').update(payload).eq('id', editingProject.id);
      } else {
        await supabase.from('projects').insert([{ ...payload, created_at: new Date().toISOString() }]);
      }
      setIsProjectModalOpen(false);
    } catch (error) {
      handleSupabaseError(error, OperationType.WRITE, 'projects');
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (window.confirm('Hapus proyek ini?')) {
      await supabase.from('projects').delete().eq('id', id);
    }
  };

  const handlePackageSubmit = async (packageData: any) => {
    const payload = {
      title: packageData.title,
      description: packageData.description,
      price: packageData.price,
      category: packageData.category,
      features: packageData.features.split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
      order: packageData.order,
      updated_at: new Date().toISOString()
    };
    try {
      if (editingPackage) {
        await supabase.from('packages').update(payload).eq('id', editingPackage.id);
      } else {
        await supabase.from('packages').insert([{ ...payload, created_at: new Date().toISOString() }]);
      }
      setIsPackageModalOpen(false);
    } catch (error) {
      handleSupabaseError(error, OperationType.WRITE, 'packages');
    }
  };

  const handleTestiSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name') as string,
      quote: fd.get('quote') as string,
      location: fd.get('location') as string,
      image_url: fd.get('image_url') as string,
      order: parseInt(fd.get('order') as string) || 0
    };
    if (editingTestimonial) {
      await supabase.from('testimonials').update(payload).eq('id', editingTestimonial.id);
    } else {
      await supabase.from('testimonials').insert([payload]);
    }
    setIsTestiModalOpen(false);
  };

  const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      num: fd.get('num') as string,
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      order: parseInt(fd.get('order') as string) || 0
    };
    if (editingService) {
      await supabase.from('site_services').update(payload).eq('id', editingService.id);
    } else {
      await supabase.from('site_services').insert([payload]);
    }
    setIsServiceModalOpen(false);
  };

  const handleShowcaseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      image_url: fd.get('image_url') as string,
      title: fd.get('title') as string,
      order: parseInt(fd.get('order') as string) || 0
    };
    if (editingShowcase) {
      await supabase.from('showcase').update(payload).eq('id', editingShowcase.id);
    } else {
      await supabase.from('showcase').insert([payload]);
    }
    setIsShowcaseModalOpen(false);
  };

  const saveSiteContent = async (key: string, value: string) => {
    setIsUpdatingSite(true);
    await supabase.from('site_content').update({ value }).eq('key', key);
    setEditingContent(prev => ({ ...prev, [key]: value }));
    await refreshSite();
    setIsUpdatingSite(false);
  };

  const handleUploadSiteImage = async (key: string, file: File) => {
    setIsUpdatingSite(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `site-assets/site-${key}-${Math.random()}.${fileExt}`;
    await supabase.storage.from('images').upload(filePath, file);
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
    await saveSiteContent(key, publicUrl);
    setIsUpdatingSite(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-medium tracking-tighter mb-2">Dasbor</h1>
            <p className="text-gray-500 text-sm">Kelola konten portofolio Anda</p>
            <div className="flex gap-8 mt-8 border-b border-gray-100 overflow-x-auto no-scrollbar">
              {['projects', 'packages', 'bookings', 'testimonials', 'services', 'showcase', 'settings'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-black' : 'text-gray-300 hover:text-gray-500'}`}
                >
                  {tab === 'projects' ? 'Proyek' : tab === 'packages' ? 'Paket' : tab === 'bookings' ? 'Pesanan' : tab === 'testimonials' ? 'Testimoni' : tab === 'services' ? 'Layanan' : tab === 'showcase' ? 'Showcase' : 'Pengaturan'}
                  {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            {activeTab !== 'bookings' && activeTab !== 'settings' && (
              <button 
                onClick={() => {
                  if (activeTab === 'projects') { setEditingProject(null); setIsProjectModalOpen(true); }
                  else if (activeTab === 'packages') { setEditingPackage(null); setIsPackageModalOpen(true); }
                  else if (activeTab === 'testimonials') { setEditingTestimonial(null); setIsTestiModalOpen(true); }
                  else if (activeTab === 'services') { setEditingService(null); setIsServiceModalOpen(true); }
                  else if (activeTab === 'showcase') { setEditingShowcase(null); setIsShowcaseModalOpen(true); }
                }}
                className="flex items-center gap-2 bg-[#1F2021] text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
              >
                <Plus size={14} /> Tambah {activeTab}
              </button>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
              Keluar
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'projects' && <ProjectsTab projects={projects} onOpenModal={(p) => { setEditingProject(p || null); setIsProjectModalOpen(true); }} onDelete={handleProjectDelete} />}
          {activeTab === 'packages' && <PackagesTab packages={packages} onOpenModal={(pkg) => { setEditingPackage(pkg || null); setIsPackageModalOpen(true); }} onDelete={(id) => supabase.from('packages').delete().eq('id', id)} />}
          {activeTab === 'bookings' && <BookingsTab bookings={bookings} onSelect={(b) => { setSelectedBooking(b); setIsBookingDetailOpen(true); }} />}
          {activeTab === 'testimonials' && <TestimonialsTab testimonials={testimonials} onEdit={(t) => { setEditingTestimonial(t); setIsTestiModalOpen(true); }} onDelete={(id) => supabase.from('testimonials').delete().eq('id', id)} />}
          {activeTab === 'services' && <ServicesTab services={siteServices} onEdit={(s) => { setEditingService(s); setIsServiceModalOpen(true); }} onDelete={(id) => supabase.from('site_services').delete().eq('id', id)} />}
          {activeTab === 'showcase' && <ShowcaseTab items={showcaseItems} onEdit={(i) => { setEditingShowcase(i); setIsShowcaseModalOpen(true); }} onDelete={(id) => supabase.from('showcase').delete().eq('id', id)} />}
          {activeTab === 'settings' && <SettingsTab siteContent={siteItems || []} editingContent={editingContent} onUpdate={(k, v) => setEditingContent(p => ({...p, [k]: v}))} onUploadImage={handleUploadSiteImage} onSave={saveSiteContent} isUpdating={isUpdatingSite} />}
        </div>

        {/* Modals */}
        <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} project={editingProject} onSubmit={handleProjectSubmit} initialOrder={projects.length} />
        <PackageModal isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} pkg={editingPackage} onSubmit={handlePackageSubmit} initialOrder={packages.length} />
        <BookingDetailModal 
          isOpen={isBookingDetailOpen} 
          onClose={() => setIsBookingDetailOpen(false)} 
          booking={selectedBooking} 
          packages={packages} 
          onUpdate={(b) => {
            setBookings(prev => prev.map(old => old.id === b.id ? b : old));
            setSelectedBooking(b);
          }}
        />
        <TestimonialModal isOpen={isTestiModalOpen} onClose={() => setIsTestiModalOpen(false)} testimonial={editingTestimonial} onSubmit={handleTestiSubmit} />
        <ServiceModal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} service={editingService} onSubmit={handleServiceSubmit} />
        <ShowcaseModal isOpen={isShowcaseModalOpen} onClose={() => setIsShowcaseModalOpen(false)} item={editingShowcase} onSubmit={handleShowcaseSubmit} />
      </div>
    </div>
  );
};
