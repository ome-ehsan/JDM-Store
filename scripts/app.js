document.addEventListener('DOMContentLoaded', () => {
    // removing some defauts keys in sessionStorage if they exist
    sessionStorage.removeItem('IsThisFirstTime_Log_From_LiveServer');
    sessionStorage.removeItem('bis_data');
    
    if( sessionStorage.getItem('total') === null) {
        sessionStorage.setItem('total' , '0');
    };

    // now retrieving previous data
    const totalPrice = parseInt(sessionStorage.getItem('total'));
    if(totalPrice > 0){
        for(let i = 0; i < sessionStorage.length; i++){
            const key = sessionStorage.key(i);
            if (key === 'total'){continue} else{
                const data = JSON.parse(sessionStorage.getItem(key));
                const query = document.querySelector(`#${key}`);
                const exactQuery = query.querySelector('#quantity');
                exactQuery.textContent = data.quantity.toString();
            }
        }
    }

    //increment and decrement functionalities 
    const incButtons = document.querySelectorAll('.bi-plus-lg');
    const decButtons = document.querySelectorAll('.bi-dash-lg');
    const cartButton = document.querySelector('#cart');
    const gitButton = document.querySelector('#gitBtn')

    // adding event to cart button
    cartButton.addEventListener('click', ()=>{
        window.location.href = "cart.html" ;
    })

    //add button to git button
    gitButton.addEventListener('click', ()=>{
        window.open("https://github.com/ome-ehsan", "_blank");
    })

    //adding event listeners to the inc buttons
    incButtons.forEach((incButton)=>{
        incButton.addEventListener('click', ()=>{
            // this searches for the model and the price up the dom tree
            const infoContainer = incButton.closest('.item-container'); 
            const model = infoContainer.querySelector('#model').textContent;
            const price = convertPrice(infoContainer.querySelector('#price').textContent);
            const key = infoContainer.id;
            const quantity = infoContainer.querySelector('#quantity');
            addToCart(key,model,price,quantity);
        })
    })

    //now adding event listeners to dec buttons 
    decButtons.forEach((decButton) => {
        decButton.addEventListener('click', () => {
            const infoContainer = decButton.closest('.item-container');
            const price = convertPrice(infoContainer.querySelector('#price').textContent);
            const key = infoContainer.id;
            const quantity = infoContainer.querySelector('#quantity');
            removeFromCart(key,quantity,price);
        })
    })
})

//Function to add item to cart
function addToCart(k,m,p,q){
    // first we need to check whether the model already exists in the cart 
    const currentValues = sessionStorage.getItem(k);
    const total = parseInt(sessionStorage.getItem('total'));
    if ( currentValues !== null ){
        const parsed = JSON.parse(currentValues); // now it's an obj
        const currentQ = parsed.quantity;
        const updatedQ = currentQ + 1;
        parsed.quantity = updatedQ;
        sessionStorage.setItem(k, JSON.stringify(parsed)) // storing it back in the storage as a string
        // now updating the quantity shown on the page
        q.textContent = updatedQ.toString();
    } else {
        q.textContent = '1';
        const tempVal = { key: k, model:m ,price:p, quantity: parseInt(q.textContent)};
        sessionStorage.setItem(k, JSON.stringify(tempVal));
    }
    sessionStorage.setItem('total', `${total + p}`);
}


////Function to remove item from cart
function removeFromCart(k,q,p){
    const currentValues = sessionStorage.getItem(k);
    const total = parseInt(sessionStorage.getItem('total'));
    if ( currentValues !== null) {
       const parsed = JSON.parse(currentValues);
       const currentQ = parsed.quantity ;
       if (currentQ === 1){
          sessionStorage.removeItem(k);
          q.textContent = '0';
       } else if( currentQ > 1){
          parsed.quantity -= 1;
          sessionStorage.setItem(k,JSON.stringify(parsed));
          q.textContent = (currentQ-1).toString();
       }
       if((total-p) < 0){
        sessionStorage.setItem('total','0');
       } else{
        sessionStorage.setItem('total', `${total - p}`);
       }
    }     
}

////
function convertPrice(priceString) {
    let convertedP = parseInt(priceString.replace('$', '').replace(/,/g, ''));
    return convertedP;
}

