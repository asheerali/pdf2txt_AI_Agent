import os
from methods.data_processing import sort_numerically, encode_image
from methods.text_converters import img2questions, img2answers, img2qna, combine_qna_files
from config.openai_client import client
from methods.log_store import log_message  # shared logger

# Main classification and routing loop
def unmarked(log_file_path, image_folder, aiken_output_file, answers_output_file, data_questions_folder, data_answers_folder, combined_folder):
    with open(log_file_path, "w", encoding="utf-8") as log_file:
        for image_name in sorted(os.listdir(image_folder), key=sort_numerically):
        # for image_name in os.listdir(image_folder):
            if image_name.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                image_path = os.path.join(image_folder, image_name)
                encoded_image = encode_image(image_path)

                print(f"🔍 Processing: {image_name}")
                log_message(f"🔍 Processing: {image_name}")


                response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": """Does this image contain only multiple-choice questions or does it also contain the answers or only the answers?

Respond with exactly one of the following:
- "Only Questions"
- "Questions and Answers"
- "Only Answers"

Do not include anything else in the response."""
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/jpeg;base64,{encoded_image}"
                                    }
                                }
                            ]
                        }
                    ],
                    temperature=0
                )

                classification = response.choices[0].message.content.strip()
                print(f"📝 {image_name}: {classification}")
                log_file.write(f"{image_name}: {classification}\n")
                log_file.flush()

                if classification == "Only Questions":
                    # img2questions(image_path)
                    img2questions(client, image_path, aiken_output_file)

                if classification == "Questions and Answers":
                    # img2qna(image_path)
                    img2qna(client, image_path, aiken_output_file, answers_output_file)
                    # combine_qna_files()
                    combine_qna_files(data_questions_folder, data_answers_folder, combined_folder)


                if classification == "Only Answers":
                    # img2answers(image_path)
                    img2answers(client, image_path, answers_output_file)
                    # combine_qna_files()
                    combine_qna_files(data_questions_folder, data_answers_folder, combined_folder)


    print(f"\n✅ All classifications saved to {log_file_path}")
    print(f"✅ All extracted questions saved to {aiken_output_file}")

# # Run script
# if __name__ == "__main__":
#     classify_and_extract()
