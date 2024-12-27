from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont
import os
import argparse

def ttf_to_bdf(ttf_path, output_path, height, space_width=10):
    # Load the TrueType font using Pillow
    try:
        font = ImageFont.truetype(ttf_path, height)
    except Exception as e:
        print(f"Error loading font: {e}")
        return

    # Open the TTF file with fontTools
    try:
        ttfont = TTFont(ttf_path)
    except Exception as e:
        print(f"Error reading TTF file: {e}")
        return

    # Prepare the BDF output file
    with open(output_path, 'w') as bdf_file:
        bdf_file.write("STARTFONT 2.1\n")
        bdf_file.write(f"FONT -{ttfont['name'].names[0].toStr()}\n")
        bdf_file.write(f"SIZE {height} 75 75\n")
        bdf_file.write(f"FONTBOUNDINGBOX {height} {height} 0 0\n")
        bdf_file.write("STARTPROPERTIES 2\n")
        bdf_file.write("FONT_ASCENT 75\n")
        bdf_file.write("FONT_DESCENT 0\n")
        bdf_file.write("ENDPROPERTIES\n")
        bdf_file.write("CHARS 256\n")

        for char_code in range(32, 127):  # Printable ASCII range
            char = chr(char_code)
            if char_code == 32:  # Handle the space character
                bdf_file.write(f"STARTCHAR space\n")
                bdf_file.write(f"ENCODING {char_code}\n")
                bdf_file.write(f"BBX {space_width} 0 0 0\n")
                bdf_file.write("BITMAP\n")
                bdf_file.write("ENDCHAR\n")
            else:
                # Get character dimensions
                bbox = font.getbbox(char)
                width = bbox[2] - bbox[0]
                height = bbox[3] - bbox[1]

                image = Image.new('1', (width, height), 1)  # Create a white image
                draw = ImageDraw.Draw(image)
                draw.text((-bbox[0], -bbox[1]), char, font=font, fill=0)  # Render the character

                # Convert image to bitmap
                bitmap = []
                for y in range(height):
                    row = 0
                    for x in range(width):
                        pixel = image.getpixel((x, y))
                        row = (row << 1) | (1 if pixel == 0 else 0)
                    bitmap.append(row)

                # Write character to BDF file
                bdf_file.write(f"STARTCHAR U+{char_code:04X}\n")
                bdf_file.write(f"ENCODING {char_code}\n")
                bdf_file.write(f"BBX {width} {height} 0 0\n")
                bdf_file.write("BITMAP\n")
                for row in bitmap:
                    bdf_file.write(f"{row:02X}\n")
                bdf_file.write("ENDCHAR\n")

        bdf_file.write("ENDFONT\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert TTF font to BDF format.")
    parser.add_argument("ttf_path", help="Path to the TTF font file.")
    parser.add_argument("output_path", help="Path to save the BDF file.")
    parser.add_argument("height", type=int, help="Height of the font in pixels.")
    parser.add_argument("--space-width", type=int, default=10, help="Width of the space character in pixels.")
    
    args = parser.parse_args()
    ttf_to_bdf(args.ttf_path, args.output_path, args.height, args.space_width)

FONT_PATH = '/Users/quangngo/Documents/Code/ISPH-Stock-Exchange/isph-stocks-rpi-led-screen/fonts/NHaasGroteskTXPro-55Rg.ttf'