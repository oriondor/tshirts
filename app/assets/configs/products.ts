export const products = [
  {
    id: "t-shirt", // Never change it, it can break a db relation
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
