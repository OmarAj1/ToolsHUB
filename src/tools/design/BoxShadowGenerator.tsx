import React, { useState, useEffect } from 'react';
import { Copy, Plus, Trash2, GripVertical } from 'lucide-react';
import { motion, Reorder } from 'motion/react';

interface ShadowLayer {
  id: string;
  horizontal: number;
  vertical: number;
  blur: number;
  spread: number;
  opacity: number;
  color: string;
  inset: boolean;
}

export function BoxShadowGenerator() {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    { id: '1', horizontal: 0, vertical: 10, blur: 15, spread: -3, opacity: 0.1, color: '#000000', inset: false },
    { id: '2', horizontal: 0, vertical: 4, blur: 6, spread: -2, opacity: 0.05, color: '#000000', inset: false }
  ]);
  const [activeLayer, setActiveLayer] = useState<string>(layers[0].id);
  const [boxColor, setBoxColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#f8fafc');

  const addLayer = () => {
    const newLayer: ShadowLayer = {
      id: Math.random().toString(36).substring(7),
      horizontal: 0,
      vertical: 10,
      blur: 20,
      spread: 0,
      opacity: 0.1,
      color: '#000000',
      inset: false
    };
    setLayers([newLayer, ...layers]);
    setActiveLayer(newLayer.id);
  };

  const removeLayer = (id: string) => {
    if (layers.length <= 1) return;
    const newLayers = layers.filter(l => l.id !== id);
    setLayers(newLayers);
    if (activeLayer === id) {
      setActiveLayer(newLayers[0].id);
    }
  };

  const updateLayer = (id: string, updates: Partial<ShadowLayer>) => {
    setLayers(layers.map(l => (l.id === id ? { ...l, ...updates } : l)));
  };

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const generateBoxShadow = () => {
    return layers.map(l => 
      `${l.inset ? 'inset ' : ''}${l.horizontal}px ${l.vertical}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color, l.opacity)}`
    ).join(', ');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`box-shadow: ${generateBoxShadow()};`);
  };

  const activeLayerData = layers.find(l => l.id === activeLayer);

  return (
    <div className="max-w-5xl animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">Shadow Layers</h3>
              <button 
                onClick={addLayer}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Layer
              </button>
            </div>
            
            <Reorder.Group axis="y" values={layers} onReorder={setLayers} className="space-y-2 mb-6">
              {layers.map(layer => (
                <Reorder.Item key={layer.id} value={layer} id={layer.id}>
                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      activeLayer === layer.id 
                        ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-sm' 
                        : 'bg-transparent border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <GripVertical className="w-4 h-4 text-slate-400" />
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700" style={{ backgroundColor: layer.color, opacity: layer.opacity + 0.2 }} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {layer.horizontal}px {layer.vertical}px {layer.blur}px {layer.inset ? '(Inset)' : ''}
                      </span>
                    </div>
                    {layers.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {activeLayerData && (
              <div className="space-y-5 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                      Horizontal <span>{activeLayerData.horizontal}px</span>
                    </label>
                    <input 
                      type="range" min="-50" max="50" 
                      value={activeLayerData.horizontal} 
                      onChange={e => updateLayer(activeLayerData.id, { horizontal: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                      Vertical <span>{activeLayerData.vertical}px</span>
                    </label>
                    <input 
                      type="range" min="-50" max="50" 
                      value={activeLayerData.vertical} 
                      onChange={e => updateLayer(activeLayerData.id, { vertical: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                      Blur <span>{activeLayerData.blur}px</span>
                    </label>
                    <input 
                      type="range" min="0" max="100" 
                      value={activeLayerData.blur} 
                      onChange={e => updateLayer(activeLayerData.id, { blur: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                      Spread <span>{activeLayerData.spread}px</span>
                    </label>
                    <input 
                      type="range" min="-50" max="50" 
                      value={activeLayerData.spread} 
                      onChange={e => updateLayer(activeLayerData.id, { spread: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                      Opacity <span>{Math.round(activeLayerData.opacity * 100)}%</span>
                    </label>
                    <input 
                      type="range" min="0" max="100" 
                      value={activeLayerData.opacity * 100} 
                      onChange={e => updateLayer(activeLayerData.id, { opacity: parseInt(e.target.value) / 100 })}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input 
                      type="checkbox" 
                      id={`inset-${activeLayerData.id}`}
                      checked={activeLayerData.inset}
                      onChange={e => updateLayer(activeLayerData.id, { inset: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <label htmlFor={`inset-${activeLayerData.id}`} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      Inset / Inner Shadow
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Shadow Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={activeLayerData.color} 
                      onChange={e => updateLayer(activeLayerData.id, { color: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <input 
                      type="text" 
                      value={activeLayerData.color.toUpperCase()} 
                      onChange={e => updateLayer(activeLayerData.id, { color: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview & Output */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center min-h-[350px] relative transition-colors" style={{ backgroundColor: bgColor }}>
            <div className="absolute top-4 right-4 flex gap-2">
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} title="Background Color" className="w-8 h-8 rounded cursor-pointer border-2 border-white/20 shadow-sm" />
              <input type="color" value={boxColor} onChange={e => setBoxColor(e.target.value)} title="Box Color" className="w-8 h-8 rounded cursor-pointer border-2 border-black/20 shadow-sm" />
            </div>
            
            <div 
              className="w-48 h-48 rounded-2xl transition-all duration-200 flex items-center justify-center text-slate-400 font-medium"
              style={{ backgroundColor: boxColor, boxShadow: generateBoxShadow() }}
            >
              Preview
            </div>
          </div>

          <div className="relative group">
            <pre className="w-full p-4 bg-slate-900 text-slate-50 rounded-xl text-sm overflow-x-auto font-mono custom-scrollbar">
              <code className="text-pink-400">box-shadow</code>
              <code className="text-slate-300">: </code>
              <code className="text-teal-300">{generateBoxShadow()}</code>
              <code className="text-slate-300">;</code>
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2"
              title="Copy CSS"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
