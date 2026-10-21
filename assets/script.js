(function(){
  var HOOK="https://script.google.com/macros/s/AKfycbytKE5UHxCyEIPxl-70AQ61kSSPe4sZFQK9DxJwSK0nRPXlPyCYNJCwSCNkELjo7YR4ZQ/exec";
  var MID=113663923;
  function lead(){var mk=function(){return "S"+Math.random().toString(36).slice(2,6).toUpperCase()};try{var id=localStorage.getItem("pd_lead");if(!id){id=mk();localStorage.setItem("pd_lead",id)}return id}catch(e){return window._lid||(window._lid=mk())}}
  function send(ev,text,extra){
    var d={ev:ev||"",text:text||"",lead:lead(),test:"Личный сайт",page:location.pathname,ref:(document.referrer||"").slice(0,200),q:(location.search||"").slice(0,200),ua:(navigator.userAgent||"").slice(0,150)};
    if(extra)for(var k in extra)d[k]=extra[k];
    var body=JSON.stringify(d);
    try{if(navigator.sendBeacon&&navigator.sendBeacon(HOOK,new Blob([body],{type:"text/plain;charset=utf-8"})))return}catch(e){}
    try{fetch(HOOK,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:body,keepalive:true})}catch(e){}
  }
  function goal(g){try{if(window.ym)ym(MID,"reachGoal",g)}catch(e){}}
  // визит
  send("visit","");
  // клики по ключевым кнопкам
  var TXT={pay_click:"💳 С личного сайта нажали «Оплатить разбор» — проверьте Робокассу",booking_open:"📅 С личного сайта открыли запись на разбор"};
  document.addEventListener("click",function(e){var a=e.target.closest("[data-ev]");if(!a)return;var ev=a.getAttribute("data-ev");goal(ev);send(ev,(TXT[ev]||"")+(TXT[ev]?"\nЛид #"+lead():""))});
  // FAQ
  document.querySelectorAll(".faq-q").forEach(function(q){q.addEventListener("click",function(){q.parentNode.classList.toggle("open")})});
  // форма
  var f=document.getElementById("lead-form");
  if(f)f.addEventListener("submit",function(e){e.preventDefault();var st=document.getElementById("form-status");
    var n=f.name.value.trim(),c=f.contact.value.trim(),w=f.want.value,m=f.message.value.trim();
    if(!n||!c){st.textContent="Заполни имя и контакт";st.style.color="var(--pain)";return}
    if(!f.querySelector("#consent").checked){st.textContent="Отметь согласие с политикой конфиденциальности";st.style.color="var(--pain)";return}
    send("site_form","📝 ЗАЯВКА с личного сайта\nЛид #"+lead()+"\nИмя: "+n+"\nКонтакт: "+c+"\nИнтересно: "+w+(m?"\nСитуация: "+m:""),{name:n,info:w+" · "+c});
    goal("site_form");
    f.innerHTML='<p style="text-align:center;font-size:19px">Спасибо, '+n.replace(/[<>&]/g,"")+'! Заявка у меня. Напишу лично в ближайшее время.</p><p class="soft">А пока — <a href="https://t.me/pavel_draga_leads_bot?start=apteka" target="_blank" rel="noopener">забери бесплатную «Аптечку» →</a></p>';
  });
})();
