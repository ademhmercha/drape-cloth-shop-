import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container with fixed aspect ratio */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              hovered ? 'scale-110' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}

        {/* Quick View overlay */}
        <div
          className={`absolute inset-0 bg-charcoal/30 flex items-end p-4 transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="w-full text-center text-cream text-xs tracking-widest uppercase font-medium bg-charcoal/80 py-2.5">
            Vue Rapide
          </span>
        </div>

        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-gold text-white text-[10px] tracking-widest uppercase px-2.5 py-1">
            Coup de cœur
          </span>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 space-y-1">
        <h3 className="font-display text-sm leading-snug group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-charcoal/50 uppercase tracking-wider">{product.brand}</p>
        <p className="font-medium text-sm">{product.price.toFixed(2)} DT</p>

        {/* Color swatches */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {product.colors.slice(0, 4).map(c => (
              <span
                key={c.hex}
                className="w-3.5 h-3.5 rounded-full border border-charcoal/20"
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-charcoal/40">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
