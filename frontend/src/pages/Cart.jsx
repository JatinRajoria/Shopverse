import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchCart, updateCartQtyAsync } from '../features/cart/cartSlice'; 
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQtyChange = async (pId, currentQty, delta) => {
    // Agar pId undefined hai toh yahi rok do
    if (!pId) {
        toast.error("Product ID missing!");
        return;
    }
    const newQty = currentQty + delta;
    if (newQty > 0) {
      try {
        await dispatch(updateCartQtyAsync({ productId: pId, qty: newQty })).unwrap();
      } catch (err) {
        toast.error(err || "Update failed");
      }
    }
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.productId?.price?.amount || 0;
    return acc + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Loading your bag...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-gray-100 p-8 rounded-full mb-6">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-sm">Looks like you haven't added anything yet. Start exploring our latest collection!</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all active:scale-95">
          Start Shopping
        </Link>
      </div>
    );
  }
  console.log("Cart Items at cart page ",items);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 min-h-screen bg-gray-50/30">
      <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Shopping Bag</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* LEFT: ITEM LIST */}
        <div className="flex-[1.5] space-y-6">
          {items.map((item) => {
            // BACKUP IDs: Agar productId object hai toh ._id lo, warna khud string hai
            const pId = item.productId?._id || item.productId;
            
            return (
              <div 
                key={item._id || pId} // Unique Key Fix
                className="bg-white p-5 sm:p-7 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center transition-all hover:shadow-md"
              >
                {/* Product Image */}
                <div className="w-32 h-32 bg-gray-50 rounded-[1.5rem] overflow-hidden flex-shrink-0 border border-gray-50">
                  <img 
                    src={item.productId?.images?.[0]?.url } 
                    alt="product" 
                    className="w-full h-full object-contain p-3 hover:scale-110 transition-transform duration-500" 
                  />
                </div>

                {/* Details */}
                <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 text-xl leading-tight">{item.productId?.title || "Product"}</h3>
                    <p className="text-blue-600 font-black text-2xl">₹{item.productId?.price?.amount?.toLocaleString()}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center sm:justify-end gap-6">
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1.5 shadow-inner">
                      <button 
                        onClick={() => handleQtyChange(pId, item.quantity, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-900 hover:text-white transition-all active:scale-90"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-black text-lg">{item.quantity}</span>
                      <button 
                        onClick={() => handleQtyChange(pId, item.quantity, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-900 hover:text-white transition-all active:scale-90"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="flex-1">
          <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-gray-100 sticky top-10">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Order Summary</h2>
            
            <div className="space-y-5 border-b border-gray-50 pb-8 text-gray-500 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-500 font-bold" : "text-gray-900 font-bold"}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-8">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl font-black text-blue-600 tracking-tight">₹{total.toLocaleString()}</span>
            </div>

            <button className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-100 transition-all active:scale-95 group">
              Checkout <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="h-4 w-4 text-green-500" /> Secure Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;