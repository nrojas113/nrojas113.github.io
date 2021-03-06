/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here

  const counter = document.getElementById('coffee_counter');

  counter.innerText = coffeeQty;

}

function clickCoffee(data) {
  // your code here
  data.coffee += 1;
  updateCoffeeView(data.coffee)
  renderProducers(data)
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  producers.forEach(producer => {
    if (coffeeCount >= (producer.price /2)){
      producer.unlocked = true;
    }
  })
}

function getUnlockedProducers(data) {
  // your code here
  return data.producers.filter(producer => {
    if (producer.unlocked === true){
      return true;
    }
  })
}

function makeDisplayNameFromId(id) {
  // your code here
  let arr = id.split('_')
  return arr.map(word => {
    return `${word[0].toUpperCase()}${word.slice(1)}`
  }).join(' ')
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while(parent.firstChild){
    parent.removeChild(parent.firstChild)
  }
}

function renderProducers(data) {
  // your code here
  const container = document.querySelector('#producer_container');

  //unlock producers (mutate the object)
  unlockProducers(data.producers, data.coffee)
  //get filtered array of unlocked producers
  const unlockedArr = getUnlockedProducers(data)

  //delete all the children before adding new producers
  deleteAllChildNodes(container)

  //add new producers who are unlocked to the producer container
  unlockedArr.forEach(producer => {
    const newProducer = makeProducerDiv(producer)
    container.appendChild(newProducer)
  })
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here

  return data.producers.reduce((acc,producer,idx) => {
    if(producer.id === producerId){
      acc = data.producers[idx]
    }
    return acc;
  },data)
}

function canAffordProducer(data, producerId) {
  // your code here
  const producerPrice = getProducerById(data, producerId).price;
  if(data.coffee >= producerPrice){
    return true;
  } else {
    return false;
  }
}

function updateCPSView(cps) {
  // your code here
  const cpsVal = document.getElementById('cps');
  cpsVal.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25)
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  const selectedProducer = getProducerById(data, producerId);
  if(data.coffee < selectedProducer.price){
    return false;
  } else {
    //increase the producer's quantity
    selectedProducer.qty++;
    //deduct the price from current coffee count
    data.coffee -=selectedProducer.price;
    //increase the producer's price for next time
    selectedProducer.price = updatePrice(selectedProducer.price);
    //increase the total CPS
    data.totalCPS+=selectedProducer.cps;

    return true;
  }
}

function buyButtonClick(event, data) {
  // your code here

  if (event.target.tagName === 'BUTTON'){
    let selectedProducer = event.target.id.slice(4)
    let afford = attemptToBuyProducer(data, selectedProducer)

    if(afford){
      renderProducers(data)
      updateCoffeeView(data.coffee)
      updateCPSView(data.totalCPS)
      return data;
    } else {
      window.alert('Not enough coffee!')
    }
  }
}

function tick(data) {
  // your code here
  data.coffee+=data.totalCPS;
  updateCoffeeView(data.coffee)
  renderProducers(data)


}

/*SAVE TO LOCAL STORAGE -> FUNCTIONS (EVENT LISTERNERS ARE LINE 236-245*/

const key = 'save'
function save(data){
  // debugger;
  console.log(data)
  //save the current data passed
  localStorage.setItem(key, JSON.stringify(data))
  console.log(data)
}

function retrieveSaveData(){
  console.log(this.data)
  //retrieve saved data (string version) from local Storage
  const savedDataStr = localStorage.getItem(key)
  //convert the string back to object
  const savedDataObj = JSON.parse(savedDataStr)
  //return the saved data object
  return savedDataObj;
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  let data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });


    /*SAVE & LOAD DATA - > EVENT LISTNERS*/

    const saveBtn = document.getElementById('save');

    saveBtn.addEventListener('click', ()=> {
      //If save button is clicked, pass current window's data to the save function (line 185)
      save(this.window.data);

      //Create new element and display saved data information on browser
      const gameState = document.createElement('p')
      gameState.innerHTML = `
      Data Successfully Saved!
      <span>Saved Data --
      Coffee: ${this.window.data.coffee}
      CSP: ${this.window.data.totalCPS}
      </span>`
      const parent = document.getElementById('game-state')
      if (parent.hasChildNodes()){
        parent.removeChild(parent.firstChild)
        parent.appendChild(gameState)
      } else {
        parent.appendChild(gameState)
      }
    });

    const loadBtn = document.getElementById('load');
    loadBtn.addEventListener('click', ()=> {
      //if Start from saved data button is clicked,
      const savedData = retrieveSaveData();
      //retrieve the saved data through retrieve data function (line 190) and
      updateCPSView(savedData.totalCPS);
      //update the CPS view and reassign that saved data as current data.
      data = savedData;
      this.window.data = savedData;
    })

    window.addEventListener('load', () => {
      const savedData = retrieveSaveData()
      const gameState = document.createElement('p')
      gameState.innerHTML = `
      <span>Saved Data --
      Coffee: ${savedData.coffee}
      CSP: ${savedData.totalCPS}
      </span>`
      const parent = document.getElementById('game-state')
      parent.appendChild(gameState)
    })

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);




}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
