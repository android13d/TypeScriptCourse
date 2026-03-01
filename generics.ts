
// 1. Написати узагальнену функцію updateProperty, яка не мутує оригінальний об'єкт,
// а повертає його нову копію з оновленим значенням для конкретного ключа. Функція повинна приймати:
//    * Об'єкт типу T
//    * Ключ цього об'єкта
//    * Нове значення, тип якого повинен строго відповідати типу властивості за цим ключем

function updateProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return {...obj, [key]: value};
}

//перевірка
type User {
  id: number;
  name: string;
}

const user: User = {
  id: 33,
  name: 'test user'
};

console.log(updateProperty(user, 'name', 'admin'));
console.log(user);

// 2. Створіть систему обробки аналітики, яка включає в себе:
//    * Тип EventName = 'click' | 'scroll' | 'purchase'.
//    * Інтерфейс EventPayloads, який описує структуру даних для кожної події
//      (наприклад, для click — { x: number, y: number }, для scroll — { offset: number }, для purchase — { itemId: string, amount: number }).
//    * Узагальненний клас AnalyticsTracker де перший параметр обмежений типом EventName,
//      а другий залежить від першого і відповідає структурі з EventPayloads.
//    * Клас повинен мати метод track(eventName, payload): void.


type EventName = 'click' | 'scroll' | 'purchase';

interface EventPayloads {
  click:    { x: number; y: number };
  scroll:   { offset: number };
  purchase: { itemId: string, amount: number };
}

class AnalyticsTracker<E extends EventName, P extends EventPayloads[E] = EventPayloads[E]> {
  track(eventName: E, payload: P): void {
    console.log(eventName + ' -> ', payload);
  }
}


// 3. Вам дістався клас FormProcessor, який створив розробник-початківець. Він намагався зробити клас універсальним,
//    але припустився критичних помилок:
//    * використав небезпечне обмеження extends any
//    * затінив параметр типу у методі
//    * повністю втратив типобезпеку при оновленні полів

class FormProcessorExample<T extends object> {
  public data: any;

  constructor(data: T) {
    this.data = data;
  }

  public updateField<T>(key: string, value: any): void {
    this.data[key] = value;
  }
}

// Ваше завдання провести рефакторинг:
//  1. Виправте оголошення класу. T має бути обмежений об'єктом. Також додайте значення за замовчуванням: якщо тип не передано,
//     нехай це буде порожній об'єкт.
//  2. Перепишіть сигнатуру методу updateField. Він не повинен затінювати параметр класу.
//  3. Також метод updateField повинен приймати лише існуючі ключі з data та сумісні з ними значення.

class FormProcessor<T extends any> {
  public data: T;

  constructor(data: T) {
    this.data = data;
  }

  public updateField<K extends keyof T>(key: K, value: T[K]): void {
    this.data[key] = value;
  }
}