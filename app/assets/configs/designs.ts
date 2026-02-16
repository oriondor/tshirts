export interface ImageProps {
  overlayThreshold?: number;
  topMargin?: string;
  leftMargin?: string;
  baseImage?: string;
}

export const defaultImageProps: Required<ImageProps> = {
  overlayThreshold: 0.4,
  topMargin: "35%",
  leftMargin: "30%",
};

export const designs = {
  "designer-custom-t-shirt": [
    {
      id: "personalised-person",
      merchandiseId: "52399291203912",
      name: "Personalised t-shirt with person",
      productId: "designer-custom-t-shirt",
      description:
        "This is a T-shirt that has a person printed on it. You can change how it looks if you want.",
      price: 29.99,
      images: { Blue: "Blue.png", Pink: "Pink.png" },
      imageProps: {
        // Uses defaults
      },
    },
  ],
  "known-prints-t-shirt": [
    {
      id: "flying-cats",
      merchandiseId: "52399291203912",
      name: "Japanese style beware of cats t-shirt",
      productId: "known-prints-t-shirt",
      description:
        "Eventually, someone noticed that cats here don't just walk — they launch. 🐈💨\n" +
        "What started as a real warning turned into a charming joke: beware of flying cats dropping in from walls and rooftops.\n" +
        "Only in Japan does even a caution sign feel this cute and chaotic.",
      price: 29.99,
      images: { Original: "cats.png", Back: "cats.png" },
      imageProps: {
        Original: {
          overlayThreshold: 0.46,
          topMargin: "38%",
          leftMargin: "27%",
        },
        Back: {
          overlayThreshold: 0.42,
          topMargin: "36%",
          leftMargin: "31.5%",
          baseImage: "back.png",
        },
      },
    },
  ],
  cup: [],
} as const;
