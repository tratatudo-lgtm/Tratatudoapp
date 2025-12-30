
import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Check, X } from 'lucide-react';

interface SignaturePadProps {
  onConfirm: (signatureData: string) => void;
  onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onConfirm, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar resolução para retina
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#002B5B';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setIsEmpty(false);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
    }
  };

  const handleConfirm = () => {
    if (isEmpty) return;
    const canvas = canvasRef.current;
    if (canvas) {
      onConfirm(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-800">Assinatura Digital</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Desenha no espaço abaixo</p>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 relative border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50 overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Assina Aqui</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={clear}
          className="py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
        >
          <Trash2 size={16} /> Limpar
        </button>
        <button
          onClick={handleConfirm}
          disabled={isEmpty}
          className="py-4 bg-[#002B5B] text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-30 transition-all"
        >
          <Check size={16} /> Confirmar
        </button>
      </div>
    </div>
  );
};
