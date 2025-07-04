import os
from PIL import Image

def compress_images_in_directory(directory="images"):
    """
    Compresses JPG and PNG images in a directory to WebP format.
    """
    if not os.path.exists(directory):
        print(f"Error: Directory '{directory}' not found.")
        return

    total_original_size = 0
    total_compressed_size = 0

    files_to_compress = [
        f for f in os.listdir(directory)
        if f.lower().endswith(('.png', '.jpg', '.jpeg'))
    ]

    if not files_to_compress:
        print(f"No JPG or PNG images to compress in '{directory}'.")
        return

    print(f"Found {len(files_to_compress)} images to compress in '{directory}'...")

    for filename in files_to_compress:
        try:
            filepath = os.path.join(directory, filename)
            original_size = os.path.getsize(filepath)
            total_original_size += original_size

            image = Image.open(filepath)
            
            # Create new filename
            name, _ = os.path.splitext(filename)
            webp_filename = name + ".webp"
            webp_filepath = os.path.join(directory, webp_filename)

            # Convert and save as WebP
            image.save(webp_filepath, 'webp')

            compressed_size = os.path.getsize(webp_filepath)
            total_compressed_size += compressed_size
            
            print(f"Compressed {filename} -> {webp_filename}. Original: {original_size/1024:.2f} KB, Compressed: {compressed_size/1024:.2f} KB")

        except Exception as e:
            print(f"Failed to compress {filename}: {e}")

    if total_original_size > 0:
        reduction_percentage = (
            (total_original_size - total_compressed_size) / total_original_size
        ) * 100
        print("\n--- Compression Summary ---")
        print(f"Total original size: {total_original_size / (1024*1024):.2f} MB")
        print(f"Total compressed size: {total_compressed_size / (1024*1024):.2f} MB")
        print(f"Total size reduction: {reduction_percentage:.2f}%")
        print("---------------------------")
    else:
        print("No compression was performed.")

if __name__ == "__main__":
    try:
        from PIL import Image
    except ImportError:
        print("The 'Pillow' library is required. Please install it by running:")
        print("pip install Pillow")
    else:
        compress_images_in_directory("images") 