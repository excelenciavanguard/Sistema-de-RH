// Laboratório do Nathan: página própria (frontend/mobilidade.html), fora do App.jsx da equipe.
// Só reaproveita os estilos globais para ficar com a mesma cara do sistema; não altera nenhum arquivo deles.
import React from "react";
import { createRoot } from "react-dom/client";
// Estilos globais primeiro: o CSS do laboratório, importado pela tela, vem depois e prevalece.
import "../../styles.css";
import "../../typography.css";
import { MobilityTestScreen } from "./MobilityTestScreen.jsx";

function LabPage() {
  return (
    <>
      <header className="lab-bar">
        <strong>Alpha RH</strong>
        <span>Laboratório · testes com dados reais</span>
        <a href="/">Abrir o sistema</a>
      </header>
      <MobilityTestScreen />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LabPage />
  </React.StrictMode>,
);
