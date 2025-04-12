import Head from 'next/head';
import { useEffect, useState } from 'react';

interface DynamicHeadProps {
  shareText: string;
  shareUrl: string;
  imageUrl?: string;
}

export default function DynamicHead({ 
  shareText, 
  shareUrl, 
  imageUrl = "https://moneywithmina.com/og-image.jpg" // Thay bằng URL thực tế của hình ảnh
}: DynamicHeadProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Chỉ render ở phía client
  if (!mounted) return null;
  
  return (
    <Head>
      <title>Money With Mina - Kết quả tự do tài chính</title>
      <meta property="og:title" content="Tôi muốn đạt tự do tài chính!" />
      <meta property="og:description" content={shareText} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={shareUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Money With Mina - Tự do tài chính" />
      <meta name="twitter:description" content={shareText} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
}