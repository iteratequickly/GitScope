"""
GitHub Profile Viewer
Python backend + Eel GUI

Install:
    python -m pip install -r requirements.txt

Run:
    python main.py
"""

import base64
import io
from pathlib import Path

import eel
import requests

from github import Auth, Github
from github.GithubException import (
    BadCredentialsException,
    GithubException,
    RateLimitExceededException,
    UnknownObjectException,
)

from PIL import Image, ImageDraw


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------

APP_DIR = Path(__file__).resolve().parent
WEB_DIR = APP_DIR / "web"


# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

def display(value, default="-"):
    """Return a display-friendly string."""
    if value is None or str(value).strip() == "":
        return default

    return str(value)


def circular_avatar_data_uri(raw: bytes, size=160):
    """
    Convert avatar bytes into a circular PNG data URI.

    The returned string can be assigned directly to an
    HTML image element's src attribute.
    """
    image = Image.open(io.BytesIO(raw)).convert("RGBA")

    image = image.resize(
        (size, size),
        Image.Resampling.LANCZOS,
    )

    mask = Image.new(
        "L",
        (size * 4, size * 4),
        0,
    )

    ImageDraw.Draw(mask).ellipse(
        (0, 0, size * 4, size * 4),
        fill=255,
    )

    mask = mask.resize(
        (size, size),
        Image.Resampling.LANCZOS,
    )

    image.putalpha(mask)

    output = io.BytesIO()

    image.save(output, format="PNG")

    encoded = base64.b64encode(
        output.getvalue()
    ).decode("ascii")

    return f"data:image/png;base64,{encoded}"


# ---------------------------------------------------------
# GitHub API
# ---------------------------------------------------------

@eel.expose
def get_profile(username, token=""):
    """
    Fetch a GitHub user's profile and recent repositories.

    Returns a dictionary that JavaScript can consume.
    """

    username = (username or "").strip()
    token = (token or "").strip()

    if not username:
        return {
            "ok": False,
            "error": "Please enter a username.",
        }

    try:
        # Authenticate only if a token was provided.
        if token:
            gh = Github(auth=Auth.Token(token))
        else:
            gh = Github()

        user = gh.get_user(username)

        # Profile information.
        data = {
            "ok": True,
            "name": display(user.name, user.login),
            "login": user.login,
            "bio": display(
                user.bio,
                "No bio provided.",
            ),
            "company": display(user.company),
            "location": display(user.location),
            "blog": display(user.blog),
            "email": display(user.email),
            "joined": user.created_at.strftime(
                "%B %d, %Y"
            ).replace(" 0", " "),
            "repos": user.public_repos,
            "gists": user.public_gists,
            "followers": user.followers,
            "following": user.following,
            "html_url": user.html_url,
            "avatar": None,
            "repo_list": [],
        }

        # Avatar is optional. Profile loading should not
        # fail if the image cannot be downloaded.
        try:
            response = requests.get(
                user.avatar_url,
                params={"s": 320},
                timeout=10,
            )

            response.raise_for_status()

            data["avatar"] = circular_avatar_data_uri(
                response.content
            )

        except Exception:
            pass

        # Fetch up to eight recently updated repositories.
        # Repository errors should not discard profile data.
        try:
            for repo in user.get_repos(
                sort="updated"
            )[:8]:

                updated = (
                    repo.updated_at.strftime("%Y-%m-%d")
                    if repo.updated_at
                    else "-"
                )

                data["repo_list"].append({
                    "name": repo.name,
                    "description": display(
                        repo.description,
                        "No description",
                    ),
                    "language": display(
                        repo.language,
                        "Other",
                    ),
                    "stars": repo.stargazers_count,
                    "forks": repo.forks_count,
                    "updated": updated,
                    "url": repo.html_url,
                })

        except Exception:
            pass

        return data

    except UnknownObjectException:
        return {
            "ok": False,
            "error": (
                f"User '{username}' was not found."
            ),
        }

    except BadCredentialsException:
        return {
            "ok": False,
            "error": (
                "The token was rejected. "
                "Check it or clear the field."
            ),
        }

    except RateLimitExceededException:
        return {
            "ok": False,
            "error": (
                "Rate limit exceeded. "
                "Wait a while or add a token."
            ),
        }

    except GithubException as exc:
        if exc.status == 403:
            message = (
                "Access denied or rate limited. "
                "Wait or add a token."
            )
        else:
            message = (
                f"GitHub request failed: "
                f"{exc.data or exc}"
            )

        return {
            "ok": False,
            "error": message,
        }

    except Exception as exc:
        return {
            "ok": False,
            "error": f"Request failed: {exc}",
        }


# ---------------------------------------------------------
# Application entry point
# ---------------------------------------------------------

if __name__ == "__main__":
    eel.init(str(WEB_DIR))

    eel.start(
        "index.html",
        size=(1040, 850),
        port=0,
    )