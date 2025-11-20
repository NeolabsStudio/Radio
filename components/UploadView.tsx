
import React, { useState } from 'react';
import { Icons } from './Icons';
import { CATEGORIES } from '../constants';
import { Station } from '../types';

interface UploadViewProps {
  onUpload: (newStation: Station) => void;
  onCancel: () => void;
}

const UploadView: React.FC<UploadViewProps> = ({ onUpload, onCancel }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]); // Default to first actual category
  const [isPremium, setIsPremium] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !file) return;

    setIsSubmitting(true);

    // Simulate upload delay
    setTimeout(() => {
      const audioUrl = URL.createObjectURL(file);
      const imageUrl = imageFile ? URL.createObjectURL(imageFile) : `https://picsum.photos/400/400?random=${Date.now()}`;

      const newStation: Station = {
        id: `user-upload-${Date.now()}`,
        title,
        description: description || "No description provided.",
        imageUrl,
        category,
        type: 'podcast', // User uploads default to podcast type
        author: 'Me (Creator)',
        isPremium,
        isUserGenerated: true,
        audioUrl,
        voice: 'Native',
        prompt: ''
      };

      onUpload(newStation);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto pt-4 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload New Content</h1>
        <p className="text-slate-500">Share your voice with the world. Monetize your content with Premium subscriptions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Upload Area */}
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${dragActive ? 'border-[#00b0f0] bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept="audio/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {file ? (
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                 <Icons.Mic size={32} />
               </div>
               <h3 className="font-bold text-slate-900 text-lg mb-1">{file.name}</h3>
               <p className="text-slate-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
               <button type="button" onClick={() => setFile(null)} className="mt-4 text-red-500 text-sm font-bold hover:underline">Remove</button>
            </div>
          ) : (
            <div className="flex flex-col items-center pointer-events-none">
               <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                 <Icons.Cloud size={32} />
               </div>
               <h3 className="font-bold text-slate-900 text-lg mb-2">Drag & drop audio file</h3>
               <p className="text-slate-500 text-sm mb-4">MP3, WAV, or AAC up to 100MB</p>
               <span className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm">Browse Files</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Cover Art */}
           <div className="md:col-span-1">
             <label className="block text-sm font-bold text-slate-700 mb-2">Cover Art</label>
             <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {imageFile ? (
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                     <Icons.ImageIcon size={32} className="mb-2" />
                     <span className="text-xs font-medium">Upload Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
             </div>
           </div>

           {/* Metadata Inputs */}
           <div className="md:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Episode Title"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00b0f0] font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your episode..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00b0f0] font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                   <select 
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                     className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00b0f0] font-medium bg-white"
                   >
                     {CATEGORIES.filter(c => c !== "All").map(c => (
                       <option key={c} value={c}>{c}</option>
                     ))}
                   </select>
                </div>
                
                <div className="flex items-end">
                   <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl w-full cursor-pointer hover:bg-slate-50 select-none">
                      <input 
                        type="checkbox" 
                        checked={isPremium}
                        onChange={(e) => setIsPremium(e.target.checked)}
                        className="w-5 h-5 text-[#00b0f0] rounded focus:ring-[#00b0f0]"
                      />
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                         <Icons.Lock size={16} className="text-yellow-500" /> Premium Only
                      </span>
                   </label>
                </div>
              </div>
           </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-200">
           <button 
             type="button" 
             onClick={onCancel}
             className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
           >
             Cancel
           </button>
           <button 
             type="submit"
             disabled={!file || !title || isSubmitting}
             className={`flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
               !file || !title || isSubmitting ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#00b0f0] hover:bg-[#0050ff] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
             }`}
           >
             {isSubmitting ? (
               <>
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                 Uploading...
               </>
             ) : (
               <>
                 <Icons.Upload size={20} /> Publish Content
               </>
             )}
           </button>
        </div>
      </form>
    </div>
  );
};

export default UploadView;
