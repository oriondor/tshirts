export interface Headline {
  /** Matches image filename in /public/headlines/{id}.png */
  id: string;
  /** Optional click destination (internal route or external URL) */
  target?: string;
  active: boolean;
}

export const headlines: Headline[] = [
  {
    id: "main",
    active: true,
  },
];
