# Python Data Processor

A backend service for processing, analyzing, and transforming data from various sources.

## Overview

This application demonstrates a typical data processing pipeline that:
- Reads data from multiple formats (CSV, JSON)
- Validates and cleanses data
- Performs transformations and aggregations
- Stores results in a database
- Provides analytics and reporting capabilities

## Features

- **Multi-format Support**: Process CSV, JSON, and other data formats
- **Data Validation**: Comprehensive input validation and error handling
- **Transformation Pipeline**: Modular data transformation stages
- **Database Integration**: SQLite storage with SQLAlchemy ORM
- **Analytics**: Basic data analysis and aggregation functions
- **Logging**: Structured logging throughout the pipeline

## Project Structure

```
python-data-processor/
├── src/
│   ├── data_processor.py    # Core processing logic
│   ├── validators.py         # Input validation functions
│   ├── database.py           # Database operations
│   └── utils.py              # Utility functions
├── tests/
│   ├── test_data_processor.py
│   ├── test_validators.py
│   └── test_database.py
├── data/
│   └── sample_data.csv       # Sample data for testing
├── requirements.txt          # Python dependencies
├── main.py                   # Entry point
└── README.md                 # This file
```

## Setup

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

### Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Run the Application

```bash
python main.py
```

### Process Sample Data

```bash
python main.py --input data/sample_data.csv --output results.json
```

### Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_data_processor.py
```

## Development

### Code Style

This project follows:
- PEP 8 style guide
- Type hints for all functions
- Google-style docstrings
- Maximum line length: 100 characters

### Type Checking

```bash
mypy src/
```

### Formatting

```bash
black src/ tests/
```

### Linting

```bash
flake8 src/ tests/
```

## Dependencies

- **pandas**: Data manipulation and analysis
- **sqlalchemy**: Database ORM
- **pytest**: Testing framework
- **black**: Code formatter
- **mypy**: Static type checker
- **flake8**: Linting

## Common Tasks

### Add New Data Source

1. Create a reader function in `data_processor.py`
2. Add validation rules in `validators.py`
3. Write tests in `tests/test_data_processor.py`

### Add New Transformation

1. Implement transformation function in `data_processor.py`
2. Add to transformation pipeline
3. Test edge cases

### Database Schema Changes

1. Update models in `database.py`
2. Create migration script if needed
3. Update tests

## Troubleshooting

### Virtual Environment Issues

If you have trouble with the virtual environment:
```bash
deactivate
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Import Errors

Ensure you're in the project root and the virtual environment is activated.

### Database Errors

Delete the database file and restart:
```bash
rm data/analytics.db
python main.py
```

## Contributing

1. Create a feature branch
2. Make changes with tests
3. Run full test suite
4. Submit pull request

## License

MIT License - See LICENSE file for details.
