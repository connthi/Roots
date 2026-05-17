export const metadata = {
  title: 'Roots',
  description: 'AI-powered financial literacy and future planning',
};

import './globals.css';
import Providers from './providers.js';
import Chatbot from '../components/chatbot/Chatbot.jsx';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
