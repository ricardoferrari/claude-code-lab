"""
Tests for data_processor module.
"""
import pytest
import pandas as pd
from src.data_processor import DataProcessor
from src.database import Database


@pytest.fixture
def temp_database(tmp_path):
    """Create a temporary database for testing."""
    db_path = tmp_path / "test.db"
    db = Database(str(db_path))
    db.create_tables()
    yield db
    db.close()


@pytest.fixture
def processor(temp_database):
    """Create a DataProcessor instance with test database."""
    return DataProcessor(temp_database)


def test_transform_data(processor):
    """Test data transformation logic."""
    df = pd.DataFrame({
        'id': [1, 2, 2, 3],
        'value': [100, 200, 200, None]
    })

    result = processor.transform_data(df)

    # Check duplicates removed
    assert len(result) == 3

    # Check nulls filled
    assert result['value'].isna().sum() == 0

    # Check processed_at added
    assert 'processed_at' in result.columns


def test_run_demo(processor, capsys):
    """Test demo mode runs without errors."""
    processor.run_demo()

    captured = capsys.readouterr()
    assert "Demo Results:" in captured.out
