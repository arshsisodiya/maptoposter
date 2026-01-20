import { useState } from "react";
import "./index.css";

export default function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [theme, setTheme] = useState("feature_based");
  const [distance, setDistance] = useState(18000);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const generatePoster = async () => {
    setLoading(true);
    setImageUrl(null);

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, country, theme, distance })
      });

      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch {
      alert("Failed to generate poster");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="layout">
        {/* CONTROLS */}
        <div className="card">
          <h1>Map To Poster</h1>
          <p style={{ color: "#a1a1aa", fontSize: 13 }}>
            Cinematic map poster generator
          </p>

          <br />

          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <br /><br />

          <input
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <br /><br />

          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="feature_based">Feature Based</option>
            <option value="noir">Noir</option>
            <option value="blueprint">Blueprint</option>
            <option value="neon_cyberpunk">Neon Cyberpunk</option>
            <option value="warm_beige">Warm Beige</option>
          </select>

          <br /><br />

          <label>Distance ({distance / 1000} km)</label>
          <input
            type="range"
            min="5000"
            max="30000"
            step="1000"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
          />

          <br /><br />

          <button onClick={generatePoster} disabled={loading}>
            {loading ? "Generating…" : "Generate Poster"}
          </button>
        </div>

        {/* PREVIEW */}
        <div className="card preview">
          {!imageUrl && !loading && (
            <p style={{ color: "#71717a" }}>
              Poster preview will appear here
            </p>
          )}

          {loading && <p className="loading">Rendering map…</p>}

          {imageUrl && (
            <img src={imageUrl} alt="Poster" className="poster-frame" />
          )}
        </div>
      </div>
    </div>
  );
}
