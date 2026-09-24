from PIL import Image, ImageDraw

def mask_image(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    
    width, height = img.size
    cx, cy = width / 2, height / 2
    
    # The gold ring is much smaller than the full image bounding box.
    # Let's set a tighter radius (e.g., 38 pixels for a 111x107 image).
    r = 38
    
    # Draw an anti-aliased white circle mask
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    
    # Apply the mask
    result = img.copy()
    result.putalpha(mask)
    
    # Crop to the actual circle to remove all the unnecessary transparent padding around it
    box = (int(cx - r), int(cy - r), int(cx + r), int(cy + r))
    result = result.crop(box)
    
    result.save(out_path, "PNG")
    print("Saved tightly cropped transparent logo to", out_path)

mask_image("c:/Users/USER/Desktop/smartsurge/frontend/public/logo.png", "c:/Users/USER/Desktop/smartsurge/frontend/public/logo_transparent.png")
