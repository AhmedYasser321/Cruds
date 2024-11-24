
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let create = document.getElementById("create");
let category = document.getElementById("category");
let count = document.getElementById("count");
let search = document.getElementById("search");
let inputs = document.querySelectorAll("input");
let tbody = document.getElementById("tbody");
let editButton = document.querySelectorAll(".edit");
let deleteButton = document.querySelectorAll(".delete");
let buttons = document.querySelector(".buttons");
let searchTitle = document.getElementById("search-title");
let searchCategory = document.getElementById("search-category");


window.onload = ()=>{
    title.focus()
}

let mood = "Create";

let general;

// document.addEventListener("keydown", e =>{
//     let index = Array.from(inputs).indexOf(e.target)
//     const nextInput = index + 1
//     const prevInput = index - 1
//     if(e.key === "ArrowRight"){
//         if(nextInput < inputs.length){
//             inputs[nextInput].focus();
//         }
//        }
//         if(e.key === "ArrowLeft"){
//             if(prevInput >= 0){
//             inputs[prevInput].focus();
//            }
//       }

//     if(e.key === "ArrowDown"){
//         if(nextInput < inputs.length){
//             inputs[nextInput].focus();
//             e.preventDefault();
//         }
//        }
//         if(e.key === "ArrowUp"){
//             if(prevInput >= 0){
//             inputs[prevInput].focus();
//             e.preventDefault();
//            }
//       }
//     //   if(nextInput >= inputs.length){
//     //     inputs[index].blur();
//     //     window.scrollTo({
//     //         top: document.body.scrollHeight,
//     //         behavior: 'smooth' 
//     //     });
//     //     console.log("focus")
//     //   }
  
// });

function getTotal(){
    if(price.value !== ""){
    let result = (+price.value) + (+taxes.value) +  (+ads.value) - (+discount.value)
    total.innerHTML = result;
}else{
    total.innerHTML = "";
}
};

document.addEventListener("input", getTotal);

let products;

if(window.localStorage.getItem("product") != null){
products = JSON.parse(window.localStorage.getItem("product"))
}else{
    products= [];
}

create.addEventListener("click", () =>{
    let product = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        category: category.value.toLowerCase(),
        count: count.value
    }
    if(title.value != "" 
        && price.value != "" 
        && category.value != ""){
    if(mood === "Create"){
        let num = product.count
        if(num > 1){
            for (let index = 0; index < num; index++) {
                products.push(product); 
            }
        }else{
            products.push(product)
        }
     }else{
        products[general] = product;
        create.innerHTML = "Create";
        mood = "Create";
        count.style.display = "block"
     }
     clearInputs();
}
    window.localStorage.setItem('product', JSON.stringify(products));
    createProducts();
})

function clearInputs(){
    Array.from(inputs).map(input => input.value = "");
    total.innerHTML = "";
};

let del = document.createElement("button")

function createProducts(){
if(products.length >= 0){
    let table = '';
    for(let i = 0; i < products.length; i++){
        table += `
    <tr>
      <td>${i + 1}</td>
      <td>${products[i].title}</td>
      <td>${products[i].price}</td>
      <td>${products[i].taxes}</td>
      <td>${products[i].ads}</td>
      <td>${products[i].discount}</td>
      <td>${products[i].total}</td>
      <td>${products[i].category}</td>
      <td class="edit" onclick="editProduct(${i})"><button>Edit</button></td>
      <td class="delete" onclick="deleteProduct(${i})"><button>Delete</button></td>
      </tr>
      `
}
tbody.innerHTML= table;
}

if(products.length > 1){
    del.innerHTML = `Delete All (${products.length})`
    del.className = "delete-all"
    buttons.after(del);
    del.onclick = deleteAll;
}else{
    del.innerHTML = "";
    del.remove()
}

}


function deleteProduct(button) {
   products.splice(button,1);
   window.localStorage.product = JSON.stringify(products);
   createProducts();
}

    createProducts(); 

    function deleteAll(){
        let res = window.confirm("Are you sure you want to delete all ?")
       if(res){
        const searchValue = search.value.toLowerCase();
        products = products.filter(p=>{
             return !p.title.includes(searchValue) && !p.category.includes(searchValue)
         });
         window.localStorage.setItem("product" , JSON.stringify(products));
         createProducts();
         searchCategory.innerHTML = `Search By Category`
         searchTitle.innerHTML = `Search By Title` 
         search.value = "";
       }
    };

function editProduct(i){
    let index = products[i]
    title.value = index.title
    price.value = index.price
    taxes.value = index.taxes
    ads.value = index.ads
    discount.value = index.discount
    total.innerHTML = index.total
    category.value = index.category
    getTotal();
    count.style.display = "none";
    create.innerHTML = "Add";
    mood = "Add";
    general = i;
    scroll({
        top:0,
        behavior: "smooth"
    });
    setTimeout(()=>{
        title.focus()
    },1000);
}


search.addEventListener("input", () => {
    if (search.value.trim() === "") {
        searchCategory.innerHTML = `Search By Category`
        searchTitle.innerHTML = `Search By Title` 
        createProducts(); 
    }
});

searchTitle.onclick = _ =>{
   
 if(search.value.trim() !== ""){
     Search(searchTitle.id);
     let searchValue = search.value.toLowerCase();
     
    let pr = products.filter(p=> p.title.includes(searchValue));
    searchTitle.innerHTML = `Search By Title (${pr.length})`
    del.innerHTML = `Delete All (${pr.length})`
 }
};

searchCategory.onclick = _ =>{
    if(search.value != ""){
    Search(searchCategory.id);
    let searchValue = search.value.toLowerCase();
     
    let ca = products.filter(p=> p.category.includes(searchValue));
    searchCategory.innerHTML = `Search By Category (${ca.length})`    
    }
}

function Search(id){
    let table = '';
    for (let i = 0; i < products.length; i++) {
        if(id === "search-title"){
        if(products[i].title.includes(search.value.toLowerCase())){
            table += `
            <tr>
              <td>${i + 1}</td>
              <td>${products[i].title}</td>
              <td>${products[i].price}</td>
              <td>${products[i].taxes}</td>
              <td>${products[i].ads}</td>
              <td>${products[i].discount}</td>
              <td>${products[i].total}</td>
              <td>${products[i].category}</td>
              <td class="edit" onclick="editProduct(${i})"><button>Edit</button></td>
              <td class="delete" onclick="deleteProduct(${i})"><button>Delete</button></td>
              </tr>
              `
        }   
    }else{
            if(products[i].category.includes(search.value.toLowerCase())){
                table += `
                <tr>
                  <td>${i + 1}</td>
                  <td>${products[i].title}</td>
                  <td>${products[i].price}</td>
                  <td>${products[i].taxes}</td>
                  <td>${products[i].ads}</td>
                  <td>${products[i].discount}</td>
                  <td>${products[i].total}</td>
                  <td>${products[i].category}</td>
                  <td class="edit" onclick="editProduct(${i})"><button>Edit</button></td>
                  <td class="delete" onclick="deleteProduct(${i})"><button>Delete</button></td>
                  </tr>
                  `
            }     
    }
    }
    tbody.innerHTML= table;
}




















