const DEFAULT_AMAZON_TAG="YOURTAG-20";
const CATS=[["electronics", "Electronics", "Audio, tech, kits"], ["fashion", "Fashion", "Apparel & watches"], ["home", "Home", "Kitchen & living"], ["beauty", "Beauty", "Skin & fragrance"], ["sports", "Sports", "Train & recover"], ["books", "Books", "Read & learn"], ["toys", "Toys", "Play & build"]];
let products=[];
let productsLoaded=false;
const WISH="velora_wishlist_v1", CART="velora_cart_v1";
let filter="all";


function money(c){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:c%100===0?0:2}).format(c/100)}
async function loadProducts(){
  try{
    const response=await fetch("./products.json",{cache:"no-store"});
    if(!response.ok) throw new Error("products.json HTTP "+response.status);
    const data=await response.json();
    if(!Array.isArray(data)) throw new Error("products.json must contain an array");
    products=data;
    productsLoaded=true;
    buildCats();
    setHeroImages();
    render();
    updateCart();
  }catch(error){
    console.error("Velora catalog load failed:",error);
    document.getElementById("products").innerHTML='<div class="empty">Catalog could not be loaded. Please check that <strong>products.json</strong> is in the same GitHub folder as index.html.</div>';
    document.getElementById("featured").innerHTML='';
    document.getElementById("resultCount").textContent='';
  }
}

function setHeroImages(){
  const byCat=(cat)=>products.find(p=>p.category===cat && p.image);
  const e=byCat("electronics"), f=byCat("fashion"), h=byCat("home");
  if(e) document.getElementById("heroE").src=e.image;
  if(f) document.getElementById("heroF").src=f.image;
  if(h) document.getElementById("heroH").src=h.image;
}

function amazon(p){
  if(p.amazonUrl) return p.amazonUrl;
  const u=new URL("https://www.amazon.com/s");
  u.searchParams.set("k",p.query||p.title);
  u.searchParams.set("tag",p.affiliateTag||DEFAULT_AMAZON_TAG);
  return u.toString();
}
function renderCard(p){let w=JSON.parse(localStorage.getItem(WISH)||"[]").includes(p.slug);return `<article class="card"><div class="pic"><img src="${esc(p.image||p.imageUrl||"")}" alt="${esc(p.title)}" loading="lazy"><div class="badges">${p.badge?`<span class="badge">${esc(p.badge)}</span>`:""}</div><button class="heart" onclick="toggleWish('${esc(p.slug)}');event.stopPropagation()">${w?"♥":"♡"}</button></div><div class="body"><div class="brandtxt">${esc(p.brand||"")}</div><a class="title" href="#" onclick="openProduct('${esc(p.slug)}');return false">${esc(p.title)}</a><div class="rating">★ ${Number(p.rating||0).toFixed(1)} · ${Number(p.reviewCount||0).toLocaleString()} reviews</div><div class="buy"><button class="primary" onclick="buy('${esc(p.slug)}');event.stopPropagation()">${esc(p.buttonText||"Check Price")} ↗</button></div></div></article>`}
function filtered(){let q=document.getElementById("search").value.toLowerCase().trim();let a=products.filter(p=>(filter==="all"||p.category===filter)&&(!q||[p.title,p.brand,p.description,p.category].join(" ").toLowerCase().includes(q)));let s=document.getElementById("sort").value;if(s==="rating")a.sort((a,b)=>(b.rating||0)-(a.rating||0));if(s==="newest")a.sort((a,b)=>(b.featured?1:0)-(a.featured?1:0));if(s==="popular")a.sort((a,b)=>(b.soldCount||0)-(a.soldCount||0));return a}
function render(){let a=filtered();document.getElementById("products").innerHTML=a.length?a.map(renderCard).join(""):'<div class="empty">No products found.</div>';document.getElementById("resultCount").textContent=a.length+" products";document.getElementById("featured").innerHTML=products.filter(p=>p.featured).slice(0,8).map(renderCard).join("")}
function filterCat(c){filter=c;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.cat===c));render();document.getElementById("shop").scrollIntoView({behavior:"smooth"})}
function buildCats(){document.getElementById("categories").innerHTML='<button class="chip active" data-cat="all" onclick="filterCat(\'all\')">All</button>'+CATS.map(c=>`<button class="chip" data-cat="${c[0]}" onclick="filterCat('${c[0]}')">${c[1]}</button>`).join("")}
function openProduct(slug){let p=products.find(x=>x.slug===slug);if(!p)return;document.getElementById("modalPanel").innerHTML=`<button class="close" onclick="closeModal()">×</button><div class="productView"><img src="${esc(p.image||p.imageUrl||"")}" alt="${esc(p.title)}"><div class="pv"><div class="brandtxt">${esc(p.brand||"")}</div><h2>${esc(p.title)}</h2><div class="rating">★ ${Number(p.rating||0).toFixed(1)} · ${Number(p.reviewCount||0).toLocaleString()} reviews</div><p class="desc">${esc(p.description||"")}</p><div class="buy"><button class="primary" onclick="buy('${esc(p.slug)}')">${esc(p.buttonText||"Check Price")} ↗</button></div><p class="mini">Clicking the button takes you to Amazon. Product price and availability are shown on Amazon.</p></div></div>`;document.getElementById("modal").classList.add("show")}
function closeModal(){document.getElementById("modal").classList.remove("show")}
function buy(slug){let p=products.find(x=>x.slug===slug);if(p)window.open(amazon(p),"_blank","noopener,noreferrer")}
function toggleWish(slug){let w=JSON.parse(localStorage.getItem(WISH)||"[]");w=w.includes(slug)?w.filter(x=>x!==slug):[...w,slug];localStorage.setItem(WISH,JSON.stringify(w));render()}
function cart(){return JSON.parse(localStorage.getItem(CART)||"[]")}
function addCart(slug){let c=cart();c.push(slug);localStorage.setItem(CART,JSON.stringify(c));updateCart();alert("Added to bag")}
function updateCart(){document.getElementById("cartCount").textContent=cart().length}

loadProducts();
function openCart(){let c=cart(),ps=c.map(s=>products.find(p=>p.slug===s)).filter(Boolean);document.getElementById("modalPanel").innerHTML=`<button class="close" onclick="closeModal()">×</button><h2>Your bag</h2>${ps.length?ps.map(p=>`<div class="bagItem"><img src="${esc(p.image||p.imageUrl||"")}"><div class="grow"><strong>${esc(p.title)}</strong><div class="mini">${esc(p.brand||"")}</div></div><button class="primary" onclick="buy('${esc(p.slug)}')">${esc(p.buttonText||"Check Price")} ↗</button></div>`).join(""):'<p class="desc">Your bag is empty.</p>'}<p class="mini">Checkout and final price are handled on Amazon.</p>`;document.getElementById("modal").classList.add("show")}
