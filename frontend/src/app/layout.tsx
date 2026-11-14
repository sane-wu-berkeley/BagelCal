import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Regret Simulator · Drex', description: 'Explore your next decision through different philosophical lenses.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
