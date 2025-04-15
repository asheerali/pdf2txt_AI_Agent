from methods.data_processing import encode_image
import os
import re
import glob

# Extract Aiken-format questions from an image and save them
def img2questions(client, image_path, aiken_output_file):
    encoded_image = encode_image(image_path)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """You are given an image containing multiple-choice questions.

Extract all the questions and options and format them using the Aiken format like this:

Sample question text
A. Option A
B. Option B
C. Option C
D. Option D

***note: Do NOT include anything else in the output. Just the questions and answers in Aiken format.***"""
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
        temperature=0.1
    )

    aiken_text = response.choices[0].message.content.strip()

    with open(aiken_output_file, "a", encoding="utf-8") as f:
        # f.write(f"# From: {os.path.basename(image_path)}\n")
        f.write(aiken_text + "\n\n")

    print(f"✅ Extracted and saved questions from {os.path.basename(image_path)}")


# Extract only the answer key
def img2answers(client, image_path, answers_output_file):
    encoded_image = encode_image(image_path)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """You are given an image that contains only answer keys to multiple-choice questions.

Extract the answers in a clean list format, one per line. For example:

1. C
2. A
3. D
4. B

***note: Do NOT include anything else. Only the list of question numbers and their correct options.***"""
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
        temperature=0.1
    )

    answers_text = response.choices[0].message.content.strip()

    with open(answers_output_file, "a", encoding="utf-8") as f:
        # f.write(f"# From: {os.path.basename(image_path)}\n")
        f.write(answers_text + "\n\n")

    print(f"✅ Extracted and saved answers from {os.path.basename(image_path)}")


def img2qna(client, image_path, aiken_output_file, answers_output_file):
    encoded_image = encode_image(image_path)

    # Extract questions in Aiken format
    question_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """You are given an image containing multiple-choice questions with their answers.

Extract ONLY the questions and options and format them using the Aiken format like this and donot write the question number:

Sample question text
A. Option A
B. Option B
C. Option C
D. Option D

Do not include any answer explanations or unrelated content. Only Aiken format questions."""
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
        temperature=0.2
    )

    aiken_text = question_response.choices[0].message.content.strip()

    with open(aiken_output_file, "a", encoding="utf-8") as f:
        # f.write(f"# From: {os.path.basename(image_path)}\n")
        f.write(aiken_text + "\n\n")

    print(f"✅ Saved Aiken questions from {os.path.basename(image_path)}")

    # Extract just the answer key
    answer_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """You are given an image containing multiple-choice questions with answers.

Extract only the answer key in the format below:

1. C
2. A
3. D
...

Do not include anything else in the output."""
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
        temperature=0.1
    )

    answer_text = answer_response.choices[0].message.content.strip()

    with open(answers_output_file, "a", encoding="utf-8") as f:
        # f.write(f"# From: {os.path.basename(image_path)}\n")
        f.write(answer_text + "\n\n")

    print(f"✅ Saved answers from {os.path.basename(image_path)}")


def combine_qna_files(data_questions_folder, data_answers_folder, combined_folder):
    questions_path = os.path.join(data_questions_folder, "questions.txt")
    answers_path = os.path.join(data_answers_folder, "answers.txt")

    if not os.path.exists(questions_path) or not os.path.exists(answers_path):
        print("⚠️ Skipping combine — one or both files missing.")
        return

    with open(questions_path, "r", encoding="utf-8") as qf:
        questions_content = qf.read().strip().split("\n\n")

    with open(answers_path, "r", encoding="utf-8") as af:
        answer_lines = af.read().strip().split("\n")

    # Clean answer lines like "1. A"
    answer_map = {}
    for line in answer_lines:
        match = re.match(r"(\d+)\.\s*([A-D])", line.strip())
        if match:
            q_num = int(match.group(1))
            answer = match.group(2)
            answer_map[q_num] = answer

    combined_entries = []
    for idx, q_block in enumerate(questions_content, start=1):
        q_block = q_block.strip()
        if not q_block:
            continue
        answer = answer_map.get(idx, None)
        if answer:
            combined_entries.append(f"{q_block}\nANSWER: {answer}")

    # Find the next file number
    existing = glob.glob(os.path.join(combined_folder, "combine_*.txt"))
    next_number = 1
    if existing:
        existing_numbers = [
            int(re.search(r"combine_(\d+)\.txt", f).group(1))
            for f in existing if re.search(r"combine_(\d+)\.txt", f)
        ]
        next_number = max(existing_numbers) + 1

    combined_path = os.path.join(combined_folder, f"combine_{next_number}.txt")
    with open(combined_path, "w", encoding="utf-8") as cf:
        cf.write("\n\n".join(combined_entries))

    print(f"✅ Combined file saved as {combined_path}")

    # Clean up
    os.remove(questions_path)
    os.remove(answers_path)
    print("🧹 Removed questions.txt and answers.txt")


def img2qwitha(client, image_path, combined_folder):
    
    output_file = os.path.join(combined_folder, "combine.txt")

    encoded_image = encode_image(image_path)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """You are given an image containing multiple-choice questions where the correct answers are already marked (e.g., underlined, circled, bolded, or indicated visually).

Your task is to extract each question in Aiken format:

Sample question text
A. Option A
B. Option B
C. Option C
D. Option D
ANSWER: C

Only include what is necessary. Do NOT add explanations or additional commentary.
Make sure the marked answer is reflected correctly in the 'ANSWER:' field.
Do not skip any questions.
Only output the Aiken-format questions.
"""
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
        temperature=0.1
    )

    aiken_text = response.choices[0].message.content.strip()
    
    with open(output_file, "a", encoding="utf-8") as f:
        f.write(aiken_text + "\n\n")

    print(f"✅ Extracted questions with marked answers from {os.path.basename(image_path)}")
