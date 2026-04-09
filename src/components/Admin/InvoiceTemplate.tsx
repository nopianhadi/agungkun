import React from 'react';

interface Booking {
  id: string;
  client_name: string;
  whatsapp: string;
  email: string;
  event_type: string;
  event_date: string;
  city: string;
  address: string;
  package_id: string;
  addons?: string;
  total_price: number;
  dp_amount: number;
  final_payment_amount: number;
}

interface Package {
  id: string;
  title: string;
  price: string;
}

interface InvoiceTemplateProps {
  booking: Booking;
  pkg?: Package;
  invoiceNumber: string;
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ booking, pkg, invoiceNumber }, ref) => {
    const finalPaid = booking.final_payment_amount || 0;
    const balanceDue = booking.total_price - booking.dp_amount - finalPaid;
    const date = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <div 
        ref={ref}
        className="bg-white p-[80px] w-[794px] min-h-[1123px] font-sans"
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px',
          backgroundColor: '#FFFFFF',
          color: '#1F2021',
          lineHeight: '1.5'
        }}
      >
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
          <div>
            <h1 className="text-4xl font-medium tracking-tighter italic mb-2" style={{ color: '#1F2021' }}>moment /</h1>
            <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: '#9CA3AF' }}>Photography Portfolio</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 className="text-2xl font-medium tracking-tight mb-2 uppercase" style={{ color: '#1F2021' }}>Invoice</h2>
            <p className="text-xs" style={{ color: '#9CA3AF', lineHeight: '1.6' }}>
              No. #{invoiceNumber}<br />
              {date}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#F3F4F6', marginBottom: '40px' }} />

        {/* Client & Studio Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4" style={{ color: '#9CA3AF' }}>Dari:</h3>
            <p className="text-sm font-medium" style={{ color: '#1F2021' }}>Moment Photography Studio</p>
            <p className="text-xs mt-2" style={{ color: '#6B7280', lineHeight: '1.6' }}>
              Jl. Artistik No. 88, Jakarta Selatan<br />
              +62 878-0202-3377<br />
              hello@momentphotography.com
            </p>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4" style={{ color: '#9CA3AF' }}>Untuk:</h3>
            <p className="text-sm font-medium" style={{ color: '#1F2021' }}>{booking.client_name}</p>
            <p className="text-xs mt-2" style={{ color: '#6B7280', lineHeight: '1.6' }}>
              {booking.whatsapp}<br />
              {booking.email || '-'}<br />
              {booking.city}
            </p>
          </div>
        </div>

        {/* Event Details Section */}
        <div style={{ marginBottom: '48px', padding: '32px', border: '1px solid #F3F4F6', borderRadius: '4px' }}>
          <h3 className="text-[10px] uppercase tracking-widest font-bold mb-6" style={{ color: '#9CA3AF' }}>Informasi Acara</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Jenis Acara</p>
              <p className="text-sm font-medium" style={{ color: '#1F2021' }}>{booking.event_type}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Tanggal</p>
              <p className="text-sm font-medium" style={{ color: '#1F2021' }}>
                {new Date(booking.event_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Lokasi</p>
              <p className="text-sm font-medium" style={{ color: '#1F2021' }}>{booking.address}</p>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div style={{ marginBottom: '48px' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <th className="text-left py-4 text-[10px] uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Deskripsi Layanan</th>
                <th className="text-right py-4 text-[10px] uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-8">
                  <p className="font-medium text-sm" style={{ color: '#1F2021' }}>Paket {pkg?.title || 'Layanan Fotografi'}</p>
                  <p className="text-xs mt-2 max-w-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
                    Dokumentasi profesional untuk acara {booking.event_type.toLowerCase()} Anda. 
                    Termasuk sesi pemotretan dan editing pasca-produksi standar industri.
                  </p>
                </td>
                <td className="py-8 text-right text-sm font-medium" style={{ color: '#1F2021' }}>
                  Rp {booking.total_price.toLocaleString('id-ID')}
                </td>
              </tr>
              {booking.addons && (
                <tr style={{ borderTop: '1px solid #F9FAFB' }}>
                  <td className="py-8">
                    <p className="font-medium text-sm" style={{ color: '#1F2021' }}>Add-On Tambahan</p>
                    <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{booking.addons}</p>
                  </td>
                  <td className="py-8 text-right text-sm font-medium" style={{ color: '#1F2021' }}>-</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Background Shading */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '80px' }}>
          <div style={{ width: '320px', backgroundColor: '#F9FAFB', padding: '32px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '16px' }}>
              <span style={{ color: '#9CA3AF' }}>Subtotal</span>
              <span style={{ color: '#1F2021' }}>Rp {booking.total_price.toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '16px' }}>
              <span style={{ color: '#9CA3AF' }}>DP Dibayarkan</span>
              <span style={{ color: '#16A34A' }}>- Rp {booking.dp_amount.toLocaleString('id-ID')}</span>
            </div>
            {finalPaid > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '16px' }}>
                <span style={{ color: '#9CA3AF' }}>Pelunasan</span>
                <span style={{ color: '#16A34A' }}>- Rp {finalPaid.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '20px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: '#1F2021' }}>Sisa Tagihan</span>
              <span className="text-2xl font-medium tracking-tight" style={{ color: '#1F2021' }}>
                Rp {balanceDue.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Fixed at Bottom */}
        <div style={{ position: 'absolute', bottom: '80px', left: '80px', right: '80px' }}>
          <div style={{ height: '1px', backgroundColor: '#F3F4F6', marginBottom: '32px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'flex-end' }}>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4" style={{ color: '#9CA3AF' }}>Syarat & Ketentuan:</h4>
              <ul className="text-[9px] space-y-2 list-disc pl-4" style={{ color: '#9CA3AF', lineHeight: '1.6' }}>
                <li>Konfirmasi pelunasan paling lambat H-7 sebelum acara.</li>
                <li>DP yang sudah dibayarkan bersifat non-refundable.</li>
                <li>Hasil dokumentasi akan diserahkan dalam 14-30 hari kerja.</li>
              </ul>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-[10px] uppercase tracking-widest italic" style={{ color: '#D1D5DB' }}>Thank you for choosing Moment Studio.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
