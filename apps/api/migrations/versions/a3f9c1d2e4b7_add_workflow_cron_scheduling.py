"""add workflow cron scheduling

Revision ID: a3f9c1d2e4b7
Revises: efd012dcfe01
Create Date: 2026-09-08 09:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3f9c1d2e4b7'
down_revision: Union[str, Sequence[str], None] = 'efd012dcfe01'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('workflow', sa.Column('cron', sa.String(), nullable=True))
    op.add_column('workflow', sa.Column('next_run_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('workflow', 'next_run_at')
    op.drop_column('workflow', 'cron')