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
    {
      id: "champignon",
      merchandiseId: "52399291203912",
      name: "Champignon",
      productId: "known-prints-t-shirt",
      description:
        "Some legends are born from greatness. Others… from mushrooms. 🍄\n" +
        "This design proudly celebrates the most unexpected champion of them all — the champignon.\n" +
        "Part parody, part culinary glory, it’s a tribute to anyone who knows that sometimes the real winners grow quietly in the forest.",
      price: 29.99,
      colors: ["white", "black", "chocolate", "natural"],
      placements: ["front"],
    },
    {
      id: "chopsticks",
      merchandiseId: "52399291203912",
      name: "Chopsticks",
      productId: "known-prints-t-shirt",
      description:
        "Two sticks. Infinite skill ceiling. 🥢\n" +
        "A minimal homage to one of humanity's most elegant inventions — the chopstick.\n" +
        "Whether you're a seasoned pro or someone who still secretly wants a fork, this design is for anyone who respects the craft.",
      price: 29.99,
      colors: ["black"],
      placements: ["front", "back"],
    },
    {
      id: "sushi_chopsticks",
      merchandiseId: "52399291203912",
      name: "Sushi & Chopsticks",
      productId: "known-prints-t-shirt",
      description:
        "The ultimate power couple. 🍣🥢\n" +
        "Raw fish, precision rice, and two wooden sticks that somehow make it all work.\n" +
        "A love letter to Japan's greatest export — worn by those who know the difference between a California roll and the real thing.",
      price: 29.99,
      colors: ["fgreen", "maroon", "purple"],
      placements: ["front", "back"],
    },
    {
      id: "sakura",
      merchandiseId: "52399291203912",
      name: "Sakura",
      productId: "known-prints-t-shirt",
      description:
        "Cherry blossoms, cherry blossoms,\n" +
        "In fields and villages\n" +
        "As far as you can see.\n" +
        "Is it a mist, or clouds?\n" +
        "Fragrant in the morning sun.\n" +
        "Cherry blossoms, cherry blossoms,\n" +
        "Flowers in full bloom.",
      price: 29.99,
      colors: ["white", "lblue", "charcoal", "lpink"],
      placements: ["front", "back"],
    },
  ],
  cup: [],
};
