import React, { useState } from 'react';
import { ShoppingBag, Star, ShieldCheck, Sparkles, CheckCircle2, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AstroProduct {
  id: string;
  name: string;
  category: 'Gemstone' | 'Rudraksha' | 'Yantra' | 'Pooja';
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  benefit: string;
  planet: string;
  isCertified: boolean;
}

const PRODUCTS: AstroProduct[] = [
  {
    id: 'prod_1',
    name: 'Certified Natural Yellow Sapphire (পুখরাজ / Pukhraj)',
    category: 'Gemstone',
    price: 3499,
    originalPrice: 4999,
    rating: 4.9,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    benefit: 'Attracts immense wealth, higher wisdom, business growth, and marital happiness.',
    planet: 'Jupiter (বৃহস্পতি)',
    isCertified: true
  },
  {
    id: 'prod_2',
    name: 'Natural Colombian Emerald (পান্না / Panna)',
    category: 'Gemstone',
    price: 2899,
    originalPrice: 4200,
    rating: 4.8,
    reviewsCount: 980,
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=400',
    benefit: 'Enhances sharp memory, public speaking, IT prowess, and communication mastery.',
    planet: 'Mercury (বুধ)',
    isCertified: true
  },
  {
    id: 'prod_3',
    name: 'Natural Burma Ruby (চুনি / Manik)',
    category: 'Gemstone',
    price: 3999,
    originalPrice: 5500,
    rating: 4.9,
    reviewsCount: 1120,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    benefit: 'Grants leadership power, government honors, high vitality, and self-confidence.',
    planet: 'Sun (সূর্য)',
    isCertified: true
  },
  {
    id: 'prod_4',
    name: 'Original 5-Mukhi Nepali Rudraksha Mala (১০৮ দানা)',
    category: 'Rudraksha',
    price: 999,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 3400,
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=400',
    benefit: 'Brings mental peace, regulates blood pressure, and shields against negative energy.',
    planet: 'Lord Shiva Blessing',
    isCertified: true
  },
  {
    id: 'prod_5',
    name: 'Energized 24K Gold Plated Shree Yantra (শ্রী যন্ত্র)',
    category: 'Yantra',
    price: 1499,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 870,
    image: 'https://images.unsplash.com/photo-1601056641807-f4e912443653?auto=format&fit=crop&q=80&w=400',
    benefit: 'Creates positive Vastu energy in homes & offices, removing financial hurdles.',
    planet: 'Goddess Mahalakshmi',
    isCertified: true
  },
  {
    id: 'prod_6',
    name: 'Natural Red Coral (রক্ত প্রবাল / Moonga)',
    category: 'Gemstone',
    price: 2199,
    originalPrice: 3200,
    rating: 4.7,
    reviewsCount: 650,
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=400',
    benefit: 'Removes Manglik dosha ill effects, infuses physical courage and sports vigor.',
    planet: 'Mars (মঙ্গল)',
    isCertified: true
  }
];

export const AstroShopSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [purchasedProduct, setPurchasedProduct] = useState<AstroProduct | null>(null);

  const categories = ['All', 'Gemstone', 'Rudraksha', 'Yantra'];

  const filtered = PRODUCTS.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  const handleBuy = (product: AstroProduct) => {
    setPurchasedProduct(product);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Lab Certified & Vedic Energized</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Astrotalk AstroShop & Gemstones</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Authentic gemstones, energized rudraksha malas, and consecrated yantras for planetary remedies.
        </p>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {cat}s
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-5 flex flex-col justify-between group hover:border-amber-500/50 hover:shadow-2xl transition-all"
          >
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-4 bg-slate-950 aspect-video flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.isCertified && (
                  <span className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Lab Certified
                  </span>
                )}
                <span className="absolute bottom-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md">
                  {item.planet}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-amber-400 mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{item.rating}</span>
                <span className="text-slate-500">({item.reviewsCount} reviews)</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{item.name}</h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{item.benefit}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-amber-400">₹{item.price}</span>
                  <span className="text-xs text-slate-500 line-through">₹{item.originalPrice}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Free Express Delivery
                </span>
              </div>

              <button
                onClick={() => handleBuy(item)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Confirmation Modal */}
      {purchasedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white">Order Confirmed! 🎉</h3>
            <p className="text-xs text-slate-300">
              Your order for <b>{purchasedProduct.name}</b> has been placed. Our certified Vedic Acharyas will energize and dispatch it to your address.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl text-xs text-amber-400 font-mono">
              Amount Paid: ₹{purchasedProduct.price} • Cash on Delivery / UPI
            </div>

            <button
              onClick={() => setPurchasedProduct(null)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
