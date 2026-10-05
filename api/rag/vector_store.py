import os
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
index = pc.Index(os.environ["PINECONE_INDEX_NAME"])


async def store_chunks(chunks: list, embeddings: list[list[float]], namespace: str):
    """Batch upsert vectors into Pinecone."""
    vectors = []
    for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
        vectors.append({
            "id": f"{chunk['doc_id']}-{i}",
            "values": emb,
            "metadata": {
                "text": chunk["text"][:1000],  # metadata has size limits
                "page": chunk["page"],
                "section": chunk["section"],
                "doc_id": chunk["doc_id"]
            }
        })

    # Pinecone recommends batches of 100
    for i in range(0, len(vectors), 100):
        index.upsert(vectors=vectors[i:i + 100], namespace=namespace)


async def retrieve_chunks(
    query_embedding: list[float],
    top_k: int = 5,
    namespace: str = "default"
):
    """Semantic search over stored vectors."""
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        namespace=namespace
    )
    return [
        {
            "text": m.metadata["text"],
            "page": m.metadata["page"],
            "section": m.metadata["section"],
            "score": m.score
        }
        for m in results.matches
    ]