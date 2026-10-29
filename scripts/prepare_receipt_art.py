"""Reproduce transparent receipt sprites from the generated source atlases.

FFmpeg performs only crops and proportion-preserving sizing. Exact prompts stay
embedded in each PNG and in the source generation manifest.
"""
import json
import shutil
import subprocess
from pathlib import Path
from PIL import Image, PngImagePlugin

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/receipt-art'
OUT = ROOT / 'public/art'
FFMPEG = shutil.which('ffmpeg') or r'C:\ffmpeg\bin\ffmpeg.exe'
BODIES = {
    'sun': (0, 0, 450, 416), 'moon': (450, 0, 365, 410),
    'mercury': (815, 0, 365, 400), 'venus': (1180, 0, 430, 410), 'mars': (1610, 0, 373, 410),
    'jupiter': (0, 420, 400, 373), 'saturn': (400, 420, 495, 373),
    'uranus': (895, 397, 322, 396), 'neptune': (1217, 410, 428, 383), 'pluto': (1645, 450, 338, 343),
}
SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio',
         'sagittarius', 'capricorn', 'aquarius', 'pisces']
STATES = ['new-moon', 'first-quarter', 'full-moon', 'last-quarter',
          'retrograde', 'conjunction', 'placement', 'invented']
SCENES = {'sun-mercury': (0, 0, 645, 627), 'mars-jupiter': (645, 0, 609, 627),
          'mercury-pluto': (0, 627, 627, 627), 'sun-pluto': (627, 627, 627, 627)}

def embed(path, record, recipe):
    with Image.open(path) as image:
        info = PngImagePlugin.PngInfo()
        info.add_text('Source', 'Built-in image_gen; see assets/receipt-art/generations.json')
        info.add_text('Prompt', record['prompt'])
        info.add_text('Recipe', json.dumps(recipe))
        image.save(path, pnginfo=info, optimize=True)
    engine = ROOT / '.agents/skills/impeccable/scripts/bin/windows-x64/impeccable.exe'
    if engine.exists():
        subprocess.run([str(engine), 'embed-prompt', str(path), '--prompt', record['prompt']],
                       check=True, capture_output=True)

def main():
    records = {r['key']: r for r in json.loads((SOURCE / 'generations.json').read_text())}
    recipes = {}
    for family, boxes in [('bodies', BODIES),
                          ('signs', {name: ((i % 4) * 362, (i // 4) * 362, 362, 362) for i, name in enumerate(SIGNS)}),
                          ('states', {name: ((i % 4) * 443, 0 if i < 4 else 405, 443 if i % 4 < 3 else 445, 405 if i < 4 else 482) for i, name in enumerate(STATES)}),
                          ('scenes', SCENES)]:
        (OUT / family).mkdir(parents=True, exist_ok=True)
        for name, (x, y, width, height) in boxes.items():
            target = OUT / family / f'{name}.png'
            recipe = {'atlas': f'assets/receipt-art/{family}.png', 'crop': [x, y, width, height],
                      'safeArea': 'Contained square with 24px transparent inset at 480px', 'decorative': True}
            filters = f'crop={width}:{height}:{x}:{y},scale=432:432:force_original_aspect_ratio=decrease,pad=480:480:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba'
            subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(SOURCE / f'{family}.png'),
                            '-vf', filters, '-frames:v', '1', str(target)], check=True)
            embed(target, records[family], recipe)
            recipes[f'{family}/{name}'] = recipe
    stock = OUT / 'receipt-stock.png'
    shutil.copy2(SOURCE / 'receipt-stock.png', stock)
    embed(stock, records['receipt-stock'], {'usage': 'nine-slice paper edge', 'slice': 60})
    (SOURCE / 'crops.json').write_text(json.dumps(recipes, indent=2) + '\n')
    print(f'Prepared {len(recipes)} transparent engravings and receipt stock.')

if __name__ == '__main__':
    main()
