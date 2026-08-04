from typing import Literal

from pydantic import BaseModel


class RootResponse(BaseModel):
    name: str
    status: Literal["running"]
    docs: str


class HealthResponse(BaseModel):
    status: Literal["healthy"]
    service: str
    environment: str


class DatabaseHealthResponse(BaseModel):
    status: Literal["healthy"]
    database: Literal["connected"]
