import { Hono } from "hono";
import { isAuthorized } from "../middlewares/auth";

// Zmienna przechowująca ID dla następnego użytkownika.
// Przy tworzeniu nowego użytkownika ta wartość zostanie użyta, a następnie zwiększona o 1.
let nextUserId = 1;

// Tablica przechowująca naszych użytkowników.
// Jest to w cachu aplikacji (pamięci RAM), zatem zniknie po restarcie serwera.
// W prawdziwych aplikacjach te dane byłyby trzymane i pobierane z bazy danych.
// Tutaj również określamy typ (strukturę) danych użytkownika używając TypeScriptu.
const users: {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  id: string;
}[] = [];

// Tworzymy nowy router (podzbior endpointów) dla ścieżek przeznaczonych dla administratora.
export const adminRouter = new Hono()
  // Używamy naszego middleware'u (pośrednika). Dzięki temu wszystkie poniższe endpointy w tym routerze
  // będą chronione i będą wymagały autoryzacji (odpowiedniego nagłówka Authorization).
  .use(isAuthorized)

  // Endpoint na poziomie /admin: metoda: get, relative path: /, path: /admin.
  // Zwraca zwykły tekst powitalny.
  .get("/", (c) => {
    return c.text("Witaj w panelu administratora!");
  })

  // Endpoint na poziomie /admin: metoda: post, relative path: /user, path: /admin/user.
  // Służy do tworzenia nowego użytkownika. Oczekuje danych w formacie JSON w ciele (body) zapytania.
  .post("/user", async (c) => {
    // Odczytujemy dane w formacie JSON z zapytania (request) wysłanego przez klienta.
    // Podobnie jak w index.ts, zabezpieczamy się przed błędami podczas parsowania (gdy klient nie wyśle poprawnego JSONa).
    const data = await c.req
      .json()
      .then((data) => data)
      .catch(() => null);

    // Sprawdzamy czy otrzymaliśmy obiekt z danymi i czy wszystkie wymagane pola są tekstami (stringami).
    if (
      !data ||
      !data.name ||
      typeof data.name !== "string" ||
      !data.email ||
      typeof data.email !== "string" ||
      !data.password ||
      typeof data.password !== "string"
    ) {
      return c.json(
        { success: false, error: "Invalid request body. Expected: { name: string, email: string, password: string }" },
        400,
      );
    }

    // Destrukturyzacja - wyciągamy wybrane pola (name, email, password) z obiektu data do osobnych zmiennych.
    const { name, email, password } = data;

    // Pobieramy aktualne ID dla nowego użytkownika i zwiększamy licznik (operator ++)
    const id = nextUserId++;

    // Tworzymy nowy obiekt użytkownika
    const user = {
      name,
      email,
      password,
      createdAt: new Date(), // Tworzy obiekt daty z obecnym czasem
      id: id.toString(), // Zmienia typ z liczby (number) na tekst (string)
    };

    // Dodajemy naszego nowego użytkownika na koniec tablicy users
    users.push(user);

    // Zwracamy odpowiedź tekstową dla klienta
    return c.text(`Utworzono użytkownika o ID: ${id}`);
  })

  // Endpoint na poziomie /admin: metoda: delete, relative path: /user/:id, path: /admin/user/:id.
  // Znak dwukropka ":" w ścieżce oznacza parametr (dynamiczną wartość).
  // Służy do usuwania użytkownika o konkretnym ID.
  .delete("/user/:id", (c) => {
    // Pobieramy wartość parametru "id" ze ścieżki (URL)
    const id = c.req.param("id");

    // Szukamy indeksu (pozycji w tablicy), na którym znajduje się użytkownik o podanym ID.
    const userIndex = users.findIndex((u) => u.id === id);

    // Jeśli findIndex nie znajdzie pasującego elementu, to zwraca -1.
    if (userIndex === -1) {
      // Zwracamy odpowiedź z kodem 404 (Not Found - Nie znaleziono)
      return c.text("Użytkownik nie znaleziony", 404);
    }

    // Funkcja splice służy m.in do usuwania. W tym przypadku: usuń 1 element znajdujący się pod indeksem userIndex.
    users.splice(userIndex, 1);

    return c.text(`Usunięto użytkownika o ID: ${id}`);
  })

  // Endpoint na poziomie /admin: metoda: get, relative path: /users, path: /admin/users.
  // Zwraca listę wszystkich użytkowników.
  .get("/users", (c) => {
    return c.json(
      // Metoda map() przechodzi przez każdy element tablicy i pozwala nam go przetransformować.
      // Używamy tego po to, aby ZABEZPIECZYĆ dane - NIE zwracamy klientowi haseł użytkowników (brak password poniżej).
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt.toISOString(), // Zmienia obiekt daty w tekst, aby JSON bez problemu mógł to obsłużyć.
      })),
    );
  })

  // Endpoint na poziomie /admin: metoda: patch, relative path: /user/:id, path: /admin/user/:id.
  // Metoda PATCH służy do częściowej aktualizacji zasobu (w przeciwieństwie do PUT, które podmienia cały zasób).
  .patch("/user/:id", async (c) => {
    const id = c.req.param("id");

    // Bezpieczne pobranie danych z body tak samo jak powyżej
    const data = await c.req
      .json()
      .then((data) => data)
      .catch(() => null);

    // W przypadku aktualizacji (PATCH) pola są opcjonalne, więc sprawdzamy tylko te, które zostały wysłane.
    // Jeśli pole zostało wysłane, upewniamy się, że ma poprawny typ (string).
    if (
      !data ||
      (data.name && typeof data.name !== "string") ||
      (data.email && typeof data.email !== "string") ||
      (data.password && typeof data.password !== "string")
    ) {
      return c.json(
        { success: false, error: "Invalid request body. Expected optional strings for name, email, or password" },
        400,
      );
    }

    const { name, email, password } = data;

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return c.text("Użytkownik nie znaleziony", 404);
    }

    // Aktualizujemy dane użytkownika.
    users[userIndex] = {
      // Operator spread (...) użyty na obiekcie rozpakowuje go. Kopiujemy wszystkie obecne wartości użytkownika.
      ...users[userIndex],
      // Operator && działa tu jako "jeśli name nie jest puste, to dopisz nowe name".
      // Kolejne użycia spread (...) dodają nowe obiekty do oryginalnego użytkownika (nadpisując te istniejące)
      ...(name && { name }),
      ...(email && { email }),
      ...(password && { password }),
    };

    return c.text(`Zaktualizowano użytkownika o ID: ${id}`);
  });
