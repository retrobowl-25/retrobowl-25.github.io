import os

def replace_in_file(file_path):
    """Replace all occurrences of a specific pattern in the file."""
    try:
        # Read the original content
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Check if the target pattern exists
        old_text = 'https://discord.gg/nS6QqcwU'
        new_text = 'https://retrobowl.click/nfl-retro-bowl-25/'
        
        if old_text in content:
            # Replace occurrences of the pattern
            new_content = content.replace(old_text, new_text)
            
            # Write the modified content back only if there's a change
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Modified: {file_path}")
            return True  # Indicate that a change was made

        print(f"No changes needed in: {file_path}")
        return False  # No change made

    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        return False

def process_directory(game_dir):
    """Process all HTML files in the given directory and its subdirectories."""
    modified_count = 0
    error_count = 0

    # Walk through the directory tree
    for root, _, files in os.walk(game_dir):
        html_files = [f for f in files if f.endswith('.html')]
        
        for html_file in html_files:
            file_path = os.path.join(root, html_file)
            if replace_in_file(file_path):
                modified_count += 1
            else:
                error_count += 1  # Track files with issues or no changes

    return modified_count, error_count

if __name__ == "__main__":
    # Set the directory path (relative to the script location)
    game_directory = "./"

    if not os.path.exists(game_directory):
        print(f"Error: Directory '{game_directory}' not found!")
    else:
        print("Starting to process files...")
        modified, errors = process_directory(game_directory)
        print("\nProcess completed!")
        print(f"Files modified: {modified}")
        print(f"Files with no changes or errors: {errors}")
