(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = value => value === 0 ? "Free" : "$" + Number(value).toFixed(2);
  const starterListings = [
    {id:"bb001",title:"Cozy Forest Starter Base",category:"Builds",edition:"Both",price:4.5,creator:"NovaBuilds",badge:"COMMUNITY PICK",icon:"🏡",art:"art-build",description:"A warm, detailed starter base concept surrounded by forest scenery. Check the creator's final file list before use.",featured:1},
    {id:"bb002",title:"Mossbound Adventurer",category:"Skins",edition:"Java",price:1.25,creator:"CraftedRealm",badge:"FRESH FIND",icon:"🧑‍🌾",art:"art-skin",description:"An earthy adventurer-inspired skin concept with a woodland palette.",featured:2},
    {id:"bb003",title:"Sky Isles Explorer Map",category:"Maps",edition:"Bedrock",price:3.75,creator:"AxolotlWorks",badge:"EDITOR'S PICK",icon:"🗺️",art:"art-map",description:"A floating-island adventure concept for explorers. Confirm version compatibility with the creator.",featured:3},
    {id:"bb004",title:"Emerald Server Bundle",category:"Server items",edition:"Both",price:5,creator:"AxolotlWorks",badge:"POPULAR STYLE",icon:"💎",art:"art-server",description:"A sample server cosmetics bundle concept. No server rank or digital delivery is actually connected.",featured:4},
    {id:"bb005",title:"Golden Hour Cottage",category:"Builds",edition:"Java",price:2.5,creator:"NovaBuilds",badge:"SMALL BUT MIGHTY",icon:"🏠",art:"art-gold",description:"A compact cottage concept with a golden palette for a cosy survival world.",featured:5},
    {id:"bb006",title:"Moonlit Wanderer",category:"Skins",edition:"Both",price:1.5,creator:"CraftedRealm",badge:"STYLE FIND",icon:"🌙",art:"art-night",description:"A night-sky-inspired character skin concept. Preview and verify the actual file before use.",featured:6},
    {id:"bb007",title:"Cherry Grove Quest",category:"Maps",edition:"Java",price:6.25,creator:"AxolotlWorks",badge:"ADVENTURE READY",icon:"🌸",art:"art-pink",description:"A sample quest-map concept set around a colourful grove. This is illustrative catalogue content.",featured:7},
    {id:"bb008",title:"Wildwood Build Pack",category:"Builds",edition:"Bedrock",price:3,creator:"NovaBuilds",badge:"BUILDERS' PICK",icon:"🌳",art:"art-forest",description:"A nature-inspired building pack concept for players who love organic shapes and green spaces.",featured:8}
  ];
  const state = {category:"All",query:"",edition:"All",sort:"featured",filterOpen:true};
  let listings = [...starterListings];
  let saved = load("bb_saved", []);
  let drafts = load("bb_drafts", []);
  const grid = $("#productGrid");
  const toastEl = $("#toast");
  let toastTimer;
  function load(key, fallback){try{const value=JSON.parse(localStorage.getItem(key));return value ?? fallback}catch{return fallback}}
  function persist(){try{localStorage.setItem("bb_saved",JSON.stringify(saved));localStorage.setItem("bb_drafts",JSON.stringify(drafts))}catch{}}
  function toast(message){toastEl.textContent=message;toastEl.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove("show"),2500)}
  function safeText(value){return String(value).replace(/[&<>"']/g, char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
  function allListings(){return [...listings,...drafts.map((d,i)=>({...d,id:d.id||"draft-"+i,badge:"LOCAL DRAFT",art:"art-build",icon:"✳",featured:100+i,isDraft:true}))]}
  function filteredListings(){
    let items=allListings().filter(item=>{
      const haystack=[item.title,item.category,item.creator,item.description].join(" ").toLowerCase();
      const categoryOk=state.category==="All"||item.category===state.category;
      const editionOk=state.edition==="All"||item.edition===state.edition||item.edition==="Both";
      return categoryOk&&editionOk&&haystack.includes(state.query.toLowerCase());
    });
    if(state.sort==="low")items.sort((a,b)=>a.price-b.price);
    else if(state.sort==="high")items.sort((a,b)=>b.price-a.price);
    else if(state.sort==="name")items.sort((a,b)=>a.title.localeCompare(b.title));
    else items.sort((a,b)=>a.featured-b.featured);
    return items;
  }
  function render(){
    const items=filteredListings();
    grid.innerHTML=items.map(item=>`
      <article class="product-card">
        <div class="product-art ${item.art}"><span class="product-badge">${safeText(item.badge)}</span><span class="edition-badge">${safeText(item.edition==="Both"?"JAVA + BEDROCK":item.edition.toUpperCase())}</span><span class="shape" aria-hidden="true">${safeText(item.icon)}</span><button class="favorite-button ${saved.includes(item.id)?"saved":""}" data-save="${safeText(item.id)}" aria-label="${saved.includes(item.id)?"Remove from":"Save to"} shortlist">${saved.includes(item.id)?"♥":"♡"}</button></div>
        <div class="product-info"><div class="product-meta"><span>${safeText(item.category)}</span><span>${item.isDraft?"YOUR DRAFT":"BLOCKBUY SELECTS"}</span></div><h3 title="${safeText(item.title)}">${safeText(item.title)}</h3><p class="product-description">${safeText(item.description)}</p><div class="product-footer"><div class="product-price">${money(item.price)} <small>USD</small></div><button class="view-button" data-view="${safeText(item.id)}">View details ↗</button></div></div>
      </article>`).join("");
    $("#emptyState").classList.toggle("hidden",items.length!==0);
    grid.classList.toggle("hidden",items.length===0);
    $("#resultsLabel").textContent=`Showing ${items.length} ${items.length===1?"drop":"drops"}`;
    $("#allCount").textContent=String(allListings().length).padStart(2,"0");
    $("#savedCount").textContent=saved.length;
    $$("#categoryFilters .filter-pill").forEach(btn=>btn.classList.toggle("selected",btn.dataset.category===state.category));
  }
  function findItem(id){return allListings().find(item=>item.id===id)}
  function openListing(id){
    const item=findItem(id);if(!item)return;
    $("#listingDetail").innerHTML=`<div class="detail-art ${item.art}">${safeText(item.icon)}</div><div class="modal-eyebrow">${safeText(item.category)} / LISTING DETAILS</div><h2>${safeText(item.title)}</h2><div class="detail-tags"><span class="detail-tag">${safeText(item.edition==="Both"?"JAVA + BEDROCK":item.edition.toUpperCase())}</span><span class="detail-tag">${item.isDraft?"LOCAL DRAFT":"SAMPLE LISTING"}</span><span class="detail-tag">${safeText(item.badge)}</span></div><p class="detail-description">${safeText(item.description)}</p><div class="detail-creator">CREATOR <strong>${safeText(item.creator)}</strong><br><br>PRICE <strong>${money(item.price)} USD</strong></div><div class="detail-actions"><button class="button button-primary" id="detailSave">${saved.includes(item.id)?"♥ Saved to shortlist":"♡ Save this drop"}</button><button class="button button-quiet" data-close="listingDialog">Close</button></div><p class="form-note" style="margin-top:15px">Sample catalogue only. This website does not process payments, guarantee item availability or deliver in-game content.</p>`;
    $("#detailSave").addEventListener("click",()=>toggleSaved(item.id));
    $("#listingDialog").showModal();
  }
  function toggleSaved(id){saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];persist();render();if($("#listingDialog").open)openListing(id);toast(saved.includes(id)?"Added to your shortlist":"Removed from your shortlist")}
  function openSaved(){
    const items=saved.map(findItem).filter(Boolean);
    $("#savedItems").innerHTML=items.length?items.map(item=>`<div class="saved-row"><div class="saved-mini ${item.art}">${safeText(item.icon)}</div><div><strong>${safeText(item.title)}</strong><small>${money(item.price)} USD · ${safeText(item.category)}</small></div><button data-unsave="${safeText(item.id)}" aria-label="Remove saved item">×</button></div>`).join(""):`<div class="saved-empty">Your shortlist is empty. Save a drop you like and it will show up here on this browser.</div>`;
    $("#savedDialog").showModal();
  }
  $("#searchInput").addEventListener("input",e=>{state.query=e.target.value;render()});
  $$("#categoryFilters .filter-pill").forEach(btn=>btn.addEventListener("click",()=>{state.category=btn.dataset.category;render()}));
  $("#editionFilter").addEventListener("change",e=>{state.edition=e.target.value;render()});
  $("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;render()});
  $("#filterToggle").addEventListener("click",()=>{$("#filterRow").classList.toggle("hidden");state.filterOpen=!$("#filterRow").classList.contains("hidden")});
  $("#clearFilters").addEventListener("click",()=>{state.category="All";state.query="";state.edition="All";state.sort="featured";$("#searchInput").value="";$("#editionFilter").value="All";$("#sortSelect").value="featured";render()});
  $$("[data-jump-category]").forEach(btn=>btn.addEventListener("click",()=>{state.category=btn.dataset.jumpCategory;render();location.hash="#marketplace"}));
  grid.addEventListener("click",e=>{const saveButton=e.target.closest("[data-save]");const viewButton=e.target.closest("[data-view]");if(saveButton)toggleSaved(saveButton.dataset.save);if(viewButton)openListing(viewButton.dataset.view)});
  $("#bagButton").addEventListener("click",openSaved);
  $("#savedItems").addEventListener("click",e=>{const btn=e.target.closest("[data-unsave]");if(btn){saved=saved.filter(id=>id!==btn.dataset.unsave);persist();render();openSaved()}});
  $("#openSell").addEventListener("click",()=>$("#sellDialog").showModal());
  $("#sellForm").addEventListener("submit",e=>{
    e.preventDefault();const data=new FormData(e.currentTarget);
    const draft={id:"draft-"+Date.now(),title:String(data.get("title")).trim(),category:String(data.get("category")),edition:String(data.get("edition")),price:Number(data.get("price")),creator:String(data.get("creator")).trim(),description:String(data.get("description")).trim(),badge:"LOCAL DRAFT",art:"art-build",icon:"✳",featured:100+drafts.length,isDraft:true};
    if(!draft.title||!draft.creator||!draft.description||!Number.isFinite(draft.price)||draft.price<0){toast("Please check the listing details.");return}
    drafts.unshift(draft);persist();e.currentTarget.reset();$("#sellDialog").close();state.category="All";state.query="";$("#searchInput").value="";render();location.hash="#marketplace";toast("Draft saved on this browser"); 
  });
  document.addEventListener("click",e=>{const closer=e.target.closest("[data-close]");if(closer){const dialog=$("#"+closer.dataset.close);if(dialog?.open)dialog.close()}});
  $("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark-mode");try{localStorage.setItem("bb_dark",document.body.classList.contains("dark-mode")?"1":"0")}catch{}});
  try{if(localStorage.getItem("bb_dark")==="1")document.body.classList.add("dark-mode")}catch{}
  $("#mobileMenu").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
  $$("#mainNav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
  $("#aboutLink").addEventListener("click",e=>{e.preventDefault();toast("BlockBuy is an independent marketplace concept.")});
  $("#safetyLink").addEventListener("click",e=>{e.preventDefault();toast("Review creator details and never share private information.")});
  document.addEventListener("keydown",e=>{if(e.key==="/"&&!/input|textarea/i.test(document.activeElement.tagName)){e.preventDefault();$("#searchInput").focus()}});
  $("#year").textContent=new Date().getFullYear();
  render();
})();