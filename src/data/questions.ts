import { Question } from '../types';

export const questions: Question[] = [
  // А. Общая информация
  {
    id: 'business_type',
    block: 'Общая информация о бизнесе',
    text: 'Чем занимается компания?',
    type: 'multiple',
    required: true,
    options: [
      { value: 'retail', label: 'Розничная торговля' },
      { value: 'wholesale', label: 'Оптовая торговля' },
      { value: 'ecommerce', label: 'Интернет-торговля/e-commerce' },
      { value: 'services', label: 'Услуги' },
      { value: 'production', label: 'Производство' },
      { value: 'catering', label: 'Общественное питание' },
      { value: 'logistics', label: 'Логистика/доставка' },
      { value: 'construction', label: 'Строительство/подряд' },
      { value: 'medicine', label: 'Медицина/аптека (потребуется отраслевое решение)' },
      { value: 'education', label: 'Образование (потребуется отраслевое решение)' },
      { value: 'horeca', label: 'HoReCa (гостиницы/рестораны/кафе)' },
      { value: 'agriculture', label: 'Сельское хозяйство' },
      { value: 'mixed', label: 'Смешанная деятельность' },
      { value: 'other', label: 'Другое' }
    ]
  },
  {
    id: 'company_form',
    block: 'Общая информация о бизнесе',
    text: 'Каков масштаб бизнеса?',
    type: 'single',
    required: true,
    options: [
      { value: 'ip', label: 'ИП' },
      { value: 'small', label: 'Небольшая компания' },
      { value: 'medium', label: 'Средний бизнес' },
      { value: 'large', label: 'Крупная компания' }
    ]
  },
  {
    id: 'company_users',
    block: 'Общая информация о бизнесе',
    text: 'Сколько пользователей планируется одновременно работать в 1С (примерное количество)?',
    type: 'single',
    required: true,
    options: [
      { value: '1', label: '1 пользователь' },
      { value: '2-5', label: '2-5 пользователей' },
      { value: '6-10', label: '6-10 пользователей' },
      { value: '11-20', label: '11-20 пользователей' },
      { value: '21-50', label: '21-50 пользователей' },
      { value: '50+', label: 'Более 50 пользователей' }
    ]
  },
  // Б. Бухгалтерский учёт
  {
    id: 'legal_entities',
    block: 'Общая информация о бизнесе',
    text: 'Сколько юридических лиц (ТОО/ИП и др.)?',
    type: 'single',
    required: true,
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3+', label: 'Более 2' }
    ]
  },
  {
    id: 'branches',
    block: 'Общая информация о бизнесе',
    text: 'Есть ли филиалы, обособленные подразделения или торговые точки?',
    type: 'single',
    required: true,
    options: [
      { value: '0', label: 'Только головной офис/основное место' },
      { value: '1-2', label: '1-2 филиала/точки' },
      { value: '3-5', label: '3-5 филиалов/точек' },
      { value: '5+', label: 'Более 5 филиалов/точек' }
    ]
  },
  {
    id: 'need_tax_kz',
    block: 'Бухгалтерский и налоговый учёт',
    text: 'Нужно ли вести бухгалтерский/налоговый учёт и сдавать обязательную отчётность по правилам Казахстана?',
    type: 'single',
    required: true,
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' },
      { value: 'unsure', label: 'Не знаю' }
    ]
  },
  // В. Продажи
  {
    id: 'sales_type',
    block: 'Продажи',
    text: 'Как компания продаёт?',
    type: 'multiple',
    required: true,
    options: [
      { value: 'retail', label: 'Розничные продажи' },
      { value: 'wholesale', label: 'Оптовые продажи' },
      { value: 'services', label: 'Услуги' },
      { value: 'custom', label: 'Производство под заказ' },
      { value: 'mixed', label: 'Смешанная модель' }
    ]
  },
  {
    id: 'has_cash_sales',
    block: 'Продажи',
    text: 'Есть ли кассовые продажи?',
    type: 'single',
    required: true,
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' }
    ]
  },
  // Г. Склад и закупки
  {
    id: 'has_crm',
    block: 'Продажи',
    text: 'Нужны ли CRM-функции (работа с лидами, клиентами, сделками)?',
    type: 'single',
    required: false,
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' },
      { value: 'unsure', label: 'Не знаю' }
    ]
  },
  {
    id: 'channels',
    block: 'Продажи',
    text: 'Через какие каналы планируете продавать?',
    type: 'multiple',
    required: false,
    options: [
      { value: 'offline', label: 'Офлайн/торговый зал' },
      { value: 'online', label: 'Интернет-магазин' },
      { value: 'marketplace', label: 'Маркетплейсы' },
      { value: 'b2b', label: 'B2B-продажи' },
      { value: 'social', label: 'Соцсети/мессенджеры' }
    ]
  },
  {
    id: 'need_stock',
    block: 'Склад и закупки',
    text: 'Нужно ли учитывать остатки товаров и материалов на складе?',
    type: 'single',
    required: true,
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' }
    ]
  },
  {
    id: 'purchases',
    block: 'Склад и закупки',
    text: 'Есть ли закупки у поставщиков?',
    type: 'single',
    required: true,
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' }
    ]
  },
  {
    id: 'warehouse_count',
    block: 'Склад и закупки',
    text: 'Сколько складов или точек хранения нужно учитывать?',
    type: 'single',
    required: false,
    options: [
      { value: 'one', label: 'Один' },
      { value: 'few', label: '2–5' },
      { value: 'many', label: 'Более 5' },
      { value: 'unknown', label: 'Пока не знаю' }
    ],
    showIf: (answers) => answers['need_stock'] === 'yes'
  },
  // Д. Производство и общепит
  {
    id: 'has_production',
    block: 'Производство и общественное питание',
    text: 'Есть ли собственное производство (изготовление продукции/блюд)?',
    type: 'single',
    required: false,
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' }
    ],
    showIf: (answers) => {
      const types = answers['business_type'] as string[] || [];
      return types.includes('production') || types.includes('catering') || types.includes('mixed');
    }
  },
  {
    id: 'production_complexity',
    block: 'Производство и общественное питание',
    text: 'Насколько сложное производство нужно учитывать?',
    type: 'single',
    required: false,
    options: [
      { value: 'simple', label: 'Простое: выпуск по рецепту или спецификации' },
      { value: 'stages', label: 'Несколько этапов, участков или цехов' },
      { value: 'planning', label: 'Нужно планировать загрузку и потребности производства' },
      { value: 'unknown', label: 'Пока не знаю' }
    ],
    showIf: (answers) => answers['has_production'] === 'yes' || (answers['business_type'] as string[] || []).includes('production')
  },
  {
    id: 'catering_process',
    block: 'Производство и общественное питание',
    text: 'Требуются ли рецептуры, списание ингредиентов и калькуляция себестоимости?',
    type: 'single',
    required: false,
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' }
    ],
    showIf: (answers) => {
      const types = answers['business_type'] as string[] || [];
      return types.includes('catering') || types.includes('mixed');
    }
  },
  // Е. Кадры и зарплата
  {
    id: 'need_payroll',
    block: 'Кадры и зарплата',
    text: 'Нужно ли рассчитывать зарплату?',
    type: 'single',
    required: true,
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' }
    ]
  },
  {
    id: 'payroll_complexity',
    block: 'Кадры и зарплата',
    text: 'Нужны ли сложные кадровые процессы (графики, смены, несколько подразделений, штатное расписание)?',
    type: 'single',
    required: false,
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет, нужен только базовый расчёт' },
      { value: 'unknown', label: 'Не знаю' }
    ],
    showIf: (answers) => answers['need_payroll'] === 'yes'
  },
  // З. Текущие системы
  {
    id: 'integrations',
    block: 'Текущие системы и ограничения',
    text: 'Нужны ли интеграции с чем-либо?',
    type: 'multiple',
    required: false,
    options: [
      { value: 'cash', label: 'Кассовое оборудование/ККМ' },
      { value: 'site', label: 'Сайт/интернет-магазин' },
      { value: 'marketplace', label: 'Маркетплейсы' },
      { value: 'edo', label: 'ЭДО' },
      { value: 'bank', label: 'Интеграция с банком' },
      { value: 'other', label: 'Другое' }
    ]
  },
  {
    id: 'budget',
    block: 'Текущие системы и ограничения',
    text: 'Ограничения по бюджету?',
    type: 'single',
    required: false,
    options: [
      { value: 'minimal', label: 'Минимальный (только необходимый минимум)' },
      { value: 'medium', label: 'Средний' },
      { value: 'flexible', label: 'Гибкий' },
      { value: 'unknown', label: 'Пока не определён' }
    ]
  },
  {
    id: 'growth',
    block: 'Текущие системы и ограничения',
    text: 'Планируется ли рост компании в ближайшие 1-2 года?',
    type: 'single',
    required: false,
    options: [
      { value: 'yes', label: 'Да, активный рост' },
      { value: 'maybe', label: 'Возможно' },
      { value: 'no', label: 'Нет, стабильность' }
    ]
  },
  {
    id: 'priority',
    block: 'Текущие системы и ограничения',
    text: 'Что важнее?',
    type: 'single',
    required: true,
    options: [
      { value: 'cost', label: 'Минимальная стоимость' },
      { value: 'simplicity', label: 'Простота использования' },
      { value: 'coverage', label: 'Охват процессов' },
      { value: 'expansion', label: 'Возможность расширения' }
    ]
  }
];
