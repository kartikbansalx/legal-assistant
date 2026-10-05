import re
from typing import List, Dict, Any

def chunk_text_by_paragraphs(text: str, max_chars: int = 800) -> List[Dict[str, Any]]:
    """Split document into coherent paragraph chunks with section & page tracking."""
    paragraphs = [p.strip() for p in re.split(r'\n\s*\n', text) if p.strip()]
    chunks = []
    current_chunk = ""
    current_section = "General"
    page = 1

    for para in paragraphs:
        # Detect Section titles
        sec_match = re.search(r'(?:Section|Article|Clause|§)\s*([\d.]+[\w]*)', para, re.I)
        if sec_match:
            current_section = f"Section {sec_match.group(1)}"
        elif len(para) < 60 and para.isupper():
            current_section = para.title()

        if re.search(r'(?:Page|页)\s*\d+', para, re.I):
            page += 1

        if len(current_chunk) + len(para) > max_chars and len(current_chunk) > 200:
            chunks.append({
                "text": current_chunk.strip(),
                "section": current_section,
                "page": page
            })
            current_chunk = para
        else:
            current_chunk += ("\n\n" if current_chunk else "") + para

    if current_chunk.strip():
        chunks.append({
            "text": current_chunk.strip(),
            "section": current_section,
            "page": page
        })

    return chunks


def retrieve_relevant_chunks(text: str, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
    """
    Hybrid Retriever: Scores chunks based on keyword term overlap & phrase matching.
    Guarantees top relevant passages are fetched even without Pinecone.
    """
    chunks = chunk_text_by_paragraphs(text)
    if not chunks:
        return []

    # Clean query terms
    query_terms = [w.lower() for w in re.findall(r'\w+', query) if len(w) > 2]
    query_phrase = query.lower().strip()

    scored_chunks = []
    for chunk in chunks:
        chunk_text_lower = chunk["text"].lower()
        score = 0.0

        # Exact phrase match bonus
        if query_phrase in chunk_text_lower:
            score += 10.0

        # Term frequency overlap
        for term in query_terms:
            count = chunk_text_lower.count(term)
            if count > 0:
                score += count * 2.0

        # Section title match bonus
        if any(term in chunk["section"].lower() for term in query_terms):
            score += 3.0

        scored_chunks.append((score, chunk))

    # Sort descending by score
    scored_chunks.sort(key=lambda x: x[0], reverse=True)

    # Return top K chunks
    top_results = [item[1] for item in scored_chunks[:top_k]]
    
    # Fallback to first few chunks if no score matches
    if not top_results or scored_chunks[0][0] == 0:
        return chunks[:top_k]

    return top_results
