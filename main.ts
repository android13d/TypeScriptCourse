// 1. У вас є типи Car, Truck та об'єднання Vehicle. Напишіть функцію getVehicleCapacity(vehicle: Vehicle): string,
// яка робить звуження типу за дискримінантом kind та повертає спецефічне повідомлення про навантаження.
// Реалізуйте вичерпну перевірку за допомогою функції. Додайте до об'єднання новий тип Motorcycle, щоб переконатися,
// що ваша функція "впаде" з помилкою на етапі компіляції.

interface Car {
  kind: 'car';
  passengers: number;
}

interface Truck {
  kind: 'truck';
  cargoWeight: number;
}

 interface Motorcycle {
   kind: 'motorcycle';
   hasSidecar: boolean;
 }

type Vehicle = Car | Truck | Motorcycle;

function getVehicleCapacity(vehicle: Vehicle): string {
  switch (vehicle.kind) {
    case 'car':
      return `Car: ${vehicle.passengers} passengers`;

    case 'truck':
      return `Truck: capacity ${vehicle.cargoWeight} kg`;

 //   case 'motorcycle':
 //     return `Motorcycle${vehicle.hasSidecar ? ' with sidecar' : ' without sidecar'}`;
 //
    default:
      const _exhaustiveCheck: never = vehicle;
      throw new Error(`Невідомий тип транспортного засобу: ${(_exhaustiveCheck as any).kind}`);
  }
}

// 2. Ви отримуєте повідомлення через WebSocket, яке має тип unknown. Реалізуйте функцію-захисник типу isChatMessage,
// яка перевіряє, чи відповідає отриманий об'єкт інтерфейсу ChatMessage. Використовуйте різні оператори
// для безпечної перевірки.

interface ChatMessage {
  text: string;
  authorId: number;
}

function isChatMessage(data: unknown): boolean {
  return (
    //base validation
    typeof data === 'object' && data !== null
    //'text' param validation
    && 'text' in data && typeof data.text === 'string'
    //'authorId' param validation
    && 'authorId' in data && typeof data.authorId === 'number'
  );
}

function processMessage(data: unknown): void {
  if (isChatMessage(data)) {
    const safeData = data as ChatMessage;//wo error
    console.info(`User ${safeData.authorId} says: "${safeData.text.toUpperCase()}"`);
  } else {
    console.error('Invalid format');
  }
}

// 3. Тип RouteHandlers вимагає, щоб значенням маршруту була строка (назва компонента) або об'єкт із функцією action.
// Створіть об'єкт appRoutes із маршрутами home (string) та login (об'єкт із методом action).
// Оголосіть його так, щоб компілятор перевірив відповідність типу RouteHandlers, але водночас зберіг точну структуру об'єкта.
// Переконайтеся, що виклик appRoutes.login.action() не викликає помилки.

type RouteHandlers = {
  [routePath: string]: string | { action: () => void };
};

const appRoutes = {
  home: "homePage" as const,

  login: {
    action: () => {
      console.log('login');
    }
  }
} as const satisfies RouteHandlers;

appRoutes.home;
appRoutes.login.action();