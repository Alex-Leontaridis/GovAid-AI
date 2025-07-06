import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Cta4Props {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: string[];
}

const defaultItems = [
  "Easy Integration",
  "24/7 Support",
  "Customizable Design",
  "Scalable Performance",
  "Hundreds of Blocks",
];

export const Cta4 = ({
  title = "Call to Action",
  description = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto illo praesentium nisi, accusantium quae.",
  buttonText = "Get Started",
  buttonUrl = "https://shadcnblocks.com",
  items = defaultItems,
}: Cta4Props) => {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="max-w-4xl">
            <div className="text-center rounded-lg bg-muted px-6 py-10 lg:px-20 lg:py-16">
              <h4 className="mb-4 text-2xl font-bold md:text-3xl">{title}</h4>
              <p className="text-muted-foreground mb-6">{description}</p>
              <Button className="mb-8" asChild>
                <a href={buttonUrl} target="_blank">
                  {buttonText} <ArrowRight className="size-4" />
                </a>
              </Button>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                {items.map((item, idx) => (
                  <span key={idx} className="px-3 py-1 bg-background rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
