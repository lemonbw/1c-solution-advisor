import { ConfigScore, RecommendationResult, RuleEffect } from "../types";
import { configs } from "../data/configs";
import { rules } from "../data/rules";

export class RecommendationEngine {
  calculate(answers: Record<string, any>): RecommendationResult {
    const scores: Record<string, ConfigScore> = {};
    
    for (const config of configs) {
      scores[config.id] = {
        configId: config.id,
        score: 0,
        reasons: [],
        penalties: [],
        missingRequirements: [],
        confidence: 0
      };
    }
    
    for (const rule of rules) {
      if (rule.condition(answers)) {
        this.applyEffect(rule.effect, scores, rule.description);
      }
    }
    
    if (answers["need_tax_kz"] === "yes") {
      scores["buh-kz"].score += 35;
      scores["buh-kz"].reasons.push("Требуется налоговый учёт и отчётность в Казахстане");
    }
    
    const sales = answers["sales_type"] as string[] || [];
    const businessTypes = answers["business_type"] as string[] || [];
    
    if (sales.includes("retail") || businessTypes.includes("retail")) {
      scores["retail-kz"].score += answers["has_cash_sales"] === "yes" ? 30 : 15;
      if (answers["has_cash_sales"] === "yes") {
        scores["retail-kz"].reasons.push("Кассовые розничные продажи");
      }
    }
    
    if (sales.includes("wholesale") || businessTypes.includes("wholesale")) {
      scores["trade-kz"].score += answers["warehouses"] && answers["warehouses"] !== "0" ? 25 : 10;
      if (answers["warehouses"] && answers["warehouses"] !== "0") {
        scores["trade-kz"].reasons.push("Оптовые продажи со складским учётом");
      }
    }
    
    if (businessTypes.includes("ecommerce") || (answers["channels"] as string[] || []).includes("online")) {
      scores["unf"].score += 15;
      scores["trade-kz"].score += 10;
    }
    
    if (businessTypes.includes("catering") || businessTypes.includes("horeca") || answers["catering_process"] === "yes") {
      scores["catering"].score += 40;
      scores["catering"].reasons.push("Процессы общественного питания");
    }
    
    if (answers["has_production"] === "yes" || businessTypes.includes("production")) {
      scores["complex"].score += 15;
      if (answers["warehouses"] === "4+" || (answers["branches"] as string) === "5+") {
        scores["complex"].score += 15;
      }
    }
    
    if (answers["need_payroll"] === "yes") {
      scores["zup-kz"].score += 35;
      scores["zup-kz"].reasons.push("Требуется расчёт зарплаты и кадровый учёт");
    }
    
    const users = answers["company_users"] as string;
    if (users === "21-50" || users === "50+") {
      scores["complex"].score += 10;
      scores["trade-kz"].score += 5;
    }
    
    const legal = answers["legal_entities"] as string;
    if (legal === "2" || legal === "3+") {
      scores["buh-kz"].score += 10;
    }
    
    const branches = answers["branches"] as string;
    if (branches === "3-5" || branches === "5+") {
      scores["buh-kz"].score += 8;
      scores["trade-kz"].score += 10;
    }
    
    for (const configId of Object.keys(scores)) {
      const totalPossible = 100;
      scores[configId].confidence = Math.min(95, Math.round((scores[configId].score / totalPossible) * 100));
    }
    
    const sortedScores = Object.values(scores)
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);
    
    const allScores = Object.values(scores).sort((a, b) => b.score - a.score);
    
    const dataGaps: string[] = [];
    const toClarify: string[] = [];
    
    if (!answers["need_tax_kz"] || answers["need_tax_kz"] === "unsure") {
      dataGaps.push("Неясно требование по налоговому учёту в Казахстане");
      toClarify.push("Уточните, кто будет вести налоговый учёт и нужна ли регламентированная отчётность");
    }
    
    if (!answers["sales_type"] || (answers["sales_type"] as string[]).length === 0) {
      dataGaps.push("Не определён способ продаж");
      toClarify.push("Уточните каналы продаж (розница/опт/услуги)");
    }
    
    const insufficientData = dataGaps.length > 2 || sortedScores.length === 0;
    
    let needsCombination = false;
    let combinationReason: string | undefined;
    
    if ((sales.includes("retail") || businessTypes.includes("retail")) && answers["need_tax_kz"] === "yes" && 
        scores["retail-kz"].score > 15 && scores["buh-kz"].score > 15) {
      needsCombination = true;
      combinationReason = "Розничные продажи часто требуют связки «Розница для Казахстана» + «Бухгалтерия для Казахстана» для полного покрытия торговых и учётных процессов";
    }
    
    if ((sales.includes("wholesale") || businessTypes.includes("wholesale")) && answers["need_tax_kz"] === "yes" && 
        scores["trade-kz"].score > 15 && scores["buh-kz"].score > 15) {
      needsCombination = true;
      combinationReason = "Оптовая торговля требует связки «Управление торговлей для Казахстана» + «Бухгалтерия для Казахстана»";
    }
    
    if (businessTypes.includes("catering") && answers["need_tax_kz"] === "yes" && 
        scores["catering"].score > 15 && scores["buh-kz"].score > 10) {
      needsCombination = true;
      combinationReason = "Для предприятий общепита часто требуется связка «Общепит» + «Бухгалтерия для Казахстана»";
    }
    
    const result: RecommendationResult = {
      primary: sortedScores.slice(0, needsCombination && sortedScores.length >= 2 ? 2 : 1),
      additional: needsCombination ? [] : [],
      alternatives: allScores.filter(s => s.score > 5 && !sortedScores.slice(0, needsCombination ? 2 : 1).includes(s)).slice(0, 2),
      explanation: this.generateExplanation(sortedScores, needsCombination, combinationReason),
      needsCombination,
      combinationReason,
      insufficientData,
      dataGaps,
      toClarify
    };
    
    return result;
  }
  
  private applyEffect(effect: RuleEffect, scores: Record<string, ConfigScore>, description: string) {
    if (effect.addScore) {
      for (const [configId, score] of Object.entries(effect.addScore)) {
        if (scores[configId]) {
          scores[configId].score += score;
          scores[configId].reasons.push(description);
        }
      }
    }
    if (effect.penalty) {
      for (const [configId, penalty] of Object.entries(effect.penalty)) {
        if (scores[configId]) {
          scores[configId].score += penalty;
          scores[configId].penalties.push(description);
        }
      }
    }
  }
  
  private generateExplanation(sorted: ConfigScore[], needsCombination: boolean, reason?: string): string {
    if (sorted.length === 0) {
      return "Недостаточно информации для однозначной рекомендации. Необходимо уточнить ключевые параметры бизнеса.";
    }
    if (needsCombination && reason) {
      return reason;
    }
    const top = sorted[0];
    const config = configs.find(c => c.id === top.configId);
    return "Наиболее подходящим решением является \"" + config?.name + "\" исходя из указанных требований.";
  }
}

export const engine = new RecommendationEngine();
