"""
Main entry point for the data processor application.
"""
import argparse
import logging
import sys
from pathlib import Path
from src.data_processor import DataProcessor
from src.database import Database

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Main function to run the data processor."""
    parser = argparse.ArgumentParser(description='Process data from various sources')
    parser.add_argument('--input', type=str, help='Input data file path')
    parser.add_argument('--output', type=str, help='Output file path')
    parser.add_argument('--format', type=str, default='csv',
                        choices=['csv', 'json'], help='Input format')

    args = parser.parse_args()

    try:
        logger.info("Starting data processor...")

        # Initialize database
        db = Database()
        db.create_tables()

        # Initialize processor
        processor = DataProcessor(db)

        if args.input:
            logger.info(f"Processing file: {args.input}")
            results = processor.process_file(args.input, args.format)
            logger.info(f"Processed {len(results)} records")

            if args.output:
                processor.save_results(results, args.output)
                logger.info(f"Results saved to {args.output}")
        else:
            logger.info("No input file specified. Running in demo mode...")
            processor.run_demo()

        logger.info("Data processor completed successfully")
        return 0

    except Exception as e:
        logger.error(f"Error running data processor: {e}", exc_info=True)
        return 1


if __name__ == "__main__":
    sys.exit(main())
