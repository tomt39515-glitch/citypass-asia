import { Link } from 'react-router-dom'

function PartnerDetail() {
  return (
    <div className="app">
      <h1>Кафе / Partner Detail</h1>
      <p>Меню, описание, отзывы, бронирование</p>

      <Link to="/orders">
        <button>Сделать заказ</button>
      </Link>
    </div>
  )
}

export default PartnerDetail