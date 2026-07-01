// ============================================================
// src/components/chat/ChatInput.tsx
// Component nhập tin nhắn nâng cao:
//   - Auto-resize textarea
//   - Enter gửi, Shift+Enter xuống dòng
//   - Upload ảnh qua nút hoặc Ctrl+V (paste)
//   - Preview ảnh trước khi gửi
// ============================================================

import React, {
  useState, useRef, useCallback, useEffect, KeyboardEvent, ClipboardEvent
} from 'react';
import { Send, ImagePlus, X, Loader2 } from 'lucide-react';
import type { ChatInputProps } from './types';

interface ImagePreview {
  file: File;
  previewUrl: string;
}

export default function ChatInput({
  onSend,
  sending = false,
  placeholder = 'Nhập tin nhắn...',
  disabled = false,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [text]);

  // Tạo preview URL từ file
  const addFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;

    const newPreviews: ImagePreview[] = await Promise.all(
      imageFiles.map(async (file) => {
        const previewUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        return { file, previewUrl };
      })
    );

    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  // Xử lý chọn file qua input
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = ''; // Reset để có thể chọn lại cùng file
    }
  }, [addFiles]);

  // Xử lý paste ảnh từ clipboard (Ctrl+V / Cmd+V)
  const handlePaste = useCallback((e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItems: File[] = [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) imageItems.push(file);
      }
    }
    if (imageItems.length > 0) {
      e.preventDefault(); // Ngăn paste text nếu là ảnh
      addFiles(imageItems);
    }
  }, [addFiles]);

  // Xóa 1 ảnh preview
  const removePreview = useCallback((index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Submit
  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if ((!trimmed && previews.length === 0) || sending || disabled) return;

    const files = previews.map(p => p.file);
    setText('');
    setPreviews([]);

    try {
      await onSend(trimmed, files);
    } catch (err) {
      console.error('[ChatInput] onSend error:', err);
    }

    // Re-focus
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [text, previews, sending, disabled, onSend]);

  // Enter gửi, Shift+Enter xuống dòng
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const canSend = (text.trim().length > 0 || previews.length > 0) && !sending && !disabled;

  return (
    <div className="border-t border-zinc-800/60 bg-[#0f0f0f] px-3 py-2">

      {/* ── Image Previews ─────────────────────────────────── */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 px-1">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative group">
              <img
                src={preview.previewUrl}
                alt="preview"
                className="w-16 h-16 object-cover rounded-xl border border-zinc-700/80 shadow"
              />
              <button
                onClick={() => removePreview(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                type="button"
                aria-label="Xóa ảnh"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Input Row ──────────────────────────────────────── */}
      <div className="flex items-end gap-2">

        {/* Upload ảnh button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-[#c29b57] transition-all disabled:opacity-40"
          aria-label="Đính kèm ảnh"
        >
          <ImagePlus className="w-4.5 h-4.5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Textarea */}
        <div className="flex-1 bg-zinc-800/60 border border-zinc-700/60 rounded-2xl px-3.5 py-2 flex items-end gap-2 focus-within:border-[#c29b57]/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-zinc-100 text-sm leading-relaxed placeholder:text-zinc-500 resize-none outline-none overflow-hidden disabled:opacity-50 min-h-[22px] max-h-40"
            style={{ scrollbarWidth: 'none' }}
          />
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSend}
          className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all shadow-sm ${
            canSend
              ? 'bg-[#c29b57] hover:bg-[#d4a843] text-black active:scale-95'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
          aria-label="Gửi tin nhắn"
        >
          {sending
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Send className="w-4 h-4 ml-0.5" />
          }
        </button>
      </div>

      {/* Hint */}
      <p className="text-[10px] text-zinc-600 mt-1 px-1 select-none">
        Enter để gửi · Shift+Enter xuống dòng · Ctrl+V để dán ảnh
      </p>
    </div>
  );
}
