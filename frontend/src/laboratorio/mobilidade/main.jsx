// Laboratório do Nathan: página própria (frontend/mobilidade.html), fora do App.jsx da equipe.
// Só reaproveita os estilos globais para ficar com a mesma cara do sistema; não altera nenhum arquivo deles.
import React from "react";
import { createRoot } from "react-dom/client";
// Estilos globais primeiro: o CSS do laboratório, importado pela tela, vem depois e prevalece.
import "../../styles.css";
import "../../typography.css";
import { MobilityTestScreen } from "./MobilityTestScreen.jsx";
import { LabHeader } from "./LabHeader.jsx";

function LabPage() {
  return (
    <>
      <LabHeader />
      <MobilityTestScreen />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LabPage />
  </React.StrictMode>,
);
