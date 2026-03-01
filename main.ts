//Вам потрібно створити тип DeepReadonly який буде робити доступними 
// тільки для читання навіть властивості вкладених обʼєктів.

type DeepReadonly<T> =
  T extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
      : T;

type User1 = {
    id: number;
    name: string;
    option: { nickname: string;};
}

const readonlyUser: DeepReadonly<User1> = {
    id: 33,
    name: "test user",
    option: { nickname: "test" }
};

//Вам потрібно створити тип DeepRequireReadonly який буде робити доступними 
// тільки для читання навіть властивості вкладених обʼєктів та ще й робити їх обовʼязковими.

type DeepRequireReadonly<T> =
  T extends (infer U)[]
    ? ReadonlyArray<DeepRequireReadonly<U>>
    : T extends object
      ? { readonly [P in keyof T]-?: DeepRequireReadonly<T[P]> }
      : T;

type User2 = {
    id?: number;
    name?: string;
    option?: { nickname?: string; };
}

const requireReadonlyUser: DeepRequireReadonly<User2> = {
  id: 33,
  name: "test user",
  option: { nickname: "test" }
};

//Вам потрібно створити тип UpperCaseKeys, який буде приводити всі ключі до верхнього регістру.

type UpperCaseKeys<T> = {[K in keyof T as Uppercase<string & K>]: T[K];};

//І саме цікаве. Створіть тип ObjectToPropertyDescriptor, який перетворює звичайний обʼєкт на обʼєкт де кожне value є дескриптором.

type ObjectToPropertyDescriptor<T> = {
  [K in keyof T]: PropertyDescriptor & {value: T[K]; };
};