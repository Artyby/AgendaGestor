import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Wallet,
} from "lucide-react";

export default function AuthScreen({ onSignIn, onSignUp }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
      }
    } catch (error) {
      console.error("Error en autenticación:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Calendar,
      text: "Organiza tu agenda personal",
      color: "text-purple-400",
    },
    {
      icon: CheckCircle2,
      text: "Gestiona tareas y metas",
      color: "text-pink-400",
    },
    {
      icon: Wallet,
      text: "Control total de finanzas",
      color: "text-emerald-400",
    },
    { icon: TrendingUp, text: "Alcanza tus objetivos", color: "text-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Panel izquierdo - Características */}
        <div className="hidden lg:block space-y-8 text-white">
          <div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
              AgendaGestor
            </h1>
            <p className="text-xl text-slate-300">
              Tu vida organizada en un solo lugar
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 ${feature.color}`}
                >
                  <feature.icon size={24} />
                </div>
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 space-y-3 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span>Sincronización en tiempo real</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span>Datos seguros y encriptados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-400"></div>
              <span>Acceso desde cualquier dispositivo</span>
            </div>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
            {/* Logo móvil */}
            <div className="lg:hidden mb-6 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
                AgendaGestor
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 p-1 bg-slate-900/50 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isLogin
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !isLogin
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Formulario */}
            <div className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <User size={16} />
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Juan Pérez"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Lock size={16} />
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                    />
                    Recordarme
                  </label>
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  isLogin
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    : "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Procesando...
                  </span>
                ) : (
                  <span>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</span>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-400">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {isLogin ? "Regístrate gratis" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
