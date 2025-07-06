import { Footer as ShadcnFooter } from "@/components/ui/footer"
import { Icons } from "@/components/ui/icons"

export const Footer = () => {
  const logo = (
    <img 
      src="/assets/logo.png" 
      alt="GovAid AI" 
      className="h-12 w-auto"
    />
  )

  const socialLinks = [
    {
      icon: <Icons.linkedin className="h-4 w-4" />,
      href: "https://www.linkedin.com/in/alex-leontaridis-23894b32a/",
      label: "LinkedIn"
    },
    {
      icon: <Icons.gitHub className="h-4 w-4" />,
      href: "https://github.com/govaid-ai",
      label: "GitHub"
    }
  ]

  const mainLinks = [
    {
      href: "/",
      label: "Home"
    },
    {
      href: "/analyze",
      label: "Analyze"
    },
    {
      href: "/upload",
      label: "Upload"
    },
    {
      href: "/qa",
      label: "Q&A"
    }
  ]

  const legalLinks = [
    {
      href: "/privacy",
      label: "Privacy Policy"
    },
    {
      href: "/terms",
      label: "Terms of Service"
    },
    {
      href: "/contact",
      label: "Contact"
    }
  ]

  const copyright = {
    text: "© 2025 GovAid AI. All rights reserved.",
    license: "Empowering government document analysis with AI"
  }

  return (
    <ShadcnFooter
      logo={logo}
      brandName=""
      socialLinks={socialLinks}
      mainLinks={mainLinks}
      legalLinks={legalLinks}
      copyright={copyright}
    />
  )
}
