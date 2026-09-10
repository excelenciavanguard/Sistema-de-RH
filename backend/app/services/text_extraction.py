import io

from charset_normalizer import from_bytes
from docx import Document
from pypdf import PdfReader


class TextExtractionError(ValueError):
    def __init__(self, code: str, message: str, needs_review: bool = True):
        super().__init__(message)
        self.code = code
        self.needs_review = needs_review


def extract_text(content: bytes, extension: str) -> tuple[str | None, str | None]:
    if extension == "pdf":
        try:
            reader = PdfReader(io.BytesIO(content))
            if reader.is_encrypted:
                raise TextExtractionError("password_protected", "PDF protegido por senha.")
            text = "\n\n".join((page.extract_text() or "").strip() for page in reader.pages).strip()
        except TextExtractionError:
            raise
        except Exception as exc:
            raise TextExtractionError("pdf_read_error", "Não foi possível ler o PDF com segurança.") from exc
        if not text:
            return None, "PDF sem camada de texto; encaminhar para OCR/revisão."
        return text, None

    if extension == "docx":
        try:
            document = Document(io.BytesIO(content))
            text = "\n".join(paragraph.text.strip() for paragraph in document.paragraphs if paragraph.text.strip())
        except Exception as exc:
            raise TextExtractionError("docx_read_error", "Não foi possível ler o DOCX com segurança.") from exc
        if not text:
            return None, "DOCX sem texto extraível; encaminhar para revisão."
        return text, None

    if extension == "txt":
        best = from_bytes(content).best()
        if best is None:
            raise TextExtractionError("encoding_unknown", "Não foi possível identificar a codificação do TXT.")
        text = str(best).strip()
        if not text:
            return None, "TXT sem conteúdo útil; encaminhar para revisão."
        return text, None

    if extension == "doc":
        return None, "DOC legado recebido; conversão segura ainda requer revisão."

    raise TextExtractionError("unsupported_format", "Formato sem extrator configurado.")

