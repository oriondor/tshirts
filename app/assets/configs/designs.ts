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

export interface PrerenderedDesign {
  id: string;
  merchandiseId: string;
  name: string;
  productId: string;
  description: string;
  price: number;
  colors: string[];
  placements: string[];
}

export interface OverlayDesign {
  id: string;
  merchandiseId: string;
  name: string;
  productId: string;
  description: string;
  price: number;
  images: Record<string, string>;
  imageProps?: Record<string, ImageProps>;
}

export type Design = PrerenderedDesign | OverlayDesign;

export function isPrerenderedDesign(
  design: Design,
): design is PrerenderedDesign {
  return "colors" in design;
}

export const designs: Record<string, Design[]> = {
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
      imageProps: {},
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
      colors: ["white", "black", "sand"],
      placements: ["front", "back"],
    },
  ],
  cup: [],
};
