export type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
};

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;

  constructor(id: string, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }

  update(data: UpdateUserData) {
    if (data.name !== undefined) this.name = data.name;
    if (data.email !== undefined) this.email = data.email;
    if (data.password !== undefined) this.password = data.password;
  }

  delete() {
    UsersManager.getInstance().deleteUser(this.id);
  }


  toString() {
    return JSON.stringify(
      {
        id: this.id,
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
      },
      null,
      2 //wcięcia
    );
  }
}

class UsersManager {

  #users: User[] = [];
  #nextUserId = 1;

  private constructor() {} //pattern singleton zabrania konstruktora new

  private static instance: UsersManager;

  public static getInstance(): UsersManager { //pattern singleton
    if (!UsersManager.instance) {
      UsersManager.instance = new UsersManager();
    }
    return UsersManager.instance;
  }


  getUsers(): User[] {
    return [...this.#users]; 
  }

  findUser(id: string): User | null {
    return this.#users.find((u) => u.id === id) || null;
  }


  addUser(data: { name: string; email: string; password: string }): User {
    const id = (this.#nextUserId++).toString();
    const newUser = new User(id, data.name, data.email, data.password);
    
    this.#users.push(newUser);
    return newUser;
  }

  deleteUser(id: string): boolean {
    const idx = this.#users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    
    this.#users.splice(idx, 1);
    return true;
  }

}

export const usersManager = UsersManager.getInstance(); //Singleton op