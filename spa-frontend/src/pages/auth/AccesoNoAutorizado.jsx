import { Lock } from "lucide-react"

export default function AccesoNoAutorizado() {
  return (
    <div className="flex flex-col justify-center items-center p-10 text-center gap-4">
      <Lock size={50} className="text-red-500" />
      <h1 className="text-3xl font-bold text-red-500">Acceso Denegado</h1>
      <p className="text-gray-600">No tienes los permisos suficientes para acceder a esta sección</p>
    </div>
  )
}
