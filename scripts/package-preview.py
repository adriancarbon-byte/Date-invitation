"""Package the single-file preview for a straightforward browser download."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
source = root / 'docs' / 'preview.html'
output = root / 'docs' / 'invitation-preview.zip'
# Fixed metadata keeps the archive reproducible; no local paths or account data.
entry = ZipInfo('preview.html', date_time=(2026, 10, 25, 0, 0, 0))
entry.compress_type = ZIP_DEFLATED
entry.external_attr = 0o644 << 16
with ZipFile(output, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    archive.writestr(entry, source.read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=9)
print('Download bundle saved: docs/invitation-preview.zip (extract, then open preview.html)')
