import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, Sparkles, Package } from 'lucide-react';
import { UserSession } from '../types';

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // Perfil único de acceso para el Propietario / Administrador
    if (
      (cleanUser === 'admin' && cleanPass === 'jadas2024') ||
      (cleanUser === 'jadas' && cleanPass === 'admin123') ||
      (cleanUser === 'admin' && cleanPass === 'admin')
    ) {
      setErrorMessage('');
      const session: UserSession = {
        username: cleanUser,
        role: 'Propietario / Administrador',
        loginTime: new Date().toISOString(),
      };
      onLoginSuccess(session);
    } else {
      setErrorMessage('Credenciales no válidas. Ingrese el usuario y contraseña autorizados del Propietario.');
    }
  };

  const handleDemoLogin = () => {
    setUsername('admin');
    setPassword('jadas2024');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100 selection:bg-sky-500 selection:text-white">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden transition-all">
        
        {/* Cabecera / Identidad de JADAS STORE */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 text-center border-b border-slate-700/60 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-sky-400 mb-4 shadow-inner">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">JADAS STORE</h1>
          <p className="text-xs uppercase tracking-widest text-sky-400 font-semibold mt-1">
            Sistema de Gestión Logística
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
            Microempresa Unipersonal · Operada desde Vivienda
          </p>
        </div>

        {/* Formulario de Login */}
        <div className="p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-start gap-3 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Acceso denegado</p>
                <p className="mt-0.5 text-rose-300/90">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Usuario / Propietario
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                  placeholder="ej: admin o jadas"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-white placeholder-slate-500 transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-900/80 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-white placeholder-slate-500 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-sky-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 cursor-pointer"
            >
              Iniciar Sesión como Propietario
            </button>
          </form>

          {/* Botón de Acceso Rápido / Demo */}
          <div className="pt-3 border-t border-slate-700/60 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-800/60 rounded-xl px-3.5 py-2 font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Autocompletar Demo (admin / jadas2024)</span>
            </button>
          </div>

          {/* Marcos teóricos en pie de login */}
          <div className="text-[11px] text-slate-400 text-center space-y-1 pt-2">
            <p className="font-semibold text-slate-300">Fundamentación Logística Integrada:</p>
            <p className="text-slate-400 leading-relaxed">
              Bowersox (Abastecimiento) · Anaya Tejero (Espacio Doméstico) · Ballou (Control de Stock & Picking)
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
