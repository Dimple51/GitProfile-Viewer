async function searchRepositories() {
  const username = document.getElementById("usernameInput").value;
  const userProfileElement = document.getElementById("userProfile");
  const repositoriesListElement = document.getElementById("repositoriesList");

  // Clear previous results
  userProfileElement.innerHTML = "";
  repositoriesListElement.innerHTML = "";

  if (!username) {
    alert("Please enter a GitHub username.");
    return;
  }

  // Show loader while fetching data
  repositoriesListElement.innerHTML = '<div class="loader"></div>';

  try {
    // Fetch user profile
    const userProfile = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userProfile.json();

    if (userData.message === "Not Found") {
      throw new Error("User not found. Please enter a valid GitHub username.");
    }

    // Fetch repositories
    const repositories = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const repositoriesData = await repositories.json();

    // Display user profile
    userProfileElement.innerHTML = `
            <div class="user-profile-info">
                <img src="${userData.avatar_url}" alt="${
      userData.login
    }" width="100">
                <h2>${userData.login}</h2>
                <p>Location: ${userData.location || "Not specified"}</p>
                <p>GitHub Profile: <a href="${
                  userData.html_url
                }" target="_blank">${userData.html_url}</a></p>
            </div>
        `;

    // Display repositories
    repositoriesListElement.innerHTML = ""; // Clear loader
    repositoriesData.forEach(async (repository) => {
      // Fetch additional information about the repository, including languages
      const repoInfo = await fetch(repository.languages_url);
      const languagesData = await repoInfo.json();

      repositoriesListElement.innerHTML += `
                <div class="card">
                    <h3>${repository.name}</h3>
                    <p>${
                      repository.description || "No description available"
                    }</p>
                    <p>Languages: ${
                      Object.keys(languagesData).join(", ") || "Not specified"
                    }</p>
                </div>
            `;
    });
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  } finally {
    // Remove loader after results are shown or error occurred
    repositoriesListElement.innerHTML =
      repositoriesListElement.innerHTML.replace(
        '<div class="loader"></div>',
        ""
      );
  }
}

