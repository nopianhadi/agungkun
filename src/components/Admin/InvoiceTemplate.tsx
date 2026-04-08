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
        className="bg-white p-[80px] w-[794px] min-h-[1123px] text-[#1F2021] font-sans"
        style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-20">
          <div>
            <h1 className="text-4xl font-medium tracking-tighter italic mb-2">moment /</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Photography Portfolio</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-medium tracking-tight mb-2 uppercase">Invoice</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              No. #{invoiceNumber}<br />
              {date}
            </p>
          </div>
        </div>

        {/* Brand Contact */}
        <div className="grid grid-cols-2 gap-20 mb-20 pb-12 border-b border-gray-100">
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Dari:</h3>
            <p className="text-sm font-medium">Moment Photography Studio</p>
            <p className="text-xs text-gray-500 leading-relaxed mt-2">
              Jl. Artistik No. 88, Jakarta Selatan<br />
              +62 878-0202-3377<br />
              hello@momentphotography.com
            </p>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Untuk:</h3>
            <p className="text-sm font-medium">{booking.client_name}</p>
            <p className="text-xs text-gray-500 leading-relaxed mt-2">
              {booking.whatsapp}<br />
              {booking.email || '-'}<br />
              {booking.city}
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Rincian Acara</h3>
            <div className="h-px flex-1 bg-gray-50" />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Jenis Acara</p>
              <p className="text-sm font-medium">{booking.event_type}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Tanggal</p>
              <p className="text-sm font-medium">
                {new Date(booking.event_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Lokasi</p>
              <p className="text-sm font-medium">{booking.address}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-20">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 text-[10px] uppercase tracking-widest text-gray-400">Deskripsi Layanan</th>
              <th className="text-right py-4 text-[10px] uppercase tracking-widest text-gray-400">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="py-8">
                <p className="font-medium text-sm">Paket {pkg?.title || 'Layanan Fotografi'}</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">
                  Profesional dokumentasi {booking.event_type.toLowerCase()} mencakup sesi pemotretan 
                  dan proses editing standar industri.
                </p>
              </td>
              <td className="py-8 text-right text-sm font-medium">
                Rp {booking.total_price.toLocaleString('id-ID')}
              </td>
            </tr>
            {booking.addons && (
              <tr>
                <td className="py-8">
                  <p className="font-medium text-sm">Add-On Tambahan</p>
                  <p className="text-xs text-gray-400 mt-1">{booking.addons}</p>
                </td>
                <td className="py-8 text-right text-sm font-medium">-</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-72 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span>Rp {booking.total_price.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">DP Dibayarkan (30%)</span>
              <span className="text-green-600">- Rp {booking.dp_amount.toLocaleString('id-ID')}</span>
            </div>
            {finalPaid > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pelunasan Dibayar</span>
                <span className="text-green-600">- Rp {finalPaid.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="h-px bg-gray-100 my-4" />
            <div className="flex justify-between">
              <span className="text-xs uppercase tracking-[0.2em] font-bold">Total Sisa Tagihan</span>
              <span className="text-xl font-medium tracking-tight">
                Rp {balanceDue.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-[80px] left-[80px] right-[80px]">
          <div className="h-px bg-gray-100 mb-8" />
          <div className="grid grid-cols-2 items-end">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Syarat & Ketentuan:</h4>
              <ul className="text-[9px] text-gray-400 space-y-1 list-disc pl-4 leading-relaxed">
                <li>Pelunasan wajib dilakukan maksimal H-7 sebelum hari acara.</li>
                <li>Pembatalan setelah DP tidak dapat dikembalikan (Non-refundable).</li>
                <li>Estimasi pengerjaan hasil foto adalah 14-30 hari kerja.</li>
              </ul>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-gray-300 italic">Terima kasih atas kepercayaan Anda.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
