import sys
import os
import re

def resize_space_width(input_file, new_width):
    """
    Resize the width of the space character in a BDF font file.

    Args:
        input_file (str): Path to the BDF file.
        new_width (int): The desired width in pixels for the space character.

    Saves:
        A new BDF file with "_space_<new_width>" appended to its name.
    """
    # Validate inputs
    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Input file '{input_file}' not found.")

    if not isinstance(new_width, int) or new_width <= 0:
        raise ValueError("Width must be a positive integer.")

    output_file = f"{os.path.splitext(input_file)[0]}_space_{new_width}.bdf"

    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        inside_space_char = False

        for line in infile:
            if line.startswith("STARTCHAR space"):
                inside_space_char = True
                outfile.write(line)
            elif inside_space_char and line.startswith("BBX"):
                # Adjust BBX width for the space character
                parts = line.split()
                parts[1] = str(new_width)
                outfile.write(" ".join(parts) + "\n")
            elif inside_space_char and line.startswith("ENDCHAR"):
                inside_space_char = False
                outfile.write(line)
            else:
                # Default write
                outfile.write(line)

    print(f"Modified BDF file saved as '{output_file}'.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python resize_space_width.py <input_file> <new_width>")
        sys.exit(1)

    input_file = sys.argv[1]
    try:
        new_width = int(sys.argv[2])
    except ValueError:
        print("Width must be an integer.")
        sys.exit(1)

    try:
        resize_space_width(input_file, new_width)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
