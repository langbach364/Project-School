#!/bin/bash

FILE_TO_WATCH="$HOME/Documents/test_shell/trans.txt"
TRANSLATED_FILE="$HOME/Documents/test_shell/trans_ed.txt"

if [ ! -f "$FILE_TO_WATCH" ]; then
    touch "$FILE_TO_WATCH"
fi

translate_file() {
    local input_file=$1
    local output_file=$2

    trans -b -i $input_file -o $output_file -s vi -t en 
    # -b: dịch văn bản thu gọn, -i: tệp đầu vào, -o: tệp đầu ra, -s: ngôn ngữ nguồn (en: tiếng Anh), -t: ngôn ngữ đích (vi: tiếng Việt)

}

inotifywait -m -e close_write --format '%w%f' "$FILE_TO_WATCH" | while read NEW_FILE; do
    if [ "$NEW_FILE" == "$FILE_TO_WATCH" ]; then

        FILE_SIZE=$(stat -c%s "$NEW_FILE")
        echo "File size: $FILE_SIZE"

        if [ "$FILE_SIZE" -gt 1 ]; then
            translate_file "$NEW_FILE" "$TRANSLATED_FILE"
            echo "" >"$NEW_FILE"
        fi
    fi
done
