import { Hono } from "hono";
import { adminRouter } from "./routes/admin";

// Inicjalizujemy aplikację przez utworzenie nowej instancji Hono
const app = new Hono();

// Inicjalizujemy zmienną przechowującą listę znajomych
// Jest to w cachu aplikacji, zatem nie powinno (i nie robi się) tak w rzeczywistości, to jest wyłącznie na potrzeby symulacji prawdziwego przechowywania danych
const friends: string[] = [];

// Pierwszy endpoint na poziomie root: metoda: get, relative path: /, path: /. Zwraca tekst "Hello, Hono!". Do sprawdzania czy serwer działa.
app.get("/", (c) => {
  return c.text("Hellooooooo, Hono!"); //flaga --hot na hot reloading
});

// Endpoint na poziomie root: metoda: post, relative path: /, path: /. Oczekuje na JSONa i zwraca go w całości.
app.post("/", async (c) => {
  const body = await c.req.json();
  return c.json(body);
});

// Nowy router dla endpointów związanych z znajomymi
app.route(
  "/friends",
  // Jako drugi parametr route przekazujemy kolejną instancję Hono, w tym przypadku tworzymy ją inline.
  new Hono()
    // Endpoint na poziomie /friends: metoda: get, relative path: /, path: /friends. Zwraca listę znajomych.
    .get("/", (c) => {
      return c.json(friends);
    })
    // Ważne: Często pojawiającą się techniką w programowaniu jest method chaining, która pozwala na zapisywanie wielu wywołań metod w jednej linii jedna pod drugą.
    // Implementacja tej techniki polega na zwracaniu obiektu kontekstu (this) przez każdą metodę
    // Pozwala ona na tworzenie bardziej czytelnego i zwięzłego kodu, oraz na korzystanie z metod instancji bez konieczności tworzenia zmiennych tymczasowych.

    // Endpoint na poziomie /friends: metoda: post, relative path: /, path: /friends. Dodaje nowego znajomego. Oczekuje danych w formacie JSON: { name: string }.
    .post("/", async (c) => {
      const body = await c.req
        .json()
        .then((data) => data)
        .catch(() => null);
      if (!body.name || typeof body.name !== "string") {
        return c.json({ success: false, error: "Invalid request body. Expected: { name: string }" }, 400);
      }
      friends.push(body.name);
      return c.json({ success: true });
    }),
);

app.route("/admin", adminRouter);

export default app;
