import { Hono } from "hono";
import { isAuthorized } from "../middlewares/auth";
import { usersManager } from "../services/UsersManager";

export const adminRouter = new Hono()
  .use(isAuthorized)

  .get("/", (c) => {
    return c.text("Witaj w panelu administratora!");
  })

  .post("/user", async (c) => {
    const data = await c.req.json().catch(() => null);

    if (!data || !data.name || !data.email || !data.password) {
      return c.json({ success: false, error: "Invalid request body. Expected: { name: string, email: string, password: string }" }, 400);
    }

    const newUser = usersManager.addUser({
      name: data.name,
      email: data.email,
      password: data.password
    });

    return c.text(`Utworzono użytkownika o ID: ${newUser.id}`);
  })

  .delete("/user/:id", (c) => {
    const id = c.req.param("id");
    
    const user = usersManager.findUser(id);

    if (!user) {
      return c.text("Użytkownik nie znaleziony", 404);
    }

    user.delete();
    return c.text(`Usunięto użytkownika o ID: ${id}`);
  })

  .get("/users", (c) => {
    const users = usersManager.getUsers();
    
    return c.json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt.toISOString(),
      }))
    );
  })

  .patch("/user/:id", async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json().catch(() => null);

    if (!data) return c.json({ error: "Invalid request body. Expected optional strings for name, email, or password" }, 400);

    const user = usersManager.findUser(id);

    if (!user) {
      return c.text("Użytkownik nie znaleziony", 404);
    }

    user.update(data);
    return c.text(`Zaktualizowano użytkownika o ID: ${id}`);
  });