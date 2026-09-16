export function LabHeader() {
  const localPortal = new URL("/enviar-curriculo", window.location.origin);
  localPortal.port = "5190";
  const candidateUrl = import.meta.env.VITE_CANDIDATO_URL || localPortal.href;
  return (
    <header className="lab-bar">
      <strong>Alpha RH</strong>
      <span>Laboratório · testes com dados reais</span>
      <nav className="lab-bar-links" aria-label="Acessos rápidos do laboratório">
        <a href={candidateUrl}>Abrir tela do candidato</a>
        <a href="/">Abrir o sistema</a>
      </nav>
    </header>
  );
}
