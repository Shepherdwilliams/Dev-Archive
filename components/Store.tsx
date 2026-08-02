
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../constants';
import { ShoppingBag, ExternalLink } from 'lucide-react';

export const Store: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-green/10 border border-brand-green/20 mb-6">
          <ShoppingBag className="w-8 h-8 text-brand-green" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Dev Archive <span className="text-brand-green">Store</span>
        </h1>
        <p className="text-lg md:text-xl text-brand-light-gray max-w-2xl mx-auto leading-relaxed">
          Exclusive AI-themed merchandise for developers and enthusiasts. Quality gear without the setup overhead.
        </p>
      </motion.div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="tech-card rounded-2xl overflow-hidden flex flex-col group h-full"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-green transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between mt-auto pt-4">
                  <p className="text-2xl font-black text-brand-green">{product.price}</p>
                  <motion.a
                    href={product.printifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-brand-green text-brand-black font-bold py-2.5 px-5 rounded-xl text-sm hover:shadow-[0_0_20px_rgba(138,201,38,0.3)] transition-all duration-300"
                  >
                    View Item
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      <div className="mt-20 p-8 rounded-3xl bg-brand-black/40 border border-brand-border/50 text-center max-w-2xl mx-auto">
        <h4 className="text-white font-bold mb-2">Zero Configuration Mode</h4>
        <p className="text-brand-light-gray text-sm">
          This store is running in static mode with pre-defined merchandise. No API keys or external connections are required.
        </p>
      </div>
    </div>
  );
};
