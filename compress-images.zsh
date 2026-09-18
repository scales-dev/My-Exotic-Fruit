#!/bin/zsh

PATH_TO_IMAGES="$1"

if [[ -z "$PATH_TO_IMAGES" || ! -d "$PATH_TO_IMAGES" ]]; then
    echo "Usage: $0 <folder>"
    exit 1
fi


# Convert a filename/folder name into a safe name
safe_name() {
    local name="$1"
    local result=""
    local char

    # Lowercase
    name="${(L)name}"

    # Replace ampersand with "and"
    name="${name//&/ and }"

    # Remove apostrophes
    name="${name//\'/}"

    # Accents
    name="${name//á/a}"
    name="${name//à/a}"
    name="${name//ä/a}"
    name="${name//â/a}"
    name="${name//ã/a}"
    name="${name//å/a}"
    name="${name//æ/ae}"

    name="${name//é/e}"
    name="${name//è/e}"
    name="${name//ë/e}"
    name="${name//ê/e}"

    name="${name//í/i}"
    name="${name//ì/i}"
    name="${name//ï/i}"
    name="${name//î/i}"

    name="${name//ó/o}"
    name="${name//ò/o}"
    name="${name//ö/o}"
    name="${name//ô/o}"
    name="${name//õ/o}"
    name="${name//ø/o}"

    name="${name//ú/u}"
    name="${name//ù/u}"
    name="${name//ü/u}"
    name="${name//û/u}"

    name="${name//ç/c}"
    name="${name//ñ/n}"
    name="${name//ß/ss}"

    # ®, ™, etc. are removed by the character check below

    # Keep only a-z, 0-9, ., _ and -
    for char in ${(s::)name}; do
        if [[ "$char" == [a-z0-9._-] ]]; then
            result+="$char"
        else
            result+="-"
        fi
    done

    name="$result"

    # Collapse repeated hyphens
    while [[ "$name" == *"--"* ]]; do
        name="${name//--/-}"
    done

    # Remove leading hyphens
    while [[ "$name" == -* ]]; do
        name="${name#-}"
    done

    # Remove trailing hyphens
    while [[ "$name" == *- ]]; do
        name="${name%-}"
    done

    printf '%s' "$name"
}


echo "Converting images..."

find "$PATH_TO_IMAGES" -type f \( \
    -iname "*.jpg" -o \
    -iname "*.jpeg" -o \
    -iname "*.png" \
\) -print0 | while IFS= read -r -d '' file; do

    output="${file%.*}.webp"

    echo "Converting: $file -> $output"

    magick "$file" \
        -alpha off \
        -define webp:method=6 \
        -quality 75 \
        "$output"

done


echo ""
echo "Renaming folders and files..."


# Process deepest paths first
find "$PATH_TO_IMAGES" -depth -mindepth 1 -print0 | while IFS= read -r -d '' path; do

    parent="${path:h}"
    name="${path:t}"

    new_name=$(safe_name "$name")

    # Nothing to change
    if [[ -z "$new_name" || "$name" == "$new_name" ]]; then
        continue
    fi

    new_path="$parent/$new_name"

    # Don't overwrite anything
    if [[ -e "$new_path" ]]; then
        echo "SKIPPED (already exists): $path"
        continue
    fi

    echo "Renaming:"
    echo "  $path"
    echo "  -> $new_path"

    # zsh built-in rename using mv via command path
    /usr/bin/mv "$path" "$new_path"

done


echo ""
echo "Done."