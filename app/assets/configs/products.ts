export const products = [
  {
    id: "t-shirt",
    name: "T-Shirt",
    description: "Sample description",
    image: "/products/t-shirt.png",
    basePrice: 30,
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
        options: ["xs", "s", "m", "l", "xl", "xxl"],
        label: "Size",
      },
      {
        name: "t-shirt-color",
        component: "SwitchSelect",
        options: ["white", "black", "grey"],
        label: "T-shirt color",
      },
      {
        name: "name",
        component: "Input",
        label: "Name",
      },
      {
        name: "secondary",
        component: "Input",
        label: "Secondary text (optional)",
      },
      {
        name: "files",
        component: "FilesUpload",
        label: "Upload files",
      },
      {
        name: "request",
        component: "Textarea",
        label: "Special request to designer",
        placeholder: "Can you adjust the brightness for the second picture...",
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
