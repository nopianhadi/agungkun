import React from 'react';
import { Type, ImageIcon, Upload, Save } from 'lucide-react';

interface Props {
  siteContent: any[];
  editingContent: Record<string, string>;
  onUpdate: (key: string, value: string) => void;
  onUploadImage: (key: string, file: File) => Promise<void>;
  onSave: (key: string, value: string) => Promise<void>;
  isUpdating: boolean;
}

export const SettingsTab: React.FC<Props> = ({ 
  siteContent, 
  editingContent, 
  onUpdate, 
  onUploadImage, 
  onSave, 
  isUpdating 
}) => {
  const mainSections = [
    { title: 'Branding & Hero', type: 'hero', icon: <Type size={18} /> },
    { title: 'Profil Fotografer', type: 'profil', icon: <Type size={18} /> },
    { title: 'Showcase & Galeri', type: 'gallery', icon: <ImageIcon size={18} /> },
    { title: 'Kontak & Sosial', type: 'contact', icon: <ImageIcon size={18} /> }
  ];

  const mainSectionTypes = mainSections.map(s => s.type);
  const uncategorizedItems = siteContent.filter(item => !mainSectionTypes.includes(item.section));

  const sections = [
    ...mainSections,
    ...(uncategorizedItems.length > 0 ? [{ title: 'Konten Lainnya', type: 'other', icon: <ImageIcon size={18} /> }] : [])
  ];

  return (
    <div className="space-y-12 pb-24">
      {sections.map((section) => (
        <div key={section.type} className="bg-white rounded-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
            <span className="text-gray-400">{section.icon}</span>
            <h2 className="text-sm font-bold uppercase tracking-widest">{section.title}</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {siteContent
              .filter(item => section.type === 'other' ? !mainSectionTypes.includes(item.section) : item.section === section.type)
              .map(item => (
                <div key={item.key} className="p-8 grid md:grid-cols-12 gap-8 items-start hover:bg-gray-50/30 transition-colors">
                  <div className="md:col-span-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">{item.label}</label>
                    <p className="text-[10px] text-gray-300 font-mono">Key: {item.key}</p>
                  </div>
                  <div className="md:col-span-8 flex gap-4">
                    {item.type === 'image' ? (
                      <div className="flex-1 flex gap-4 items-center">
                        <img 
                          src={editingContent[item.key] || item.value} 
                          alt={item.label} 
                          className="w-20 h-20 object-cover grayscale rounded-sm border border-gray-100" 
                        />
                        <div className="flex-1 space-y-3">
                          <input 
                            type="text"
                            value={editingContent[item.key] || ''}
                            onChange={(e) => onUpdate(item.key, e.target.value)}
                            className="w-full text-xs bg-gray-50 border-none p-3 rounded-sm focus:ring-1 focus:ring-black transition-all font-mono"
                          />
                          <div className="flex gap-2">
                            <label className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-100 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-50 transition-colors">
                              <Upload size={12} /> Pilih Gambar
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) onUploadImage(item.key, file);
                                }} 
                              />
                            </label>
                            <button 
                              onClick={() => onSave(item.key, editingContent[item.key])}
                              disabled={isUpdating}
                              className="px-6 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-200 transition-all"
                            >
                              Simpan
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex gap-4">
                        <textarea 
                          value={editingContent[item.key] || ''}
                          onChange={(e) => onUpdate(item.key, e.target.value)}
                          className="flex-1 text-sm bg-gray-50 border-none p-4 rounded-sm focus:ring-1 focus:ring-black transition-all resize-none min-h-[100px]"
                        />
                        <button 
                          onClick={() => onSave(item.key, editingContent[item.key])}
                          disabled={isUpdating}
                          className="self-end px-8 py-3 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-200 transition-all flex items-center gap-2"
                        >
                          <Save size={14} /> Simpan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
