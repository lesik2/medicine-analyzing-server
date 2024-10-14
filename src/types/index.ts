export enum Roles {
  USER = 'USER',
  DOCTOR = 'DOCTOR',
  MANAGER = 'MANAGER',
}

export enum TypeOfPatient {
  ADULT = 'Взрослый',
  CHILD = 'Детский',
}

export enum Gender {
  MALE = 'Мужской',
  FEMALE = 'Женский',
}

export enum TypesOfShifts {
  FIRST_SHIFT = 'Первая смена',
  SECOND_SHIFT = 'Вторая смена',
  FULL_SHIFT = 'Полная смена',
}

export enum Status {
  FILLED = 'Полный состав',
  PARTIALLY_FILLED = 'Один сотрудник',
  EMPTY = 'Нет сотрудников',
}

// export enum TIME_OF_SHIFTS {
//   FIRST_SHIFT = '8.00 - 13.00',
//   SECOND_SHIFT = '14.00 - 18.50',
//   FULL_SHIFT = '8.00 - 17.00',
// }

export enum Specialty {
  GENERAL_PRACTICE = 'Общая практика',
  OBSTETRICS = 'Акушерство и гинекология',
  SURGERY = 'Хирургия',
  DENTISTRY = 'Стоматология',
  THERAPY = 'Терапия',
  OPHTHALMOLOGY = 'Офтальмология',
  PEDIATRICS = 'Педиатрия',
  CARDIOLOGY = 'Кардиология',
  NEUROLOGY = 'Неврология',
  ENDOCRINOLOGY = 'Эндокринология',
  DERMATOLOGY = 'Дерматология',
  MENTAL_HEALTH = 'Психиатрия',
}

export enum AnalysisTypes {
  GENERAL_BLOOD_TEST = 'Общий анализ крови',
  VENOUS_BLOOD_TEST = 'Анализ крови из вены',
  URINALYSIS = 'Анализ мочи',
  STOOL_ANALYSIS = 'Анализ кала',
  BIOCHEMICAL_BLOOD_TEST = 'Биохимический анализ крови',
  HORMONAL_ANALYSIS = 'Гормональный анализ',
  ALLERGY_TEST = 'Тест на аллергию',
  BLOOD_SUGAR_TEST = 'Анализ на сахар в крови',
  CHOLESTEROL_TEST = 'Анализ на холестерин',
  INFECTIOUS_DISEASE_TEST = 'Тест на инфекционные заболевания',
  VITAMINS_MINERALS_TEST = 'Анализ на витамины и минералы',
  ECG = 'Электрокардиограмма (ЭКГ)',
  THYROID_FUNCTION_TEST = 'Анализ функции щитовидной железы',
}
