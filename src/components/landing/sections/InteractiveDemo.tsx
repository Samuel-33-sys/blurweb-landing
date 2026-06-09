import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Monitor, FileText, Shield, Zap } from 'lucide-react';

const InteractiveDemo = () => {
  const [activeTab, setActiveTab] = useState<'element' | 'text' | 'area'>(() => {
    const saved = localStorage.getItem('bw_demo_persist') === 'true';
    if (saved) {
      return (localStorage.getItem('bw_demo_tab') as any) || 'element';
    }
    return 'element';
  });
  const [isPersist, setIsPersist] = useState(() => localStorage.getItem('bw_demo_persist') === 'true');
  const [blurredItems, setBlurredItems] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('bw_demo_persist') === 'true';
    if (saved) {
      const items = JSON.parse(localStorage.getItem('bw_demo_items') || '[]');
      return new Set(items);
    }
    return new Set();
  });
  const [selectionMasks, setSelectionMasks] = useState<{id: string, x: number, y: number, w: number, h: number}[]>(() => {
    const saved = localStorage.getItem('bw_demo_persist') === 'true';
    if (saved) {
      return JSON.parse(localStorage.getItem('bw_demo_selection') || '[]');
    }
    return [];
  });
  const [areaMasks, setAreaMasks] = useState<{id: string, x: number, y: number, w: number, h: number}[]>(() => {
    const saved = localStorage.getItem('bw_demo_persist') === 'true';
    if (saved) {
      return JSON.parse(localStorage.getItem('bw_demo_area') || '[]');
    }
    return [];
  });
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Save Persistence
  useEffect(() => {
    if (isPersist) {
      localStorage.setItem('bw_demo_persist', 'true');
      localStorage.setItem('bw_demo_tab', activeTab);
      localStorage.setItem('bw_demo_items', JSON.stringify(Array.from(blurredItems)));
      localStorage.setItem('bw_demo_selection', JSON.stringify(selectionMasks));
      localStorage.setItem('bw_demo_area', JSON.stringify(areaMasks));
    } else {
      localStorage.setItem('bw_demo_persist', 'false');
    }
  }, [activeTab, blurredItems, selectionMasks, areaMasks, isPersist]);

  const tabs = [
    { id: 'element', label: 'Hover & Blur', icon: <Monitor className="w-4 h-4" /> },
    { id: 'text', label: 'Text Selection', icon: <FileText className="w-4 h-4" /> },
    { id: 'area', label: 'Drag & Mask', icon: <Shield className="w-4 h-4" /> }
  ];

  const toggleBlur = (id: string) => {
    setBlurredItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearBlurs = () => {
    setBlurredItems(new Set());
    setSelectionMasks([]);
    setAreaMasks([]);
    setDragStart(null);
    setDragEnd(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTab !== 'area' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeTab !== 'area' || !dragStart || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => {
    if (activeTab === 'text') {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0 && containerRef.current) {
        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        const newMasks = Array.from(rects).map((rect, i) => ({
          id: Math.random().toString(36).substr(2, 9) + i,
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          w: rect.width,
          h: rect.height
        }));
        
        setSelectionMasks(prev => [...prev, ...newMasks]);
        selection.removeAllRanges();
      }
    }

    if (activeTab === 'area' && dragStart && dragEnd) {
      const width = Math.abs(dragEnd.x - dragStart.x);
      const height = Math.abs(dragEnd.y - dragStart.y);
      
      if (width > 5 && height > 5) {
        const newMask = {
          id: Math.random().toString(36).substr(2, 9),
          x: Math.min(dragStart.x, dragEnd.x),
          y: Math.min(dragStart.y, dragEnd.y),
          w: width,
          h: height
        };
        setAreaMasks(prev => [...prev, newMask]);
      }
      setDragStart(null);
      setDragEnd(null);
    }
  };

  return (
    <section id="demo" className="py-32 bg-black text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-white/5 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">It lives inside the page.</h2>
            
            <div className="flex gap-2 mb-12 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    // @ts-ignore
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-black' : ''}>{tab.icon}</span>
                  <span className={activeTab === tab.id ? 'text-black' : ''}>{tab.label}</span>
                </button>
              ))}
            </div>

            <p className="text-white/60 text-xl font-medium mb-12 leading-relaxed h-24">
              {activeTab === 'element' && "No clicking required. Simply glide your cursor over sensitive blocks to sanitize them. Perfect for fast-paced walkthroughs."}
              {activeTab === 'text' && "Precision control. Hover or select names to highlight them with an unreadable, professional mask instantly."}
              {activeTab === 'area' && "The ultimate fallback. Drag your cursor directly on the preview to mask any custom area, no matter the content."}
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <button 
                onClick={clearBlurs}
                className="px-8 py-4 rounded-full font-bold transition-all bg-white/10 text-white hover:bg-white/20 flex items-center gap-2 border border-white/10"
              >
                <Zap className="w-5 h-5 text-white/50" />
                <span>Reset demo</span>
              </button>
            </div>
          </div>

          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-2xl rounded-[3rem] overflow-hidden p-1 shadow-2xl border border-white/10"
          >
            <div 
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="bg-white rounded-[2.8rem] overflow-hidden text-black aspect-video p-12 relative select-none"
            >
              {activeTab === 'element' && (
                <div className="h-full">
                  <div className="h-4 w-1/4 bg-white/5 rounded mb-10" />
                  <div className="grid grid-cols-2 gap-8 mb-12">
                    {['data', 'email'].map(type => (
                      <div 
                        key={type}
                        onMouseEnter={() => !blurredItems.has(type) && toggleBlur(type)}
                        className={`p-6 rounded-3xl bg-[#F4F4F4]/50 border transition-all duration-300 group cursor-pointer overflow-hidden relative ${
                          blurredItems.has(type) ? 'border-black/50' : 'border-black/5 hover:border-black/30'
                        }`}
                      >
                        <div className="text-[10px] font-black tracking-widest text-black/20 mb-2 uppercase">{type === 'data' ? 'Sensitive Data' : 'User Email'}</div>
                        <div className={`text-xl font-bold transition-all duration-500 ${
                          blurredItems.has(type) ? 'blur-md grayscale opacity-40 scale-95 group-hover:blur-none group-hover:opacity-100 group-hover:scale-100' : ''
                        }`}>
                          {type === 'data' ? '$9,450.00' : 'john@apple.com'}
                        </div>
                        {!blurredItems.has(type) && (
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-[8px] uppercase tracking-tighter text-black">
                            Glide to blur
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 opacity-10">
                    <div className="h-2 w-full bg-black/10 rounded" />
                    <div className="h-2 w-3/4 bg-black/10 rounded" />
                  </div>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="h-full text-black relative selection:bg-black/10">
                  {selectionMasks.map(mask => (
                    <motion.div 
                      key={mask.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute bg-white/30 backdrop-blur-md border border-white/20 rounded z-50 pointer-events-none"
                      style={{
                        left: mask.x,
                        top: mask.y,
                        width: mask.w,
                        height: mask.h
                      }}
                    />
                  ))}
                  <div className="h-4 w-1/3 bg-black/5 rounded mb-12" />
                  <div className="space-y-6 text-lg font-medium leading-relaxed">
                    <p>
                      Hello, I am writing to inform you that the payment for 
                      <span 
                        onMouseEnter={() => !blurredItems.has('invoice') && toggleBlur('invoice')}
                        onClick={() => toggleBlur('invoice')}
                        className={`mx-2 px-1 rounded transition-all duration-500 cursor-pointer ${
                          blurredItems.has('invoice') 
                            ? 'blur-sm grayscale bg-black/10 hover:blur-none hover:grayscale-0 hover:bg-black/5' 
                            : 'bg-black/5'
                        }`}
                      >
                        Invoice #88492
                      </span>
                      has been received and processed.
                    </p>
                    <p>
                      The details belong to 
                      <span 
                        onMouseEnter={() => !blurredItems.has('user') && toggleBlur('user')}
                        onClick={() => toggleBlur('user')}
                        className={`mx-2 px-1 rounded transition-all duration-500 cursor-pointer ${
                          blurredItems.has('user') 
                            ? 'blur-sm grayscale bg-black/10 hover:blur-none hover:grayscale-0 hover:bg-black/5' 
                            : 'bg-black/5'
                        }`}
                      >
                        Sarah Jenkins
                      </span>, 
                      who is currently our primary contact.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'area' && (
                <div className="h-full relative overflow-hidden flex flex-col">
                  {areaMasks.map(mask => (
                    <motion.div 
                      key={mask.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute bg-black/30 backdrop-blur-xl border border-white/40 rounded-xl shadow-lg z-50 pointer-events-none flex items-center justify-center"
                      style={{
                        left: mask.x,
                        top: mask.y,
                        width: mask.w,
                        height: mask.h
                      }}
                    >
                      {mask.w > 20 && mask.h > 20 && <Shield className="w-3 h-3 text-white/30" />}
                    </motion.div>
                  ))}
                  <div className="h-6 w-1/4 bg-black/5 rounded mb-6 shrink-0" />
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    {[
                      { id: 'sec-hero', title: 'Hero Section', content: 'Main Headline & Catchy Subtext' },
                      { id: 'sec-pricing', title: 'Pricing Plan', content: '$29/year - Unlimited' },
                      { id: 'sec-team', title: 'Our Experts', content: 'Meet the engineers behind the tool' },
                      { id: 'sec-contact', title: 'Contact Us', content: '24/7 support at your service' }
                    ].map((section) => (
                      <div 
                        key={section.id}
                        className={`p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group select-none ${
                          blurredItems.has(section.id) 
                            ? 'bg-black/10 border-transparent shadow-inner' 
                            : 'bg-[#F4F4F4]/50 border-black/5 hover:border-black/30 hover:shadow-md'
                        }`}
                      >
                        <div className={`transition-all duration-700 ${
                          blurredItems.has(section.id) 
                            ? 'blur-md grayscale opacity-30 scale-95 group-hover:blur-none group-hover:opacity-100 group-hover:scale-100' 
                            : ''
                        }`}>
                          <div className="text-[8px] font-black tracking-widest text-black/30 mb-1 uppercase">{section.title}</div>
                          <div className="text-xs font-bold leading-tight line-clamp-2">{section.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {dragStart && dragEnd && (
                    <div 
                      className="absolute bg-black/20 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl flex items-center justify-center pointer-events-none"
                      style={{
                        left: Math.min(dragStart.x, dragEnd.x),
                        top: Math.min(dragStart.y, dragEnd.y),
                        width: Math.abs(dragEnd.x - dragStart.x),
                        height: Math.abs(dragEnd.y - dragStart.y)
                      }}
                    >
                      <Shield className="w-6 h-6 text-white/50" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
