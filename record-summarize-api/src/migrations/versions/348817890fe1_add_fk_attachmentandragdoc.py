"""Add FK AttachmentAndRAGDoc

Revision ID: 348817890fe1
Revises: a7d4305be369
Create Date: 2025-09-05 19:22:42.493069
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '348817890fe1'
down_revision: Union[str, None] = 'a7d4305be369'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Tạo type enum trong Postgres
    rag_source_type_enum = postgresql.ENUM(
        'ATTACHMENT', 'TRANSCRIPT',
        name='ragsourcetypeenum'
    )
    rag_source_type_enum.create(op.get_bind(), checkfirst=True)

    # Add cột
    op.add_column('rag_documents',
        sa.Column('source_type', rag_source_type_enum, nullable=True)
    )
    op.add_column('rag_documents',
        sa.Column('attachment_id', sa.UUID(), nullable=False)
    )
    op.add_column('rag_documents',
        sa.Column('record_id', sa.UUID(), nullable=False)
    )

    # Thêm foreign key
    op.create_foreign_key(
        'fk_ragdoc_attachment',
        'rag_documents', 'attachments',
        ['attachment_id'], ['id'],
        ondelete='CASCADE'
    )
    op.create_foreign_key(
        'fk_ragdoc_record',
        'rag_documents', 'records',
        ['record_id'], ['id'],
        ondelete='RESTRICT'
    )

    # Xoá cột cũ
    op.drop_column('rag_documents', 'description')
    op.drop_column('rag_documents', 'name')


def downgrade() -> None:
    # Add lại cột cũ
    op.add_column('rag_documents',
        sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False)
    )
    op.add_column('rag_documents',
        sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=True)
    )

    # Drop FK
    op.drop_constraint('fk_ragdoc_record', 'rag_documents', type_='foreignkey')
    op.drop_constraint('fk_ragdoc_attachment', 'rag_documents', type_='foreignkey')

    # Drop cột mới
    op.drop_column('rag_documents', 'record_id')
    op.drop_column('rag_documents', 'attachment_id')
    op.drop_column('rag_documents', 'source_type')

    # Drop enum type
    op.execute('DROP TYPE IF EXISTS ragsourcetypeenum')
