"""premium workspace: folder+tags, workflow_version, template

Revision ID: b7c4a3e2f1d8
Revises: a3f9c1d2e4b7
Create Date: 2026-09-12
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "b7c4a3e2f1d8"
down_revision: str | None = "a3f9c1d2e4b7"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("workflow", sa.Column("folder", sa.String(), nullable=True))
    op.add_column("workflow", sa.Column("tags", sa.JSON(), nullable=False, server_default="[]"))

    op.create_table(
        "workflowversion",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("workflow_id", sa.Integer(), sa.ForeignKey("workflow.id", ondelete="CASCADE"), nullable=False),
        sa.Column("label", sa.String(), nullable=True),
        sa.Column("definition", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_workflowversion_workflow_id", "workflowversion", ["workflow_id"])

    op.create_table(
        "template",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("user.id", ondelete="CASCADE"), nullable=True),
        sa.Column("template_key", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("icon", sa.String(), nullable=False),
        sa.Column("definition", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_template_owner_id", "template", ["owner_id"])


def downgrade() -> None:
    op.drop_index("ix_template_owner_id", table_name="template")
    op.drop_table("template")
    op.drop_index("ix_workflowversion_workflow_id", table_name="workflowversion")
    op.drop_table("workflowversion")
    op.drop_column("workflow", "tags")
    op.drop_column("workflow", "folder")