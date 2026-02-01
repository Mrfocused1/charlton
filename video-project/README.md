# Video Generator

Generate videos from prompts and media files using Remotion.

## Quick Start

```bash
# Install dependencies
npm install

# Generate a video from a prompt
npm run generate -- --media photo.jpg --prompt "title: 'Hello World'"
```

## Usage

### Generate Video from Prompt

```bash
npm run generate -- --media <file> --prompt "<your prompt>"
```

**Options:**
- `--media, -m` - Path to image or video file (required)
- `--prompt, -p` - Text prompt describing the video (required)
- `--output, -o` - Output filename (default: out/output.mp4)
- `--title, -t` - Title text (overrides prompt parsing)
- `--subtitle, -s` - Subtitle text (overrides prompt parsing)

### Prompt Keywords

The prompt parser understands natural language. Include these keywords:

| Category | Keywords | Default |
|----------|----------|---------|
| **Position** | `top`, `center`, `bottom` | bottom |
| **Style** | `minimal`, `elegant`, `bold` | bold |
| **Animation** | `fade`, `slide`, `zoom`, `static` | fade |
| **Format** | `landscape`, `portrait`/`story`/`tiktok`, `square`/`instagram` | landscape |
| **Duration** | `X seconds` (e.g., "5 seconds", "10s") | 5 seconds |

### Examples

**Basic video with title:**
```bash
npm run generate -- -m photo.jpg -p "title: 'Welcome to Our Store'"
```

**Instagram story with zoom effect:**
```bash
npm run generate -- -m promo.mp4 -p "portrait zoom title: 'Summer Sale' subtitle: 'Up to 50% off'"
```

**Clean minimal centered text:**
```bash
npm run generate -- -m hero.jpg -p "minimal center 'Company Name' 10 seconds"
```

**TikTok/Reels format:**
```bash
npm run generate -- -m video.mp4 -p "tiktok slide title: 'Check this out!' 15 seconds"
```

**Elegant style with no animation:**
```bash
npm run generate -- -m background.jpg -p "elegant static top title: 'Announcement' subtitle: 'Important news'"
```

## Video Formats

| Composition | Dimensions | Use Case |
|-------------|------------|----------|
| MediaVideo | 1920x1080 | YouTube, standard video |
| MediaVideoShort | 1080x1920 | TikTok, Reels, Stories |
| MediaVideoSquare | 1080x1080 | Instagram feed |

## Development

**Start Remotion Studio** (visual editor):
```bash
npm run dev
```

**Render directly** (without prompt):
```bash
npx remotion render MediaVideo out/video.mp4 --props '{"mediaPath":"photo.jpg","mediaType":"image","title":"Hello"}'
```

## Supported Media Types

**Images:** .jpg, .jpeg, .png, .gif, .webp, .bmp, .svg

**Videos:** .mp4, .mov, .webm, .avi, .mkv, .m4v

## Output

Videos are rendered to the `out/` folder by default. The output format is MP4 (H.264).
