import hashlib
import io
import zipfile
from dataclasses import dataclass
from pathlib import Path


class FileValidationError(ValueError):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


@dataclass(frozen=True)
class ValidatedFile:
    extension: str
    mime_type: str
    sha256: str
    size_bytes: int


ALLOWED = {"pdf", "doc", "docx", "txt"}
OLE_SIGNATURE = bytes.fromhex("D0CF11E0A1B11AE1")


def _extension(name: str) -> str:
    return Path(name).suffix.lower().lstrip(".")


def validate_file(name: str, content: bytes, max_bytes: int) -> ValidatedFile:
    extension = _extension(name)
    if extension not in ALLOWED:
        raise FileValidationError("unsupported_format", "Formato não aceito. Envie PDF, DOC, DOCX ou TXT.")
    if not content:
        raise FileValidationError("empty_file", "O arquivo está vazio.")
    if len(content) > max_bytes:
        raise FileValidationError("file_too_large", "O arquivo ultrapassa o limite de 12 MB.")

    if extension == "pdf":
        if not content.startswith(b"%PDF-"):
            raise FileValidationError("signature_mismatch", "O conteúdo não corresponde a um PDF válido.")
        mime_type = "application/pdf"
    elif extension == "doc":
        if not content.startswith(OLE_SIGNATURE):
            raise FileValidationError("signature_mismatch", "O conteúdo não corresponde a um documento Word legado válido.")
        mime_type = "application/msword"
    elif extension == "docx":
        if not content.startswith(b"PK\x03\x04"):
            raise FileValidationError("signature_mismatch", "O conteúdo não corresponde a um DOCX válido.")
        try:
            with zipfile.ZipFile(io.BytesIO(content)) as archive:
                names = set(archive.namelist())
                if "[Content_Types].xml" not in names or "word/document.xml" not in names:
                    raise FileValidationError("signature_mismatch", "O arquivo ZIP não contém um documento Word válido.")
        except zipfile.BadZipFile as exc:
            raise FileValidationError("corrupt_file", "O DOCX está corrompido.") from exc
        mime_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:
        if b"\x00" in content[:4096]:
            raise FileValidationError("binary_text", "O TXT contém dados binários incompatíveis.")
        mime_type = "text/plain"

    return ValidatedFile(
        extension=extension,
        mime_type=mime_type,
        sha256=hashlib.sha256(content).hexdigest(),
        size_bytes=len(content),
    )

