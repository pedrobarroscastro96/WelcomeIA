import { MadeWithDyad } from "@/components/made-with-dyad";

const HelloIA = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Olá IA
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
            Bem-vindo ao futuro da inteligência artificial! 
            <br className="hidden md:block" />
            Estamos felizes em ter você aqui.
          </p>
        </div>
        
        <div className="pt-6">
          <MadeWithDyad />
        </div>
      </div>
    </div>
  );
};

export default HelloIA;