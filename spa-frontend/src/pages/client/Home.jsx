import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/spa.png";
import axios from 'axios'
import {
  Clock,
  DollarSign,
  Scissors,
  Leaf,
  Heart,
  Star,
  ArrowRight,
  Phone,
  MapPin,
  Mail,
  Sparkles,
  Award,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

function Contador({ end, suffix = "", duracion = 2000 }) {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    let inicio = 0;
    const incremento = end / (duracion / 30);

    const intervalo = setInterval(() => {
      inicio += incremento;
      if (inicio >= end) {
        setValor(end);
        clearInterval(intervalo);
      } else {
        setValor(Math.ceil(inicio));
      }
    }, 30);

    return () => clearInterval(intervalo);
  }, [end, duracion]);

  return (
    <span>
      {valor}
      {suffix}
    </span>
  );
}

function Home() {
  const navigate = useNavigate();
  const [servicio, setServicio] = useState([]);

  useEffect(() => {
    const traerDatos = async () => {
      try {
        const {data} = await axios.get(
          "http://localhost:5000/servicios/listarServicios",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setServicio(data)
        
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };

    traerDatos();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-200 via-teal-50 to-cyan-50">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-emerald-200 shadow-xl">
                <img
                  src={logo}
                  alt="Logo AquaSpa"
                  title="AquaSpa"
                  className="w-16 h-16 object-contain"
                />
              </div>

              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-emerald-500 animate-bounce" />
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-emerald-900 mb-6 leading-tight">
            AquaSpa
            <span className="block bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mt-2">
              Tu Oasis de Relajación Total
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-800 mb-12 max-w-4xl mx-auto leading-relaxed">
            Experimenta el equilibrio perfecto entre el bienestar y la belleza
            en AquaSpa. Ofrecemos tratamientos exclusivos diseñados para renovar
            tu cuerpo, mente y espíritu.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="bg-emerald-500 text-white hover:bg-emerald-600 text-lg px-10 py-7 rounded-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 font-semibold flex items-center justify-center gap-3"
            >
              <Star className="w-6 h-6" />
              Comenzar Ahora
            </button>
            <button
              onClick={() => {
                navigate("/registro");
              }}
              className="border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-lg px-10 py-7 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300"
            >
              Registrarse Gratis
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                <Contador end={500} suffix="+" />
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">
                Clientes Felices
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                <Contador end={15} suffix="+" />
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">
                Años de Experiencia
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                <Contador end={30} suffix="+" />
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">
                Tratamientos Exclusivos
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                <Contador end={98} suffix="%" />
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">
                Satisfacción
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Servicios Destacados */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Nuestros Servicios
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-emerald-900 mb-6">
              Tratamientos que
              <span className="block text-teal-600 mt-2">
                Transforman tu Ser
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada servicio está cuidadosamente diseñado para brindarte una
              experiencia única de bienestar y renovación
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {servicio.slice(0, 6).map((service, index) => (
              <div
                key={service._id}
                className="group h-full bg-white border-2 border-gray-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-lg"
              >
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                {/* Imagen del servicio */}
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={
                      service.imagen
                        ? `http://localhost:5000/uploads/servicios/${service.imagen}`
                        : "/img/servicio-default.jpg"
                    }
                    alt={service.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/servicio-default.jpg";
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                      <Scissors className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-900 group-hover:text-teal-600 transition-colors duration-300 mb-4">
                    {service.nombre}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {service.descripcion}
                  </p>

                  <div className="flex items-center justify-between py-4 border-t border-gray-100 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Precio</div>
                        <div className="text-2xl font-bold text-emerald-900">
                          ${service.precio}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Duración</div>
                        <div className="text-lg font-bold text-teal-900">
                          {service.duracion} min
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/reservar-cita");
                    }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Reservar Ahora
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                navigate("/reservar-cita");
              }}
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white text-lg px-10 py-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 inline-flex items-center gap-3"
            >
              Explorar Todos los Servicios
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full mb-4">
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                La Diferencia AquaSpa
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-emerald-900 mb-6">
              ¿Por Qué Somos Tu
              <span className="block text-teal-600 mt-2">Mejor Elección?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Más que un spa, somos un refugio donde cada detalle está pensado
              para tu bienestar completo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Atención Personalizada",
                description:
                  "Cada tratamiento es adaptado a tus necesidades, garantizando una experiencia única y relajante.",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: Award,
                title: "Profesionales Certificados",
                description:
                  "Nuestro equipo está altamente capacitado en las últimas técnicas de bienestar y relajación.",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: Sparkles,
                title: "Productos Premium",
                description:
                  "Utilizamos únicamente productos naturales de la más alta calidad.",
                color: "from-purple-500 to-violet-500",
              },
              {
                icon: TrendingUp,
                title: "Resultados Garantizados",
                description:
                  "Con un 98% de satisfacción de los clientes, con resultados visibles desde la primera sesión.",
                color: "from-emerald-500 to-teal-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group h-full bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 p-8 text-center rounded-lg"
              >
                <div
                  className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle,
                text: "Instalaciones modernas y confortables",
              },
              { icon: CheckCircle, text: "Ambiente zen y relajante" },
              { icon: CheckCircle, text: "Sistema de reservas 24/7" },
              { icon: CheckCircle, text: "Protocolos de higiene y seguridad" },
              { icon: CheckCircle, text: "Tratamientos personalizados" },
              { icon: CheckCircle, text: "Experiencia integral de bienestar" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-emerald-50 rounded-xl p-4"
              >
                <item.icon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <span className="text-emerald-900 font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Final */}

      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-emerald-100 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                ¿Listo para tu Transformación?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Agenda tu primera cita hoy y descubre por qué miles de clientes
                confían en AquaSpa para su bienestar
              </p>
              <button
                onClick={() => {
                  navigate("/reservar-cita");
                }}
                className="bg-white text-emerald-900 hover:bg-gray-100 text-lg px-12 py-7 rounded-lg shadow-2xl font-bold inline-flex items-center gap-3 transition-all duration-300"
              >
                <Star className="w-6 h-6" />
                Comenzar Mi Viaje de Bienestar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="py-20 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6">
                Visítanos y Descubre
                <span className="block text-teal-600 mt-2">
                  Tu Nuevo Santuario
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Estamos ubicados en el corazón de la ciudad, listos para
                recibirte en un ambiente de paz y tranquilidad.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 text-lg mb-1">
                      Ubicación
                    </h3>
                    <p className="text-gray-600">
                      Calle 15 de Agosto, Loja
                      <br />
                      Piso 1, Local 204, Loja
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-7 h-7 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 text-lg mb-1">
                      Teléfono
                    </h3>
                    <p className="text-gray-600">
                      +593 912 456 789
                      <br />
                      WhatsApp: +593 912 456 789
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 text-lg mb-1">
                      Email
                    </h3>
                    <p className="text-gray-600">
                      info@aquaspa.com
                      <br />
                      reservas@aquaspa.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-8 h-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-emerald-900">
                  Horarios de Atención
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  { day: "Lunes - Viernes", time: "9:00 AM - 8:00 PM" },
                  { day: "Sábados", time: "9:00 AM - 8:00 PM" },
                  { day: "Domingos", time: "9:00 AM - 8:00 PM" },
                ].map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white rounded-xl p-4 border border-emerald-100"
                  >
                    <span className="font-semibold text-emerald-900">
                      {schedule.day}
                    </span>
                    <span className="text-teal-700 font-medium">
                      {schedule.time}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-emerald-600 text-white rounded-xl text-center">
                <p className="font-semibold">¿Necesitas atención urgente?</p>
                <p className="text-sm text-emerald-100 mt-1">
                  Llámanos y te atenderemos lo antes posible
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-emerald-100 via-teal-100 to-emerald-50 text-emerald-900 py-12 px-6 border-t border-emerald-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <img
                  src={logo}
                  alt="Logo AquaSpa"
                  title="AquaSpa"
                  className="w-14 h-14 object-contain"
                />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-2">AquaSpa</h3>
          <p className="text-emerald-700 mb-6">
            Tu oasis de relajación y bienestar
          </p>
          <p className="text-emerald-600 text-sm">
            © 2025 AquaSpa. Todos los derechos reservados. | Diseñado con 💚
            para tu bienestar
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
