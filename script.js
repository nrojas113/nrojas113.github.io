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

/*SAVE TO LOCAL STORAGE*/

const key = 'save'
function save(data){
  console.log(data)
  localStorage.setItem(key, JSON.stringify(data))
}

function load(){
  debugger;
  console.log(this.data)
  const strObject = localStorage.getItem(key)
  const returnedObj = JSON.parse(strObject)
  console.log(typeof returnedObj)
  this.data = returnedObj
  updateCoffeeView(this.data.coffee)
  renderProducers(this.data)

  console.log(this.data)
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
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });


    /*SAVE & LOAD DATA*/

    const saveBtn = document.getElementById('save');
    saveBtn.addEventListener('click', ()=> {
      save(this.window.data)
    });

    const loadBtn = document.getElementById('load');
    loadBtn.addEventListener('click', ()=> {
      load()
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
