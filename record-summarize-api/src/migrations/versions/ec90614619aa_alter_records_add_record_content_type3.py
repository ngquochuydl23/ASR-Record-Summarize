"""Alter Records add record_content_type3

Revision ID: ec90614619aa
Revises: 864d9108ae8f
Create Date: 2025-09-03 14:13:35.837866

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ec90614619aa'
down_revision: Union[str, None] = '864d9108ae8f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Tạo enum type trong Postgres
    record_content_type_enum = sa.Enum(
        'MEETING',
        'LECTURE_CLASS',
        'TUTORIAL_TRAINING',
        'INTERVIEW',
        'TALKSHOW',
        'NEWS',
        'DOCUMENTARY',
        'ENTERTAINMENT',
        name='recordcontenttype'
    )
    record_content_type_enum.create(op.get_bind())  # 👈 create enum type

    # Thêm cột mới sử dụng enum type đó
    op.add_column(
        'records',
        sa.Column('record_content_type', record_content_type_enum, nullable=True)
    )


def downgrade() -> None:
    op.drop_column('records', 'record_content_type')
    sa.Enum(name='record_content_type_enum').drop(op.get_bind())  # 👈 drop enum type
