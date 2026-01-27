/**
 * IFROF Supplier Risk Calculation Algorithm
 * متخصصة في تقييم المورّدين الصينيين
 */

export interface SupplierAssessment {
  supplierId: string;
  supplierName: string;
  assessmentDate: Date;
  scores: {
    legalStructure: number; // 0-10
    location: number; // 0-10
    workforce: number; // 0-10
    technicalKnowledge: number; // 0-10
    customization: number; // 0-10
    pricing: number; // 0-10
    credentials: number; // 0-10
    communication: number; // 0-10
    productQuality: number; // 0-10
    deliveryReliability: number; // 0-10
    certifications: number; // 0-10
    innovation: number; // 0-10
    transparency: number; // 0-10
  };
  redFlags: string[];
  greenFlags: string[];
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  classification: "FACTORY" | "TRADING" | "MIXED";
  overallScore: number;
  recommendation: string;
}

export interface RiskMetrics {
  totalScore: number;
  riskPercentage: number;
  trustScore: number;
  factoryLikelihood: number;
  recommendations: string[];
}

/**
 * حساب درجة المخاطر الإجمالية
 */
export function calculateRiskMetrics(
  assessment: SupplierAssessment
): RiskMetrics {
  const scores = Object.values(assessment.scores);
  const totalScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // حساب نسبة المخاطر (معكوس الثقة)
  const riskPercentage = 100 - totalScore * 10;

  // حساب درجة الثقة (0-100)
  const trustScore = totalScore * 10;

  // احتمالية أن تكون مصنع حقيقي (بناءً على المعايير)
  const factoryLikelihood = calculateFactoryLikelihood(assessment);

  // توليد التوصيات
  const recommendations = generateRecommendations(assessment, totalScore);

  return {
    totalScore,
    riskPercentage,
    trustScore,
    factoryLikelihood,
    recommendations,
  };
}

/**
 * حساب احتمالية أن يكون المورّد مصنع حقيقي
 */
function calculateFactoryLikelihood(assessment: SupplierAssessment): number {
  const factoryIndicators = [
    assessment.scores.legalStructure,
    assessment.scores.location,
    assessment.scores.workforce,
    assessment.scores.technicalKnowledge,
    assessment.scores.customization,
    assessment.scores.credentials,
    assessment.scores.innovation,
  ];

  const tradingIndicators = [
    assessment.scores.pricing,
    assessment.scores.communication,
    assessment.scores.deliveryReliability,
  ];

  const factoryScore =
    factoryIndicators.reduce((a, b) => a + b, 0) / factoryIndicators.length;
  const tradingScore =
    tradingIndicators.reduce((a, b) => a + b, 0) / tradingIndicators.length;

  // إذا كان factoryScore أعلى بكثير = مصنع حقيقي
  const likelihood = (factoryScore / (factoryScore + tradingScore)) * 100;

  return Math.round(likelihood);
}

/**
 * تصنيف المورّد (Factory / Trading / Mixed)
 */
export function classifySupplier(
  assessment: SupplierAssessment
): "FACTORY" | "TRADING" | "MIXED" {
  const metrics = calculateRiskMetrics(assessment);
  const factoryLikelihood = metrics.factoryLikelihood;

  if (factoryLikelihood >= 75) return "FACTORY";
  if (factoryLikelihood <= 40) return "TRADING";
  return "MIXED";
}

/**
 * تحديد مستوى المخاطر
 */
export function determineRiskLevel(
  riskPercentage: number,
  redFlagsCount: number,
  classification: string
): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  // Critical: أكثر من 70% مخاطر أو 5+ علامات تحذير
  if (riskPercentage > 70 || redFlagsCount >= 5) return "CRITICAL";

  // High: 50-70% مخاطر أو 3-4 علامات تحذير
  if (riskPercentage > 50 || redFlagsCount >= 3) return "HIGH";

  // Medium: 30-50% مخاطر أو 1-2 علامات تحذير
  if (riskPercentage > 30 || redFlagsCount >= 1) return "MEDIUM";

  // Low: أقل من 30% مخاطر
  return "LOW";
}

/**
 * توليد التوصيات بناءً على التقييم
 */
function generateRecommendations(
  assessment: SupplierAssessment,
  totalScore: number
): string[] {
  const recommendations: string[] = [];

  // توصيات بناءً على المخاطر
  if (assessment.riskLevel === "CRITICAL") {
    recommendations.push(
      "⛔ لا ننصح بالتعامل مع هذا المورّد - مخاطر عالية جداً"
    );
    recommendations.push("🔍 يحتاج تحقق إضافي قبل أي تعامل");
  }

  if (assessment.riskLevel === "HIGH") {
    recommendations.push("⚠️ احذر - قد يكون وسيط وليس مصنع");
    recommendations.push("📞 اطلب فيديو حي للمصنع قبل الطلب");
  }

  // توصيات بناءً على التصنيف
  if (assessment.classification === "FACTORY") {
    recommendations.push("✅ يبدو مصنع حقيقي - يمكن التعامل");
    recommendations.push("💰 يمكن التفاوض على أسعار أفضل");
  }

  if (assessment.classification === "TRADING") {
    recommendations.push("❌ هذا وسيط وليس مصنع - تجنب");
    recommendations.push("🏭 ابحث عن مصنع مباشر آخر");
  }

  // توصيات بناءً على نقاط الضعف
  if (assessment.scores.credentials < 5) {
    recommendations.push("📋 اطلب شهادات ISO والتراخيص الرسمية");
  }

  if (assessment.scores.technicalKnowledge < 5) {
    recommendations.push("🤔 اطرح أسئلة فنية أكثر للتحقق من الخبرة");
  }

  if (assessment.scores.customization < 5) {
    recommendations.push("🎨 تحقق من قدرتهم على التخصيص");
  }

  // توصيات بناءً على العلامات الإيجابية
  if (assessment.greenFlags.length >= 5) {
    recommendations.push("🎯 علامات إيجابية قوية - موثوق");
  }

  return recommendations;
}

/**
 * حساب درجة كل معيار بناءً على البيانات المدخلة
 */
export function calculateCriterionScore(
  criterionName: string,
  data: Record<string, any>
): number {
  switch (criterionName) {
    case "legalStructure":
      return calculateLegalStructureScore(data);
    case "location":
      return calculateLocationScore(data);
    case "workforce":
      return calculateWorkforceScore(data);
    case "technicalKnowledge":
      return calculateTechnicalKnowledgeScore(data);
    case "customization":
      return calculateCustomizationScore(data);
    case "pricing":
      return calculatePricingScore(data);
    case "credentials":
      return calculateCredentialsScore(data);
    case "communication":
      return calculateCommunicationScore(data);
    case "productQuality":
      return calculateProductQualityScore(data);
    case "deliveryReliability":
      return calculateDeliveryReliabilityScore(data);
    case "certifications":
      return calculateCertificationsScore(data);
    case "innovation":
      return calculateInnovationScore(data);
    case "transparency":
      return calculateTransparencyScore(data);
    default:
      return 0;
  }
}

// دوال حساب كل معيار
function calculateLegalStructureScore(data: Record<string, any>): number {
  let score = 0;
  if (data.hasManufacturingLicense) score += 3;
  if (data.businessScope === "manufacturing") score += 3;
  if (data.yearsInBusiness > 5) score += 2;
  if (data.hasRDDepartment) score += 2;
  return Math.min(score, 10);
}

function calculateLocationScore(data: Record<string, any>): number {
  let score = 0;
  if (data.isInIndustrialZone) score += 4;
  if (data.hasFactoryPhotos) score += 3;
  if (data.hasGoogleMapsVerification) score += 2;
  if (data.hasSatelliteImagery) score += 1;
  return Math.min(score, 10);
}

function calculateWorkforceScore(data: Record<string, any>): number {
  let score = 0;
  if (data.employeeCount > 50) score += 3;
  if (data.hasProductionDepartment) score += 2;
  if (data.hasQCDepartment) score += 2;
  if (data.hasHeavyEquipment) score += 2;
  if (data.hasRDTeam) score += 1;
  return Math.min(score, 10);
}

function calculateTechnicalKnowledgeScore(data: Record<string, any>): number {
  let score = 0;
  if (data.responseTime < 2) score += 3; // < 2 hours
  if (data.answerAccuracy >= 8) score += 3;
  if (data.canAnswerTechnicalQuestions) score += 2;
  if (data.hasMaterialExpertise) score += 2;
  return Math.min(score, 10);
}

function calculateCustomizationScore(data: Record<string, any>): number {
  let score = 0;
  if (data.canCustomizeProducts) score += 3;
  if (data.moqForCustomization <= 500) score += 2;
  if (data.canChangeColors) score += 2;
  if (data.canChangeMaterials) score += 2;
  if (data.canChangeSizes) score += 1;
  return Math.min(score, 10);
}

function calculatePricingScore(data: Record<string, any>): number {
  let score = 0;
  if (data.priceCompetitiveness >= 7) score += 3;
  if (data.moq <= 300) score += 2;
  if (data.hasBulkDiscount) score += 2;
  if (data.paymentTermsFlexibility >= 7) score += 2;
  if (data.priceTransparency >= 8) score += 1;
  return Math.min(score, 10);
}

function calculateCredentialsScore(data: Record<string, any>): number {
  let score = 0;
  if (data.hasISO9001) score += 3;
  if (data.hasManufacturingLicense) score += 2;
  if (data.hasProductCertificates) score += 2;
  if (data.hasEnvironmentalCertification) score += 2;
  if (data.hasIndustryCertifications) score += 1;
  return Math.min(score, 10);
}

function calculateCommunicationScore(data: Record<string, any>): number {
  let score = 0;
  if (data.responseTime < 2) score += 3;
  if (data.communicationLanguage === "english") score += 2;
  if (data.hasMultipleContactChannels) score += 2;
  if (data.professionalCommunication >= 8) score += 2;
  if (data.clarityOfInformation >= 8) score += 1;
  return Math.min(score, 10);
}

function calculateProductQualityScore(data: Record<string, any>): number {
  let score = 0;
  if (data.qualityRating >= 8) score += 3;
  if (data.defectRate < 2) score += 2;
  if (data.hasQCProcess) score += 2;
  if (data.offersWarranty) score += 2;
  if (data.hasQualityFeedback >= 8) score += 1;
  return Math.min(score, 10);
}

function calculateDeliveryReliabilityScore(data: Record<string, any>): number {
  let score = 0;
  if (data.onTimeDeliveryRate >= 95) score += 3;
  if (data.leadTime <= 30) score += 2;
  if (data.hasTrackingSystem) score += 2;
  if (data.hasWarehouse) score += 2;
  if (data.deliveryReliability >= 8) score += 1;
  return Math.min(score, 10);
}

function calculateCertificationsScore(data: Record<string, any>): number {
  let score = 0;
  const certCount = (data.certifications || []).length;
  if (certCount >= 5) score += 3;
  else if (certCount >= 3) score += 2;
  else if (certCount >= 1) score += 1;

  if (data.hasValidCertificates) score += 2;
  if (data.certificatesVerified) score += 2;
  if (data.recentCertifications) score += 2;
  return Math.min(score, 10);
}

function calculateInnovationScore(data: Record<string, any>): number {
  let score = 0;
  if (data.hasPatents) score += 3;
  if (data.hasRDDepartment) score += 2;
  if (data.investsInTechnology) score += 2;
  if (data.hasNewProductDevelopment) score += 2;
  if (data.innovationRating >= 7) score += 1;
  return Math.min(score, 10);
}

function calculateTransparencyScore(data: Record<string, any>): number {
  let score = 0;
  if (data.sharesFactoryPhotos) score += 2;
  if (data.sharesFactoryVideo) score += 2;
  if (data.providesDetailedInfo) score += 2;
  if (data.transparentPricing) score += 2;
  if (data.willowsVisits) score += 2;
  return Math.min(score, 10);
}

/**
 * إنشاء ملخص التقييم
 */
export function generateAssessmentSummary(
  assessment: SupplierAssessment
): string {
  const metrics = calculateRiskMetrics(assessment);

  return `
IFROF Supplier Assessment Report
================================

Supplier: ${assessment.supplierName}
Assessment Date: ${assessment.assessmentDate.toLocaleDateString("ar-SA")}

Classification: ${assessment.classification}
Risk Level: ${assessment.riskLevel}
Overall Score: ${metrics.trustScore.toFixed(1)}/100
Risk Percentage: ${metrics.riskPercentage.toFixed(1)}%
Factory Likelihood: ${metrics.factoryLikelihood}%

Recommendation:
${assessment.recommendation}

Green Flags (${assessment.greenFlags.length}):
${assessment.greenFlags.map(flag => `✅ ${flag}`).join("\n")}

Red Flags (${assessment.redFlags.length}):
${assessment.redFlags.map(flag => `❌ ${flag}`).join("\n")}

Recommendations:
${metrics.recommendations.map(rec => `• ${rec}`).join("\n")}
  `;
}
