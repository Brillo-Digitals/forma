"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, ExternalLink, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

interface Props {
  url: string;
  onClose: () => void;
}

export default function PublishModal({ url, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-cream w-full max-w-[480px] relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone hover:text-charcoal transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-10 flex flex-col items-center gap-6">
          {/* Title */}
          <div className="text-center">
            <h2 className="font-heading font-bold text-[28px] text-charcoal mb-1">
              Page Published!
            </h2>
            <p className="text-[13px] text-stone">
              Your landing page is live. Share it with the world.
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-4 shadow-sm border border-divider">
            <QRCodeSVG
              value={url}
              size={160}
              bgColor="#FFFFFF"
              fgColor="#2A2A2A"
              level="M"
            />
          </div>

          {/* URL bar */}
          <div className="flex items-center gap-0 w-full border border-divider bg-white">
            <span className="flex-1 text-[12px] text-stone px-3 py-2.5 truncate font-mono">
              {url}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-2.5 text-charcoal hover:bg-cream transition-colors border-l border-divider shrink-0"
              title="Copy link"
            >
              {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 text-charcoal hover:bg-cream transition-colors border-l border-divider shrink-0"
              title="Open page"
            >
              <ExternalLink size={15} />
            </a>
          </div>

          <p className="text-[11px] text-stone/60 text-center">
            Demo mode: page is stored locally in your browser.
            Connect Firebase Storage to enable permanent hosting.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
