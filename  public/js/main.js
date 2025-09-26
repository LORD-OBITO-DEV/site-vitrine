// main client utilities
function openAdWindow(){
  const w = window.open("/show-ad", "AdWindow", "width=600,height=500");
  // start a 30s timer then call reward endpoint
  setTimeout(async ()=>{
    try{
      const res = await fetch("/api/reward", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ points: 2 })
      });
      const data = await res.json();
      alert("✅ +2 points ajoutés !");
      // update UI if element exists
      const el = document.getElementById("userPoints");
      if(el && data.points !== undefined) el.textContent = data.points;
      w.close();
    }catch(e){
      console.error(e);
      alert("Erreur réseau lors de l'ajout des points");
    }
  }, 30000);
}