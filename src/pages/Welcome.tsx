
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/home');
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 animate-float">
          <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl border-4 border-white/30">
            <img 
              src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center"
              alt="متجر المنظفات"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            <h1 className="text-3xl font-bold text-white">متجر النظافة</h1>
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            أفضل المنظفات لمنزل نظيف ومتألق
            <br />
            جودة عالية وأسعار منافسة
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={isLoading}
          className="w-full py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              جاري التحميل...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>ادخل للمتجر</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          )}
        </Button>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-effect rounded-lg p-4 animate-pulse-slow">
              <div className="w-8 h-8 bg-white/30 rounded-full mx-auto mb-2"></div>
              <div className="h-2 bg-white/30 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
