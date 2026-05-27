type Props = {
  title?: string;
  message: string;
  hint?: string;
};

export default function SetupError({ title = 'Сайт не настроен', message, hint }: Props) {
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
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        <h1 style={{ color: '#d4a528', fontSize: 22, marginBottom: 12 }}>{title}</h1>
        <p style={{ lineHeight: 1.65, marginBottom: 16 }}>{message}</p>
        {hint && (
          <p style={{ fontSize: 13, color: '#8c7e6a', lineHeight: 1.6, textAlign: 'left', whiteSpace: 'pre-wrap' }}>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
