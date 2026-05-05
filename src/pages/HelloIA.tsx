import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowRight } from "lucide-react";

const HelloIA = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-900 dark:to-pink-900 p-6">
      <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-full mx-auto">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white shadow-lg shadow-white">
            Olá IA
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white dark:text-gray-300 font-medium leading-relaxed mt-4">
            Bem-vindo ao futuro da inteligência artificial! <br className="hidden md:block" />
            Estamos felizes em ter você aqui.
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center">
          <div className="w-full sm:w-1/2">
            <button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-white transition-all duration-300 transform hover:scale-105"
              onClick={() => window.location.href = '/hello-ia'}
            >
              Say Hello to IA
              <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
            </button>
          </div>
          <div className="w-full sm:w-1/2">
            <MadeWithDyad className="opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelloIA;