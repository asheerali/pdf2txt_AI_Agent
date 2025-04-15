import os
from methods.data_processing import sort_numerically, encode_image
from methods.text_converters import img2qwitha
from config.openai_client import client

# Main classification and routing loop
def marked(log_file_path, image_folder, aiken_output_file):
    with open(log_file_path, "w", encoding="utf-8") as log_file:
        for image_name in sorted(os.listdir(image_folder), key=sort_numerically):
        # for image_name in os.listdir(image_folder):
            if image_name.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                image_path = os.path.join(image_folder, image_name)
                encoded_image = encode_image(image_path)

                print(f"🔍 Processing: {image_name}")
                
                img2qwitha(client, image_path, aiken_output_file)

    print(f"\n✅ All classifications saved to {log_file_path}")
    print(f"✅ All extracted questions saved to {aiken_output_file}")

# # Run script
# if __name__ == "__main__":
#     classify_and_extract()
