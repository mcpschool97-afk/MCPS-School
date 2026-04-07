// frontend/src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../components/Layout';
import SplashScreen from '../components/SplashScreen';
import '../styles/globals.css';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen only on first load
    const hasSeenSplash = sessionStorage.getItem('hasSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSplash', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}
