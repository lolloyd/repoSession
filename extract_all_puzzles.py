import pymupdf
from PIL import Image
import io
import os
import json

os.makedirs("public/puzzles", exist_ok=True)

doc = pymupdf.open("rebus-puzzles.pdf")

# Standard bounding boxes for the 3x4 grid on each page
cols = [(115, 820), (885, 1595), (1655, 2365)]
rows = [(455, 1165), (1215, 1920), (1975, 2680), (2725, 3435)]

card_num = 1
for page_idx in range(8):
    img_info = doc[page_idx].get_images()[0]
    base_image = doc.extract_image(img_info[0])
    img = Image.open(io.BytesIO(base_image["image"]))
    
    for r_idx, (y1, y2) in enumerate(rows):
        for c_idx, (x1, x2) in enumerate(cols):
            cropped = img.crop((x1, y1, x2, y2))
            # Resize slightly to 600x600 for optimal crispness and fast web loading
            cropped_resized = cropped.resize((600, 600), Image.Resampling.LANCZOS)
            filename = f"public/puzzles/puzzle_{card_num}.webp"
            cropped_resized.save(filename, "WEBP", quality=90)
            card_num += 1

print(f"Successfully extracted {card_num - 1} puzzles into public/puzzles/*.webp")
