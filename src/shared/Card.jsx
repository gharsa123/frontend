const Card = ({
  children,
  image,
  title,
  description,
  price,
  onBuy,
  showQuantity = false,
  quantity = 1,
  onQuantityChange,
}) => {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition overflow-hidden p-4 w-full max-w-xl">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h3 className="text-gray-800 font-semibold text-base line-clamp-2">
            {title}
          </h3>
          <p className="mt-2 text-gray-600 font-bold text-sm">{price}</p>
          {description && (
            <p className="mt-2 text-xs text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
        <div className="flex-shrink-0 w-[100px] h-[100px] rounded-xl overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom: Button / Quantity */}
      <div className="mt-4 flex items-center justify-end">
        {showQuantity ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQuantityChange && onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center hover:bg-green-50 transition"
            >
              −
            </button>
            <span className="font-semibold text-gray-800 min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange && onQuantityChange(quantity + 1)}
              className="w-8 h-8 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center hover:bg-green-50 transition"
            >
              +
            </button>
          </div>
        ) : children ? (
          children
        ) : (
          <button
            onClick={onBuy}
            className="bg-white border-2 border-green-500 text-green-600 font-semibold py-2 px-6 rounded-full hover:bg-green-100 transition"
          >
            Tambah
          </button>
        )}
      </div>
    </div>
  );
};

export { Card };
