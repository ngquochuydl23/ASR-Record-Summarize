"""Alter record-table add source-type

Revision ID: e1c82d5a7cdd
Revises: e12631937d08
Create Date: 2025-09-13 11:20:02.839037

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'e1c82d5a7cdd'
down_revision: Union[str, None] = 'e12631937d08'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

recordlang = postgresql.ENUM('LOCAL', 'YOUTUBE', name='recordsourcetype')
def upgrade() -> None:
    recordlang.create(op.get_bind(), checkfirst=True)
    op.add_column('records', sa.Column('source_type', sa.Enum('LOCAL', 'YOUTUBE', name='recordsourcetype'), nullable=True))


def downgrade() -> None:
    op.drop_column('records', 'source_type')
    recordlang.drop(op.get_bind(), checkfirst=True)