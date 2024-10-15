document.addEventListener('DOMContentLoaded', ()=> {
    // removal of some default data if exist
    sessionStorage.removeItem('IsThisFirstTime_Log_From_LiveServer');
    sessionStorage.removeItem('bis_data');
    /// checking whether the cart is empty or not
    if( parseInt(sessionStorage.getItem('total')) !== 0 ){   
        loadData();
        addFunctionality();
    } else{
        document.querySelector('#tableID').setAttribute('style','display:none;');
        document.querySelector('#buttons').setAttribute('style','display:none;');    
    }

})


function loadData(){
    const priceID = document.querySelector('#priceID');
    priceID.textContent = `$${sessionStorage.getItem('total')}`;
    // disable the empty cart text
    document.querySelector('#ifEmpty').setAttribute('style','display:none;');

    for(let i = 0; i < sessionStorage.length; i++){
        const key = sessionStorage.key(i);
        if(key === 'total'){ continue } else {
            const data = JSON.parse(sessionStorage.getItem(key));
            // load the table body
            const tableBody = document.querySelector('.tableBody');
            // create a table row
            const newRow = document.createElement('tr');
            newRow.classList.add('row')
            newRow.id = key; // key for each item works as unique ID
            // create 3 table data then append them  to table row
            const data1 = document.createElement('td');
            data1.textContent = data.model;
            data1.classList.add('data1');
            const data2 = document.createElement('td');
            data2.textContent = `$${data.price}`;
            data2.classList.add('data2');        
            const data3 = document.createElement('td');
            // create a div to hold icons and quantity
            const newDiv = document.createElement('div'); 
            newDiv.classList.add('buttons-qt')          
            // plus icon
            const plusIcon = document.createElement('i');
            plusIcon.classList.add('bi-plus-lg');
            // quantity
            const qt = document.createElement('h4');
            qt.classList.add('qt');
            qt.textContent = `${data.quantity}`;
            // minus icon
            const minusIcon = document.createElement('i');
            minusIcon.classList.add('bi-dash-lg');
            // add the icons and qt to div
            newDiv.appendChild(plusIcon);
            newDiv.appendChild(qt);
            newDiv.appendChild(minusIcon);
            // add the newDiv to data3
            data3.appendChild(newDiv);
            data3.classList.add('data3');
            // add all data to table row
            newRow.appendChild(data1);
            newRow.appendChild(data2);
            newRow.appendChild(data3);
            // finally, add the row to table body
            tableBody.appendChild(newRow);  
        };
    };
};


function addFunctionality(){

    /// decrement and increment func needed

    const clearCart = document.querySelector('#clearCart');
    const checkout = document.querySelector('#checkout');
    const plusIcons = document.querySelectorAll('.bi-plus-lg');
    const minusIcons= document.querySelectorAll('.bi-dash-lg');

    plusIcons.forEach((pIcon)=>{
        pIcon.addEventListener('click', ()=>{
            const rowInfoContainer = pIcon.closest('.row');
            const itemID = rowInfoContainer.id;
            const cartData = JSON.parse(sessionStorage.getItem(itemID));
            const cartTotal = parseInt(sessionStorage.getItem('total'));
            cartData.quantity += 1;
            // Update total price
            const priceID = document.querySelector('#priceID');
            const qtID = rowInfoContainer.querySelector('.qt'); // because qt is row specific
            priceID.textContent = `$${cartTotal + cartData.price}`;
            // Update item quantity
            qtID.textContent = `${cartData.quantity}`;
            //finally, update the data in cart accordingly 
            sessionStorage.setItem('total', cartTotal + cartData.price);
            sessionStorage.setItem(itemID, JSON.stringify(cartData));
        })
    })
    
    minusIcons.forEach((mIcon)=>{
        mIcon.addEventListener('click', ()=>{
            const rowInfoContainer = mIcon.closest('.row');
            const itemID = rowInfoContainer.id;
            const cartData = JSON.parse(sessionStorage.getItem(itemID));
            const cartTotal = parseInt(sessionStorage.getItem('total'));
            const priceID = document.querySelector('#priceID');
            const qtID = rowInfoContainer.querySelector('.qt');
            if( (cartTotal - cartData.price) === 0){
                sessionStorage.removeItem(itemID);
                sessionStorage.setItem('total',0);
                document.querySelector('#ifEmpty').setAttribute('style','display:block;');
                document.querySelector('#tableID').setAttribute('style','display:none;');
                document.querySelector('#buttons').setAttribute('style','display:none;');
            } else {
                if ((cartData.quantity - 1) === 0){
                    rowInfoContainer.setAttribute('style','display:none;');
                    sessionStorage.removeItem(itemID);
                    sessionStorage.setItem('total', cartTotal - cartData.price);
                    priceID.textContent = `$${cartTotal - cartData.price}`;
                } else{
                    cartData.quantity -= 1;
                    priceID.textContent = `$${cartTotal - cartData.price}`;
                    qtID.textContent = `${cartData.quantity}`;
                    sessionStorage.setItem('total', cartTotal - cartData.price);
                    sessionStorage.setItem(itemID, JSON.stringify(cartData));
                };
            };
        });
    });

    clearCart.addEventListener('click', ()=> {
        const confirmed = confirm("Cart will be cleared. Are you sure?");
        if (confirmed) {
            sessionStorage.clear();
            document.querySelector('#ifEmpty').setAttribute('style','display:block;');
            document.querySelector('#tableID').setAttribute('style','display:none;');
            document.querySelector('#buttons').setAttribute('style','display:none;');
        } else{
            alert("Cart wasn't cleared");
        }
    });
    checkout.addEventListener('click', ()=> {
        alert("You are dirt broke. Work hard!")
    });
};
