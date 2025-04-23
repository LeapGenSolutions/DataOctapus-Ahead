from fastapi import FastAPI, HTTPException
from azure.cosmos import CosmosClient, exceptions
from pydantic import BaseModel
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pybase64

app = FastAPI()

# ✅ Global CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CosmosDB connection details from environment variables
COSMOSDB_ENDPOINT = os.getenv("COSMOSDB_ENDPOINT", "https://data-octapus-admin-source-list.documents.azure.com:443/")
COSMOSDB_KEY = os.getenv("COSMOSDB_KEY", pybase64.b64decode("WXpURE9PcW9GVkY0QXNDaDdyUDNmTk5kYzc0c2FDemhGa25KTzR0bEFidFhSSnA2RE9LRFhBOXd6dnd0NnB0NzBUWTNDUTI0UXpxVEFDRGJxZlNxTWc9PQ=="))
DATABASE_NAME = "admin-sources"
CONTAINER_NAME = "source-list"

# Connect to Azure CosmosDB
client = CosmosClient(COSMOSDB_ENDPOINT, COSMOSDB_KEY)
database = client.get_database_client(DATABASE_NAME)
container = database.get_container_client(CONTAINER_NAME)

# ✅ CORS Helper Function
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# Pydantic Model for Source
class Source(BaseModel):
    id: str
    sourceName: str
    type: str
    authType: str
    sourcecredentialType: str
    credentialType: str
    authMethod: str
    sourceOption: str
    selectedTables: list
    ediChecked: bool
    preserveChecked: bool
    sourceSelected: str | None = None
    fqdn: str | None = None
    databaseName: str | None = None
    username: str | None = None
    password: str | None = None
    servicePrincipleId: str | None = None
    servicePrincipleKey: str | None = None
    credentialTypeedi837: str | None = None
    authTypeedi837: str | None = None
    authMethodedi837: str | None = None
    edi834: bool
    edi837: bool
    fqdnedi837: str | None = None
    databaseNameedi837: str | None = None
    usernameedi837: str | None = None
    passwordedi837: str | None = None
    servicePrincipleIdedi837: str | None = None
    servicePrincipleKeyedi837: str | None = None

# 🔹 Get All Sources
@app.get("/sources", response_model=list[Source])
async def get_sources():
    try:
        sources = list(container.read_all_items())  # Fetch all items
        response = JSONResponse(content=sources)
        return add_cors_headers(response)
    except exceptions.CosmosHttpResponseError:
        raise HTTPException(status_code=500, detail="Failed to fetch sources")

# 🔹 Get Single Source by ID
@app.get("/sources/{id}", response_model=Source)
async def get_source(id: str):
    try:
        source = container.read_item(item=id, partition_key=id)
        response = JSONResponse(content=source)
        return add_cors_headers(response)
    except exceptions.CosmosResourceNotFoundError:
        raise HTTPException(status_code=404, detail="Source not found")

# 🔹 Create a New Source
@app.post("/sources", response_model=Source)
async def create_source(source: Source):
    try:
        container.create_item(source.dict())  # Insert new source
        response = JSONResponse(content=source.dict())
        return add_cors_headers(response)
    except exceptions.CosmosHttpResponseError:
        raise HTTPException(status_code=500, detail="Failed to create source")

# 🔹 Update an Existing Source
@app.put("/sources/{source_id}")
async def update_source(source_id: str, source: Source):
    """Update a source in CosmosDB."""
    try:
        existing_source = container.read_item(item=source_id, partition_key=source_id)
        if not existing_source:
            raise HTTPException(status_code=404, detail="Source not found")
        
        # Merge existing and new data
        updated_source = {**existing_source, **source.dict()}
        
        # Update in CosmosDB
        container.replace_item(item=source_id, body=updated_source)
        
        return updated_source  # Return the updated source
    except exceptions.CosmosHttpResponseError as e:
        raise HTTPException(status_code=500, detail=str(e))


# 🔹 Delete a Source
@app.delete("/sources/{source_id}")
async def delete_source(source_id: str):
    """Delete a source from CosmosDB."""
    try:
        container.delete_item(item=source_id, partition_key=source_id)
        return {"message": "Source deleted successfully"}
    except exceptions.CosmosResourceNotFoundError:
        raise HTTPException(status_code=404, detail="Source not found")
    except exceptions.CosmosHttpResponseError as e:
        raise HTTPException(status_code=500, detail=str(e))




CONTAINER_NAME_PIPELINE = "pipelines-list"
container_pipeline = database.get_container_client(CONTAINER_NAME_PIPELINE)

# Pipeline Model
class Pipeline(BaseModel):
    id: str
    name: str
    runID: str
    
# 🔹 Fetch All Pipelines
@app.get("/pipelines", response_model=list[Pipeline])
async def get_pipelines():
    try:
        pipelines = list(container_pipeline.read_all_items())
        response = JSONResponse(content=pipelines)
        return add_cors_headers(response)
    except exceptions.CosmosHttpResponseError:
        raise HTTPException(status_code=500, detail="Failed to fetch pipelines")

# 🔹 Create New Pipeline
@app.post("/pipelines", response_model=Pipeline)
async def create_pipeline(pipeline: Pipeline):
    try:
        container_pipeline.create_item(pipeline.dict())
        response = JSONResponse(content=pipeline.dict())
        return add_cors_headers(response)
    except exceptions.CosmosHttpResponseError:
        raise HTTPException(status_code=500, detail="Failed to create pipeline")

# 🔹 Update Pipeline
@app.put("/pipelines/{pipeline_id}", response_model=Pipeline)
async def update_pipeline(pipeline_id: str, pipeline: Pipeline):
    try:
        existing_pipeline = container_pipeline.read_item(item=pipeline_id, partition_key=pipeline_id)
        existing_pipeline.update(pipeline.dict())
        container_pipeline.replace_item(item=pipeline_id, body=existing_pipeline)
        response = JSONResponse(content=existing_pipeline)
        return add_cors_headers(response)
    except exceptions.CosmosResourceNotFoundError:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    except exceptions.CosmosHttpResponseError:
        raise HTTPException(status_code=500, detail="Failed to update pipeline")

# 🔹 Delete Pipeline
@app.delete("/pipelines/{pipeline_id}")
async def delete_pipeline(pipeline_id: str):
    try:
        container_pipeline.delete_item(item=pipeline_id, partition_key=pipeline_id)
        response = JSONResponse(content={"message": "Pipeline deleted successfully"})
        return add_cors_headers(response)
    except exceptions.CosmosResourceNotFoundError:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    except exceptions.CosmosHttpResponseError:
        raise HTTPException(status_code=500, detail="Failed to delete pipeline")




CONTAINER_NAME_HISTORY = "pipeline-history"
container_history = database.get_container_client(CONTAINER_NAME_HISTORY)

# ✅ Pipeline History Model
class PipelineHistory(BaseModel):
    name: str
    start: str
    end: str
    status: str
    message: str

# 🔹 Fetch All Pipeline History
@app.get("/pipelines/history")
async def get_pipeline_history():
    try:
        history = list(container_history.read_all_items())
        response = JSONResponse(content=history)
        return add_cors_headers(response)
    except exceptions.CosmosHttpResponseError:
        raise HTTPException(status_code=500, detail="Failed to fetch pipeline history")

# 🔹 Add New Pipeline to History
@app.post("/pipelines/history")
async def add_pipeline_to_history(history: PipelineHistory):
    try:
        container_history.create_item(history.dict())
        response = JSONResponse(content=history.dict())
        return add_cors_headers(response)
    except exceptions.CosmosHttpResponseError:
        raise HTTPException(status_code=500, detail="Failed to save pipeline history")