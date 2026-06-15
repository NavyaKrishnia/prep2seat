export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export const CATEGORIES = ["GEN", "OBC-NCL", "SC", "ST", "EWS"] as const;
export type Category = (typeof CATEGORIES)[number];

export const PLAN_DETAILS = {
  basic: {
    name: "Basic",
    price: 999,
    priceLabel: "₹999",
    features: [
      "1 personalised preference list by expert (Round 1)",
      "Excel download of your list",
      "Community counselling session (Round 1) via WhatsApp",
    ],
  },
  pro: {
    name: "Pro",
    price: 2999,
    priceLabel: "₹2999",
    features: [
      "Personalised lists for every counselling round",
      "1-on-1 expert counselling session",
      "Priority WhatsApp support across all rounds",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLAN_DETAILS;

export const DUMMY_COLLEGES = [
  { name: "Maulana Azad Medical College", state: "Delhi", estd: 1958, bond: "₹10,00,000" },
  { name: "Lady Hardinge Medical College", state: "Delhi", estd: 1916, bond: "₹10,00,000" },
  { name: "Grant Medical College", state: "Maharashtra", estd: 1845, bond: "₹20,00,000" },
  { name: "Bangalore Medical College", state: "Karnataka", estd: 1955, bond: "₹25,00,000" },
  { name: "Madras Medical College", state: "Tamil Nadu", estd: 1835, bond: "₹10,00,000" },
];
