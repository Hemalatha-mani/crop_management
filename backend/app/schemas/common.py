from datetime import datetime, timezone
from typing import Annotated

from pydantic import PlainSerializer


def _to_utc_iso(value: datetime) -> str:
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


# Naive datetimes coming from the DB are UTC; serialize them with an explicit Z.
UtcDatetime = Annotated[datetime, PlainSerializer(_to_utc_iso, return_type=str)]
