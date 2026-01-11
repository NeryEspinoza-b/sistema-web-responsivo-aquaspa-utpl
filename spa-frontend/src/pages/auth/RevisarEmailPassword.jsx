import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/spa.png'
function RevisarEmailPassword() {
  const location = useLocation()
  const email = location.state?.email || 'tu correo electrónico'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
           <img src={logo} alt="Logo establecimiento SPA" title='Logo establecimiento' className='mx-auto w-20 h-20 mb-4' />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Revisa tu correo electrónico
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Hemos enviado instrucciones para restablecer la contraseña a{' '}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* Mensaje de instrucciones */}
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <p className="text-green-800 text-sm text-center">
            Revisa tu correo electrónico para encontrar el enlace de restablecimiento de contraseña.
            Puede tomar unos minutos en llegar.
          </p>
        </div>

        {/* Enlace volver */}
        <div className="text-center">
          <Link 
            to="/login"
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RevisarEmailPassword
