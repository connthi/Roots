export const metadata = {
  title: 'Roots',
  description: 'AI-powered financial literacy and future planning',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
