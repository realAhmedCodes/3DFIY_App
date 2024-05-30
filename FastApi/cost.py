from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import trimesh
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CostEstimationRequest(BaseModel):
    material: str
    color: str
    resolution: str
    resistance: str

def calculate_cost(surface_area: float, volume: float, material: str, resolution: str, resistance: str) -> float:
    material_cost_per_cm3 = {
        "PLA": 0.05,
        "PETG": 0.07,
        "ABS": 0.06,
        "ASA": 0.08,
        "TPU": 0.10,
        "Nylon": 0.09
    }

    resolution_value = float(resolution)
    resolution_multiplier = 0.5 + (1 / resolution_value)  # Adjust the scale

    resistance_value = int(resistance) / 100
    resistance_multiplier = 1 + (resistance_value / 2)  # Adjust the scale

    base_cost = material_cost_per_cm3.get(material, 0.05) * volume
    cost = base_cost * resolution_multiplier * resistance_multiplier
    
    return cost

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), 
                      material: str = Form(...),
                      color: str = Form(...),
                      resolution: str = Form(...),
                      resistance: str = Form(...)):
    if not file.filename.endswith('.obj'):
        raise HTTPException(status_code=400, detail="Invalid file type. Only .obj files are supported.")

    try:
        contents = await file.read()
        mesh = trimesh.load(io.BytesIO(contents), file_type='obj')
        
        surface_area = mesh.area
        volume = mesh.volume
        
        cost = calculate_cost(surface_area, volume, material, resolution, resistance)
        
        return JSONResponse(content={"cost": cost})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
