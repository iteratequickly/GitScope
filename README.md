# 🔍 GitScope

<p align="center">
  <strong>A sleek desktop GitHub Profile Viewer built with Python, Eel, and PyGithub.</strong>
</p>

<p align="center">
  Explore GitHub profiles, view public repositories, and discover developer stats through a clean, modern interface.
</p>

---

## 📌 Overview

**GitScope** is a desktop application that lets you explore GitHub user profiles without manually navigating through multiple GitHub pages.

Enter a GitHub username to view profile information, account statistics, and public repositories in one place.

The app combines a Python backend with a web-based interface, powered by Eel and PyGithub.

## ✨ Features

* 🔎 **Profile Search:** Look up GitHub users by username.
* 👤 **Profile Details:** View names, bios, locations, companies, and other available public information.
* 📊 **Developer Statistics:** See follower counts, following counts, public repositories, and public gists.
* 📦 **Repository Explorer:** Browse public repositories, descriptions, programming languages, stars, forks, and last update dates.
* 🖼️ **Profile Avatar:** Display the user's GitHub profile image when available.
* 🔗 **Direct Links:** Open GitHub profiles and repositories.
* 🏠 **Quick Reset:** Click the GitScope logo to clear the current search and return to the home screen.
* 🎨 **Modern Interface:** Use a dark-themed interface with responsive layouts.
* ⚡ **Python Backend:** Retrieve GitHub information using PyGithub.

## 🛠️ Built With

| Technology                                       | Purpose                                                    |
| ------------------------------------------------ | ---------------------------------------------------------- |
| Python                                           | Backend logic and GitHub data retrieval                    |
| [Eel](https://github.com/python-eel/Eel)         | Connects Python to the HTML, CSS, and JavaScript interface |
| [PyGithub](https://github.com/PyGithub/PyGithub) | Interacts with the GitHub API                              |
| HTML                                             | Application structure                                      |
| CSS                                              | Styling and responsive layout                              |
| JavaScript                                       | User interactions and dynamic profile rendering            |
| GitHub REST API                                  | Source of GitHub profile and repository information        |

## 🚀 Getting Started

### Requirements

* **Windows 10 or Windows 11**
* **Python 3.14** or a compatible Python 3 release
* The dependencies listed in `requirements.txt`

### Installation

1. **Download the latest release**

   * Visit the 
   * Download the `` file.

2. **Extract the ZIP file**

   Extract the contents to a permanent location.

3. **Open a terminal**

   Open Command Prompt, PowerShell, or a terminal inside the extracted folder.

4. **Install the required dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Launch GitScope**

   ```bash
   python main.py
   ```

## 📁 Project Structure

```text
GitScope/
├── main.py
├── requirements.txt
├── README.md
├── LICENSE
└── web/
    ├── index.html
    ├── style.css
    └── script.js
```

### File Descriptions

* **`main.py`**: Handles GitHub API requests, retrieves profile and repository data, processes avatars, and exposes Python functions to the frontend.
* **`requirements.txt`**: Lists the Python dependencies required by the project.
* **`web/index.html`**: Defines the application layout and interface elements.
* **`web/style.css`**: Contains the application styling, colors, layout, and responsive design.
* **`web/script.js`**: Handles profile searches, displays results, renders repositories, and resets the interface when the logo is clicked.
* **`README.md`**: Provides project documentation and setup instructions.
* **`LICENSE`**: Contains the project's license, if included.

## 💡 How to Use

1. Launch GitScope.
2. Enter a GitHub username in the search field.
3. Start the search to retrieve the user's profile.
4. Explore the profile information and account statistics.
5. Browse the user's public repositories.
6. Click a profile or repository link to open it on GitHub.
7. Click the GitScope logo to clear the current results and return to the welcome screen.

## 🔌 How It Works

GitScope uses Eel to connect the Python backend to the JavaScript frontend. The backend uses PyGithub to retrieve profile details and public repository information. It returns the data to JavaScript, which updates the interface.

The response includes fields such as:

* `login`
* `name`
* `bio`
* `followers`
* `following`
* `repos`
* `gists`
* `avatar`
* `repo_list`

Repository entries include details such as their names, descriptions, programming languages, stars, forks, update dates, and GitHub URLs.

## ⚠️ Limitations

* Only information available through GitHub and the relevant API permissions can be displayed.
* Some profile fields, such as company, location, email, or bio, may be empty.
* Private repositories and restricted account information are not available unless the application is configured with suitable authentication and permissions.
* Unauthenticated API requests are subject to rate limits.
* Profile and repository information depends on the data returned by GitHub.
* An internet connection is required to retrieve current information.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes locally.
5. Open a pull request with a clear description.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
