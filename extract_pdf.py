import fitz
import sys
import os

pdf_path = sys.argv[1]
output_dir = 'public/portfolio'
os.makedirs(output_dir, exist_ok=True)

try:
    doc = fitz.open(pdf_path)
    for i in range(min(4, len(doc))):
        page = doc.load_page(i)
        pix = page.get_pixmap(dpi=150)
        output_path = os.path.join(output_dir, f'spark-{i+1}.png')
        pix.save(output_path)
        print(f'Saved {output_path}')
    print("Done extracting images.")
except Exception as e:
    print(f"Error: {e}")
