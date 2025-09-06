"""Add HNSW index

Revision ID: a8bfe0ec5834
Revises: a9e865df9205
Create Date: 2025-09-06 09:51:07.166080

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a8bfe0ec5834'
down_revision: Union[str, None] = 'a9e865df9205'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_rag_chunks_embedding_hnsw
        ON rag_chunks
        USING hnsw (embedding vector_l2_ops);
    """)

def downgrade():
    op.execute("DROP INDEX IF EXISTS idx_rag_chunks_embedding_hnsw")