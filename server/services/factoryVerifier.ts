export interface VerificationEvidence {
  type: "keyword" | "certificate" | "visual" | "structure" | "business_model";
  score: number;
  details: string;
}

export interface VerificationResult {
  overallScore: number;
  confidence: "high" | "medium" | "low";
  evidence: VerificationEvidence[];
  isLikelyManufacturer: boolean;
  recommendations: string[];
}

const MANUFACTURER_KEYWORDS = [
  "manufacturer",
  "factory",
  "production line",
  "assembly",
  "OEM",
  "ODM",
  "fabrication",
  "machining",
  "casting",
  "molding",
  "welding",
  "stamping",
  "injection",
  "extrusion",
  "forging",
];

const TRADER_KEYWORDS = [
  "supplier",
  "distributor",
  "trading",
  "export",
  "import",
  "wholesale",
  "retailer",
  "agent",
  "reseller",
  "middleman",
  "broker",
  "representative",
];

const QUALITY_CERTIFICATES = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "CE",
  "FDA",
  "UL",
  "RoHS",
  "REACH",
  "GMP",
  "factory audit",
  "SGS",
  "TUV",
];

function analyzeKeywords(content: string, keywords: string[]): number {
  if (!content) return 0;

  const lowerContent = content.toLowerCase();
  const foundKeywords = keywords.filter(kw =>
    lowerContent.includes(kw.toLowerCase())
  );

  return Math.min(100, (foundKeywords.length / keywords.length) * 100);
}

function analyzeCertificates(content: string, certificates: string[]): number {
  if (!content) return 0;

  const lowerContent = content.toLowerCase();
  const foundCerts = certificates.filter(cert =>
    lowerContent.includes(cert.toLowerCase())
  );

  return Math.min(100, (foundCerts.length / certificates.length) * 100);
}

function analyzeStructure(content: string): number {
  if (!content) return 0;

  let score = 0;

  // Check for production-related sections
  if (
    content.includes("production capacity") ||
    content.includes("production process") ||
    content.includes("manufacturing process")
  ) {
    score += 25;
  }

  // Check for equipment mentions
  if (
    content.includes("equipment") ||
    content.includes("machinery") ||
    content.includes("machine")
  ) {
    score += 20;
  }

  // Check for facility information
  if (
    content.includes("facility") ||
    content.includes("factory") ||
    content.includes("workshop")
  ) {
    score += 20;
  }

  // Check for quality control
  if (
    content.includes("quality control") ||
    content.includes("QC") ||
    content.includes("inspection")
  ) {
    score += 20;
  }

  // Check for R&D
  if (
    content.includes("R&D") ||
    content.includes("research") ||
    content.includes("development")
  ) {
    score += 15;
  }

  return Math.min(100, score);
}

function analyzeBusinessModel(content: string): number {
  if (!content) return 0;

  let score = 0;

  // Check for MOQ (Minimum Order Quantity)
  if (content.includes("MOQ") || content.includes("minimum order")) {
    score += 30;
  }

  // Check for B2B focus
  if (
    content.includes("B2B") ||
    content.includes("wholesale") ||
    content.includes("bulk")
  ) {
    score += 25;
  }

  // Check for customization
  if (
    content.includes("customization") ||
    content.includes("custom") ||
    content.includes("OEM") ||
    content.includes("ODM")
  ) {
    score += 25;
  }

  // Check for lead time
  if (content.includes("lead time") || content.includes("delivery time")) {
    score += 20;
  }

  return Math.min(100, score);
}

function checkTraderRedFlags(content: string): string[] {
  const redFlags: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check for trader keywords
  const traderKeywordsFound = TRADER_KEYWORDS.filter(kw =>
    lowerContent.includes(kw.toLowerCase())
  );

  if (traderKeywordsFound.length > 3) {
    redFlags.push(
      `Found ${traderKeywordsFound.length} trader-related keywords`
    );
  }

  // Check for generic descriptions
  if (
    content.length < 200 ||
    content.includes("we supply") ||
    content.includes("we offer") ||
    content.includes("we provide")
  ) {
    redFlags.push("Generic description without specific manufacturing details");
  }

  // Check for lack of specificity
  if (!content.includes("production") && !content.includes("manufacturing")) {
    redFlags.push("No mention of production or manufacturing capabilities");
  }

  // Check for no certifications
  if (!analyzeCertificates(content, QUALITY_CERTIFICATES)) {
    redFlags.push("No quality certifications mentioned");
  }

  return redFlags;
}

export async function verifyManufacturer(
  companyName: string,
  websiteContent: string,
  yearsInBusiness?: number
): Promise<VerificationResult> {
  const evidence: VerificationEvidence[] = [];

  // 1. Keyword Analysis (30 points)
  const keywordScore = analyzeKeywords(websiteContent, MANUFACTURER_KEYWORDS);
  const traderKeywordScore = analyzeKeywords(websiteContent, TRADER_KEYWORDS);

  evidence.push({
    type: "keyword",
    score: Math.max(0, keywordScore - traderKeywordScore * 0.5),
    details: `Manufacturing keywords: ${keywordScore.toFixed(0)}%, Trader keywords: ${traderKeywordScore.toFixed(0)}%`,
  });

  // 2. Certificates (25 points)
  const certScore = analyzeCertificates(websiteContent, QUALITY_CERTIFICATES);
  evidence.push({
    type: "certificate",
    score: certScore,
    details: `Quality certifications detected: ${certScore.toFixed(0)}%`,
  });

  // 3. Website Structure (20 points)
  const structureScore = analyzeStructure(websiteContent);
  evidence.push({
    type: "structure",
    score: structureScore,
    details: `Manufacturing-like structure: ${structureScore.toFixed(0)}%`,
  });

  // 4. Business Model (15 points)
  const modelScore = analyzeBusinessModel(websiteContent);
  evidence.push({
    type: "business_model",
    score: modelScore,
    details: `B2B/MOQ indicators: ${modelScore.toFixed(0)}%`,
  });

  // 5. Years in Business (10 points)
  let yearsScore = 0;
  if (yearsInBusiness) {
    if (yearsInBusiness >= 10) {
      yearsScore = 100;
    } else if (yearsInBusiness >= 5) {
      yearsScore = 70;
    } else if (yearsInBusiness >= 2) {
      yearsScore = 40;
    } else {
      yearsScore = 10;
    }
  }

  evidence.push({
    type: "visual",
    score: yearsScore,
    details: `Years in business: ${yearsInBusiness || "Unknown"}`,
  });

  // Calculate overall score with weights
  const overallScore =
    keywordScore * 0.3 +
    certScore * 0.25 +
    structureScore * 0.2 +
    modelScore * 0.15 +
    yearsScore * 0.1;

  // Get red flags
  const redFlags = checkTraderRedFlags(websiteContent);

  // Determine confidence
  let confidence: "high" | "medium" | "low";
  if (overallScore > 75) {
    confidence = "high";
  } else if (overallScore > 50) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (certScore < 50) {
    recommendations.push("Request quality certifications (ISO 9001, CE, etc.)");
  }

  if (keywordScore < 50) {
    recommendations.push("Ask for detailed production process information");
  }

  if (modelScore < 50) {
    recommendations.push("Request MOQ and lead time information");
  }

  if (redFlags.length > 0) {
    recommendations.push(
      "Verify company background and request factory photos"
    );
  }

  return {
    overallScore: Math.round(overallScore),
    confidence,
    evidence,
    isLikelyManufacturer: overallScore > 60,
    recommendations,
  };
}

export async function batchVerifyManufacturers(
  companies: Array<{ name: string; content: string; yearsInBusiness?: number }>
): Promise<Array<{ name: string; result: VerificationResult }>> {
  return Promise.all(
    companies.map(async company => ({
      name: company.name,
      result: await verifyManufacturer(
        company.name,
        company.content,
        company.yearsInBusiness
      ),
    }))
  );
}
