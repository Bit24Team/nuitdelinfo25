# Laser Game Leaderboard Project - Backend

This document provides an overview of the backend setup and usage for the Laser Game Leaderboard project.

## Overview

The backend is built using Python and Flask, providing an API for managing the leaderboard of the laser game. It connects to a database to store and retrieve player scores.

## Project Structure

```
backend/
├── src/
│   ├── main.py                # Entry point of the application
│   ├── api/                   # API module
│   │   ├── __init__.py        # Initializes the API module
│   │   └── leaderboard.py      # API endpoints for leaderboard management
│   ├── db/                    # Database module
│   │   ├── __init__.py        # Initializes the database module
│   │   └── models.py          # Database models for leaderboard entries
│   └── config/                # Configuration settings
│       └── settings.py        # Application configuration
├── requirements.txt           # Python dependencies
└── README.md                  # Documentation for backend setup and usage
```

## Setup Instructions

1. **Clone the Repository**: 
   Clone the project repository to your local machine.

   ```
   git clone <repository-url>
   ```

2. **Navigate to the Backend Directory**:
   Change to the backend directory.

   ```
   cd lasergame-leaderboard-project/backend
   ```

3. **Install Dependencies**:
   Use pip to install the required Python packages.

   ```
   pip install -r requirements.txt
   ```

4. **Configure the Database**:
   Update the `settings.py` file with your database connection details.

5. **Run the Application**:
   Start the Flask application.

   ```
   python src/main.py
   ```

6. **Access the API**:
   The API will be available at `http://localhost:5000/api/leaderboard`.

## API Endpoints

- **GET /api/leaderboard**: Retrieve the current leaderboard scores.
- **POST /api/leaderboard**: Submit a new score to the leaderboard.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.