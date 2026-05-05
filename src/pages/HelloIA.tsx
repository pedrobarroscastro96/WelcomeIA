import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowRight } from "lucide-react";

const HelloIA = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-900 dark:to-pink-900 p-6">
      {/* Main content pushes footer to bottom */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-full mx-auto text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Olá IA
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium leading-relaxed mt-4">
            Bem-vindo ao futuro da inteligência artificial! <br className="hidden md:block" />
            Estamos felizes em ter você aqui.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="w-full sm:w-1/2">
              <button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 transform hover:scale-105 w-full"
                onClick={() => window.location.href = '/hello-ia'}
              >
                Say Hello to IA
                <ArrowRight className="ml-2 h-5 w-5 animate-pulse inline-block" />
              </button>
            </div>
            <div className="w-full sm:w-1/2 flex items-center justify-center">
              <MadeWithDyad className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 hover:text-white/90" />
            </div>
          </div>
        </div>
      </div>

      {/* Developer Footer */}
      <footer className="py-4 text-center text-white/80 text-sm md:text-base">
        <p>Desenvolvido por Pedro de Castro</p>
      </footer>
    </div>
  );
};

export default HelloIA;