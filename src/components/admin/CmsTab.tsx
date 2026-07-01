import React from 'react';
import { FileText, Image as ImageIcon, Plus, Trash2, Save, Car } from 'lucide-react';

interface CmsTabProps {
  cmsSubTab: 'news' | 'banners' | 'vinfast';
  setCmsSubTab: (val: 'news' | 'banners' | 'vinfast') => void;
  cmsNews: any[];
  updateCmsNews: (news: any[]) => void;
  cmsBanners: string[];
  updateCmsBanners: (banners: string[]) => void;
  localVinfast: any[];
  setLocalVinfast: React.Dispatch<React.SetStateAction<any[]>>;
  saveVinfastChanges: () => void;
  isAddingNews: boolean;
  setIsAddingNews: (val: boolean) => void;
  newsForm: any;
  setNewsForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function CmsTab({
  cmsSubTab,
  setCmsSubTab,
  cmsNews,
  updateCmsNews,
  cmsBanners,
  updateCmsBanners,
  localVinfast,
  setLocalVinfast,
  saveVinfastChanges,
  isAddingNews,
  setIsAddingNews,
  newsForm,
  setNewsForm,
}: CmsTabProps) {

  const handleAddNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.summary) {
      alert('Vui lòng nhập tiêu đề và tóm tắt tin tức!');
      return;
    }
    const newArticle = {
      id: 'art-' + Date.now(),
      title: newsForm.title,
      summary: newsForm.summary,
      content: newsForm.content || '',
      imageUrl: newsForm.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      date: new Date().toLocaleDateString('vi-VN'),
      category: newsForm.category || 'Vingroup'
    };
    const updated = [newArticle, ...cmsNews];
    updateCmsNews(updated);
    setIsAddingNews(false);
    setNewsForm({});
    alert('Đã thêm bài viết mới thành công!');
  };

  const handleDeleteNews = (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
    const updated = cmsNews.filter(n => n.id !== id);
    updateCmsNews(updated);
    alert('Đã xóa bài viết.');
  };

  const handleAddBanner = () => {
    const url = window.prompt('Nhập URL ảnh banner mới:');
    if (!url) return;
    const updated = [...cmsBanners, url];
    updateCmsBanners(updated);
    alert('Đã thêm ảnh banner mới.');
  };

  const handleDeleteBanner = (index: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này không?')) return;
    const updated = [...cmsBanners];
    updated.splice(index, 1);
    updateCmsBanners(updated);
    alert('Đã xóa banner.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* CMS Sub-tabs */}
      <div className="flex gap-4 border-b border-[#4f453b]/20 pb-2">
        <button 
          onClick={() => setCmsSubTab('news')}
          className={`px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-colors ${
            cmsSubTab === 'news' ? 'text-[#ecbe8e] border-b-2 border-[#ecbe8e]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          TIN TỨC VINCLUB
        </button>
        <button 
          onClick={() => setCmsSubTab('banners')}
          className={`px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-colors ${
            cmsSubTab === 'banners' ? 'text-[#ecbe8e] border-b-2 border-[#ecbe8e]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          SLIDER BANNERS
        </button>
        <button 
          onClick={() => setCmsSubTab('vinfast')}
          className={`px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-colors ${
            cmsSubTab === 'vinfast' ? 'text-[#ecbe8e] border-b-2 border-[#ecbe8e]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          THÔNG SỐ XE VINFAST
        </button>
      </div>

      {/* SUB-TAB: NEWS */}
      {cmsSubTab === 'news' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-xs font-black uppercase tracking-wider text-zinc-400">Danh sách bài viết</h3>
            <button 
              onClick={() => setIsAddingNews(!isAddingNews)}
              className="px-3 py-1.5 text-xs font-bold rounded bg-[#ecbe8e] text-[#000D1A] hover:bg-[#ecbe8e]/80 transition-colors uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Thêm Bài Viết
            </button>
          </div>

          {isAddingNews && (
            <form onSubmit={handleAddNewsSubmit} className="bg-[#1a1b21] border border-[#4f453b]/40 p-5 rounded-xl space-y-4 max-w-2xl">
              <h4 className="text-white font-heading text-xs font-bold uppercase tracking-wider border-b border-[#4f453b]/10 pb-2">Soạn thảo bài viết mới</h4>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Tiêu đề bài viết</label>
                <input 
                  type="text" 
                  value={newsForm.title || ''}
                  onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#ecbe8e] text-white"
                  placeholder="Nhập tiêu đề..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Phân mục</label>
                  <select 
                    value={newsForm.category || 'Vingroup'}
                    onChange={e => setNewsForm({...newsForm, category: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#ecbe8e] text-zinc-400"
                  >
                    <option value="Vingroup">Vingroup</option>
                    <option value="VinFast">VinFast</option>
                    <option value="Vinpearl">Vinpearl</option>
                    <option value="Vinhomes">Vinhomes</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">URL hình ảnh</label>
                  <input 
                    type="text" 
                    value={newsForm.imageUrl || ''}
                    onChange={e => setNewsForm({...newsForm, imageUrl: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#ecbe8e] text-white"
                    placeholder="URL ảnh Unsplash/Google..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Tóm tắt ngắn (Summary)</label>
                <textarea 
                  value={newsForm.summary || ''}
                  onChange={e => setNewsForm({...newsForm, summary: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#ecbe8e] text-white h-20"
                  placeholder="Nhập tóm tắt..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Nội dung chi tiết (Content)</label>
                <textarea 
                  value={newsForm.content || ''}
                  onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#ecbe8e] text-white h-32"
                  placeholder="Nhập nội dung bài viết..."
                />
              </div>

              <div className="flex gap-2 justify-end border-t border-[#4f453b]/10 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAddingNews(false)}
                  className="px-4 py-2 rounded text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-wider"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded bg-[#ecbe8e] text-[#000D1A] text-xs font-bold uppercase tracking-wider"
                >
                  Xác nhận lưu
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cmsNews.map(item => (
              <div key={item.id} className="bg-[#1a1b21] border border-[#4f453b]/30 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#ecbe8e]/20 transition-all">
                <div className="relative h-40 bg-zinc-950">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  <span className="absolute top-3 left-3 bg-[#ecbe8e]/10 border border-[#ecbe8e]/20 text-[#ecbe8e] text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                    {item.category}
                  </span>
                </div>
                
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono block">{item.date}</span>
                    <h4 className="text-white font-heading font-bold text-sm leading-snug">{item.title}</h4>
                    <p className="text-zinc-500 text-xs line-clamp-2 mt-2">{item.summary}</p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[#4f453b]/15 mt-4">
                    <button 
                      onClick={() => handleDeleteNews(item.id)}
                      className="text-red-400 hover:text-red-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: SLIDER BANNERS */}
      {cmsSubTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-xs font-black uppercase tracking-wider text-zinc-400">Danh sách ảnh Slider</h3>
            <button 
              onClick={handleAddBanner}
              className="px-3 py-1.5 text-xs font-bold rounded bg-[#ecbe8e] text-[#000D1A] hover:bg-[#ecbe8e]/80 transition-colors uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Thêm Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cmsBanners.map((banner, index) => (
              <div key={index} className="bg-[#1a1b21] border border-[#4f453b]/30 rounded-xl overflow-hidden relative group">
                <div className="h-44 bg-zinc-950">
                  <img src={banner} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDeleteBanner(index)}
                    className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-transform hover:scale-110 duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: VINFAST */}
      {cmsSubTab === 'vinfast' && (
        <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl p-6 max-w-3xl space-y-6">
          <div className="flex justify-between items-center border-b border-[#4f453b]/10 pb-4">
            <div>
              <h4 className="text-white font-heading text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Car className="w-4 h-4 text-[#ecbe8e]" /> Điều chỉnh gói VinFast</h4>
              <p className="text-[10px] text-zinc-500">Cấu hình lãi suất ngày và mức khởi điểm của các gói xe</p>
            </div>
            
            <button 
              onClick={saveVinfastChanges}
              className="px-4 py-2 text-xs font-bold rounded bg-[#ecbe8e] text-[#000D1A] hover:bg-[#ecbe8e]/80 transition-colors uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
            >
              <Save className="w-4 h-4" /> Lưu thông số
            </button>
          </div>

          <div className="space-y-4">
            {localVinfast.map((car, idx) => (
              <div key={car.title} className="bg-zinc-950 border border-zinc-900 rounded-lg p-4 grid grid-cols-4 gap-4 items-center">
                <span className="font-heading text-sm font-black text-white">{car.title}</span>
                
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Lãi ngày (%)</label>
                  <input 
                    type="text" 
                    value={car.profit}
                    onChange={e => {
                      const next = [...localVinfast];
                      next[idx].profit = e.target.value;
                      setLocalVinfast(next);
                    }}
                    className="w-full bg-[#111318] border border-zinc-800 rounded px-2.5 py-1 text-xs text-[#ecbe8e] font-mono focus:outline-none focus:border-[#ecbe8e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Công suất (KW)</label>
                  <input 
                    type="text" 
                    value={car.kw || '260'}
                    onChange={e => {
                      const next = [...localVinfast];
                      next[idx].kw = e.target.value;
                      setLocalVinfast(next);
                    }}
                    className="w-full bg-[#111318] border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-300 font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Vốn tối thiểu</label>
                  <input 
                    type="text" 
                    value={car.minCapital}
                    onChange={e => {
                      const next = [...localVinfast];
                      next[idx].minCapital = e.target.value;
                      setLocalVinfast(next);
                    }}
                    className="w-full bg-[#111318] border border-zinc-800 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none"
                  />
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
