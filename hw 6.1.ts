//Визначте інтерфейс, який використовує сигнатуру індексу з типами об'єднання. Наприклад, тип значення для кожного ключа може бути число | рядок.

interface IIndexA {
    [key: string]: string | number;
}

const exampleIndexA: IIndexA = {
  'A': 'A',
  'B': 2
};

interface IIndexB {
    [key: string]: string | number;
    [key: number]: string | number;
}

const exampleIndexB: IIndexB = {
  'A': 'A',
  2: 2,
  3: 'C'
};

//Створіть інтерфейс, у якому типи значень у сигнатурі індексу є функціями. Ключами можуть бути рядки, 
// а значеннями — функції, які приймають будь-які аргументи.

interface IFunctionA {
    [key: string]: (...args: any[]) => any; // будь-які аргументи та з будь-якою кількiстю
}

const exampleIFunctionA: IFunctionA = {
  'testF': (s) => s.trim()
};

//якщо потрібні аргументі певного типу чи тип значення, яке повертає функція, то змінюємо відповідний any на потрыбний тип або union

interface IFunctionB {
    [key: string]: (...args: (string | number)[]) => number; // будь-які аргументи та з будь-якою кількостю
}

//Опишіть інтерфейс, який використовує сигнатуру індексу для опису об'єкта, подібного до масиву. Ключі повинні бути числами, а значення - певного типу.

interface IArrayLike<T> {
  [index: number]: T;
  length: number;
}

const example: IArrayLike<string> = {
  0: 'A',
  1: 'B',
  length: 2
};

//Створіть інтерфейс з певними властивостями та індексною сигнатурою. 
//Наприклад, ви можете мати властивості типу name: string та індексну сигнатуру для додаткових динамічних властивостей.

interface IUser {
    readonly id: number;
    name: string;

    [key: string]: string | number;
}

const user1: IUser = {
    id: 1,
    name: 'Guest',
    role: 'guest'
};

//Створіть два інтерфейси, один з індексною сигнатурою, а інший розширює перший, додаючи специфічні властивості.

//розширимо попередній інтерфейс IUser
interface IAuthorizedUser extends IUser {
    email: string;
    age: number;
}

const user2: IAuthorizedUser = {
    id: 1,
    name: 'test manager',
    email: 'test@gmail.com',
    age: 33,
    level: 3
};

//Напишіть функцію, яка отримує об'єкт з індексною сигнатурою і перевіряє, 
//чи відповідають значення певних ключів певним критеріям (наприклад, чи всі значення є числами).


interface INumberTest {
  [key: number]: string | number;
}

function areAllNumbers(obj: INumberTest): boolean {
  return Object.values(obj).every(value => typeof value === "number");
}

function areSpecificKeysNumbers(obj: INumberTest, keys: number[]): boolean {
  return keys.every(key => typeof obj[key] === "number");
}

const numericValues: INumberTest = {
    0: 0,
    1: 1.1,
    2: 2
};

const mixedValues: INumberTest = {
    0: '0',
    1: 1.1,
    2: '2'
};

console.log(areAllNumbers(numericValues)); //true
console.log(areAllNumbers(mixedValues)); //false

console.log(areSpecificKeysNumbers(mixedValues, [1])); //true
console.log(areSpecificKeysNumbers(mixedValues, [0, 2])); //false
