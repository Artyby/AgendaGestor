import React, { useState } from "react";

const AuthScreen = ({ onSignIn, onSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      onSignUp(email, password);
    } else {
      onSignIn(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">📅</div>
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
          Agenda Manager
        </h1>
        <p className="text-gray-600 mb-8">
          Organiza tu calendario, mide tu progreso y guarda tus mejores ideas
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-all"
          >
            {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            {isSignUp
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Tus datos se guardan de forma segura en tu cuenta
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
