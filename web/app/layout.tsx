import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nkoso — Grow Together',
  description: 'A social investment & collaboration platform for African startups. Volunteer, invest, or buy shares in businesses you believe in.',
  keywords: 'Ghana, startups, investment, volunteer, equity, crowdfunding, Africa',
  openGraph: {
    title: 'Nkoso — Grow Together',
    description: 'Invest in African startups. Volunteer your skills. Own a piece of the future.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
