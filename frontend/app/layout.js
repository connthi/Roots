export const metadata = {
  title: 'Roots',
  description: 'AI-powered financial literacy and future planning',
};

import './globals.css';
import Providers from './providers.js';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
