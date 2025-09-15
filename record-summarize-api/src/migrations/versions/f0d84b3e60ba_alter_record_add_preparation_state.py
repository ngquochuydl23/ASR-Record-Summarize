"""Alter record add preparation-state

Revision ID: f0d84b3e60ba
Revises: e484a064fda5
Create Date: 2025-09-13 21:40:12.668045

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f0d84b3e60ba'
down_revision: Union[str, None] = 'e484a064fda5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

recordchatbotpreparationstate = postgresql.ENUM('PREPARING', 'DONE', 'FAILED', name='recordchatbotpreparationstate')
def upgrade() -> None:
    recordchatbotpreparationstate.create(op.get_bind(), checkfirst=True)
    op.add_column('records', sa.Column('chatbot_preparation_state', sa.Enum('PREPARING', 'DONE', 'FAILED', name='recordchatbotpreparationstate'), nullable=True))


def downgrade() -> None:
    op.drop_column('records', 'chatbot_preparation_state')
    recordchatbotpreparationstate.drop(op.get_bind(), checkfirst=True)