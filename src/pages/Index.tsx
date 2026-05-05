import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-6">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to Your App
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              Start building your amazing project here!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = '/hello-ia'}
            >
              Say Hello to IA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="pt-6">
            <MadeWithDyad />
          </div>
        </div>
      </div>

      {/* Developer Footer */}
      <footer className="py-4 text-center text-gray-600 dark:text-gray-400 text-sm md:text-base">
        <p>Desenvolvido por Pedro de Castro</p>
      </footer>
    </div>
  );
};

export default Index;