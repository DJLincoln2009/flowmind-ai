from datetime import UTC, datetime
from typing import Optional

from sqlalchemy import JSON, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.sql import func
from sqlmodel import Field, Relationship, SQLModel


def utcnow() -> datetime:
    return datetime.now(UTC)


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(sa_column=Column(String, unique=True, index=True, nullable=False))
    hashed_password: str = Field(sa_column=Column(String, nullable=False))
    name: str | None = Field(default=None, sa_column=Column(String))
    created_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True)))
    updated_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), onupdate=func.now()),
    )

    workflows: list["Workflow"] = Relationship(back_populates="owner")


class Workflow(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    owner_id: int = Field(sa_column=Column(ForeignKey("user.id", ondelete="CASCADE"), index=True, nullable=False))
    name: str = Field(sa_column=Column(String, nullable=False))
    description: str | None = Field(default=None, sa_column=Column(Text))
    # Graphe serialisé : nodes + edges (compatible @xyflow/react)
    definition: dict = Field(default_factory=dict, sa_column=Column(JSON))
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True)))
    updated_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), onupdate=func.now()),
    )

    owner: Optional["User"] = Relationship(back_populates="workflows")
    executions: list["Execution"] = Relationship(back_populates="workflow")


class Execution(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workflow_id: int = Field(sa_column=Column(ForeignKey("workflow.id", ondelete="CASCADE"), index=True, nullable=False))
    status: str = Field(default="pending", sa_column=Column(String, nullable=False))  # pending|running|success|error
    # Statut par nœud (id node -> status) et logs
    node_states: dict = Field(default_factory=dict, sa_column=Column(JSON))
    logs: list = Field(default_factory=list, sa_column=Column(JSON))
    started_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True)))
    finished_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True)))
    created_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True)))

    workflow: Optional["Workflow"] = Relationship(back_populates="executions")
