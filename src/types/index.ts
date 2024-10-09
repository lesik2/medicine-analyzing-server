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

export enum TYPES_OF_SHIFTS {
  FIRST_SHIFT = 'Первая смена',
  SECOND_SHIFT = 'Вторая смена',
  FULL_SHIFT = 'Полная смена',
}

export enum TIME_OF_SHIFTS {
  FIRST_SHIFT = '8.00 - 13.00',
  SECOND_SHIFT = '14.00 - 18.50',
  FULL_SHIFT = '8.00 - 17.00',
}

export enum Specialty {
  GENERAL_PRACTICE = 'Врач общей практики',
  OBSTETRICS = 'Врач-акушер-гинеколог',
  SURGERY = 'Врач-хирург',
  DENTISTRY = 'Врач-стоматолог',
  THERAPY = 'Врач-терапевт',
  OPHTHALMOLOGY = 'Врач-офтальмолог',
  PEDIATRICS = 'Врач-педиатр',
  CARDIOLOGY = 'Врач-кардиолог',
  NEUROLOGY = 'Врач-невролог',
  ENDOCRINOLOGY = 'Врач-эндокринолог',
  DERMATOLOGY = 'Врач-дерматолог',
  MENTAL_HEALTH = 'Врач-психиатр',
}

export enum Departments {
  GENERAL_PRACTICE = 'Кабинет общей практики',
  OBSTETRICS = 'Кабинет акушер-гинекологии',
  SURGERY = 'Кабинет хирургии',
  DENTISTRY = 'Кабинет стоматологии',
  THERAPY = 'Кабинет терапии',
  OPHTHALMOLOGY = 'Кабинет офтальмологии',
  PEDIATRICS = 'Кабинет педиатрии',
  CARDIOLOGY = 'Кабинет кардиологии',
  NEUROLOGY = 'Кабинет неврологии',
  ENDOCRINOLOGY = 'Кабинет эндокринологии',
  DERMATOLOGY = 'Кабинет дерматологии',
  MENTAL_HEALTH = 'Кабинет психиатрии',
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
