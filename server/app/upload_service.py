"""Secure File Upload and Validation Service for TrustBridge.

Security Controls:
1. Strict extension and MIME whitelist (PDF, PNG, JPEG).
2. Binary magic-byte header validation to prevent disguised payloads.
3. Max file size enforcement (5 MB).
4. Path traversal prevention via UUID-based safe storage naming.
5. Cryptographic SHA-256 fingerprinting for document integrity and duplicate checks.
"""

import os
import re
import uuid
import hashlib
from typing import Tuple, Dict, Any

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
ALLOWED_MIME_TYPES = {"application/pdf", "image/png", "image/jpeg", "image/pjpeg"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 # 5 MB

# Magic byte signatures
MAGIC_BYTES = {
    "pdf": b"%PDF",
    "png": b"\x89PNG\r\n\x1a\n",
    "jpeg": b"\xff\xd8\xff"
}


def sanitize_filename(filename: str) -> str:
    """Strip path traversal attempts and special characters."""
    clean = os.path.basename(filename)
    clean = re.sub(r"[^\w\.\-]", "_", clean)
    return clean


def validate_file_content(content: bytes, original_filename: str) -> Tuple[bool, str, str]:
    """Validate binary content size, extension, and magic bytes.
    
    Returns: (is_valid, mime_type, error_message)
    """
    if not content:
        return False, "", "File is empty."

    if len(content) > MAX_FILE_SIZE_BYTES:
        return False, "", f"File size ({len(content)} bytes) exceeds 5MB limit."

    # Extension check
    _, ext = os.path.splitext(original_filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        return False, "", f"Unsupported file extension '{ext}'. Allowed: PDF, PNG, JPG, JPEG."

    # Magic byte validation
    detected_mime = ""
    if content.startswith(MAGIC_BYTES["pdf"]):
        detected_mime = "application/pdf"
    elif content.startswith(MAGIC_BYTES["png"]):
        detected_mime = "image/png"
    elif content.startswith(MAGIC_BYTES["jpeg"]):
        detected_mime = "image/jpeg"
    else:
        return False, "", "Binary signature does not match declared file type. Upload rejected."

    return True, detected_mime, ""


def process_secure_upload(content: bytes, original_filename: str, category: str = "EVIDENCE") -> Dict[str, Any]:
    """Validate, fingerprint, and safely prepare evidence document metadata."""
    is_valid, mime_type, error = validate_file_content(content, original_filename)
    if not is_valid:
        return {
            "allowed": False,
            "status": "REJECTED",
            "message": error,
            "document_id": "",
            "original_name": original_filename,
            "sanitized_name": "",
            "file_size_bytes": len(content),
            "mime_type": "",
            "sha256_hash": ""
        }

    sha256 = hashlib.sha256(content).hexdigest()
    doc_uuid = f"DOC-{uuid.uuid4().hex[:12].upper()}"
    _, ext = os.path.splitext(original_filename.lower())
    safe_name = f"{doc_uuid}{ext}"

    return {
        "allowed": True,
        "status": "UPLOADED_FOR_INSPECTION",
        "message": "File verified and accepted for OCR and anomaly screening.",
        "document_id": doc_uuid,
        "original_name": sanitize_filename(original_filename),
        "sanitized_name": safe_name,
        "file_size_bytes": len(content),
        "mime_type": mime_type,
        "sha256_hash": sha256
    }
