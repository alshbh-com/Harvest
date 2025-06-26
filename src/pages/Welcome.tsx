
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Leaf, Sparkles, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Welcome = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // جلب إعدادات المتجر
  const { data: settings } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/home');
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-white/10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute top-32 left-8 w-12 h-12 bg-white/10 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 left-16 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          {/* Logo Section */}
          <div className="mb-12 relative">
            <div className="relative group">
              <div className="w-56 h-56 mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 backdrop-blur-sm bg-white/10 group-hover:scale-105 transition-all duration-500">
                {settings?.welcome_image_url ? (
                  <img 
                    src={settings.welcome_image_url} 
                    alt="صورة المتجر"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center">
                    <div className="text-center">
                      <Leaf className="w-20 h-20 text-green-600 mx-auto mb-4 animate-pulse" />
                      <p className="text-green-700 text-sm font-medium">صورة المتجر</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Decorative Stars */}
              <Star className="absolute -top-4 -right-4 w-8 h-8 text-yellow-300 animate-spin" />
              <Star className="absolute -bottom-4 -left-4 w-6 h-6 text-yellow-200 animate-bounce" />
              <Sparkles className="absolute top-1/2 -right-8 w-6 h-6 text-white animate-pulse" />
            </div>

            {/* Brand Name */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl"></div>
              <h1 className="relative text-5xl font-bold text-white mb-4 tracking-wide">
                <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                  {settings?.store_name || 'Harvest'}
                </span>
              </h1>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-transparent to-white/50 rounded-full"></div>
                <Leaf className="w-5 h-5 text-green-200" />
                <div className="h-1 w-12 bg-gradient-to-l from-transparent to-white/50 rounded-full"></div>
              </div>
              <p className="text-white/90 text-lg mb-2 font-medium leading-relaxed">
                أفضل المنظفات الطبيعية
              </p>
              <p className="text-white/80 text-base leading-relaxed">
                نظافة مثالية • جودة عالية • أسعار منافسة
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-6">
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="w-full py-4 text-lg font-bold bg-white text-green-600 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl rounded-2xl border-2 border-white/30"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري تحضير المتجر...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>ادخل إلى {settings?.store_name || 'Harvest'}</span>
                  <ChevronLeft className="w-6 h-6" />
                </div>
              )}
            </Button>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              {[
                { icon: Leaf, text: 'طبيعي' },
                { icon: Sparkles, text: 'فعال' },
                { icon: Star, text: 'مميز' }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <item.icon className="w-8 h-8 text-white mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white/90 text-sm font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
