import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-900 dark:to-pink-900 p-6">
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-full mx-auto text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Você sabe o que é uma IA?
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium leading-relaxed mt-4">
            Descubra como a inteligência artificial está transformando o mundo ao nosso redor! <br className="hidden md:block" />
            Explore as possibilidades e veja o futuro em ação.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="w-full sm:w-1/2">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.href = '/hello-ia'}
              >
                Explorar IA
                <ArrowRight className="ml-2 h-5 w-5 animate-pulse inline-block" />
              </Button>
            </div>
            <div className="w-full sm:w-1/2">
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

export default Index;