//Zadanie 1 (source /home/kbed/.bash_profile)
function fibrec(x){
    if(x === 2 || x === 1){
        return 1;
    }
    return fibrec(x-1) + fibrec(x-2);
}

function fibiter(x){
    if(x === 2 || x === 1){
        return 1;
    }
    let pop = 1, pop2 = 1, tmp = 0;
    for(let i = 3; i <= x; i++){
        tmp = pop + pop2;
        pop2 = pop;
        pop = tmp;
    }
    return pop;
}

console.log(`Zadanie1:`);
console.log(`Fibrec(10): ${fibrec(10)}, Fibiter(10): ${fibiter(10)}\n`);

//Zadanie 2
function arrOfFib(x){
    let xs = [1];
    if(x === 1){
        return xs;
    }

    xs.push(1);
    if(x === 2){
        return xs;
    }

    for(let i = 2; i < x; i++){
        xs.push(xs[i-1] + xs[i-2]);
    }
    return xs;
}

console.log(`Zadanie2:`);
console.log(`arrOfFib(10): ${arrOfFib(10)}\n`);

//Zadanie 3
function selectFib(xs){
    let maks = 0;
    for(let i = 1; i < xs.length; i++){
        if(xs[i] > xs[maks]){
            maks = i;
        }    
    }

    maks = xs[maks];
    let i = 1;
    while(fibiter(i) < maks){
        i++;
    }
    let ys = arrOfFib(i);

    return xs.filter(liczba => ys.includes(liczba));
}

console.log(`Zadanie3:`);
console.log(`selectFib(10): ${selectFib([1,2,3,4,5,6,7,8,9,10,55,34,77,66,44])}\n`);

//Zadanie 4
function shiftFib(x){
    return function(y) {
        let xs = arrOfFib(y);
        return xs.map(liczba => liczba + x); 
    }
}

console.log(`Zadanie4:`);
console.log(`(shiftFib(2))(10): ${(shiftFib(2))(10)}\n`);

//Zadanie 5
function findfib(x){
    let i = 0, acc = 0;
    while(acc < x){
        i++;
        acc = fibiter(i);
    }
    if(i > 0 && x == fibiter(i)){
        return i;
    }
    return -1;
}

function addEndsOf(x){
    let tmp = findfib(x);

    if(tmp === -1){ return []; }
    if(tmp === 1 || tmp === 2) {return [0, 1]}

    return [fibiter(tmp-2), fibiter(tmp-1)];
}

console.log(`Zadanie5:`);
console.log(`addEndsOf(10): ${addEndsOf(55)}\n`);

//Zadanie 6
function customFib(ini, rule) {
    let xs = [...ini];

    return function(y) {
        if (y < 0) { return null; }

        while (xs.length < y) {
            let idx = xs.length;
            xs.push(rule(idx, xs));
        }

        return xs[y-1];
    };
}

console.log(`Zadanie6:`);
console.log(`customFib: ${(customFib([1,1], (x, xs) => xs[x-2] + xs[x-1]))(10)}\n`);
console.log(`customFib: ${(customFib([1,0], (x, xs) => xs[x-2] + xs[x-1]))(10)}\n`);
console.log(`customFib: ${(customFib([1,2], (x, xs) => xs[x-1]))(10)}\n`);

//Zadanie 7
function addEndsOfAr(xs){
    let ys = selectFib(xs);
    ys = ys.map(y => [y, addEndsOf(y)]);
    return Object.fromEntries(ys);
}

console.log(`Zadanie7:`);
console.log(`addEndsOfAr:`, addEndsOfAr([1,2,3,5,8,13,21,34,55,89,444,555,666,777,888]), `\n`);

