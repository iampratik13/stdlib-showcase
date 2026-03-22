import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'stdlib Scientific Computing Showcase',
  description: 'Interactive demonstrations of stdlib\'s powerful scientific computing libraries — statistical distributions, matrix operations, special functions, signal processing, and more.',
  keywords: ['stdlib', 'scientific computing', 'JavaScript', 'numerical analysis', 'GSoC', 'LAPACK', 'BLAS'],
  openGraph: {
    title: 'stdlib Scientific Computing Showcase',
    description: 'Explore the power of stdlib\'s numerical computing libraries through interactive visualizations.',
    type: 'website',
  },
};

import InteractiveBackground from '@/components/InteractiveBackground';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <InteractiveBackground />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
