# functions/pdf_to_img.py
from pdf2image import convert_from_path
import os

def convert_pdf_to_images(pdf_path: str, output_folder: str = "images") -> int:
    os.makedirs(output_folder, exist_ok=True)
    images = convert_from_path(pdf_path)
    
    for i, img in enumerate(images):
        image_path = os.path.join(output_folder, f"page_{i+1}.jpg")
        img.save(image_path, "JPEG")
    
    print(f"✅ Saved {len(images)} pages to '{output_folder}' folder.")
    return len(images)
