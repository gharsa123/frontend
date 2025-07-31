const CartBar = ({ itemCount, totalPrice, onClick, restaurantName }) => {
  return (
    <div className="fixed bottom-0 z-30 w-full px-4 sm:px-6 md:px-10 lg:px-20 pb-4">
      <button
        onClick={onClick}
        className="w-full max-w-xl mx-auto flex items-center justify-between bg-[#FFD21F] hover:bg-yellow-400 active:bg-yellow-500 text-black font-medium py-3 px-5 rounded-full shadow-lg transition-all"
      >
        <div className="flex flex-col text-left">
          <span className="text-sm">{itemCount} item</span>
          <span className="text-xs text-gray-700 line-clamp-1">{restaurantName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          Rp {totalPrice.toLocaleString("id-ID")}
        </div>
      </button>
    </div>
  );
};

export default CartBar;
