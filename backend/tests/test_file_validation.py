import io
import zipfile

import pytest

from app.services.file_validation import FileValidationError, validate_file


def make_docx() -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w") as archive:
        archive.writestr("[Content_Types].xml", "<Types />")
        archive.writestr("word/document.xml", "<document />")
    return buffer.getvalue()


def test_accepts_valid_pdf_signature():
    result = validate_file("curriculo.pdf", b"%PDF-1.4\nconteudo", 1024)
    assert result.extension == "pdf"
    assert result.mime_type == "application/pdf"
    assert len(result.sha256) == 64


def test_accepts_structurally_valid_docx():
    result = validate_file("curriculo.docx", make_docx(), 4096)
    assert result.extension == "docx"


def test_rejects_extension_signature_mismatch():
    with pytest.raises(FileValidationError) as captured:
        validate_file("curriculo.pdf", b"texto qualquer", 1024)
    assert captured.value.code == "signature_mismatch"


def test_rejects_oversized_file():
    with pytest.raises(FileValidationError) as captured:
        validate_file("curriculo.txt", b"a" * 20, 10)
    assert captured.value.code == "file_too_large"

