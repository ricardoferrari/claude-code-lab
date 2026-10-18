"""
Database operations using SQLAlchemy.
"""
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

Base = declarative_base()


class ProcessedData(Base):
    """Model for storing processed data records."""

    __tablename__ = 'processed_data'

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_id = Column(Integer)
    name = Column(String)
    value = Column(Float)
    processed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> Dict[str, Any]:
        """Convert model to dictionary."""
        return {
            'id': self.id,
            'external_id': self.external_id,
            'name': self.name,
            'value': self.value,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Database:
    """Database handler for the data processor."""

    def __init__(self, db_path: str = 'data/analytics.db'):
        """
        Initialize database connection.

        Args:
            db_path: Path to SQLite database file
        """
        # Ensure data directory exists
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)

        self.engine = create_engine(f'sqlite:///{db_path}')
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

        logger.info(f"Database initialized at {db_path}")

    def create_tables(self):
        """Create database tables if they don't exist."""
        Base.metadata.create_all(self.engine)
        logger.info("Database tables created")

    def save_records(self, records: List[Dict[str, Any]]) -> int:
        """
        Save multiple records to the database.

        Args:
            records: List of record dictionaries

        Returns:
            Number of records saved
        """
        count = 0
        for record in records:
            try:
                db_record = ProcessedData(
                    external_id=record.get('id'),
                    name=record.get('name'),
                    value=record.get('value'),
                    processed_at=record.get('processed_at')
                )
                self.session.add(db_record)
                count += 1
            except Exception as e:
                logger.error(f"Error saving record: {e}")

        self.session.commit()
        logger.info(f"Saved {count} records to database")
        return count

    def get_all_records(self) -> List[Dict[str, Any]]:
        """
        Retrieve all records from the database.

        Returns:
            List of all records as dictionaries
        """
        records = self.session.query(ProcessedData).all()
        return [r.to_dict() for r in records]

    def get_recent_records(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Retrieve most recent records.

        Args:
            limit: Maximum number of records to return

        Returns:
            List of recent records
        """
        records = (self.session.query(ProcessedData)
                   .order_by(ProcessedData.created_at.desc())
                   .limit(limit)
                   .all())
        return [r.to_dict() for r in records]

    def close(self):
        """Close database connection."""
        self.session.close()
        logger.info("Database connection closed")
