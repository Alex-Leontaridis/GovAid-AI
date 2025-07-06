"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  heading = "Analyzing Government Aid Policies from America's Most Trusted Agencies",
  logos = [
    {
      id: "logo-1",
      description: "Government Aid Agency 1",
      image: "/gov_logos/logo.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-2",
      description: "Government Aid Agency 2",
      image: "/gov_logos/logo2.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-3",
      description: "Government Aid Agency 3",
      image: "/gov_logos/logo3.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-5",
      description: "Government Aid Agency 5",
      image: "/gov_logos/logo5.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-6",
      description: "Government Aid Agency 6",
      image: "/gov_logos/logo6.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-7",
      description: "Government Aid Agency 7",
      image: "/gov_logos/logo7.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-8",
      description: "Government Aid Agency 8",
      image: "/gov_logos/logo8.png",
      className: "h-8 w-auto",
    },
  ],
}: Logos3Props) => {
  return (
    <section className="py-16 animate-fade-in">
      <div className="container flex flex-col items-center text-center animate-fade-in-up">
        <h2 className="my-4 text-base text-gray-500 font-normal">
          {heading}
        </h2>
      </div>
      <div className="pt-6 md:pt-8 lg:pt-10 animate-fade-in-up-delayed">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true })]}
          >
            <CarouselContent
              className="ml-0"
            >
              {[...logos, ...logos, ...logos].map((logo, idx) => (
                <CarouselItem
                  key={logo.id + '-' + idx}
                  className="flex basis-1/3 justify-center items-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <img
                    src={logo.image}
                    alt={logo.description}
                    className="h-12 w-32 object-contain mx-auto transition-all duration-300 hover:scale-110 hover:brightness-110 animate-fade-in-scale"
                    style={{
                      animationDelay: `${idx * 0.1}s`
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent animate-fade-in-delayed" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent animate-fade-in-delayed" />
        </div>
      </div>
    </section>
  );
};

export { Logos3 };
