"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "919029923246"; // The PM properties number
  const message = "Hi there 👋 How can I help you?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi!%20I'm%20interested%20in%20learning%20more%20about%20your%20properties.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#075E54] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white overflow-hidden border-2 border-white/20">
                    {/* Using the provided whatsapp avatar image */}
                    <img
                      src="/images/whatsapp-avatar.jpeg"
                      alt="PM Properties"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25D366] border-2 border-[#075E54] rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg leading-tight">PM Properties</h3>
                  <p className="text-white/80 text-xs">Typically replies within a day</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="bg-[#E5DDD5] p-5 h-[160px] relative">
               {/* Minimal WA background pattern */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://w7.pngwing.com/pngs/915/70/png-transparent-whatsapp-background-pattern-illustration.png")', backgroundSize: '150px' }}></div>
               
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 }}
                 className="relative bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-sm text-slate-800 z-10"
               >
                 <div className="text-slate-400 text-xs font-semibold mb-1">PM Properties</div>
                 <p>Hi there 👋</p>
                 <p className="mt-1">How can I help you?</p>
                 <div className="text-right text-[10px] text-slate-400 mt-1">17:03</div>
                 {/* Chat bubble tail */}
                 <div className="absolute top-0 -left-2 w-2 h-3 bg-white" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
               </motion.div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white flex justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Start Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        whileHover={{ scale: 1.05, y: 0 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] flex items-center justify-center transition-colors relative"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
}
