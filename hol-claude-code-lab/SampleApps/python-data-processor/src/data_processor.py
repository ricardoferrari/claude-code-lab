"""
Core data processing logic.
"""
import logging
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Optional
from .validators import validate_dataframe, validate_file_path
from .database import Database

logger = logging.getLogger(__name__)


class DataProcessor:
    """
    Main class for processing data from various sources.

    This class handles reading, validating, transforming, and storing data.
    """

    def __init__(self, database: Database):
        """
        Initialize the DataProcessor.

        Args:
            database: Database instance for storing results
        """
        self.database = database
        logger.info("DataProcessor initialized")

    def process_file(self, file_path: str, format_type: str = 'csv') -> List[Dict[str, Any]]:
        """
        Process a data file and return results.

        Args:
            file_path: Path to the input file
            format_type: Format of the file ('csv' or 'json')

        Returns:
            List of processed records as dictionaries

        Raises:
            ValueError: If file path is invalid or format is unsupported
            FileNotFoundError: If file doesn't exist
        """
        validate_file_path(file_path)

        logger.info(f"Reading {format_type} file: {file_path}")

        if format_type == 'csv':
            df = pd.read_csv(file_path)
        elif format_type == 'json':
            df = pd.read_json(file_path)
        else:
            raise ValueError(f"Unsupported format: {format_type}")

        validate_dataframe(df)

        # Process the data
        processed_df = self.transform_data(df)

        # Convert to records
        results = processed_df.to_dict('records')

        # Store in database
        self.database.save_records(results)

        logger.info(f"Processed {len(results)} records")
        return results

    def transform_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Apply transformations to the dataframe.

        Args:
            df: Input dataframe

        Returns:
            Transformed dataframe
        """
        logger.debug("Applying data transformations")

        # Remove duplicates
        df = df.drop_duplicates()

        # Handle missing values
        df = df.fillna(0)

        # Add processed timestamp
        df['processed_at'] = pd.Timestamp.now()

        return df

    def save_results(self, results: List[Dict[str, Any]], output_path: str):
        """
        Save processing results to a file.

        Args:
            results: List of processed records
            output_path: Path to save the results
        """
        df = pd.DataFrame(results)

        if output_path.endswith('.csv'):
            df.to_csv(output_path, index=False)
        elif output_path.endswith('.json'):
            df.to_json(output_path, orient='records', indent=2)
        else:
            raise ValueError("Output format must be .csv or .json")

        logger.info(f"Saved {len(results)} results to {output_path}")

    def run_demo(self):
        """Run a demonstration with sample data."""
        logger.info("Running demo mode")

        # Create sample data
        data = {
            'id': [1, 2, 3, 4, 5],
            'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
            'value': [100, 200, 150, 300, 250]
        }

        df = pd.DataFrame(data)
        processed_df = self.transform_data(df)
        results = processed_df.to_dict('records')

        self.database.save_records(results)

        logger.info(f"Demo completed with {len(results)} records")
        print("\nDemo Results:")
        print(processed_df)
