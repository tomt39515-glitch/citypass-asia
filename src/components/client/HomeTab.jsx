import heroImage from "../../assets/citypass-hero.png";
import { Bell, QrCode, Utensils, Hotel, ShoppingBag, PartyPopper, MapPin } from "lucide-react";

export default function HomeTab({ onChangeTab }) {
const userName =
  window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || "Гость";

  const categories = [
    { title: "Рестораны", count: "126 мест", icon: <Utensils size={20} />, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200" },
    { title: "Отели", count: "42 объекта", icon: <Hotel size={20} />, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200" },
    { title: "Магазины", count: "78 мест", icon: <ShoppingBag size={20} />, image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200" },
    { title: "Развлечения", count: "35 мест", icon: <PartyPopper size={20} />, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200" },
  ];

  return (
    <div style={{ background:"#f6f8fb", minHeight:"100vh", fontFamily:"Inter,system-ui,sans-serif" }}>
      <div style={{
  width:"100vw",
  paddingBottom:120
}}>
        <div style={{
          height:"85vh",
          minHeight:720,
          borderBottomLeftRadius:36,
          borderBottomRightRadius:36,
          overflow:"hidden",
          position:"relative",
          backgroundImage:`url(${heroImage})`,
          backgroundSize:"cover",
          backgroundPosition:"center"
        }}>
          <div style={{
            position:"absolute",
            inset:0,
            background:"linear-gradient(to top,rgba(0,0,0,.60),rgba(0,0,0,.05))"
          }} />

          <div style={{
            position:"absolute",
            top:-4,
            left:20,
            right:20,
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            zIndex:10
          }}>
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

          <div style={{
            position:"absolute",
            left:24,
            right:24,
            top:170,
            color:"#fff",
            zIndex:10
          }}>
            <div style={{fontSize:42,fontWeight:800,lineHeight:1.1}}>
              Добро пожаловать,
              <br />
              {userName} 👋
            </div>

            <div style={{
              marginTop:16,
              fontSize:18,
              maxWidth:340,
              lineHeight:1.5
            }}>
              Скидки, бонусы и специальные предложения по всей Азии
            </div>
          </div>
        </div>

        <div onClick={()=>onChangeTab?.("qr")} style={{
          marginTop:-60,
          marginLeft:16,
          marginRight:16,
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
            <div style={{fontSize:20,fontWeight:800}}>Моя карта CityPass</div>
            <div style={{opacity:.9}}>Откройте QR-код для получения привилегий</div>
          </div>
        </div>
      </div>
    </div>
  );
}
