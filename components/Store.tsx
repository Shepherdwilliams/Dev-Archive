
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  images: { src: string; variant_ids: number[] }[];
  variants: { price: number; is_enabled: boolean }[];
  external: { handle: string };
}

const StoreSetupGuide: React.FC = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center tech-card p-12 rounded-2xl"
        >
            <h1 className="text-4xl font-bold text-white mb-6 tracking-tight glow-text">Connect Your Printify Store</h1>
            <p className="text-brand-light-gray text-lg mb-10 leading-relaxed">
                To display your real products here, you need to provide your Printify API credentials in the environment variables.
            </p>
            <div className="text-left bg-brand-black/40 p-8 rounded-xl border border-brand-border/50">
                <h3 className="text-xl font-bold text-brand-green mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center mr-3 text-sm">!</span>
                    Configuration Required
                </h3>
                <ol className="space-y-4 text-brand-off-white">
                    <li className="flex items-start">
                        <span className="font-mono text-brand-green mr-3 mt-1">01.</span>
                        <span>Get your <strong>API Key</strong> from Printify (Settings &gt; API).</span>
                    </li>
                    <li className="flex items-start">
                        <span className="font-mono text-brand-green mr-3 mt-1">02.</span>
                        <span>Find your <strong>Shop ID</strong> in your Printify dashboard URL.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="font-mono text-brand-green mr-3 mt-1">03.</span>
                        <span>Add <code>PRINTIFY_API_KEY</code> and <code>PRINTIFY_SHOP_ID</code> to your environment variables.</span>
                    </li>
                </ol>
            </div>
        </motion.div>
    );
};

export const Store: React.FC = () => {
  const [products, setProducts] = useState<PrintifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch products');
        }
        const data = await response.json();
        // Printify returns data.data as the array of products
        setProducts(data.data || []);
      } catch (err: any) {
        console.error('Store error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full mb-4"
        />
        <p className="text-brand-light-gray font-mono text-sm tracking-widest uppercase">Initializing Storefront...</p>
      </div>
    );
  }

  if (error || products.length === 0) {
    return <StoreSetupGuide />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight glow-text">Dev Archive Store</h1>
        <p className="text-lg md:text-xl text-brand-light-gray max-w-2xl mx-auto leading-relaxed">
          Show your support and grab some exclusive AI-themed merch. Perfect for developers, students, and enthusiasts.
        </p>
      </motion.div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => {
            const price = product.variants?.[0]?.price ? (product.variants[0].price / 100).toFixed(2) : '0.00';
            const imageUrl = product.images?.[0]?.src || 'https://picsum.photos/seed/merch/400/400';
            
            return (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="tech-card rounded-2xl overflow-hidden flex flex-col group"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm line-clamp-2 leading-relaxed">
                      {product.description.replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-green transition-colors line-clamp-1">{product.title}</h3>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <p className="text-2xl font-black text-brand-green">${price}</p>
                    <motion.a
                      href={`https://printify.com/app/store/products/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-brand-green text-brand-black font-bold py-2 px-6 rounded-xl text-sm hover:bg-brand-green-dark transition-all duration-300 shadow-lg shadow-brand-green/20"
                    >
                      View Item
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
