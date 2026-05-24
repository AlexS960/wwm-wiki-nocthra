export default function SetupError({ message }: { message: string }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: '#0f0b07',
        color: '#d4cec3',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: 520, textAlign: 'center' }}>
        <h1 style={{ color: '#d4a528', fontSize: 22, marginBottom: 12 }}>Сайт не настроен</h1>
        <p style={{ lineHeight: 1.6, marginBottom: 16 }}>{message}</p>
        <p style={{ fontSize: 13, color: '#8c7e6a' }}>
          Для GitHub Pages: Settings → Secrets → добавьте <code>VITE_SUPABASE_URL</code> и{' '}
          <code>VITE_SUPABASE_ANON_KEY</code>, затем перезапустите деплой.
        </p>
      </div>
    </div>
  );
}
