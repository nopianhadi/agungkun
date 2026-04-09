import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Save, Upload, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Booking, Package } from '../types';
import { supabase } from '../../../../lib/supabase';
import { InvoiceTemplate } from '../../InvoiceTemplate';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  packages: Package[];
  onUpdate: (updatedBooking: Booking) => void;
}

export const BookingDetailModal: React.FC<Props> = ({ 
  booking, 
  isOpen, 
  onClose, 
  packages, 
  onUpdate
}) => {
  const [finalPaymentAmount, setFinalPaymentAmount] = useState<number>(0);
  const [finalPaymentProof, setFinalPaymentProof] = useState<File | null>(null);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (booking) {
      setFinalPaymentAmount(booking.final_payment_amount || 0);
      setFinalPaymentProof(null);
    }
  }, [booking]);

  const handleDownloadInvoice = async () => {
    if (!booking || !invoiceRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      // Small delay to ensure the template is rendered
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
      pdf.save(`Invoice-Moment-${booking.client_name.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal membuat invoice. Silakan coba lagi.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!booking) return null;

  const handleSavePelunasan = async () => {
    setIsUpdatingPayment(true);
    try {
      let proofUrl = booking.final_payment_proof_url;

      if (finalPaymentProof) {
        const fileExt = finalPaymentProof.name.split('.').pop();
        const fileName = `pelunasan-${booking.id}-${Math.random()}.${fileExt}`;
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
          status: finalPaymentAmount + booking.dp_amount >= booking.total_price ? 'completed' : booking.status
        })
        .eq('id', booking.id);

      if (error) throw error;
      
      onUpdate({ 
        ...booking, 
        final_payment_amount: finalPaymentAmount,
        final_payment_proof_url: proofUrl,
        status: finalPaymentAmount + booking.dp_amount >= booking.total_price ? 'completed' : booking.status
      });
      alert('Pelunasan berhasil disimpan.');
    } catch (error) {
      console.error('Error saving pelunasan:', error);
      alert('Gagal menyimpan pelunasan.');
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handleUpdateStatus = async (status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', booking.id);
      if (error) throw error;
      onUpdate({ ...booking, status });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const selectedPackage = packages.find(p => p.id === booking.package_id);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Left Column: Detail Info */}
            <div className="md:w-1/2 p-10 overflow-y-auto border-r border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Detail Pesanan</h2>
                  <p className="text-xs text-gray-400 font-mono">ID: {booking.id.substring(0, 8).toUpperCase()}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                  booking.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {booking.status}
                </div>
              </div>

              <div className="space-y-10">
                <section>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 block">Klien</label>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Nama</p>
                      <p className="font-medium">{booking.client_name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">WhatsApp</p>
                        <p className="font-medium">{booking.whatsapp}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Email</p>
                        <p className="font-medium text-sm truncate">{booking.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Instagram</p>
                      <p className="font-medium text-gray-500">{booking.instagram}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 block">Acara</label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Tipe</p>
                        <p className="font-medium">{booking.event_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Kota</p>
                        <p className="font-medium">{booking.city}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Alamat</p>
                      <p className="font-medium text-sm">{booking.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Tanggal Acara</p>
                      <p className="font-medium">{new Date(booking.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </section>

                {booking.proof_url && (
                  <section>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 block">Bukti DP (30%)</label>
                    <a 
                      href={booking.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative block aspect-video rounded-xl overflow-hidden bg-gray-200 border border-gray-100 shadow-sm"
                    >
                      <img src={booking.proof_url} alt="Bukti Transfer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                        <ExternalLink size={16} /> LIHAT UKURAN PENUH
                      </div>
                    </a>
                  </section>
                )}
              </div>
            </div>

            {/* Right Column: Payment & Status */}
            <div className="md:w-1/2 p-10 flex flex-col justify-between">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>

              <div className="space-y-10">
                <section>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 block">Layanan & Pembayaran</label>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <span className="text-sm font-medium">Paket</span>
                      <span className="text-sm text-gray-500">{selectedPackage?.title || 'Undetermined'}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Biaya</span>
                        <span className="font-mono">Rp {booking.total_price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-red-500">
                        <span>Jumlah DP (30%)</span>
                        <span className="font-mono">- Rp {booking.dp_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                        <span>Sisa Tagihan</span>
                        <span className="font-mono">Rp {(booking.total_price - (booking.dp_amount + (booking.final_payment_amount || 0))).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                        <span>Ref Rekening DP</span>
                        <span>{booking.bank_ref || '-'}</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm space-y-6">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Input Pelunasan (Opsional)</label>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Nominal Pelunasan</p>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                        <input 
                          type="number"
                          value={finalPaymentAmount}
                          onChange={(e) => setFinalPaymentAmount(Number(e.target.value))}
                          className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white transition-all pl-10 pr-4 py-3 rounded-xl text-sm font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Bukti Pelunasan</p>
                      <div className="flex items-center gap-3">
                        {booking.final_payment_proof_url && (
                          <a href={booking.final_payment_proof_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                            <ImageIcon size={20} />
                          </a>
                        )}
                        <label className="flex-1 flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-200 py-3 rounded-xl text-xs font-medium cursor-pointer transition-all">
                          <Upload size={16} className="text-gray-400" />
                          {finalPaymentProof ? finalPaymentProof.name : 'Pilih file...'}
                          <input type="file" className="hidden" onChange={(e) => setFinalPaymentProof(e.target.files?.[0] || null)} />
                        </label>
                      </div>
                    </div>
                    <button 
                      onClick={handleSavePelunasan}
                      disabled={isUpdatingPayment}
                      className="w-full bg-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-3"
                    >
                      {isUpdatingPayment ? 'Menyimpan...' : (
                        <>
                          <Save size={16} /> Simpan Data Pelunasan
                        </>
                      )}
                    </button>
                  </div>
                </section>

                <section>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 block">Update Status</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(status as any)}
                        className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          booking.status === status 
                            ? 'bg-black text-white shadow-lg shadow-black/20' 
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={handleDownloadInvoice}
                    disabled={isGeneratingPDF}
                    className="flex-1 bg-white border border-gray-200 text-black py-4 rounded-full text-sm font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 group"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-100 border-t-black rounded-full animate-spin" />
                        Memproses PDF...
                      </>
                    ) : (
                      <>
                        <Download size={18} className="text-gray-400 group-hover:text-black transition-colors" /> Unduh Invoice Resmi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Hidden invoice for PDF generation */}
          <div className="fixed -left-[9999px]">
            <InvoiceTemplate 
              ref={invoiceRef}
              booking={booking}
              pkg={selectedPackage}
              invoiceNumber={`${booking.id.substring(0, 8).toUpperCase()}`}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
