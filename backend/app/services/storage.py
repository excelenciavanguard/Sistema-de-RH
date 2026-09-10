import os
import uuid
from pathlib import Path


class PrivateStorage:
    def __init__(self, root: Path):
        self.root = root
        self.root.mkdir(parents=True, exist_ok=True)

    def save(self, content: bytes, extension: str) -> tuple[str, Path]:
        stored_name = f"{uuid.uuid4()}.{extension}"
        destination = (self.root / stored_name).resolve()
        if self.root not in destination.parents:
            raise ValueError("Destino de armazenamento inválido.")
        flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
        descriptor = os.open(destination, flags, 0o600)
        try:
            with os.fdopen(descriptor, "wb") as handle:
                handle.write(content)
        except Exception:
            destination.unlink(missing_ok=True)
            raise
        return stored_name, destination

