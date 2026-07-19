#!/usr/bin/env python3
"""Generate photoreal burger ingredient layers via fal.ai, then remove backgrounds.

flux/dev for the food photography, birefnet v2 for cutouts.
Consistent studio lighting across all six so they stack believably.
"""
import json, os, sys, time, urllib.request, subprocess

KEY = None
with open(os.path.expanduser('~/.zshenv')) as f:
    for line in f:
        if 'FAL_KEY' in line:
            KEY = line.split('=', 1)[1].strip().strip('"').strip("'")
if not KEY:
    sys.exit('no FAL_KEY')

OUT = os.path.expanduser('~/Developer/learning/portfolio/public/burger-layers')
os.makedirs(OUT, exist_ok=True)

STYLE = ("professional studio food photography, perfectly centered, straight-on side view at eye level, "
         "soft diffused overhead key light, crisp focus, appetizing, commercial burger advertisement style, "
         "isolated on pure solid white background, no shadow on background, no other objects")

LAYERS = {
    'lettuce':    "one single whole round green-leaf lettuce leaf lying flat like a burger layer, solid leafy center with visible veins, no hole, frilly ruffled wavy edges all the way around, fresh crisp vibrant green with water droplets, no bun, no other ingredients, hyperrealistic professional studio food photography, tack sharp focus across the entire subject, deep depth of field, macro detail, visible realistic texture, viewed from slightly above at a gentle three-quarter angle, bright even studio light, commercial burger advert quality, centered, isolated alone on a pure solid white background, absolutely nothing else in frame",
    'cheese':     "one single square slice of orange cheddar cheese lying flat like on a cheeseburger, sharp square outline, corners softly bending and melting downward, smooth glossy surface with fine detail, no burger, no bread, no patty, just the one cheese slice, hyperrealistic professional studio food photography, tack sharp focus across the entire subject, deep depth of field, macro detail, visible realistic texture, viewed from slightly above at a gentle three-quarter angle, bright even studio light, commercial burger advert quality, centered, isolated alone on a pure solid white background, absolutely nothing else in frame",
}

def call(endpoint, payload):
    req = urllib.request.Request(
        f'https://fal.run/{endpoint}',
        data=json.dumps(payload).encode(),
        headers={'Authorization': f'Key {KEY}', 'Content-Type': 'application/json'},
        method='POST')
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)

for name, prompt in LAYERS.items():
    raw = os.path.join(OUT, f'{name}-raw.png')
    cut = os.path.join(OUT, f'{name}.png')
    if os.path.exists(cut):
        print(f'{name}: exists, skip')
        continue
    print(f'{name}: generating...', flush=True)
    gen = call('fal-ai/flux-pro/v1.1', {
        'prompt': prompt,
        'image_size': 'square_hd',
        'num_inference_steps': 28,
        'guidance_scale': 3.5,
        'seed': 5,
        'enable_safety_checker': True,
    })
    url = gen['images'][0]['url']
    urllib.request.urlretrieve(url, raw)
    print(f'{name}: cutting background...', flush=True)
    cutout = call('fal-ai/birefnet/v2', {
        'image_url': url,
        'model': 'General Use (Heavy)',
        'operating_resolution': '1024x1024',
        'output_format': 'png',
    })
    curl = cutout['image']['url']
    urllib.request.urlretrieve(curl, cut)
    print(f'{name}: done -> {cut}', flush=True)

print('ALL DONE')
