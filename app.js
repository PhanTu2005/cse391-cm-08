import { categories, products } from "./data.js";

import {
    lineTotal,
    inventoryValue,
    stockLevel,
    findProductBySku,
    countByCategory
} from "./helpers.js";

console.log(inventoryValue(products));

console.log(
    stockLevel(10),
    stockLevel(3),
    stockLevel(1)
);

function renderStats(){

    const el =
        document.querySelector("#stats");

    if(!el)
        return;

    const total =
        inventoryValue(products);

    el.textContent =
`So san pham = ${products.length}
Tong gia tri kho = ${total}`;

}

renderStats();

function categoryName(id) {

    const c = categories.find(cat => cat.id === id);

    if (c) {
        return c.name;
    }

    return "?";

}

function render(list) {

    const grid =
        document.querySelector(
            '[data-testid="cm-product-table"]'
        );

    grid.innerHTML = "";

    for (const p of list) {

        const card =
            document.createElement("article");

        card.className = "cm-card";

        card.dataset.testid = "cm-product-row";

        card.dataset.sku = p.sku;



        const h3 = document.createElement("h3");
        h3.className = "cm-card-title";    
        h3.textContent = p.name;



        const cat =
            document.createElement("p");

        cat.className = "cm-card-category";

        cat.textContent =
            categoryName(p.category_id);



        const price =
            document.createElement("p");

        price.className = "cm-card-price";

        price.textContent =
            String(p.price);



        const stock =
            document.createElement("p");

        stock.className = "cm-stock";

        stock.textContent =
            stockLevel(p.qty);



        card.append(
            h3,
            cat,
            price,
            stock
        );

        grid.appendChild(card);

    }

    const countEl =
        document.querySelector(
            '[data-testid="cm-visible-count"]'
        );

    if (countEl) {
        countEl.textContent = `Hien thi: ${list.length} san pham`;
    }
    }

let currentList = products;
render(products);

const select = document.querySelector(
    '[data-testid="cm-filter-category"]'
);

function applyFilter(v){

    currentList =
        v === "all"
            ? products
            : products.filter(
                p => p.category_id === Number(v)
            );

    render(currentList);

}


select.addEventListener("change", () => {

    const v = select.value;

    localStorage.setItem(
        "cm_filter",
        v
    );

    applyFilter(v);

});


const savedFilter =
    localStorage.getItem("cm_filter") ?? "all";


select.value = savedFilter;

applyFilter(savedFilter);

document
    .querySelector("#sort-price")
    .addEventListener("click", () => {

        const sorted =
            [...currentList].sort(
                (a, b) => a.price - b.price
            );

        currentList = sorted;
        render(currentList);
    }
    );

const grid = document.querySelector(
    '[data-testid="cm-product-table"]'
);

grid.addEventListener("click", (e) => {

    const card =
        e.target.closest(".cm-card");

    if (!card)
        return;

    console.log(
        "Ban vua bam card:",
        card.dataset.sku
    );

});

categories.forEach(cat=>{

    const subset=
        products.filter(
            p=>p.category_id===cat.id
        );

    console.log(

        cat.name,

        subset.length,

        inventoryValue(subset)

    );

});

const subscribeForm =
document.querySelector(
    '[data-testid="cm-subscribe-form"]'
);


const formMsg =
document.querySelector("#form-msg");


subscribeForm.addEventListener(
"submit",
(e)=>{

    e.preventDefault();


    const name =
        subscribeForm.name.value.trim();


    const email =
        subscribeForm.email.value.trim();


    const category_id =
        subscribeForm.category_id.value;



    const errors=[];


    if(name.length < 2)
        errors.push(
            "Ten toi thieu 2 ky tu"
        );


    if(!/^\S+@\S+\.\S+$/.test(email))
        errors.push(
            "Email khong hop le"
        );


    if(errors.length){

        formMsg.textContent =
            errors.join(". ");

        formMsg.className =
            "cm-error";

        return;

    }



    const list =
        JSON.parse(
            localStorage.getItem(
                "cm_subscribers"
            ) ?? "[]"
        );


    list.push({

        name,
        email,
        category_id

    });


    localStorage.setItem(
        "cm_subscribers",
        JSON.stringify(list)
    );


    formMsg.textContent =
        "Dang ky thanh cong";


    formMsg.className =
        "cm-success";


    subscribeForm.reset();


    renderSubscribers();

});

const addForm =
document.querySelector(
    '[data-testid="cm-product-form"]'
);


const productMsg =
document.querySelector(
    "#product-form-msg"
);

if(addForm){
    addForm.addEventListener(
    "submit",
    (e)=>{

        e.preventDefault();


        const sku =
            addForm.sku.value.trim();


        const name =
            addForm.name.value.trim();


        const category_id =
            Number(addForm.category_id.value);


        const price =
            Number(addForm.price.value);


        const qty =
            Number(addForm.qty.value);



        if(
            !sku ||
            !name ||
            !category_id
        ){

            productMsg.textContent =
            "Thieu thong tin bat buoc";
            return;

        }



        if(price <=0){

            productMsg.textContent =
            "Gia phai lon hon 0";

            return;

        }



        if(findProductBySku(products,sku)){

            productMsg.textContent =
            "SKU da ton tai";

            return;

        }



        const item={

            sku,
            name,
            category_id,
            price,
            qty

        };


        products.push(item);

        productMsg.textContent = "";


        applyFilter(
            select.value
        );

        renderStats();


        addForm.reset();
        productMsg.textContent = "";

    }
    );
}
function renderSubscribers(){

    const ul =
    document.querySelector(
        '[data-testid="cm-subscriber-list"]'
    );


    if(!ul)
        return;


    ul.innerHTML="";


    const list =
    JSON.parse(
        localStorage.getItem(
            "cm_subscribers"
        ) ?? "[]"
    );


    list.forEach(s=>{

        const li =
        document.createElement("li");


        li.textContent =
        `${s.name} — ${s.email}`;


        ul.appendChild(li);

    });

}


renderSubscribers();