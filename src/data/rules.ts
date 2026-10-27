import { Rule } from '../types';

export const rules: Rule[] = [
  {
    id: 'tax_kz_accounting',
    description: 'Требуется налоговый учёт и отчётность в РК',
    condition: (answers) => answers['need_tax_kz'] === 'yes',
    effect: {
      addScore: { 'buh-kz': 40 },
      require: { 'buh-kz': ['Наличие регламентированного учёта в РК'] }
    }
  },
  {
    id: 'cash_sales_retail',
    description: 'Кассовые розничные продажи',
    condition: (answers) => {
      const sales = answers['sales_type'] as string[] || [];
      return answers['has_cash_sales'] === 'yes' && sales.includes('retail');
    },
    effect: {
      addScore: { 'retail-kz': 35 }
    }
  },
  {
    id: 'wholesale_trade',
    description: 'Оптовые продажи с заказами',
    condition: (answers) => {
      const sales = answers['sales_type'] as string[] || [];
      return sales.includes('wholesale') && answers['need_stock'] === 'yes';
    },
    effect: {
      addScore: { 'trade-kz': 20 }
    }
  },
  {
    id: 'catering_recipes',
    description: 'Общепит с рецептами и калькуляцией',
    condition: (answers) => answers['catering_process'] === 'yes',
    effect: {
      addScore: { 'unf': 15 }
    }
  },
  {
    id: 'payroll_zup',
    description: 'Расчёт зарплаты',
    condition: (answers) => answers['need_payroll'] === 'yes',
    effect: {
      addScore: { 'zup-kz': 30 }
    }
  },
  {
    id: 'small_business_unf',
    description: 'Малый бизнес нуждается во всём в одном решении',
    condition: (answers) => {
      const form = answers['company_form'];
      const sales = answers['sales_type'] as string[] || [];
      return (form === 'ip' || form === 'small') && 
             sales.includes('services') && 
             answers['has_crm'] === 'yes';
    },
    effect: {
      addScore: { 'unf': 25 }
    }
  },
  {
    id: 'complex_processes',
    description: 'Сложные комплексные процессы',
    condition: (answers) => {
      const form = answers['company_form'];
      const sales = answers['sales_type'] as string[] || [];
      return (form === 'medium' || form === 'large') && 
             sales.includes('wholesale') && 
             answers['has_production'] === 'yes' &&
             answers['branches'] === '5+';
    },
    effect: {
      addScore: { 'complex': 40 }
    }
  },
  {
    id: 'buh_complement_retail',
    description: 'Розница обычно нуждается в бухгалтерии',
    condition: (answers) => {
      const sales = answers['sales_type'] as string[] || [];
      return sales.includes('retail') && answers['need_tax_kz'] === 'yes';
    },
    effect: {
      addScore: { 'buh-kz': 15 }
    }
  }
];
