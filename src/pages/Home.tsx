import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/tasks");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-900 dark:to-pink-900 p-6">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Organizador de Tarefas
        </h1>
        <p className="text-xl text-white/90 mb-8">
          Gerencie suas tarefas de forma simples e rápida.
        </p>
        <button
          onClick={handleEnter}
          className="px-8 py-3 bg-yellow-400 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition-colors"
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

export default Home;