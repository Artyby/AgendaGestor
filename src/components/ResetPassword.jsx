import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Supabase automáticamente maneja el token del email
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // Usuario llegó desde el email de recuperación
        setMessage("Ingresa tu nueva contraseña");
      }
    });
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage("¡Contraseña actualizada exitosamente!");

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      setMessage("Error al actualizar contraseña: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">Nueva Contraseña</h2>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm mb-4 ${
              message.includes("Error")
                ? "bg-red-500/10 text-red-400"
                : "bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nueva contraseña"
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold"
        >
          {loading ? "Actualizando..." : "Actualizar Contraseña"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
