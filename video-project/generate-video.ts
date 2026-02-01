#!/usr/bin/env npx ts-node

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface VideoConfig {
  mediaPath: string;
  mediaType: "image" | "video";
  title: string;
  subtitle: string;
  textPosition: "top" | "center" | "bottom";
  textStyle: "minimal" | "bold" | "elegant";
  animation: "fade" | "slide" | "zoom" | "none";
  format: "landscape" | "portrait" | "square";
  duration: number;
}

function parsePrompt(prompt: string): Partial<VideoConfig> {
  const config: Partial<VideoConfig> = {};

  // Parse text position
  if (/\b(top|upper)\b/i.test(prompt)) {
    config.textPosition = "top";
  } else if (/\b(center|middle)\b/i.test(prompt)) {
    config.textPosition = "center";
  } else {
    config.textPosition = "bottom";
  }

  // Parse text style
  if (/\b(minimal|clean|simple)\b/i.test(prompt)) {
    config.textStyle = "minimal";
  } else if (/\b(elegant|fancy|serif)\b/i.test(prompt)) {
    config.textStyle = "elegant";
  } else {
    config.textStyle = "bold";
  }

  // Parse animation
  if (/\b(slide|sliding)\b/i.test(prompt)) {
    config.animation = "slide";
  } else if (/\b(zoom|ken burns)\b/i.test(prompt)) {
    config.animation = "zoom";
  } else if (/\b(no animation|static)\b/i.test(prompt)) {
    config.animation = "none";
  } else {
    config.animation = "fade";
  }

  // Parse format
  if (/\b(portrait|vertical|story|stories|tiktok|reel|reels|short)\b/i.test(prompt)) {
    config.format = "portrait";
  } else if (/\b(square|instagram)\b/i.test(prompt)) {
    config.format = "square";
  } else {
    config.format = "landscape";
  }

  // Parse duration (look for numbers followed by "seconds" or "s")
  const durationMatch = prompt.match(/(\d+)\s*(?:seconds?|s)\b/i);
  if (durationMatch) {
    config.duration = parseInt(durationMatch[1], 10);
  }

  // Extract title - look for quoted text or "title:" prefix
  const titleMatch = prompt.match(/(?:title[:\s]+)?["']([^"']+)["']/i) ||
                     prompt.match(/title[:\s]+([^,.\n]+)/i);
  if (titleMatch) {
    config.title = titleMatch[1].trim();
  }

  // Extract subtitle
  const subtitleMatch = prompt.match(/subtitle[:\s]+["']?([^"'\n,]+)["']?/i);
  if (subtitleMatch) {
    config.subtitle = subtitleMatch[1].trim();
  }

  return config;
}

function getMediaType(filePath: string): "image" | "video" {
  const ext = path.extname(filePath).toLowerCase();
  const videoExtensions = [".mp4", ".mov", ".webm", ".avi", ".mkv", ".m4v"];
  return videoExtensions.includes(ext) ? "video" : "image";
}

function getCompositionId(format: string): string {
  switch (format) {
    case "portrait":
      return "MediaVideoShort";
    case "square":
      return "MediaVideoSquare";
    default:
      return "MediaVideo";
  }
}

function printUsage() {
  console.log(`
Video Generator - Create videos from prompts and media files

USAGE:
  npx ts-node generate-video.ts --media <file> --prompt "<your prompt>"

OPTIONS:
  --media, -m     Path to image or video file (required)
  --prompt, -p    Text prompt describing the video (required)
  --output, -o    Output filename (default: output.mp4)
  --title, -t     Title text (overrides prompt parsing)
  --subtitle, -s  Subtitle text (overrides prompt parsing)
  --help, -h      Show this help message

PROMPT KEYWORDS:
  Position:   "top", "center", "bottom" (default)
  Style:      "minimal", "elegant", "bold" (default)
  Animation:  "fade" (default), "slide", "zoom", "static"
  Format:     "landscape" (default), "portrait/story/tiktok", "square/instagram"
  Duration:   "X seconds" (e.g., "5 seconds", "10s")

EXAMPLES:
  # Basic video with title
  npx ts-node generate-video.ts -m photo.jpg -p "title: Welcome to Our Store"

  # Instagram story with zoom effect
  npx ts-node generate-video.ts -m promo.mp4 -p "portrait zoom title: 'Summer Sale' subtitle: 'Up to 50% off'"

  # Clean minimal style
  npx ts-node generate-video.ts -m hero.jpg -p "minimal center 'Company Name' 10 seconds"
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    printUsage();
    process.exit(0);
  }

  // Parse arguments
  let mediaPath = "";
  let prompt = "";
  let outputPath = "out/output.mp4";
  let titleOverride = "";
  let subtitleOverride = "";

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--media":
      case "-m":
        mediaPath = args[++i];
        break;
      case "--prompt":
      case "-p":
        prompt = args[++i];
        break;
      case "--output":
      case "-o":
        outputPath = args[++i];
        break;
      case "--title":
      case "-t":
        titleOverride = args[++i];
        break;
      case "--subtitle":
      case "-s":
        subtitleOverride = args[++i];
        break;
    }
  }

  if (!mediaPath) {
    console.error("Error: --media is required");
    printUsage();
    process.exit(1);
  }

  if (!prompt) {
    console.error("Error: --prompt is required");
    printUsage();
    process.exit(1);
  }

  // Resolve media path
  const absoluteMediaPath = path.resolve(mediaPath);
  if (!fs.existsSync(absoluteMediaPath)) {
    console.error(`Error: Media file not found: ${absoluteMediaPath}`);
    process.exit(1);
  }

  // Copy media to public folder
  const publicDir = path.join(__dirname, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const mediaFilename = path.basename(absoluteMediaPath);
  const publicMediaPath = path.join(publicDir, mediaFilename);
  fs.copyFileSync(absoluteMediaPath, publicMediaPath);

  console.log(`Copied media to: ${publicMediaPath}`);

  // Parse prompt and build config
  const parsedConfig = parsePrompt(prompt);
  const mediaType = getMediaType(absoluteMediaPath);

  const config: VideoConfig = {
    mediaPath: mediaFilename,
    mediaType,
    title: titleOverride || parsedConfig.title || "",
    subtitle: subtitleOverride || parsedConfig.subtitle || "",
    textPosition: parsedConfig.textPosition || "bottom",
    textStyle: parsedConfig.textStyle || "bold",
    animation: parsedConfig.animation || "fade",
    format: parsedConfig.format || "landscape",
    duration: parsedConfig.duration || 5,
  };

  const compositionId = getCompositionId(config.format);
  const durationInFrames = config.duration * 30; // 30 fps

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Build input props JSON
  const inputProps = {
    mediaPath: config.mediaPath,
    mediaType: config.mediaType,
    title: config.title,
    subtitle: config.subtitle,
    textPosition: config.textPosition,
    textStyle: config.textStyle,
    animation: config.animation,
  };

  console.log("\nGenerating video with config:");
  console.log(JSON.stringify(inputProps, null, 2));
  console.log(`\nComposition: ${compositionId}`);
  console.log(`Duration: ${config.duration} seconds (${durationInFrames} frames)`);
  console.log(`Output: ${outputPath}\n`);

  // Run Remotion render
  const propsJson = JSON.stringify(inputProps).replace(/"/g, '\\"');
  const command = `npx remotion render ${compositionId} ${outputPath} --props "${propsJson}" --frames=0-${durationInFrames - 1}`;

  console.log("Running render...\n");

  try {
    execSync(command, { stdio: "inherit", cwd: __dirname });
    console.log(`\nVideo generated successfully: ${outputPath}`);
  } catch (error) {
    console.error("\nError rendering video:", error);
    process.exit(1);
  }
}

main();
