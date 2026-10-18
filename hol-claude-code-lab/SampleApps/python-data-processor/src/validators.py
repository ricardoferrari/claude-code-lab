"""
Data validation functions.
"""
import pandas as pd
from pathlib import Path
from typing import Any


def validate_file_path(file_path: str) -> None:
    """
    Validate that a file path exists and is readable.

    Args:
        file_path: Path to validate

    Raises:
        ValueError: If path is empty or invalid
        FileNotFoundError: If file doesn't exist
    """
    if not file_path:
        raise ValueError("File path cannot be empty")

    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    if not path.is_file():
        raise ValueError(f"Path is not a file: {file_path}")


def validate_dataframe(df: pd.DataFrame) -> None:
    """
    Validate that a dataframe meets minimum requirements.

    Args:
        df: DataFrame to validate

    Raises:
        ValueError: If dataframe is invalid
    """
    if df is None:
        raise ValueError("DataFrame cannot be None")

    if df.empty:
        raise ValueError("DataFrame cannot be empty")

    if len(df.columns) == 0:
        raise ValueError("DataFrame must have at least one column")


def validate_record(record: dict) -> bool:
    """
    Validate a single data record.

    Args:
        record: Dictionary representing a data record

    Returns:
        True if valid, False otherwise
    """
    if not isinstance(record, dict):
        return False

    if not record:
        return False

    return True
