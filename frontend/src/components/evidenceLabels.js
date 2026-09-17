const evidenceLabels = {
  Comprovado: "No currículo",
  Declarado: "Informado",
  "Informação ausente": "Pendente",
};

export function getEvidenceLabel(evidence) {
  return evidenceLabels[evidence] ?? evidence;
}
