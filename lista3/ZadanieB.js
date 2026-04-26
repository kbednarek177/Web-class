const oceny = {
    jpolski: {
        Jan: [4,3,4.5,4,2],
        Marek: [1,2,3,3,1.5],
        Pola: [5,4,6,5,5,4.5],
        Bartek: [3,5,3,2,5]
    },
    matematyka: {
        Jan: [3, 4, 2, 3, 3.5],
        Marek: [2, 2, 1, 3, 2],
        Pola: [6, 5, 5, 6, 5],
        Bartek: [4, 3, 4, 4, 3]
    },
    historia: {
        Jan: [4, 5, 4, 4, 5],
        Marek: [3, 2, 3, 4, 2],
        Pola: [5, 5, 6, 5, 5],
        Bartek: [2, 3, 2, 3, 3]
    },
    wf: {
        Jan: [5, 4, 5, 5, 4],
        Marek: [4, 4, 3, 5, 4],
        Bartek: [6, 6, 5, 6, 6]
    }
}

//Zadanie 1
function srednie(imie) {
    const przedmioty = Object.keys(oceny);

    const pary = przedmioty.map(x => {
        let ocenyUcznia = oceny[x][imie], srednia = 0;

        if (ocenyUcznia && ocenyUcznia.length > 0) {
            srednia = ocenyUcznia.reduce((acc, ocena) => acc + ocena, 0) / ocenyUcznia.length;
        }

        return [x, srednia];
    });

    return Object.fromEntries(pary);
}

console.log(`Zadanie1:`);
console.log(srednie("Jan"));
console.log(srednie("Garfield"));
console.log(srednie("Pola"));

//Zadanie 2
function najlepsi(przedmiot) {

    if (!oceny[przedmiot]) {
        return [];
    }

    const pary = Object.entries(oceny[przedmiot]);

    const posortowani = pary.map(([imie, listaocen]) => {

            let sred = listaocen.reduce((acc, ocena) => acc + ocena, 0) / listaocen.length;

            return { 
                name: imie, 
                oceny: listaocen, 
                srednia: sred 
            };
        })
        .sort((a, b) => b.srednia - a.srednia)
        .map(uczen => {
            return {
                name: uczen.name,
                oceny: uczen.oceny
            };
        });

    return posortowani;
}

console.log(`Zadanie2:`);
console.log(najlepsi("wf"));

let uczniowie = [
{
    id: 0,
    imie: 'Jan',
    nazwisko: 'Kowalski',
    pesel: '082210499323',
    adres: 'ul. Turkusowa 34/9, 34-999 Oława',
    telefon: '+48 125 362 234',
    email: 'mama_janka@o2.drop',
    bio: 'Nie lubię nauki. Nie wiem co tu robię. Chcę grać w grę. Jaką? Tomb Rider!'
},
{
    id: 1,
    imie: 'Marek',
    nazwisko: 'Nowak',
    pesel: '082210555323',
    adres: 'ul. Polna 2',
    telefon: '+48 500 600 700',
    email: 'marek@nowak.pl',
    bio: 'Lubię sport, ale szkoła jest trudna.'
},
{
    id: 2,
    imie: 'Pola',
    nazwisko: 'Zdolna',
    pesel: '082210444321',
    adres: 'ul. Jasna 5',
    telefon: '+48 111 222 333',
    email: 'pola@interia.pl',
    bio: 'Zawsze celująca!'
},
{
    id: 3,
    imie: 'Bartek',
    nazwisko: 'Szybki',
    pesel: '082210666777',
    adres: 'ul. Sportowa 1',
    telefon: '+48 999 888 777',
    email: 'bartek@sport.pl',
    bio: 'Biegam szybciej niż myślę.'
}
];

//Zadanie 3
function getPublicProfile(user){
    return {
        id: user.id,
        imie: user.imie,
        nazwisko: user.nazwisko,
        email: user.email,
        bio: user.bio
    };
}

console.log(`Zadanie3:`);
console.log(uczniowie[2]);
