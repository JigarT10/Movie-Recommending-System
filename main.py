import os
from dotenv import load_dotenv
from flask import Flask, render_template, request
import pandas as pd
import pickle
import requests

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static"),
)
tmdb_api_key = os.environ.get("TMDB_API_KEY")


with open(os.path.join(BASE_DIR, "movies_dict.pkl"), "rb") as f:
    movies_dict = pickle.load(f)
movies = pd.DataFrame(movies_dict)

similarity_file = (
    os.path.join(BASE_DIR, "similarity_46mb.pkl")
    if os.path.exists(os.path.join(BASE_DIR, "similarity_46mb.pkl"))
    else os.path.join(BASE_DIR, "similarity.pkl")
)
with open(similarity_file, "rb") as f:
    similarity = pickle.load(f)


def fetch_poster(movie_id):
    try:
        response = requests.get(
            f"https://api.themoviedb.org/3/movie/{movie_id}",
            params={"api_key": tmdb_api_key, "language": "en-US"},
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        poster_path = data.get("poster_path")
        if poster_path:
            return f"https://image.tmdb.org/t/p/w500{poster_path}"
    except Exception:
        pass
    return "https://placehold.co/500x750?text=No+Poster"


def recommend(movie):
    movie_index = movies[movies["title"] == movie].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[
        1:7
    ]
    recommended_movies = []
    recommended_movies_posters = []
    for i in movies_list:
        movie_id = movies.iloc[i[0]].movie_id
        recommended_movies.append(movies.iloc[i[0]].title)
        recommended_movies_posters.append(fetch_poster(movie_id))
    return recommended_movies, recommended_movies_posters


@app.route("/")
def home():
    return render_template("index.html", movies=movies, movie_titles=sorted(movies["title"].unique()))


@app.route("/recommend", methods=["POST"])
def recommend_page():
    selected_movie_name = (request.form.get("movie") or "").strip()
    if not selected_movie_name or not movies["title"].eq(selected_movie_name).any():
        return render_template(
            "index.html",
            movies=movies,
            movie_titles=sorted(movies["title"].unique()),
            selected_movie=selected_movie_name,
            error="Choose a title from the collection to continue.",
        ), 400
    if not tmdb_api_key:
        return render_template(
            "recommend.html",
            movie=selected_movie_name,
            error="Recommendations are unavailable because the TMDB API key is not configured. Please add TMDB_API_KEY in your .env file.",
        ), 503
    names, posters = recommend(selected_movie_name)
    return render_template(
        "recommend.html", names=names, posters=posters, movie=selected_movie_name
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
