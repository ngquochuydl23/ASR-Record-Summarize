"""Add title to conversation

Revision ID: af5d2a0f1a0b
Revises: bcbe3ab7d37a
Create Date: 2025-09-21 09:17:42.304416

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'af5d2a0f1a0b'
down_revision: Union[str, None] = 'bcbe3ab7d37a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass