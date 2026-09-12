from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class WorkflowCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = None
    definition: dict = Field(default_factory=dict)
    folder: str | None = Field(default=None, max_length=80)
    tags: list[str] | None = Field(default=None, max_length=10)

    @field_validator("tags")
    @classmethod
    def _clean_tags(cls, v: list[str] | None) -> list[str] | None:
        if v is None:
            return v
        cleaned = [t.strip().lower() for t in v if t.strip()]
        return list(dict.fromkeys(cleaned))[:10]

    @field_validator("folder")
    @classmethod
    def _clean_folder(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip()
        return v or None


class AgenticCreate(BaseModel):
    objective: str = Field(min_length=10, max_length=2000)


class AgenticPlanOut(BaseModel):
    name: str
    description: str = ""
    definition: dict


class WorkflowUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = None
    definition: dict | None = None
    is_active: bool | None = None
    cron: str | None = None
    folder: str | None = Field(default=None, max_length=80)
    tags: list[str] | None = Field(default=None, max_length=10)

    @field_validator("tags")
    @classmethod
    def _clean_tags(cls, v: list[str] | None) -> list[str] | None:
        if v is None:
            return v
        cleaned = [t.strip().lower() for t in v if t.strip()]
        # Pas de tags vides et limité à 10
        return list(dict.fromkeys(cleaned))[:10]

    @field_validator("folder")
    @classmethod
    def _clean_folder(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip()
        return v or None


class WorkflowOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: str | None = None
    definition: dict
    is_active: bool
    cron: str | None = None
    next_run_at: datetime | None = None
    folder: str | None = None
    tags: list = []
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


class VersionSaveIn(BaseModel):
    label: str | None = Field(default=None, max_length=120)


class WorkflowVersionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    workflow_id: int
    label: str | None = None
    definition: dict
    created_at: datetime
