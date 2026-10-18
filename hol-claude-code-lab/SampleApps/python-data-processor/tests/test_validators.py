"""
Tests for validators module.
"""
import pytest
import pandas as pd
from src.validators import validate_file_path, validate_dataframe, validate_record


def test_validate_file_path_empty():
    """Test validation rejects empty file path."""
    with pytest.raises(ValueError, match="File path cannot be empty"):
        validate_file_path("")


def test_validate_file_path_nonexistent():
    """Test validation rejects non-existent file."""
    with pytest.raises(FileNotFoundError):
        validate_file_path("nonexistent_file.csv")


def test_validate_dataframe_none():
    """Test validation rejects None dataframe."""
    with pytest.raises(ValueError, match="DataFrame cannot be None"):
        validate_dataframe(None)


def test_validate_dataframe_empty():
    """Test validation rejects empty dataframe."""
    df = pd.DataFrame()
    with pytest.raises(ValueError, match="DataFrame cannot be empty"):
        validate_dataframe(df)


def test_validate_record_valid():
    """Test validation accepts valid record."""
    record = {'id': 1, 'name': 'test'}
    assert validate_record(record) is True


def test_validate_record_invalid_type():
    """Test validation rejects non-dict record."""
    assert validate_record("not a dict") is False


def test_validate_record_empty():
    """Test validation rejects empty record."""
    assert validate_record({}) is False
