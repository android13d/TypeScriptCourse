type LecturerType = {
    name: string;
    surname: string;
    position: string;
    company: string;
    experience: number;
    courses: string[];
    contacts: string[];
  };

type GroupStatus = "new" | "active" | "finished";


class School {
  // implement 'add area', 'remove area', 'add lecturer', and 'remove lecturer' methods

  _areas: Area[] = [];
  _lecturers: LecturerType[] = []; // Name, surname, position, company, experience, courses, contacts

  get areas(): Area[] {
    return this._areas;
  }

  get lecturers(): LecturerType[] {
    return this._lecturers;
  }

  addArea(area: Area): void {
    this._areas.push(area);
  }

  removeArea(areaName: string): void {
    this._areas = this._areas.filter(a => a.name.toLowerCase() !== areaName.toLowerCase());
  }

  addLecturer(lecturer: LecturerType): void {
    this._lecturers.push(lecturer);
  }

  removeLecturer(name: string, surname: string): void {
    this._lecturers = this._lecturers.filter(
      l => !(l.name.toLowerCase() === name.toLowerCase() && l.surname.toLowerCase() === surname.toLowerCase())
    );
  }

}

class Area {
  // implement getters for fields and 'add/remove level' methods
  _levels: Level[] = [];
  _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get levels(): Level[] {
    return this._levels;
  }
  
  get name(): string {
    return this._name;
  }

  addLevel(level: Level): void {
    this._levels.push(level);
  }

  removeLevel(levelName: string): void {
    this._levels = this._levels.filter(l => l.name.toLowerCase() !== levelName.toLowerCase());
  }

}

class Level {
  // implement getters for fields and 'add/remove group' methods

  _groups: Group[] = [];
  _name: string;
  _description: string;

  constructor(name: string, description: string) {
    this._name = name;
    this._description = description;
  }

  get groups(): Group[] {
    return this._groups;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  addGroup(group: Group): void {
    this._groups.push(group);
  }

  removeGroup(directionName: string): void {
    this._groups = this._groups.filter(g => g.directionName.toLowerCase() !== directionName.toLowerCase());
  }

}

class Group {
  // implement getters for fields and 'add/remove student' and 'set status' methods

  _area: Area | null = null;
  _status: GroupStatus = "new";
  _students: Student[] = []; // Modify the array so that it has a valid toSorted method*
  _directionName: string;
  _levelName: string;

  constructor(directionName: string, levelName: string) {
    this._directionName = directionName;
    this._levelName = levelName;
  }

  get area(): Area | null {
    return this._area;
  }

  get status(): GroupStatus {
    return this._status;
  }

  get students(): Student[] {
    return this._students;
  }

  get directionName(): string {
    return this._directionName;
  }

  get levelName(): string {
    return this._levelName;
  }

  set area(area: Area | null) {
    this._area = area;
  }

  set status(status: GroupStatus) {
    this._status = status;
  }

  addStudent(student: Student): void {
    this._students.push(student);
  }

  removeStudent(id: string): void {
    this._students = this._students.filter(s => s.id.toLowerCase() !== id.toLowerCase());
  }

  showPerformance():Student[] {
    //const sortedStudents = this._students.toSorted((a, b) => b.getPerformanceRating() - a.getPerformanceRating());
    const sortedStudents = [...this._students].sort((a, b) => b.getPerformanceRating() - a.getPerformanceRating());
    return sortedStudents;
  }
}

class Student {
  // implement 'set grade' and 'set visit' methods

  _id: string;
  _firstName: string;
  _lastName: string;
  _birthYear: number;
  _grades: { [key: string]: number } = {}; // workName: mark
  _visits: boolean[] = []; // lesson: present

  constructor(firstName: string, lastName: string, birthYear: number) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._birthYear = birthYear;
    this._id = `${firstName}_${lastName}_${birthYear}`;
  }
  
  get id(): string {
    return this._id;
  }

  get fullName(): string {
    return `${this._lastName} ${this._firstName}`;
  }

  set fullName(value: string) {
    [this._lastName, this._firstName] = value.split(' ');
    this._id = `${this._firstName}_${this._lastName}_${this._birthYear}`;
  }

  get age() {
    return new Date().getFullYear() - this._birthYear;
  }

  setGrade(workName: string, grade: number): void {
    this._grades[workName] = grade;
  }

  setVisit(present: boolean): void {
    this._visits.push(present);
  }

  getPerformanceRating(): number {
    const gradeValues = Object.values(this._grades);

    if (!gradeValues.length) return 0;

    const averageGrade = (gradeValues.length > 0)
      ? gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length
      : 0;
    const attendancePercentage = (this._visits.length > 0) 
      ? (this._visits.filter(present => present).length / this._visits.length) * 100
      : 0;

    return (averageGrade + attendancePercentage) / 2;
  }
}