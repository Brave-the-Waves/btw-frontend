import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DonationProgress = () => {
  const [totalDonated, setTotalDonated] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const goal = 25000;

  useEffect(() => {
    const fetchTotalDonations = async () => {
      try {
        const baseUrl = import.meta.env.PROD 
          ? import.meta.env.VITE_BACKEND_URL 
          : import.meta.env.VITE_LOCAL_PORT;
          
        const response = await fetch(`${baseUrl}/api/donations/total`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch donation total');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setTotalDonated(data.total);
        }
      } catch (error) {
        console.error('Error fetching donation total:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalDonations();
  }, []);

  const progressPercentage = Math.min((totalDonated / goal) * 100, 100);

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 animate-pulse">
          <div className="flex justify-between items-end mb-6">
            <div className="h-6 bg-slate-200 rounded-full w-32"></div>
            <div className="h-8 bg-slate-200 rounded-full w-48"></div>
          </div>
          <div className="h-6 bg-slate-200 rounded-full w-full mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      <div className="bg-white rounded-3xl shadow-xl shadow-[#fc87a7]/10 border border-[#fc87a7]/20 p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#fc87a7]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-6 relative z-10">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h3 className="text-2xl font-bold text-slate-800">Donation Goal</h3>
            <p className="text-slate-500 text-sm mt-1">Help us reach our target for the cause!</p>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-3xl font-extrabold text-[#fc87a7]">${totalDonated.toLocaleString()}</span>
            <span className="text-slate-500 font-medium ml-1">raised of ${goal.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="relative z-10 w-full h-6 sm:h-8 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#fc87a7] to-[#e65c83] rounded-full relative"
          >
            {/* Sparkle effect on progress bar */}
            <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 blur-sm"></div>
          </motion.div>
        </div>
        
        <div className="relative z-10 flex justify-between mt-4 text-sm font-bold text-slate-400">
          <span>$0</span>
          <span>${(goal / 2).toLocaleString()}</span>
          <span className="text-[#fc87a7]/80">Goal: ${goal.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DonationProgress;
