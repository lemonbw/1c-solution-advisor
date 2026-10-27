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
      if (rule.condition(answers)) this.applyEffect(rule.effect, scores, rule.description);
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
      scores["trade-kz"].score += answers["need_stock"] === "yes" ? 30 : 20;
      scores["trade-kz"].reasons.push("Оптовые продажи и работа с заказами клиентов");
    }
    
    if (businessTypes.includes("ecommerce") || (answers["channels"] as string[] || []).includes("online")) {
      scores["unf"].score += 15;
      scores["trade-kz"].score += 10;
    }
    if (answers["has_crm"] === "yes" || sales.includes("services")) {
      scores["unf"].score += 20;
      scores["unf"].reasons.push("Нужны управление клиентами, продажами или услугами в одной системе");
    }
    
    if (businessTypes.includes("catering") || businessTypes.includes("horeca") || answers["catering_process"] === "yes") {
      scores["unf"].score += 20;
      scores["unf"].reasons.push("Для общепита может подойти управление заказами, закупками и производством в УНФ; отраслевые требования нужно проверить");
    }
    
    if (answers["has_production"] === "yes" || businessTypes.includes("production")) {
      scores["complex"].score += 15;
      if (answers["production_complexity"] === "stages" || answers["production_complexity"] === "planning") scores["complex"].score += 20;
      if ((answers["branches"] as string) === "5+") {
        scores["complex"].score += 15;
      }
    }
    
    if (answers["need_payroll"] === "yes") {
      scores["zup-kz"].score += 35;
      if (answers["payroll_complexity"] === "yes") scores["zup-kz"].score += 10;
      scores["zup-kz"].reasons.push("Требуется расчёт зарплаты и кадровый учёт");
    }
    
    const users = answers["company_users"] as string;
    if (users === "21-50" || users === "50+") {
      scores["complex"].score += 10;
      scores["trade-kz"].score += 5;
    }
    if (answers["production_complexity"] === "planning" || (businessTypes.includes("production") && users === "50+")) {
      scores["erp-kz"].score += 35;
      scores["erp-kz"].reasons.push("Планирование сложного или масштабного производства — повод оценить ERP-класс");
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
    
    const insufficientData = dataGaps.length > 0 || sortedScores.length === 0;
    
    let needsCombination = false;
    let combinationReason: string | undefined;
    
    const selected: string[] = [];
    if ((sales.includes("retail") || businessTypes.includes("retail")) && answers["has_cash_sales"] === "yes") selected.push("retail-kz");
    if ((sales.includes("wholesale") || businessTypes.includes("wholesale")) && answers["need_stock"] === "yes") selected.push("trade-kz");
    if (answers["need_tax_kz"] === "yes") selected.push("buh-kz");
    if (answers["need_payroll"] === "yes") selected.push("zup-kz");

    if (selected.includes("retail-kz") && selected.includes("buh-kz")) {
      needsCombination = true;
      combinationReason = "Для кассовых продаж и регламентированного учёта подходят специализированная «Розница для Казахстана» и «Бухгалтерия для Казахстана». Их можно использовать совместно через обмен данными.";
    }
    if (selected.includes("trade-kz") && selected.includes("buh-kz")) {
      needsCombination = true;
      combinationReason = "Для оперативного управления оптовой торговлей и регламентированного учёта можно связать «Управление торговлей для Казахстана» и «Бухгалтерию для Казахстана».";
    }
    if (selected.includes("retail-kz") && selected.includes("trade-kz")) needsCombination = true;
    if (needsCombination && !combinationReason) {
      combinationReason = "Для разных участков бизнеса могут потребоваться отдельные решения. Совместимость и обмены данных нужно проверить при проектировании системы.";
    }
    if (!selected.length && answers["need_tax_kz"] === "no" && scores["unf"].score === 0 && (sales.includes("services") || answers["purchases"] === "yes")) {
      scores["unf"].score += 20;
      scores["unf"].reasons.push("УНФ стоит рассмотреть как единое решение для процессов малого бизнеса");
    }
    const fallbackScores = Object.values(scores).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
    const primaryIds = selected.length ? [...new Set(selected)] : fallbackScores.slice(0, 1).map(s => s.configId);
    if (primaryIds.length > 1) needsCombination = true;
    const primary = primaryIds.map(id => scores[id]).filter(Boolean);
    
    const result: RecommendationResult = {
      primary,
      additional: [],
      alternatives: allScores.filter(s => s.score > 5 && !primaryIds.includes(s.configId)).slice(0, 2),
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
