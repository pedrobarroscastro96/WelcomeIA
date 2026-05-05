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
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Inteligência Artificial
            </span>
            é a área da ciência da computação que cria sistemas capazes de realizar tarefas que normalmente exigem inteligência humana.
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl text-white dark:text-gray-300 font-medium leading-relaxed mt-2">
            Essas tarefas incluem aprendizado, raciocínio, percepção, compreensão de linguagem natural e tomada de decisões.
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl text-white dark:text-gray-300 font-medium leading-relaxed mt-2">
            Em termos simples, IA é como ensinar máquinas a "pensarem" e "aprenderem" com dados, permitindo que elas realizem tarefas complexas de forma autônoma.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="w-full sm:w-1/2">
              <a 
                href="https://brasilescola.uol.com.br/informatica/inteligencia-artificial.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-white transition-all duration-300 transform hover:scale-105 inline-block w-full"
              >
                Explorar Mais
                <ArrowRight className="ml-2 h-5 w-5 animate-pulse inline-block" />
              </a>
            </div>
            <div className="w-full sm:w-1/2 flex items-center justify-center">
              <MadeWithDyad className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 hover:text-white/90" />
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé com nome do desenvolvedor */}
      <footer className="py-4 text-center text-white/80 text-sm md:text-base">
        <p>Desenvolvido por Pedro de Castro</p>
      </footer>
    </div>
  );
};

export default HelloIA;