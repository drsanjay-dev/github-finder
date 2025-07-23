async function fetchUser() {
  const username = document.querySelector(".input_user").value.trim();
  if (!username) return alert("Please enter a GitHub username");

  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) throw new Error("User not found");

    const userData = await userResponse.json();

   
    document.querySelector(".profile_pic").src = userData.avatar_url;
    document.querySelector(".name").textContent = userData.name || "N/A";
    document.querySelector(".username").textContent = `@${userData.login}`;
    document.querySelector(".followers").textContent = userData.followers;
    document.querySelector(".following").textContent = userData.following;
    document.querySelector(".repo_count").textContent = userData.public_repos;

    const joined = new Date(userData.created_at);
    document.querySelector(".joined").textContent = joined.toLocaleDateString("en-US", {
      year: "numeric", month: "short"
    });


    const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos = await repoResponse.json();

    const repoContainer = document.querySelector(".repo_details");
    repoContainer.innerHTML = "";

    repos.forEach(repo => {
      const updatedDate = new Date(repo.updated_at);
      const repoHTML = `
        <div class="item">
          <div class="repo_name">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          </div>
          <div class="repo_stats">
            <span>⭐ ${repo.stargazers_count}</span>
            <span>✨ ${repo.forks_count}</span>
            <span>💻 ${repo.language || "N/A"}</span>
            <span>🗓️ Updated ${updatedDate.toDateString()}</span>
          </div>
        </div>
      `;
      repoContainer.innerHTML += repoHTML;
    });

  } catch (error) {
    alert(error.message);
  }
}
