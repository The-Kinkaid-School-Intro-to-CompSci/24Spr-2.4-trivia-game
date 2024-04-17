let fruitsJSON = {
    owner: "Mr. Alban",
    fruits: [
        {name: "apple", color: "red", shape: "round", emoji: "🍎"},
        {name: "banana", color: "yellow", shape: "curved", emoji: "🍌"},
        {name: "orange", color: "orange", shape: "round", emoji: "🍊"},
        {name: "kiwi", color: "brown", shape: "oval", emoji: "🥝"},
        {name: "mango", color: "yellow", shape: "oval", emoji: "🥭"},
        {name: "grape", color: "purple", shape: "round", emoji: "🍇"},
        {name: "pear", color: "green", shape: "oval", emoji: "🍐"},
        {name: "pineapple", color: "yellow", shape: "oval", emoji: "🍍"},
    ],
    purpose: "Education"
}

/**** Part 1: showing divs within divs */
function makeFruitInfoDiv(fruit){
    let fruitInfo = document.createElement('div');
    fruitInfo.classList.add('green-border');

    let color = document.createElement('p');
    color.textContent = `Color: ${fruit.color}`;
    fruitInfo.appendChild(color);

    let shape = document.createElement('p');
    shape.textContent = `Shape: ${fruit.shape}`;
    fruitInfo.appendChild(shape);

    let emoji = document.createElement('p');
    emoji.textContent = `Emoji: ${fruit.emoji}`;
    fruitInfo.appendChild(emoji);

    return fruitInfo;
}

function makeFruitCard(fruit){
    let card = document.createElement('div');
    card.classList.add('red-border');

    let name = document.createElement('h2');
    name.textContent = fruit.name;
    name.classList.add('blue-border');
    card.appendChild(name);

    let fruitInfo = makeFruitInfoDiv(fruit);
    card.appendChild(fruitInfo);

    return card;
}

function clearContainer(elem){
    while(elem.firstChild){
        elem.removeChild(elem.firstChild);
    }
}

function showFruits(fruits){
    let fruitContainer = document.querySelector('#fruitsContainer');
    clearContainer(fruitContainer);
    for(let fruit of fruits){
        let fruitCard = makeFruitCard(fruit);
        fruitContainer.appendChild(fruitCard);
    }
}


/**** Part 1: showing divs within divs END */

/**** Part 2: filtering fruits START */

let needle = 'apple';
let haystack1 = 'pineapple';
let haystack2 = 'banana';

if(haystack1.includes(needle)){
    console.log('apple is in pineapple');
}
if(haystack2.includes(needle)){
    console.log('apple is in banana');
}

function getAppleFruits(){
    let appleFruits = [];
    for(let fruit of fruitsJSON.fruits){
        if(fruit.name.includes('apple')){
            appleFruits.push(fruit);
        }
    }
    return appleFruits;
}

function filterByColor(color){
    let fruitsByColor = [];
    for(let fruit of fruitsJSON.fruits){
        if(fruit.color === color){
            fruitsByColor.push(fruit);
        }
    }
    console.log(fruitsByColor);
    return fruitsByColor;
}

function handleFruitsSelect(event){
    let fruitsSelect = event.target;
    let optionChosen = fruitsSelect.value;

    if(optionChosen === "all"){
        showFruits(fruitsJSON.fruits);
    }
    else if (optionChosen === "containsApple"){
        let appleFruits = getAppleFruits();
        showFruits(appleFruits);
    }
    else{
        console.log(optionChosen)
        //filter by color
        let fruitsByColor = filterByColor(optionChosen);
        showFruits(fruitsByColor);
    }
}
/**** Part 2: filtering fruits END */

function runProgram(){

    //get fruits button
    const getFruitsButton = document.querySelector('#getFruits');
    getFruitsButton.addEventListener('click', () => showFruits(fruitsJSON.fruits));


    //get fruits select (Part 2)
    const fruitsSelect = document.querySelector('#fruitsSelect');
    fruitsSelect.addEventListener('change', (event) => handleFruitsSelect(event));   

}

document.addEventListener('DOMContentLoaded', runProgram);