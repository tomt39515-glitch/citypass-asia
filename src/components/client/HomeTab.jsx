import { Bell, QrCode, Utensils, Hotel, ShoppingBag, PartyPopper, MapPin } from "lucide-react";

export default function HomeTab({ onChangeTab }) {
  const categories = [
    { title: "Рестораны", count: "126 мест", icon: <Utensils size={20} />, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200" },
    { title: "Отели", count: "42 объекта", icon: <Hotel size={20} />, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200" },
    { title: "Магазины", count: "78 мест", icon: <ShoppingBag size={20} />, image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200" },
    { title: "Развлечения", count: "35 мест", icon: <PartyPopper size={20} />, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200" },
  ];

  return (
    <div style={{ background:"#f6f8fb", minHeight:"100vh", fontFamily:"Inter,system-ui,sans-serif" }}>
      <div style={{ maxWidth:480, margin:"0 auto", padding:16, paddingBottom:120 }}>

        <div style={{
          height:520,
          borderRadius:32,
          overflow:"hidden",
          position:"relative",
          backgroundImage:"url('https://images.unsplash.com/photo-1528127269322-539801943592?w=2000')",
          backgroundSize:"cover",
          backgroundPosition:"center"
        }}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.72),rgba(0,0,0,.12))"}} />

          <div style={{position:"absolute",top:24,left:24,right:24,display:"flex",justifyContent:"space-between"}}>
            <div style={{color:"#fff"}}>
              <div style={{fontSize:26,fontWeight:800}}>CityPass Asia</div>
              <div style={{fontSize:14}}>Клуб привилегий в Азии</div>
            </div>

            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{background:"#ECD06F",padding:"12px 20px",borderRadius:999,fontWeight:800}}>CLUB</div>
              <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
                <Bell size={20}/>
              </div>
            </div>
          </div>

          <div style={{position:"absolute",left:24,right:24,bottom:32,color:"#fff"}}>
            <div style={{fontSize:56,fontWeight:800,lineHeight:1.05}}>
              Откройте Азию<br/>с привилегиями
            </div>
            <div style={{marginTop:16,fontSize:18,maxWidth:340,lineHeight:1.5}}>
              Эксклюзивные предложения в ресторанах, отелях, магазинах и сервисах для участников CityPass Club.
            </div>
          </div>
        </div>

        <div onClick={()=>onChangeTab?.("qr")} style={{
          marginTop:-30,
          position:"relative",
          background:"linear-gradient(135deg,#0e8f8f,#06656c)",
          color:"#fff",
          borderRadius:28,
          padding:24,
          display:"flex",
          alignItems:"center",
          gap:18,
          boxShadow:"0 10px 30px rgba(0,0,0,.15)"
        }}>
          <div style={{background:"#fff",width:72,height:72,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",color:"#06656c"}}>
            <QrCode size={42}/>
          </div>
          <div>
            <div style={{fontSize:18,fontWeight:800}}>Показать QR-код</div>
            <div style={{opacity:.9}}>Откройте код для получения привилегий</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:18}}>
          {categories.map(c=>(
            <div key={c.title} style={{position:"relative",height:170,borderRadius:22,overflow:"hidden"}}>
              <img src={c.image} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.75),transparent)"}}/>
              <div style={{position:"absolute",top:10,left:10,width:36,height:36,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{c.icon}</div>
              <div style={{position:"absolute",left:10,bottom:10,color:"#fff"}}>
                <div style={{fontWeight:700}}>{c.title}</div>
                <div style={{fontSize:12}}>{c.count}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:18,background:"linear-gradient(135deg,#015d63,#037f87)",color:"#fff",borderRadius:28,padding:24}}>
          <div>Вы сэкономили</div>
          <div style={{fontSize:48,fontWeight:800}}>12 458 000 ₫</div>
          <div>за всё время</div>
        </div>

        <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2>Рядом с вами</h2>
          <div style={{color:"#0e8f8f"}}>Смотреть все</div>
        </div>

        <div style={{display:"flex",gap:12,overflowX:"auto"}}>
          {[1,2,3,4].map(i=>(
            <div key={i} style={{minWidth:170,height:180,borderRadius:20,overflow:"hidden",position:"relative"}}>
              <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.75),transparent)"}}/>
              <div style={{position:"absolute",left:12,bottom:12,color:"#fff"}}>Duck Cafe</div>
            </div>
          ))}
        </div>

        <div style={{marginTop:20,textAlign:"center"}}>
          <button onClick={()=>onChangeTab?.("map")} style={{background:"#0b7777",color:"#fff",border:"none",padding:"18px 30px",borderRadius:999}}>
            <MapPin size={20} style={{verticalAlign:"middle"}}/> Смотреть на карте
          </button>
        </div>
      </div>
    </div>
  );
}
