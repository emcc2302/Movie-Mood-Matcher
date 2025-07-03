document.getElementById("fetchBtn").addEventListener("click", async () => {
  const mood = document.getElementById("mood").value.trim();
  const industry = document.getElementById("industry").value;
  const output = document.getElementById("movie-output");

  output.innerHTML = `<p>🎬 Searching movies for "${mood}"...</p>`;

  try {
    let movies = [];

    // ✅ Anime – Jikan API
    if (industry === "anime") {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(mood)}&limit=6`
      );
      const json = await res.json();
      movies = (json.data || []).map((item) => ({
        title: item.title,
        rating: item.score || "N/A",
        poster: item.images.jpg.image_url,
        link: item.url,
      }));
    }

    // ✅ Any Industry – YTS API
    else if (industry === "any") {
      const url = `https://yts.theproxy2.org/api/v2/list_movies.json?limit=6&query_term=${encodeURIComponent(mood)}`;
      const res = await fetch(url);
      const { status, data } = await res.json();

      if (status === "ok" && data.movies) {
        movies = data.movies.map((m) => ({
          title: m.title,
          rating: m.rating,
          poster: m.medium_cover_image,
          link: m.url,
          genres: m.genres?.join(", ") || "",
          year: m.year,
        }));
      }
    }

    // ❌ Unsupported industry
    else {
      alert("⚠️ Currently, only Anime and Any Industry options are supported.");
      output.innerHTML = `<p>❌ Only "Any Industry" and "Anime" are currently supported.</p>`;
      return;
    }

    // ✅ Render movie cards
    if (movies.length) {
      output.innerHTML = movies
        .map((m) => `
          <div class="movie-card">
            <img src="${m.poster}" alt="${m.title}">
            <div class="movie-info">
              <h3>${m.title}${m.year ? ` (${m.year})` : ""}</h3>
              <p>⭐ ${m.rating}</p>
              ${m.genres ? `<p>${m.genres}</p>` : ""}
              <p><a href="${m.link}" target="_blank">🎥 View More</a></p>
            </div>
          </div>
        `)
        .join("");
    } else {
      output.innerHTML = `<p>😕 No movies found for "${mood}". Try a different mood.</p>`;
    }

  } catch (err) {
    console.error("Error 🚨:", err);
    output.innerHTML = `<p>⚠️ Something went wrong. Please try again later.</p>`;
  }
});
