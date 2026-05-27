import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './features/auth/authSlice';
import MainRoutes from './Routes/MainRoutes';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import ServiceWaker from './utils/ServiceWaker';
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      // 1. Initial Loading Toast dikhao (Ye tab tak rahega jab tak background calls poore na hon)
      const wakeUpToast = toast.loading(
        "Waking up cloud servers... Please wait 1-2 minutes for a smooth experience! 🚀",
        {
          duration: Infinity, // Jab tak hum khud band na karein, ye dikhta rahega
          style: {
            background: '#1f2937',
            color: '#fff',
            fontWeight: 'bold',
          }
        }
      );

      try {
        // Services ko jagao
        await ServiceWaker();

        // 2. Jaise hi fetch execute ho jaye, toaster ko replace karo success se
        toast.dismiss(wakeUpToast);
        toast.success("Servers connected successfully! Happy Shopping 🎉", { duration: 4000 });

        // Services jaagne ke baad user profile load karo
        dispatch(loadUser());
      } catch (error) {
        toast.dismiss(wakeUpToast);
        toast.error("Something went wrong while connecting to servers.");
        dispatch(loadUser());
      }
    };

    initializeApp();

    // 2. Har 5 minute (300,000 ms) mein dubara ping karo taaki Render unhe sone na de
    const interval = setInterval(() => {
      ServiceWaker();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [dispatch]);

  // useEffect(() => {
  //   // Page load hote hi backend se 'me' wala route hit hoga
  //   // Cookies automatically chali jayengi 'withCredentials: true' ki wajah se
  //   dispatch(loadUser());
  // }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollToTop />
      <Navbar />
      <MainRoutes />
      <Footer/>
    </div>
  );
}

export default App;