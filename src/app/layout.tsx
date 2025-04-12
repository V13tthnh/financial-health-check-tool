import { FormProvider } from "../lib/context/FormContext";
import "../app/globals.css";
import { Metadata } from "next";

// Định nghĩa metadata tĩnh
export const metadata: Metadata = {
  title: 'Money With Mina',
  description: 'Khám phá cách đạt tự do tài chính với Money With Mina!',
  openGraph: {
    title: 'Tôi muốn đạt tự do tài chính!',
    description: 'Khám phá cách đạt tự do tài chính với Money With Mina!',
    images: [
      {
        url: 'https://example.com/path-to-your-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Money With Mina',
      },
    ],
    url: 'https://moneywithmina.com/',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
    <body>
      <FormProvider>
        <main>{children}</main>
      </FormProvider>
    </body>
  </html>
  );
}
