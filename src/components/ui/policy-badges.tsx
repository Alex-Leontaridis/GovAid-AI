import { Badge } from "./badge";

interface PolicyBadge {
  title: string;
  url: string;
}

interface PolicyBadgesProps {
  onSelect: (url: string) => void;
}

const policies: PolicyBadge[] = [
  { title: "Unemployment Benefits", url: "https://www.usa.gov/unemployment-benefits" },
  { title: "TANF (Welfare)", url: "https://www.benefits.gov/benefit/613" },
  { title: "Social Security", url: "https://www.benefits.gov/benefit/4402" },
  { title: "SSDI/SSI Disability", url: "https://www.benefits.gov/benefit/4412" },
  { title: "Flood Insurance (NFIP)", url: "https://www.benefits.gov/benefit/435" },
  { title: "AOTC Tax Credit", url: "https://www.irs.gov/credits-deductions/individuals/aotc" },
  { title: "Section 8 Vouchers", url: "https://www.hud.gov/helping-americans/housing-choice-vouchers" },
  { title: "Public Housing", url: "https://www.hud.gov/helping-americans/public-housing" },
  { title: "Community Block Grant", url: "https://www.benefits.gov/benefit/825" },
  { title: "Lifetime Learning Credit", url: "https://www.irs.gov/credits-deductions/individuals/llc" },
];

export function PolicyBadges({ onSelect }: PolicyBadgesProps) {
  // Pick 7-8 random policies each render
  const shuffled = [...policies].sort(() => 0.5 - Math.random());
  const shown = shuffled.slice(0, Math.floor(Math.random() * 2) + 7);

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {shown.map((policy) => (
        <button
          key={policy.url}
          type="button"
          onClick={() => onSelect(policy.url)}
          className="focus:outline-none"
        >
          <Badge
            variant="secondary"
            className="cursor-pointer px-3 py-2 text-sm hover:bg-primary/90 hover:text-white transition-colors"
          >
            {policy.title}
          </Badge>
        </button>
      ))}
    </div>
  );
} 