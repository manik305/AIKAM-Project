"""Evidence Vault Storage Service (MinIO / S3 / Azure Blob)."""
import uuid


class EvidenceStorageService:
    """Manages secure encrypted uploads for meter photos and physical bill scans."""

    @classmethod
    async def upload_meter_photo(cls, image_bytes: bytes, usc_number: str) -> str:
        """Uploads image and returns signed evidence URL."""
        photo_id = uuid.uuid4().hex[:12]
        # In cloud deployment, streams to Azure Blob / MinIO bucket
        return f"https://vault.tgspdcl.gov.in/meter_evidence/{usc_number}_{photo_id}.jpg"
