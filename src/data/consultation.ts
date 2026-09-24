export type RequirementType = "1bhk" | "2bhk" | "3bhk" | "other";
export type PriceType = "30-40" | "40-50" | "50-60" | "60+";
export type StageType = "rtmi" | "under_construction" | "resell" | "nearing_possession";

export interface RequirementOption {
  id: RequirementType;
  label: string;
  sub?: string;
}

export interface PriceOption {
  id: PriceType;
  label: string;
}

export interface StageOption {
  id: StageType;
  label: string;
  tag: string;
}

export const REQUIREMENTS: RequirementOption[] = [
  { id: "1bhk", label: "1 BHK" },
  { id: "2bhk", label: "2 BHK" },
  { id: "3bhk", label: "3 BHK" },
  { id: "other", label: "Others" },
];

export const PRICE_RANGES: PriceOption[] = [
  { id: "30-40", label: "₹30 - 40 Lakhs" },
  { id: "40-50", label: "₹40 - 50 Lakhs" },
  { id: "50-60", label: "₹50 - 60 Lakhs" },
  { id: "60+", label: "₹60+ Lakhs" },
];

export const PROPERTY_STAGES: StageOption[] = [
  { id: "rtmi", label: "RTMI", tag: "Ready to Move" },
  { id: "under_construction", label: "Under Construction", tag: "High ROI" },
  { id: "resell", label: "Resale", tag: "Prime Locality" },
  { id: "nearing_possession", label: "Nearing Possession", tag: "Within Months" },
];

export function createConsultationWhatsAppUrl({
  fullName,
  phone,
  selectedRequirement,
  selectedPrice,
  selectedStage,
  source = "Website",
}: {
  fullName: string;
  phone: string;
  selectedRequirement?: RequirementType | "";
  selectedPrice?: PriceType | "";
  selectedStage?: StageType | "";
  source?: string;
}): string {
  const reqObj = REQUIREMENTS.find((r) => r.id === selectedRequirement);
  const priceObj = PRICE_RANGES.find((p) => p.id === selectedPrice);
  const stageObj = PROPERTY_STAGES.find((s) => s.id === selectedStage);

  const message = `*The PM Properties Consultation Booking* (${source})
👤 Name: ${fullName}
📞 Phone: ${phone}
🏠 Requirement: ${reqObj ? reqObj.label : "Not specified"}
💰 Budget: ${priceObj ? priceObj.label : "Not specified"}
🏗️ Stage: ${stageObj ? `${stageObj.label} (${stageObj.tag})` : "Not specified"}

Please connect with me for available options and site visit details.`;

  return `https://wa.me/919029923246?text=${encodeURIComponent(message)}`;
}
