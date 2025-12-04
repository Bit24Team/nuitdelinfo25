# Laser Game Leaderboard Project

This project implements a laser game with a leaderboard system. The application is structured into three main components: the backend, the frontend, and the infrastructure setup for deployment.

## Project Structure

- **backend/**: Contains the server-side application built with Python and Flask.
  - **src/**: Source code for the backend application.
    - **main.py**: Entry point of the backend application.
    - **api/**: Contains API endpoints for managing the leaderboard.
      - **leaderboard.py**: API functions to get and post scores.
    - **db/**: Database models and initialization.
      - **models.py**: Defines the structure for storing leaderboard entries.
    - **config/**: Configuration settings for the application.
      - **settings.py**: Database connection details and other settings.
  - **requirements.txt**: Lists the Python dependencies required for the backend.
  - **README.md**: Documentation for backend setup and usage.

- **infra/**: Contains infrastructure setup files for deployment.
  - **azure/**: Azure-specific setup files.
    - **vm-setup.sh**: Script to automate the setup of the Azure virtual machine.
    - **nginx.conf**: Configuration for Nginx to serve the frontend and reverse proxy requests to the backend.
    - **systemd/**: Contains service definitions for managing the backend application.
      - **lasergame-backend.service**: Systemd service file for the backend.
  - **README.md**: Documentation for infrastructure setup.

- **frontend/**: Contains the client-side application built with HTML, CSS, and JavaScript.
  - **pages/**: Main pages of the application.
    - **lasergame/**: Contains files specific to the laser game.
      - **index.html**: Main HTML file for the laser game interface.
      - **styles/**: CSS styles for the game.
        - **game.css**: Styles defining the visual appearance of game elements.
      - **assets/**: Contains scripts for game logic and API interactions.
        - **scripts/**: JavaScript files.
          - **game.js**: Game logic and user interactions.
          - **api.js**: Functions for making API calls to the backend.
  - **README.md**: Documentation for frontend setup and usage.

## Setup Instructions

### Backend Setup

1. Navigate to the `backend/` directory.
2. Install the required Python packages using:
   ```
   pip install -r requirements.txt
   ```
3. Configure the database connection in `src/config/settings.py`.
4. Run the backend application:
   ```
   python src/main.py
   ```

### Frontend Setup

1. Navigate to the `frontend/pages/lasergame/` directory.
2. Open `index.html` in a web browser to play the game.

### Infrastructure Setup

1. Navigate to the `infra/azure/` directory.
2. Run the setup script to configure the Azure virtual machine:
   ```
   bash vm-setup.sh
   ```

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.