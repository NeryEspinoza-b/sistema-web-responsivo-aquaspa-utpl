import { useNavigate } from "react-router-dom"
function ServiceCard({ title, description, price }) {
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button className="text-gray-500 ">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-gray-900">${price}</span>
        <button onClick={() => navigate('/reservar-cita')} className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors cursor-pointer">
          Reservar Servicio
        </button>
      </div>
    </div>
  )
}

export default ServiceCard