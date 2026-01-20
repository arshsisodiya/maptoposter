from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

# Import the WEB wrapper function you added
from create_map_poster import generate_poster_web

app = FastAPI(title="MapToPoster API")

# Enable CORS (required for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------- Request Model -----------

class PosterRequest(BaseModel):
    city: str
    country: str
    theme: str = "feature_based"
    distance: int = 18000
    format: str = "png"   # future-proof (png/svg/pdf)

# ----------- Routes -----------

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate")
def generate_poster(req: PosterRequest):
    try:
        output_path = generate_poster_web(
            city=req.city,
            country=req.country,
            theme=req.theme,
            distance=req.distance,
            output_format=req.format
        )

        if not os.path.exists(output_path):
            return JSONResponse(
                status_code=500,
                content={"error": "Poster generation failed"}
            )

        media_type = (
            "image/png" if req.format == "png"
            else "image/svg+xml" if req.format == "svg"
            else "application/pdf"
        )

        return FileResponse(
            output_path,
            media_type=media_type,
            filename=os.path.basename(output_path)
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
