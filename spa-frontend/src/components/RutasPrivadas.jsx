// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
export default function RutasPrivadas({ children, rolesPermitidos = [] }) {
  const [cargando, setCargando] = useState(true)
  const [user, setUser] = useState(null)
  const [presentarAlerta, setPresentarAlerta] = useState(false)
  useEffect(() => {
    const verificar = async () => {
      try {
        const {data} = await axios.get("http://localhost:5000/auth/verificar-sesion", {
          withCredentials: true
        })
        setUser(data?.user || null)  

        if(!data?.user) setPresentarAlerta(true)
          
      } catch (error) {
        setUser(null)
        setPresentarAlerta(true)
      } finally {
        setCargando(false)
      }
    }
    verificar()
  }, [])

  useEffect(() => {
    if(presentarAlerta){
      alert('Para realizar esta acción, primero debe de iniciar sesión')
      setPresentarAlerta(false)
    }
  }, [presentarAlerta])
  if (cargando) return <p>Cargando...</p>

  if (!user){
    return <Navigate to="/login" />
  } 

  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(user.rol)) {
    return <Navigate to="/no-autorizado" />
  }

  return children
}
