document.addEventListener("DOMContentLoaded", () => {
    const homeLink = document.getElementById("home-link");
    const searchForm = document.getElementById("search-form");
    const usernameInput = document.getElementById("username");
    const searchButton = document.getElementById("search-button");
    const message = document.getElementById("message");
    const welcome = document.getElementById("welcome");
    const results = document.getElementById("results");
    const repositories = document.getElementById("repositories");

    let searchRequestId = 0;

    // Return to the home screen and clear the previous search.
    function resetApp() {
        // Invalidate any search request that is still running.
        searchRequestId++;

        searchForm.reset();
        usernameInput.value = "";

        setLoading(false);
        showMessage("");

        results.hidden = true;
        welcome.hidden = false;

        // Clear old profile content.
        document.getElementById("avatar").removeAttribute("src");
        document.getElementById("avatar").alt = "GitHub avatar";
        document.getElementById("profile-name").textContent = "";
        document.getElementById("profile-login").textContent = "";
        document.getElementById("profile-login").removeAttribute("href");
        document.getElementById("profile-bio").textContent = "";
        document.getElementById("profile-details").replaceChildren();

        document.getElementById("stat-repos").textContent = "0";
        document.getElementById("stat-followers").textContent = "0";
        document.getElementById("stat-following").textContent = "0";
        document.getElementById("stat-gists").textContent = "0";

        document.getElementById("repo-count").textContent = "0";
        repositories.replaceChildren();

        const profileLink = document.getElementById("github-profile-link");
        profileLink.href = "#";

        // Remove the URL fragment without reloading the app.
        history.replaceState(null, "", window.location.pathname);

        // Return focus to the search field.
        usernameInput.focus();

        // Return to the top of the page.
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    homeLink.addEventListener("click", (event) => {
        event.preventDefault();
        resetApp();
    });

    function setLoading(isLoading) {
        searchButton.disabled = isLoading;

        const buttonText = searchButton.querySelector(".button-text");
        buttonText.textContent = isLoading ? "Searching..." : "Explore profile";
    }

    function showMessage(text, type = "") {
        message.textContent = text;
        message.className = "message";

        if (type) {
            message.classList.add(type);
        }
    }

    function safeUrl(value) {
        if (!value || typeof value !== "string") {
            return null;
        }

        try {
            const url = new URL(value);

            if (url.protocol === "https:" || url.protocol === "http:") {
                return url.href;
            }
        } catch {
            return null;
        }

        return null;
    }

    function addDetail(container, label, value, url = null) {
        if (
            value === null ||
            value === undefined ||
            String(value).trim() === "" ||
            value === "-"
        ) {
            return;
        }

        const item = document.createElement("span");
        item.className = "detail-item";

        const labelElement = document.createElement("span");
        labelElement.textContent = `${label}:`;
        item.appendChild(labelElement);

        const safe = url ? safeUrl(url) : null;

        if (safe) {
            const link = document.createElement("a");
            link.href = safe;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = String(value);
            item.appendChild(link);
        } else {
            const valueElement = document.createElement("span");
            valueElement.textContent = String(value);
            item.appendChild(valueElement);
        }

        container.appendChild(item);
    }

    function renderProfile(user) {
        const avatar = document.getElementById("avatar");
        const name = user.name || user.login || "GitHub user";

        avatar.alt = `${name}'s GitHub avatar`;

        if (user.avatar) {
            avatar.src = user.avatar;
        } else {
            avatar.removeAttribute("src");
        }

        document.getElementById("profile-name").textContent = name;

        const loginLink = document.getElementById("profile-login");
        loginLink.textContent = `@${user.login}`;

        const profileUrl = safeUrl(user.html_url);

        if (profileUrl) {
            loginLink.href = profileUrl;
        } else {
            loginLink.removeAttribute("href");
        }

        document.getElementById("profile-bio").textContent =
            user.bio || "No bio provided.";

        document.getElementById("stat-repos").textContent =
            Number(user.repos || 0).toLocaleString();

        document.getElementById("stat-followers").textContent =
            Number(user.followers || 0).toLocaleString();

        document.getElementById("stat-following").textContent =
            Number(user.following || 0).toLocaleString();

        document.getElementById("stat-gists").textContent =
            Number(user.gists || 0).toLocaleString();

        const details = document.getElementById("profile-details");
        details.replaceChildren();

        addDetail(details, "Location", user.location);
        addDetail(details, "Company", user.company);
        addDetail(details, "Website", user.blog, user.blog);
        addDetail(details, "Email", user.email);
        addDetail(details, "Joined", user.joined);

        const githubLink = document.getElementById("github-profile-link");

        if (profileUrl) {
            githubLink.href = profileUrl;
            githubLink.hidden = false;
        } else {
            githubLink.href = "#";
            githubLink.hidden = true;
        }
    }

    function renderRepositories(repoList) {
        repositories.replaceChildren();

        const count = Array.isArray(repoList) ? repoList.length : 0;
        document.getElementById("repo-count").textContent = count;

        if (count === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-repos";
            empty.textContent = "No public repositories found for this profile.";
            repositories.appendChild(empty);
            return;
        }

        repoList.forEach((repo) => {
            const card = document.createElement("article");
            card.className = "repo-card";

            const titleRow = document.createElement("div");
            titleRow.className = "repo-title-row";

            const symbol = document.createElement("div");
            symbol.className = "repo-symbol";
            symbol.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 3h9l5 5v13H6z"
                          stroke="currentColor" stroke-width="1.6"
                          stroke-linejoin="round"/>
                    <path d="M14 3v6h6M9 14h8M9 17h8"
                          stroke="currentColor" stroke-width="1.6"
                          stroke-linecap="round"/>
                </svg>
            `;

            const title = document.createElement("h3");
            title.className = "repo-title";

            const repoUrl = safeUrl(repo.url);

            if (repoUrl) {
                const link = document.createElement("a");
                link.href = repoUrl;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = repo.name || "Unnamed repository";
                title.appendChild(link);
            } else {
                title.textContent = repo.name || "Unnamed repository";
            }

            titleRow.append(symbol, title);

            const description = document.createElement("p");
            description.className = "repo-description";
            description.textContent = repo.description || "No description";

            const meta = document.createElement("div");
            meta.className = "repo-meta";

            const language = document.createElement("span");
            const languageDot = document.createElement("i");
            languageDot.className = "language-dot";

            const languageName = document.createElement("span");
            languageName.textContent = repo.language || "Other";

            language.append(languageDot, languageName);

            const stars = document.createElement("span");
            stars.textContent = `★ ${Number(repo.stars || 0).toLocaleString()}`;

            const forks = document.createElement("span");
            forks.textContent = `⑂ ${Number(repo.forks || 0).toLocaleString()}`;

            const updated = document.createElement("span");
            updated.textContent = `Updated ${repo.updated || "-"}`;

            meta.append(language, stars, forks, updated);
            card.append(titleRow, description, meta);
            repositories.appendChild(card);
        });
    }

    async function searchProfile(username) {
        const currentRequestId = ++searchRequestId;

        showMessage("");
        setLoading(true);

        // Hide previous results while a new profile is loading.
        results.hidden = true;
        welcome.hidden = true;

        try {
            if (typeof eel === "undefined" || typeof eel.get_profile !== "function") {
                throw new Error("The Python backend is unavailable. Please restart GitScope.");
            }

            // main.py returns a flat object, not { user, repos }.
            const data = await eel.get_profile(username)();

            // Ignore a response from a search that has since been reset.
            if (currentRequestId !== searchRequestId) {
                return;
            }

            if (!data || data.ok === false || data.error) {
                throw new Error(
                    data?.error || "Could not retrieve this GitHub profile."
                );
            }

            if (!data.login) {
                throw new Error(
                    "The profile response was incomplete. Please try again."
                );
            }

            renderProfile(data);
            renderRepositories(data.repo_list || []);

            results.hidden = false;
            welcome.hidden = true;

            showMessage(`Profile loaded: @${data.login}`, "success");

            // Bring the profile into view.
            results.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        } catch (error) {
            if (currentRequestId !== searchRequestId) {
                return;
            }

            console.error("GitScope search error:", error);

            results.hidden = true;
            welcome.hidden = false;

            showMessage(
                error.message || "Something went wrong. Please try again.",
                "error"
            );
        } finally {
            if (currentRequestId === searchRequestId) {
                setLoading(false);
            }
        }
    }

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();

        if (!username) {
            showMessage("Please enter a GitHub username.", "error");
            usernameInput.focus();
            return;
        }

        await searchProfile(username);
    });

    // Example buttons fill in a username and search immediately.
    document.querySelectorAll(".example-chip").forEach((button) => {
        button.addEventListener("click", () => {
            const username = button.dataset.username;

            if (!username) {
                return;
            }

            usernameInput.value = username;
            searchProfile(username);
        });
    });
});
