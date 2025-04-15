from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, FileResponse, JSONResponse
import shutil
import os
from methods.data_processing import empty_folder, empty_subfolders
from methods.log_store import log_stream
from methods.pdf_to_img import convert_pdf_to_images
from methods.unmarked import unmarked
from methods.marked import marked

logs_folder = "logs"
os.makedirs(logs_folder, exist_ok=True)
log_file_path = os.path.join(logs_folder, "image_classification_log.txt")
os.makedirs(os.path.dirname(log_file_path), exist_ok=True)

image_folder = "images"
os.makedirs(image_folder, exist_ok=True)

data_folder = "data_folder"
questions_folder = "questions_folder"
answers_folder = "answers_folder"

data_questions_folder = os.path.join(data_folder, questions_folder)
data_answers_folder = os.path.join(data_folder, answers_folder)
combined_folder = os.path.join(data_folder, "combined_folder")

os.makedirs(data_folder, exist_ok=True)
os.makedirs(data_questions_folder, exist_ok=True)
os.makedirs(data_answers_folder, exist_ok=True)
os.makedirs(combined_folder, exist_ok=True)

aiken_output_file = os.path.join(data_questions_folder, "questions.txt")
answers_output_file = os.path.join(data_answers_folder, "answers.txt")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=PlainTextResponse)
async def root():
    return "response ok"

@app.post("/unmarked")
async def upload_pdf(file: UploadFile = File(...)):
    log_stream.clear()  # ✅ clear old logs

    temp_pdf_path = "temp_uploaded.pdf"
    
    #Clear and recreate data folder
    empty_folder("images")
    empty_subfolders("data_folder")
    
    
    with open(temp_pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(1)
    
    # Step 1: Convert PDF to images
    num_pages = convert_pdf_to_images(temp_pdf_path)

    # Step 2: Classify images and extract Q/A
    unmarked(log_file_path, image_folder, aiken_output_file, answers_output_file, data_questions_folder, data_answers_folder, combined_folder)

    return {"No. of files retured": num_pages}


@app.post("/marked")
async def upload_pdf(file: UploadFile = File(...)):
    temp_pdf_path = "temp_uploaded.pdf"
    
    #Clear and recreate data folder
    empty_folder("images")
    empty_subfolders("data_folder")
    
    with open(temp_pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(1)
    
    # Step 1: Convert PDF to images
    num_pages = convert_pdf_to_images(temp_pdf_path)

    # Step 2: Classify images and extract Q/A
    marked(log_file_path, image_folder, combined_folder)
    
    return {"No. of files retured": num_pages}


combined_folder = os.path.join("data_folder", "combined_folder")

@app.get("/combined-files")
async def list_combined_files():
    # print("it was called ++++++++++++++++++++++")
    files = sorted(
        f for f in os.listdir(combined_folder)
        if f.endswith(".txt")
    )
    return JSONResponse(content={"files": files})

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(combined_folder, filename)
    if not os.path.exists(file_path):
        return PlainTextResponse("File not found", status_code=404)
    return FileResponse(file_path, media_type="text/plain", filename=filename)

from fastapi.responses import StreamingResponse
import asyncio


@app.get("/logs")
async def stream_logs():
    async def event_generator():
        print(f"🌐 [SSE] log_stream length: {len(log_stream)}")

        previous_len = 0
        while True:
            await asyncio.sleep(0.5)
            if len(log_stream) > previous_len:
                for line in log_stream[previous_len:]:
                    yield f"data: {line}\n\n"
                previous_len = len(log_stream)
                
    return StreamingResponse(event_generator(), media_type="text/event-stream")