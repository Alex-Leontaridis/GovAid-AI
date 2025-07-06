import { ProblemSolution } from "./problem-solution";

function ProblemSolutionExample() {
  const problemFeatures = [
    "Each year, over $30 billion in public benefits go unclaimed by seniors alone, largely due to complex applications and lack of awareness",
    "Complex government forms and eligibility requirements",
    "Limited access to information about available programs",
    "Language barriers and technical difficulties",
    "Fear of making mistakes on applications"
  ];

  const solutionFeatures = [
    "AI-powered document analysis and eligibility assessment",
    "Simplified application guidance and step-by-step assistance",
    "Comprehensive database of government programs and benefits",
    "Multi-language support and accessibility features",
    "Real-time validation and error prevention"
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
          The Problem We're Solving
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Millions of Americans miss out on critical government assistance due to complex processes. 
          We're here to change that.
        </p>
      </div>
      
      <ProblemSolution
        problemTitle="Billions in Benefits Go Unclaimed"
        problemDescription="Every year, eligible individuals miss out on billions of dollars in government assistance due to complex application processes, lack of awareness, and overwhelming paperwork requirements."
        problemFeatures={problemFeatures}
        solutionTitle="AI-Powered Benefits Discovery"
        solutionDescription="GovAid AI helps users discover, understand, and apply for government benefits by breaking down complex requirements and offering personalized, step-by-step guidance. Our platform removes barriers and ensures that no eligible person is left behind."
        solutionFeatures={solutionFeatures}
      />
    </div>
  );
}

export { ProblemSolutionExample }; 