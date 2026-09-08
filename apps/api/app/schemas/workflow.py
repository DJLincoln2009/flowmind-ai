from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class WorkflowCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = None
    definition: dict = Field(default_factory=dict)


class WorkflowUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = None
    definition: dict | None = None
    is_active: bool | None = None
    cron: str | None = None


class WorkflowOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: str | None = None
    definition: dict
    is_active: bool
    cron: str | None = None
    next_run_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class ExecutionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    workflow_id: int
    status: str
    node_states: dict
    logs: list
    started_at: datetime | None = None
    finished_at: datetime | None = None
    created_at: datetime
