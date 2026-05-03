import type { Context } from "hono";
import { createMiddleware } from "hono/factory";

// Middleware to warstwa pośrednia pomiędzy aplikacją a finalnym endpointem.
// Żądanie, przechodząc przez drzewo może napotykać na middlewary które modyfikują żądanie, lub np. sprawdzają autoryzację.
// W tym przypadku sprawdzamy, czy użytkownik jest zalogowany poprzez sprawdzenie nagłówka Authorization.
// W prawdziwej aplikacji tutaj sprawdzane byłyby tokeny JWT lub inne metody uwierzytelniania.

// async w sygnaturze oznacza, że funkcja zwraca Promise, a w jej wnętrzu może się znaleźć asynchroniczna logika.
export const isAuthorized = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // await to słowo kluczowe, które czeka na zakończenie asynchronicznej operacji przed kontynuacją wykonywania kodu.
  await next();

  // po wykonaniu next() nie musimy zwracać niczego, ponieważ next() zwraca już Response
});
