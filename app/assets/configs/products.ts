export const products = [
  {
    id: "designer-custom-t-shirt", // Never change it, it can break a db relation
    name: "Designer custom T-Shirt",
    description:
      "Select from one or more predefined designs to create your personalized t-shirt",
    basePrice: 29.99,
    available: true,
    properties: [
      {
        name: "variant",
        component: "Variant",
        label: "Variant",
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
    basePrice: 29.99,
    available: true,
    properties: [
      {
        name: "placement",
        component: "Placement",
        label: "Side",
      },
      {
        name: "product-color",
        component: "Color",
        label: "T-shirt color",
      },
      {
        name: "size",
        component: "SwitchSelect",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        label: "Size",
      },
    ],
  },
  {
    id: "cup",
    name: "Cup",
    description: "Sample desriotipn",
    basePrice: 15,
    available: true,
    properties: [],
  },
] as const;
