import { describe, it, expect } from 'vitest';
import { engine } from '../src/engine/recommendation';

describe('Recommendation Engine', () => {
  it('should recommend Buhgalteriya for tax accounting in KZ', () => {
    const answers = {
      need_tax_kz: 'yes',
      company_form: 'ip',
      sales_type: ['services'],
      need_accounting: 'yes'
    };
    const result = engine.calculate(answers);
    expect(result.primary.length).toBeGreaterThan(0);
    const hasBuh = result.primary.some(p => p.configId === 'buh-kz');
    expect(hasBuh).toBe(true);
  });

  it('should recommend Retail for cash sales', () => {
    const answers = {
      sales_type: ['retail'],
      has_cash_sales: 'yes',
      need_tax_kz: 'yes',
      company_form: 'small'
    };
    const result = engine.calculate(answers);
    expect(result.needsCombination).toBe(true);
  });

  it('should recommend Catering for recipes', () => {
    const answers = {
      business_type: ['catering'],
      catering_process: 'yes',
      company_form: 'small',
      sales_type: ['services']
    };
    const result = engine.calculate(answers);
    const hasCatering = result.primary.some(p => p.configId === 'catering') || 
                        result.alternatives.some(a => a.configId === 'catering');
    expect(hasCatering).toBe(true);
  });

  it('should mark insufficient data when missing key info', () => {
    const answers = {
      company_form: 'small'
    };
    const result = engine.calculate(answers);
    expect(result.insufficientData).toBe(true);
    expect(result.dataGaps.length).toBeGreaterThan(0);
  });
});
