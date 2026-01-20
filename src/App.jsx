import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function MapToPosterUI() {
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
    } catch (e) {
      alert("Failed to generate poster");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Controls */}
      <Card className="md:col-span-1 bg-zinc-900 border-zinc-800">
        <CardContent className="space-y-5 p-6">
          <h1 className="text-xl font-semibold">Map To Poster</h1>

          <Input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Input
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <select
            className="w-full bg-zinc-800 p-2 rounded"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="feature_based">Feature Based</option>
            <option value="noir">Noir</option>
            <option value="blueprint">Blueprint</option>
            <option value="neon_cyberpunk">Neon Cyberpunk</option>
            <option value="warm_beige">Warm Beige</option>
          </select>

          <div>
            <label className="text-sm text-zinc-400">Distance: {distance / 1000} km</label>
            <Slider
              defaultValue={[distance]}
              min={5000}
              max={30000}
              step={1000}
              onValueChange={(v) => setDistance(v[0])}
            />
          </div>

          <Button
            onClick={generatePoster}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Generating..." : "Generate Poster"}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="md:col-span-2 bg-zinc-900 border-zinc-800">
        <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
          {!imageUrl && !loading && (
            <p className="text-zinc-500">Poster preview will appear here</p>
          )}

          {loading && (
            <p className="animate-pulse text-zinc-400">Rendering map…</p>
          )}

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Generated Poster"
              className="max-h-[600px] rounded shadow-lg"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
