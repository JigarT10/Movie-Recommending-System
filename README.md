# Movie Recommender System

A web application that recommends movies with content-based filtering and The Movie Database (TMDb) API.

---

## Description

This application recommends six movies related to a chosen movie.
The system calculates recommendations from a cosine similarity matrix.
The system downloads movie posters from TMDb API.

---

## Features

- Search and choose from more than 4,800 movies.
- Content-based recommendation engine.
- High-resolution poster images from TMDb.
- Responsive user interface.
- Automatic fallback image when a poster is not available.

---

## System Requirements

Make sure that your computer has the software that follows:

- Python 3.10 or later
- Git
- TMDb API Key (free from [themoviedb.org](https://www.themoviedb.org/))

---

## Installation

Do the steps that follow to install the application:

1. Clone the repository:
   ```bash
   git clone https://github.com/JigarT10/Movie-Recommending-System.git
   ```

2. Go to the project directory:
   ```bash
   cd Movie-Recommending-System
   ```

3. Create a Python virtual environment:
   ```bash
   python -m venv .venv
   ```

4. Activate the virtual environment:
   - On Windows (PowerShell):
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - On Linux and macOS:
     ```bash
     source .venv/bin/activate
     ```

5. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   On Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Open the `.env` file in a text editor.

3. Add your TMDb API key:
   ```env
   TMDB_API_KEY=your_actual_tmdb_api_key_here
   ```

---

## How to Run

1. Start the Flask application:
   ```bash
   python main.py
   ```

2. Open your web browser.

3. Go to the URL that follows:
   ```
   http://127.0.0.1:5000
   ```

4. Select a movie from the list.

5. Click the recommendation button to see six related movies.

---

## Project Structure

| File or Directory | Description |
| :--- | :--- |
| `main.py` | Flask web application routes and recommendation logic |
| `movies_dict.pkl` | Dataset with movie titles, IDs, and metadata |
| `similarity_46mb.pkl` | Cosine similarity matrix in float16 format (~46 MB) |
| `requirements.txt` | Python packages required to run the project |
| `.env.example` | Template for environment variables |
| `static/` | CSS styles, JavaScript, and SVG icons |
| `templates/` | HTML templates for index and recommendation pages |

---

## Technical Notes

- The raw matrix file `similarity.pkl` is 184 MB in float64 format.
- The file `similarity_46mb.pkl` uses float16 format.
- This change reduces the file size to 46 MB.
- This file stays below the GitHub 100 MB file size limit.
- Recommendation accuracy is identical.

