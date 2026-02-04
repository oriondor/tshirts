export const products = [
  {
    id: "designer-custom-t-shirt", // Never change it, it can break a db relation
    name: "Designer custom T-Shirt",
    description:
      "Select from one or more predefined designs to create your personalized t-shirt",
    image: "/products/designer-custom-t-shirt.png",
    basePrice: 29.99,
    available: true,
    properties: [
      {
        name: "design-color",
        component: "DesignColor",
        label: "Design color",
      },
      {
        name: "size",
        component: "SwitchSelect",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        label: "Size",
      },
      {
        name: "product-color",
        component: "SwitchSelect",
        options: ["White", "Black", "Grey"],
        label: "T-shirt color",
      },
      {
        id: "name",
        name: "name",
        component: "Input",
        label: "Name",
        placeholder: "Main name on the t-shirt",
      },
      {
        name: "secondary",
        component: "Input",
        label: "Secondary text (optional)",
        placeholder: "Happy anniversary, you stink, etc.",
      },
      {
        id: "files",
        name: "files",
        component: "FilesUpload",
        label: "Upload files",
      },
      {
        name: "request",
        component: "Textarea",
        label: "Special request to designer (optional)",
        placeholder: "Can you adjust the brightness for the second picture...",
      },
    ],
  },
  {
    id: "known-prints-t-shirt", // Never change it, it can break a db relation
    name: "Awesome prints T-Shirt",
    description: "Check out our cool prints",
    image: "/products/known-prints-t-shirt.png",
    basePrice: 29.99,
    available: true,
    properties: [
      {
        name: "design-color",
        component: "DesignColor",
        label: "Design color",
      },
      {
        name: "size",
        component: "SwitchSelect",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        label: "Size",
      },
      {
        name: "product-color",
        component: "SwitchSelect",
        options: ["White", "Black", "Grey"],
        label: "T-shirt color",
      },
    ],
  },
  {
    id: "cup",
    name: "Cup",
    description: "Sample desriotipn",
    image: "/products/cup.png",
    basePrice: 15,
    available: true,
    properties: [],
  },
] as const;
