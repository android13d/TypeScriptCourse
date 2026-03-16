/* Вам треба створити додаток для управління нотатками, використовуючи принципи ООП, патерн DTO та декоратори.

1. Нотатки
Кожна нотатка має містити:
- ідентифікатор
- назву
- зміст
- дату створення
- дату редагування
- статус
- тип

Нотатки бувають двох типів (використовуйте наслідування):
- Дефолтні.
- Такі, що вимагають підтвердження при редагуванні та видалинні

2. У списку нотаток повинні бути методи для:
- Додавання нового запису.
- Видалення запису за ідентифікатором.
- Редагування запису.
- Отримання повної інформації про нотатку за ідентифікатором.
- Позначення нотатки як "виконаної".
- Отримання статистики: скільки всього нотаток у списку і скільки залишилося невиконаними.
- У списку повинна бути можливість пошуку нотатки за ім'ям або змістом.
- Додайте можливість сортування нотаток за статусом виконання або за часом створення.

3. Робота з даними
Уявіть, що дані надходять до вашого списку із зовнішнього API. Всі вхідні дані приходять у форматі snake_case.
Внутрішня бізнес-логіка вашого додатку та класи повинні суворо використовувати camelCase.

Типізуйте механізм, який автоматично трансформує ключі об'єктів зі snake_case у camelCase при отриманні даних, та навпаки — при поверненні результату клієнту.

4. Декоратори
Для оптимізації та чистоти коду необхідно реалізувати та застосувати наступні декоратори:

@SanitizeInput: Застосовується до методів додавання та редагування. Повинен автоматично видаляти зайві пробіли на початку
та в кінці строк у назві та змісті нотатки перед тим, як дані потраплять до основної логіки методу.

@ValidateNotEmpty: Застосовується після очищення. Нотатки не повинні бути порожніми. Декоратор перевіряє,
чи не є назва та зміст порожніми строками, і якщо так — викидає помилку до виконання основної логіки методу.

@AutoUpdateTimestamp: Застосовується до методу редагування. Декоратор повинен перехоплювати виклик методу
і автоматично оновлювати поле дата редагування поточною датою та часом, звільняючи розробника від необхідності
писати цю логіку всередині самого методу.
*/


type StartsWithUppercase<StringPart extends string> =
  StringPart extends Uncapitalize<StringPart> ? false : true;

type CamelToSnake<Text extends string> =
  Text extends `${infer CurrentChar}${infer RestOfString}`
    ? StartsWithUppercase<RestOfString> extends true
      ? `${Uncapitalize<CurrentChar>}_${CamelToSnake<RestOfString>}`
      : `${Uncapitalize<CurrentChar>}${CamelToSnake<RestOfString>}`
    : Text;

type MapToSnakeCaseDTO<T> = {
  [K in keyof T as CamelToSnake<K & string>]: T[K];
};

type SnakeToCamel<T extends string> = T extends `${infer C}_${infer R}` 
? `${C}${Capitalize<SnakeToCamel<R>>}` 
: T;

type MapToCamelCaseDomain<T> = {
  [K in keyof T as SnakeToCamel<K & string>]: T[K];
};

type NoteServerDTO = MapToSnakeCaseDTO<Note>;
type ReconstructedNote = MapToCamelCaseDomain<NoteServerDTO>;

function mapToDTO(data: ReconstructedNote): NoteServerDTO {
  return {
    note_id: data.noteId,
    note_title: data.noteTitle,
    note_content: data.noteContent,
    created_at: data.createdAt,
    updated_at: data.updatedAt,
    is_completed: data.isCompleted,
    type: data.type,
  };
}

function mapFromDTO(data: NoteServerDTO): ReconstructedNote {
  return {
    noteId: data.note_id,
    noteTitle: data.note_title,
    noteContent: data.note_content,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    isCompleted: data.is_completed,
    type: data.type,
  };
}

function SanitizeInput(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (data: any) {
    if (typeof data === 'object' && data !== null) {
      if (typeof data.noteTitle === 'string') {
        data.noteTitle = data.noteTitle.trim();
      }
      if (typeof data.noteContent === 'string') {
        data.noteContent = data.noteContent.trim();
      }
    }
    return method.apply(this, [data]);
  };
}

function ValidateNotEmpty(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (data: any) {
    if (!data.noteTitle || data.noteTitle === '') {
      throw new Error('Title cannot be empty');
    }
    if (!data.noteContent || data.noteContent === '') {
      throw new Error('Content cannot be empty');
    }
    return method.apply(this, [data]);
  };
}

function AutoUpdateTimestamp(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (id: string, data: any) {
    data.updatedAt = new Date().toString()
    return method.apply(this, [id, data]);
  };
}

interface Note {
  noteId: string;
  noteTitle: string;
  noteContent: string;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
  type: 'default' | 'confirmation';
}

abstract class BaseNote implements Note {
  noteId: string;
  noteTitle: string;
  noteContent: string;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
  type: 'default' | 'confirmation';

  constructor(data: Note) {
    this.noteId = data.noteId;
    this.noteTitle = data.noteTitle;
    this.noteContent = data.noteContent;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.isCompleted = data.isCompleted;
    this.type = data.type;
  }

  abstract canEdit(): boolean;
  abstract canDelete(): boolean;
}

class DefaultNote extends BaseNote {
  canEdit(): boolean {return true;}
  canDelete(): boolean {return true;}
}

class ConfirmationNote extends BaseNote {
  canEdit(): boolean {
    return confirm('Edit note?');
  }

  canDelete(): boolean {
    return confirm('Delete note?');
  }
}


class NoteList {
  private notes: BaseNote[] = [];

  @SanitizeInput
  @ValidateNotEmpty
  addNote(data: Note): void {
    const note = data.type === 'confirmation' ? new ConfirmationNote(data) : new DefaultNote(data);
    this.notes.push(note);
  }


  deleteNote(id: string): void {
    const note = this.notes.find((n) => n.noteId === id);
    if (!note) 
      throw new Error('Not found');;
    if (!note.canDelete())
       throw new Error('Cannot delete');
    this.notes = this.notes.filter((n) => n.noteId !== id);
  }

  @SanitizeInput
  @ValidateNotEmpty
  @AutoUpdateTimestamp
  editNote(id: string, data: Partial<Note>): void {
    const note = this.notes.find((n) => n.noteId === id);
    if (!note) 
      throw new Error('Not found');
    if (!note.canEdit()) 
      throw new Error('Cannot edit');

    if (data.noteTitle) 
      note.noteTitle = data.noteTitle;
    if (data.noteContent) 
      note.noteContent = data.noteContent;
  }



  getNoteById(id: string): BaseNote {
    const note = this.notes.find((n) => n.noteId === id);
    if (!note) 
      throw new Error('Not found');
    return note;
  }

  markAsCompleted(id: string): void {
    const note = this.getNoteById(id);
    note.isCompleted = true;
  }

  getStatistics(): { total: number; completed: number; incomplete: number } {
    return {
      total: this.notes.length,
      completed: this.notes.filter((n) => n.isCompleted).length,
      incomplete: this.notes.filter((n) => !n.isCompleted).length,
    };
  }


  searchNotes(query: string): BaseNote[] {
    const q = query.toLowerCase();
    return this.notes.filter((n) => n.noteTitle.toLowerCase().includes(q) || n.noteContent.toLowerCase().includes(q));
  }

  sortByCompletion(): BaseNote[] {
    return [...this.notes].sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }

  sortByCreatedDate(): BaseNote[] {
    return [...this.notes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  loadFromServer(serverData: NoteServerDTO[]): void {
    serverData.forEach((dto) => {
      const note = mapFromDTO(dto);
      this.addNote(note);
    });
  }

  exportToServer(): NoteServerDTO[] {return this.notes.map((note) => mapToDTO({
        noteId: note.noteId,
        noteTitle: note.noteTitle,
        noteContent: note.noteContent,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        isCompleted: note.isCompleted,
        type: note.type,
      })
    );
  }
}
