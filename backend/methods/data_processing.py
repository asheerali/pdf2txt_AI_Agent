import re
import base64
import os
import shutil


# Encode image to base64
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def sort_numerically(filename):
    match = re.search(r"(\d+)", filename)
    return int(match.group(1)) if match else 0

def empty_subfolders(folder_path: str):
    """
    Deletes all files inside each subfolder of the given folder.
    Keeps the folder and subfolders intact.
    """
    if not os.path.exists(folder_path):
        print(f"⚠️ Folder '{folder_path}' does not exist.")
        return

    for subfolder in os.listdir(folder_path):
        subfolder_path = os.path.join(folder_path, subfolder)
        if os.path.isdir(subfolder_path):
            for file_name in os.listdir(subfolder_path):
                file_path = os.path.join(subfolder_path, file_name)
                try:
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                        print(f"🗑 Deleted: {file_path}")
                    elif os.path.isdir(file_path):
                        # Optional: If subfolders inside subfolders, remove them too
                        shutil.rmtree(file_path)
                        print(f"🧹 Deleted folder: {file_path}")
                except Exception as e:
                    print(f"⚠️ Could not delete {file_path}: {e}")

def empty_folder(folder_path: str):
    """
    Deletes all contents inside the given folder (files and subfolders).
    Keeps the folder itself intact.
    """
    if not os.path.exists(folder_path):
        print(f"⚠️ Folder '{folder_path}' does not exist.")
        return

    for item in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item)
        try:
            if os.path.isfile(item_path) or os.path.islink(item_path):
                os.remove(item_path)
                print(f"🗑 Deleted file: {item_path}")
            elif os.path.isdir(item_path):
                shutil.rmtree(item_path)
                print(f"🧹 Deleted folder: {item_path}")
        except Exception as e:
            print(f"⚠️ Could not delete {item_path}: {e}")
