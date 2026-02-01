import { Composition, getInputProps } from "remotion";
import { MyComposition, VideoProps } from "./Composition";

// Default props for preview in Remotion Studio
const defaultProps: VideoProps = {
  mediaPath: "sample.jpg",
  mediaType: "image",
  title: "Your Title Here",
  subtitle: "Your subtitle text",
  textPosition: "bottom",
  textStyle: "bold",
  animation: "fade",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MediaVideo"
        component={MyComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
      {/* Short format for social media */}
      <Composition
        id="MediaVideoShort"
        component={MyComposition}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
      {/* Square format for Instagram */}
      <Composition
        id="MediaVideoSquare"
        component={MyComposition}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultProps}
      />
    </>
  );
};
