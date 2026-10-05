import re
from typing import List, Dict


def chunk_document(text: str, doc_id: str, max_chunk: int = 1500) -> List[Dict]:
    """
    Split document into chunks by paragraph, preserving page and section info.
    """
    paragraphs = re.split(r'\n\s*\n', text)
    chunks = []
    current = ""
    page = 1

    for para in paragraphs:
        # Simple page tracking: increment when "Page X" is found
        if re.search(r'(?:Page|页)\s*\d+', para, re.I):
            page += 1

        if len(current) + len(para) > max_chunk and len(current) > 300:
            chunks.append({
                "text": current.strip(),
                "page": page,
                "section": extract_section(current),
                "doc_id": doc_id
            })
            current = para
        else:
            current += ("\n\n" if current else "") + para

    if len(current) > 300:
        chunks.append({
            "text": current.strip(),
            "page": page,
            "section": extract_section(current),
            "doc_id": doc_id
        })

    return chunks


def extract_section(text: str) -> str:
    """Try to extract a section number from the text."""
    match = re.search(r'(?:Section|§|条款)\s*([\d.]+)', text, re.I)
    return f"Section {match.group(1)}" if match else "General"