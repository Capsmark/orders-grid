import './globals.css';

export const metadata = {
  title: 'Caps Grid Order Panel',
  description: 'The most comfortable way of placing orders.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
