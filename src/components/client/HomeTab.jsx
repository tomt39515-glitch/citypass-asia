export default function HomeTab({ onChangeTab }) {
  const categories = [
    { title: "Рестораны", icon: "🍽️", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    { title: "Отели", icon: "🏨", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200" },
    { title: "Магазины", icon: "🛍️", image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200" },
    { title: "Развлечения", icon: "🎉", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200" },
  ];

  const nearbyPartners = [
    { name: "Duck Cafe", rating: "4.8", distance: "180 м", discount: "-15%", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200" },
    { name: "Sailing Club", rating: "4.9", distance: "350 м", discount: "-20%", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    { name: "Sunrise Hotel", rating: "4.7", distance: "500 м", discount: "-10%", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200" },
  ];

  return (
    <div style={{background:"#F7FAFB",minHeight:"100vh"}}>
      <div style={{maxWidth:"480px",margin:"0 auto",padding:"16px",paddingBottom:"120px"}}>

        <div style={{
          position:"relative",
          height:"380px",
          borderRadius:"32px",
          overflow:"hidden",
          backgroundImage:"url('https://images.unsplash.com/photo-1528127269322-539801943592?w=2000')",
          backgroundSize:"cover",
          backgroundPosition:"center"
        }}>
          <div style={{
            position:"absolute",inset:0,
            background:"linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.15))"
          }}/>

          <div style={{
            position:"absolute",top:"18px",left:"18px",right:"18px",
            display:"flex",justifyContent:"space-between",alignItems:"center"
          }}>
            <div style={{
              background:"rgba(255,255,255,.18)",
              backdropFilter:"blur(10px)",
              padding:"10px 14px",
              borderRadius:"16px",
              color:"#fff"
            }}>
              <div style={{fontWeight:800,fontSize:"20px"}}>CityPass Asia</div>
              <div style={{fontSize:"12px",opacity:.9}}>Клуб привилегий</div>
            </div>

            <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
              <div style={{
                background:"#E8C75A",
                color:"#0F172A",
                padding:"10px 18px",
                borderRadius:"999px",
                fontWeight:700
              }}>CLUB</div>

              <div style={{
                width:"42px",height:"42px",
                borderRadius:"50%",
                background:"rgba(255,255,255,.18)",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                color:"#fff"
              }}>🔔</div>
            </div>
          </div>

          <div style={{
            position:"absolute",
            left:"24px",
            right:"24px",
            bottom:"28px",
            color:"#fff"
          }}>
            <h1 style={{
              margin:0,
              fontSize:"44px",
              lineHeight:"1.05",
              fontWeight:800
            }}>
              Откройте Азию
              <br/>
              с привилегиями
            </h1>

            <div style={{
              marginTop:"12px",
              maxWidth:"330px",
              lineHeight:"1.5"
            }}>
              Эксклюзивные предложения в ресторанах,
              отелях, магазинах и сервисах для участников CityPass Club.
            </div>
          </div>
        </div>

        <div
          onClick={() => onChangeTab?.("qr")}
          style={{
            marginTop:"16px",
            background:"linear-gradient(135deg,#14B8A6,#0F766E)",
            borderRadius:"28px",
            padding:"24px",
            color:"#fff",
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            cursor:"pointer"
          }}
        >
          <div>
            <div style={{fontSize:"12px",opacity:.85}}>CITYPASS CLUB</div>
            <div style={{fontSize:"28px",fontWeight:800,marginTop:"6px"}}>
              Показать QR-код
            </div>
            <div style={{marginTop:"6px"}}>
              Получайте привилегии у партнёров
            </div>
          </div>
          <div style={{fontSize:"42px"}}>🔳</div>
        </div>

        <div style={{
          marginTop:"16px",
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:"14px"
        }}>
          {categories.map((c)=>(
            <div key={c.title} style={{
              position:"relative",
              height:"190px",
              borderRadius:"24px",
              overflow:"hidden",
              backgroundImage:`url(${c.image})`,
              backgroundSize:"cover"
            }}>
              <div style={{
                position:"absolute",inset:0,
                background:"linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.05))"
              }}/>
              <div style={{
                position:"absolute",
                top:"12px",left:"12px",
                width:"42px",height:"42px",
                borderRadius:"50%",
                background:"#fff",
                display:"flex",
                alignItems:"center",
                justifyContent:"center"
              }}>{c.icon}</div>
              <div style={{
                position:"absolute",
                left:"14px",
                bottom:"14px",
                color:"#fff",
                fontWeight:800,
                fontSize:"18px"
              }}>{c.title}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop:"16px",
          background:"linear-gradient(135deg,#005C63,#008A8A)",
          color:"#fff",
          borderRadius:"28px",
          padding:"28px"
        }}>
          <div>Вы сэкономили</div>
          <div style={{fontSize:"40px",fontWeight:800,marginTop:"8px"}}>
            12 458 000 ₫
          </div>
          <div style={{opacity:.85}}>за всё время</div>
          <div style={{
            marginTop:"20px",
            height:"60px",
            borderTop:"1px solid rgba(255,255,255,.2)"
          }}/>
        </div>

        <div style={{marginTop:"20px"}}>
          <div style={{fontSize:"24px",fontWeight:800,marginBottom:"14px"}}>
            Рядом с вами
          </div>

          <div style={{display:"flex",gap:"14px",overflowX:"auto"}}>
            {nearbyPartners.map((p)=>(
              <div key={p.name} style={{
                minWidth:"240px",
                background:"#fff",
                borderRadius:"24px",
                overflow:"hidden",
                boxShadow:"0 8px 24px rgba(15,23,42,.08)"
              }}>
                <div style={{
                  height:"140px",
                  backgroundImage:`url(${p.image})`,
                  backgroundSize:"cover",
                  backgroundPosition:"center"
                }}/>
                <div style={{padding:"14px"}}>
                  <div style={{fontWeight:700,fontSize:"18px"}}>{p.name}</div>
                  <div style={{marginTop:"6px",color:"#64748B"}}>
                    ⭐ {p.rating} · 📍 {p.distance}
                  </div>
                  <div style={{
                    marginTop:"10px",
                    display:"inline-block",
                    background:"#14B8A6",
                    color:"#fff",
                    padding:"8px 12px",
                    borderRadius:"12px",
                    fontWeight:700
                  }}>
                    {p.discount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onChangeTab?.("map")}
          style={{
            width:"100%",
            marginTop:"20px",
            border:"none",
            background:"#0F766E",
            color:"#fff",
            borderRadius:"20px",
            padding:"18px",
            fontSize:"18px",
            fontWeight:700,
            cursor:"pointer"
          }}
        >
          Смотреть на карте
        </button>

      </div>
    </div>
  );
}
