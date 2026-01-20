import { useState } from "react";
import "./index.css";

export default function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [theme, setTheme] = useState("feature_based");
  const [distance, setDistance] = useState(18000);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const THEME_DESCRIPTIONS = {
  feature_based: "Classic black & white map with clear road hierarchy",
  gradient_roads: "Smooth gradient shading for roads and areas",
  contrast_zones: "High contrast highlighting dense urban areas",
  noir: "Pure black background with white roads",
  midnight_blue: "Navy background with elegant gold roads",
  blueprint: "Architectural blueprint technical drawing style",
  neon_cyberpunk: "Dark theme with electric pink and cyan highlights",
  warm_beige: "Vintage sepia tones with warm beige background",
  pastel_dream: "Soft, muted pastel color palette",
  japanese_ink: "Minimalist black ink wash inspired by Japanese art",
  forest: "Deep greens and sage tones inspired by forests",
  ocean: "Blues and teals inspired by coastal cities",
  terracotta: "Mediterranean warmth with earthy terracotta tones",
  sunset: "Warm oranges and pinks like a city at sunset",
  autumn: "Burnt oranges and reds inspired by fall season",
  copper_patina: "Oxidized copper look with artistic patina",
  monochrome_blue: "Single blue color family with tonal variations",
};

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
            {Object.keys(THEME_DESCRIPTIONS).map((key) => (
              <option key={key} value={key}>
                {key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
            </option>
            ))}
          </select>

          <p className="theme-description">
          {THEME_DESCRIPTIONS[theme]}
          </p>


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
