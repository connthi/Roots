import Link from 'next/link';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          margin: '0 0 0.5rem',
        }}
      >
        Roots
      </p>
      <h1 style={{ fontSize: '2rem', margin: '0 0 0.75rem' }}>Financial literacy, rooted in you</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: 420, margin: '0 0 2rem' }}>
        Understand your spending personality, then see how habits shape your long-term wealth.
      </p>
      <Link
        href="/survey"
        style={{
          display: 'inline-block',
          padding: '0.85rem 1.5rem',
          background: 'var(--accent)',
          color: 'var(--bg)',
          fontWeight: 600,
          borderRadius: 10,
          textDecoration: 'none',
        }}
      >
        Take the personality quiz
      </Link>
    </main>
  );
}
