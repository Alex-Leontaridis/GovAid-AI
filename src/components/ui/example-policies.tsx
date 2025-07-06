import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";

interface PolicyExample {
  title: string;
  url: string;
  category: string;
  description: string;
}

interface ExamplePoliciesProps {
  onPolicySelect: (url: string) => void;
}

const policyExamples: PolicyExample[] = [
  {
    title: "Unemployment Benefits",
    url: "https://www.usa.gov/unemployment-benefits",
    category: "Employment",
    description: "Federal unemployment insurance program for workers who lose their jobs"
  },
  {
    title: "TANF (Welfare)",
    url: "https://www.benefits.gov/benefit/613",
    category: "Financial Aid",
    description: "Temporary Assistance for Needy Families program"
  },
  {
    title: "Social Security Benefits",
    url: "https://www.benefits.gov/benefit/4402",
    category: "Retirement",
    description: "General overview of Social Security retirement benefits"
  },
  {
    title: "SSDI and SSI for Disabilities",
    url: "https://www.benefits.gov/benefit/4412",
    category: "Disability",
    description: "Social Security Disability Insurance and Supplemental Security Income"
  },
  {
    title: "Flood Insurance (NFIP)",
    url: "https://www.benefits.gov/benefit/435",
    category: "Insurance",
    description: "National Flood Insurance Program for property protection"
  },
  {
    title: "Community Services Block Grant",
    url: "https://www.benefits.gov/benefit/825",
    category: "Community",
    description: "Federal funding for community action agencies"
  },
  {
    title: "American Opportunity Tax Credit",
    url: "https://www.irs.gov/credits-deductions/individuals/aotc",
    category: "Education",
    description: "Tax credit for qualified education expenses"
  },
  {
    title: "Lifetime Learning Credit",
    url: "https://www.irs.gov/credits-deductions/individuals/llc",
    category: "Education",
    description: "Tax credit for post-secondary education and training"
  },
  {
    title: "Education Credits Overview",
    url: "https://www.irs.gov/credits-deductions/individuals/education-credits-aotc-and-llc",
    category: "Education",
    description: "Comprehensive guide to education tax credits"
  },
  {
    title: "Education Credits Q&A",
    url: "https://www.irs.gov/help/ita/am-i-eligible-to-claim-an-education-credit",
    category: "Education",
    description: "Interactive tool to determine education credit eligibility"
  },
  {
    title: "Public Housing Program",
    url: "https://www.hud.gov/helping-americans/public-housing",
    category: "Housing",
    description: "Federal housing assistance for low-income families"
  },
  {
    title: "Housing Choice Voucher (Section 8)",
    url: "https://www.hud.gov/helping-americans/housing-choice-vouchers",
    category: "Housing",
    description: "Rental assistance program for low-income families"
  },
  {
    title: "Emergency Housing Vouchers",
    url: "https://www.hud.gov/helping-americans/housing-choice-vouchers-emergency",
    category: "Housing",
    description: "Emergency housing assistance for vulnerable populations"
  },
  {
    title: "Homeownership Program for Voucher Users",
    url: "https://www.hud.gov/helping-americans/public-indian-housing-hcv-homeownership",
    category: "Housing",
    description: "Program to help voucher holders become homeowners"
  },
  {
    title: "Fair Housing Assistance Program",
    url: "https://www.hud.gov/stat/fheo/assistance-program",
    category: "Housing",
    description: "Federal assistance for fair housing enforcement"
  }
];

// Function to get random policies (7-8 each time)
const getRandomPolicies = (count: number = 8): PolicyExample[] => {
  const shuffled = [...policyExamples].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 7); // Random between 7-8
};

const categoryColors: Record<string, string> = {
  "Employment": "bg-blue-100 text-blue-800",
  "Financial Aid": "bg-green-100 text-green-800",
  "Retirement": "bg-purple-100 text-purple-800",
  "Disability": "bg-orange-100 text-orange-800",
  "Insurance": "bg-red-100 text-red-800",
  "Community": "bg-teal-100 text-teal-800",
  "Education": "bg-indigo-100 text-indigo-800",
  "Housing": "bg-pink-100 text-pink-800"
};

export function ExamplePolicies({ onPolicySelect }: ExamplePoliciesProps) {
  const randomPolicies = getRandomPolicies();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-8"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Explore Example Policies
        </h3>
        <p className="text-sm text-gray-600">
          Click on any policy below to analyze it with GovAid AI
        </p>
      </div>

      <div className="grid gap-3">
        {randomPolicies.map((policy, index) => (
          <motion.div
            key={policy.url}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="group"
          >
            <Button
              variant="outline"
              className="w-full h-auto p-4 justify-between items-start hover:bg-gray-50 transition-all duration-200 group-hover:shadow-md"
              onClick={() => onPolicySelect(policy.url)}
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {policy.title}
                  </h4>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${categoryColors[policy.category] || "bg-gray-100 text-gray-800"}`}
                  >
                    {policy.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {policy.description}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <ExternalLink className="h-3 w-3" />
                  <span className="truncate">{policy.url}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 ml-3 flex-shrink-0" />
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          Policies are randomly selected each time. Refresh to see different examples.
        </p>
      </div>
    </motion.div>
  );
} 