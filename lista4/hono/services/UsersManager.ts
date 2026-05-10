export type User = {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  id: string;
};

export type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
};

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


  addUser(data: Omit<User, "id" | "createdAt">): User { //omit da mi argument na user bez kluczy id createAt
    const id = (this.#nextUserId++).toString();
    const newUser: User = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.#users.push(newUser);
    return newUser;
  }

  deleteUser(id: string): boolean {
    const idx = this.#users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    
    this.#users.splice(idx, 1);
    return true;
  }


  updateUser(id: string, data: UpdateUserData): User | null {
    const user = this.#users.find((u) => u.id === id);
    if (!user) return null;

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.password) user.password = data.password;

    return user;
  }
}

export const usersManager = UsersManager.getInstance(); //Singleton op