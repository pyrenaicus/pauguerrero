#!/usr/bin/env zsh

# Process all .md files in the current directory
for file in *.md; do
    # Check if any .md files exist (in case glob doesn't match)
    if [[ ! -e "$file" ]]; then
        echo "No .md files found in current directory"
        break
    fi
    
    # Get filename without extension
    folder_name="${file%.md}"
    
    # Create folder with the same name (without .md extension)
    mkdir -p "$folder_name"
    
    # Move the file into the newly created folder
    mv "$file" "$folder_name/"
    
    echo "Created folder '$folder_name' and moved '$file' into it"
done

echo "Done!"

