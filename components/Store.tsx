
import React from 'react';
import { products } from '../constants';

const StoreSetupGuide: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto text-center bg-brand-gray-dark p-8 rounded-xl border border-brand-border">
            <h1 className="text-3xl font-bold text-white mb-4">Set Up Your Store</h1>
            <p className="text-brand-light-gray mb-6">
                Your store is currently empty. To add your Printify products, you need to edit the `constants.ts` file in the project source code.
            </p>
            <div className="text-left bg-brand-black/50 p-6 rounded-lg border border-brand-border">
                <h3 className="font-bold text-brand-green mb-3">Follow these steps:</h3>
                <ol className="list-decimal list-inside space-y-2 text-brand-off-white">
                    <li>Open the file named `constants.ts`.</li>
                    <li>Find the `products` array.</li>
                    <li>
                        For each of your products, add a new object to the array with the following structure:
                        <pre className="bg-brand-black rounded-md p-3 mt-2 text-sm overflow-x-auto">
{`{
  id: 'unique-product-id',
  name: 'Your Product Name',
  price: '$19.99',
  description: 'A great description of your product.',
  imageUrl: 'https://link-to-your-product-image.jpg',
  printifyUrl: 'https://link-to-your-printify-store-item.com'
}`}
                        </pre>
                    </li>
                     <li>Replace the placeholder values with your actual product details.</li>
                </ol>
            </div>
        </div>
    );
};


export const Store: React.FC = () => {
  if (!products || products.length === 0) {
    return <StoreSetupGuide />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Dev Archive Store</h1>
        <p className="text-lg text-brand-light-gray max-w-2xl mx-auto">
          Show your support and grab some exclusive AI-themed merch. Perfect for developers, students, and enthusiasts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-brand-gray-dark rounded-xl border border-brand-border overflow-hidden flex flex-col group">
            <div className="aspect-square overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-brand-light-gray mb-4 flex-grow">{product.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <p className="text-2xl font-extrabold text-brand-green">{product.price}</p>
                <a
                  href={product.printifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-green text-brand-black font-bold py-2 px-4 rounded-full text-sm hover:bg-brand-green-dark transition-colors duration-300 transform group-hover:scale-105"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
