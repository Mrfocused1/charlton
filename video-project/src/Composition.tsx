import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";

export interface VideoProps {
  mediaPath: string;
  mediaType: "image" | "video";
  title?: string;
  subtitle?: string;
  textPosition?: "top" | "center" | "bottom";
  textStyle?: "minimal" | "bold" | "elegant";
  animation?: "fade" | "slide" | "zoom" | "none";
}

export const MyComposition: React.FC<VideoProps> = ({
  mediaPath,
  mediaType,
  title = "",
  subtitle = "",
  textPosition = "bottom",
  textStyle = "bold",
  animation = "fade",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Animation calculations
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
    }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  const slideY = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const scale = interpolate(frame, [0, 60], [1.1, 1], {
    extrapolateRight: "clamp",
  });

  // Text position styles
  const getTextPositionStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      left: 0,
      right: 0,
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };

    switch (textPosition) {
      case "top":
        return { ...base, top: 0 };
      case "center":
        return { ...base, top: "50%", transform: "translateY(-50%)" };
      case "bottom":
      default:
        return { ...base, bottom: 0 };
    }
  };

  // Text style presets
  const getTextStyles = (): {
    title: React.CSSProperties;
    subtitle: React.CSSProperties;
  } => {
    const baseTitle: React.CSSProperties = {
      color: "white",
      textAlign: "center",
      margin: 0,
      textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
    };

    const baseSubtitle: React.CSSProperties = {
      color: "rgba(255,255,255,0.9)",
      textAlign: "center",
      margin: "10px 0 0 0",
      textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
    };

    switch (textStyle) {
      case "minimal":
        return {
          title: { ...baseTitle, fontSize: 48, fontWeight: 300, fontFamily: "Arial, sans-serif" },
          subtitle: { ...baseSubtitle, fontSize: 24, fontWeight: 300, fontFamily: "Arial, sans-serif" },
        };
      case "elegant":
        return {
          title: { ...baseTitle, fontSize: 56, fontWeight: 400, fontFamily: "Georgia, serif", fontStyle: "italic" },
          subtitle: { ...baseSubtitle, fontSize: 28, fontWeight: 400, fontFamily: "Georgia, serif" },
        };
      case "bold":
      default:
        return {
          title: { ...baseTitle, fontSize: 64, fontWeight: 700, fontFamily: "Arial Black, sans-serif" },
          subtitle: { ...baseSubtitle, fontSize: 32, fontWeight: 500, fontFamily: "Arial, sans-serif" },
        };
    }
  };

  // Animation styles for text
  const getAnimationStyle = (): React.CSSProperties => {
    switch (animation) {
      case "slide":
        return {
          opacity: 1,
          transform: `translateY(${interpolate(slideY, [0, 1], [50, 0])}px)`,
        };
      case "zoom":
        return {
          opacity: fadeIn,
          transform: `scale(${interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: "clamp" })})`,
        };
      case "none":
        return { opacity: 1 };
      case "fade":
      default:
        return { opacity };
    }
  };

  const textStyles = getTextStyles();

  // Determine if media path is a URL or static file reference
  const resolvedMediaPath = mediaPath.startsWith("http") || mediaPath.startsWith("/")
    ? mediaPath
    : staticFile(mediaPath);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Media Layer */}
      <AbsoluteFill
        style={{
          transform: animation === "zoom" ? `scale(${scale})` : undefined,
        }}
      >
        {mediaType === "video" ? (
          <OffthreadVideo
            src={resolvedMediaPath}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Img
            src={resolvedMediaPath}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </AbsoluteFill>

      {/* Gradient Overlay for text readability */}
      {(title || subtitle) && (
        <AbsoluteFill
          style={{
            background:
              textPosition === "bottom"
                ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)"
                : textPosition === "top"
                ? "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 50%)"
                : "rgba(0,0,0,0.3)",
          }}
        />
      )}

      {/* Text Layer */}
      {(title || subtitle) && (
        <div style={{ ...getTextPositionStyle(), ...getAnimationStyle() }}>
          {title && <h1 style={textStyles.title}>{title}</h1>}
          {subtitle && <p style={textStyles.subtitle}>{subtitle}</p>}
        </div>
      )}
    </AbsoluteFill>
  );
};
