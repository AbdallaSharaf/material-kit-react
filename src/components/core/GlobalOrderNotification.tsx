"use client";

import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { fetchOrderCount, setLastKnownCount } from '@/redux/slices/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store/store';
import { Bell, BellOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import  { useRouter } from 'next/router';

const POLL_INTERVAL = 10000; // 10 seconds
const STORAGE_KEY = 'order_notifications_enabled';

const GlobalOrderNotification: React.FC = () => {
    const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const lastKnownCount = useSelector((state: RootState) => state.orders.lastKnownCount);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    // Load from localStorage on initial mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, notificationsEnabled.toString());
  }, [notificationsEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (notificationsEnabled) {
      interval = setInterval(async () => {
        try {
          const result = await dispatch(fetchOrderCount()).unwrap();
          if (lastKnownCount !== null && result !== lastKnownCount) {
            if (audioRef.current) {
              audioRef.current.play().catch(err =>
                console.warn("Autoplay error:", err)
              );
            }
            Swal.fire('You have new orders!').then(() => {
                router.push('/dashboard/orders');
              });
          }
          dispatch(setLastKnownCount(result));
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, POLL_INTERVAL);
    }

    return () => clearInterval(interval);
  }, [dispatch, lastKnownCount, notificationsEnabled]);

  useEffect(() => {
    dispatch(fetchOrderCount());
  }, [dispatch]);

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  return (
    <>
      <div className="fixed top-2 max-md:right-[25vw] max-md:top-18 right-[50vw] z-[9999] bg-white shadow-lg rounded-xl px-4 py-3 flex items-center space-x-3 border border-gray-200">
        <button
          onClick={toggleNotifications}
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          aria-label="Toggle order notifications"
        >
          {notificationsEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
        </button>
        <label
          htmlFor="enableNotifications"
          className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          onClick={toggleNotifications}
        >
          {notificationsEnabled ? 'Notifications Enabled' : 'Enable Order Notifications'}
        </label>
      </div>
      <audio ref={audioRef} src="/sounds/ringtone.mp3" />
    </>
  );
};

export default GlobalOrderNotification;
