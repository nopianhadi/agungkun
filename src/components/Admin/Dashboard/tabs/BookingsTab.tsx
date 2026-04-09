import React from 'react';
import { Booking } from '../types';

interface Props {
  bookings: Booking[];
  onSelect: (booking: Booking) => void;
}

export const BookingsTab: React.FC<Props> = ({ bookings, onSelect }) => {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500 text-[10px] uppercase tracking-widest">Klien</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-[10px] uppercase tracking-widest">Tipe Acara</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-[10px] uppercase tracking-widest">Tanggal</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-[10px] uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-[10px] uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-[10px] uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium">{booking.client_name}</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1">{booking.whatsapp}</div>
                </td>
                <td className="px-6 py-4 text-gray-500">{booking.event_type}</td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(booking.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </td>
                <td className="px-6 py-4 font-mono">Rp {booking.total_price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onSelect(booking)}
                    className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
