import easyocr
import sys
import re

def extract_name_and_cnic(image_path):
    reader = easyocr.Reader(['en', 'ur'])
    result = reader.readtext(image_path, detail=0)
    # Print the OCR results for debugging
    for text in result:
        cleaned_text = re.sub(r'[^0-9A-Za-z\s-]', '', text)
        # Encode the text using UTF-8 to handle characters properly
        print("OCR Results:", cleaned_text.encode('utf-8'))
    name = None
    cnic = None
    for text in result:
        cleaned_text = re.sub(r'[^0-9A-Za-z\s-]', '', text)
        if name is None:
            name = cleaned_text
        if cnic is None:
            cnic_pattern = r'\b\d{5}-\d{7}-\d{1}\b'
            cnic_match = re.search(cnic_pattern, cleaned_text)
            if cnic_match:
                cnic = cnic_match.group(0)
                break
    return name, cnic

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Image path argument is missing.")
        sys.exit(1)

    image_path = sys.argv[1]
    extracted_name, extracted_cnic = extract_name_and_cnic(image_path)
    if extracted_name and extracted_cnic:
        print("Extracted Name:", extracted_name)
        print("Extracted CNIC:", extracted_cnic)
    else:
        print("Name or CNIC number not found in the extracted text.")


