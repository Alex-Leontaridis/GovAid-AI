import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface FeatureItem {
  title: string;
  description: string;
}

interface FeatureProps {
  title: string;
  badge: string;
  description: string;
  features: FeatureItem[];
}

function Feature({ title, badge, description, features }: FeatureProps) {
  return (
    <div className="w-full py-8 lg:py-12">
      <div className="w-auto mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid border rounded-lg p-6 grid-cols-1 gap-6 items-center lg:grid-cols-2">
          <div className="flex gap-6 flex-col">
            <div className="flex gap-3 flex-col">
              <div>
                <Badge variant="outline">{badge}</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-2xl lg:text-3xl tracking-tighter max-w-xl text-left font-regular">
                  {title}
                </h2>
                <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
                  {description}
                </p>
              </div>
            </div>
            <div className="grid lg:pl-4 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-4">
              {features.map((feature, idx) => (
                <div className="flex flex-row gap-4 items-start" key={idx}>
                  <Check className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-muted rounded-md aspect-square"></div>
        </div>
      </div>
    </div>
  );
}

export { Feature };