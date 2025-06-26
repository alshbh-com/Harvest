
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Leaf, Sparkles, Star, Crown, Gift, Zap, Heart } from 'lucide-react';
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
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* خلفية متحركة متقدمة */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/60 to-indigo-900/80"></div>
        
        {/* دوائر متحركة */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-32 left-8 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full animate-bounce blur-lg"></div>
        <div className="absolute bottom-20 left-16 w-40 h-40 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full animate-ping blur-2xl"></div>
        <div className="absolute bottom-32 right-20 w-28 h-28 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full animate-spin blur-lg" style={{animationDuration: '8s'}}></div>
        
        {/* تأثير الجزيئات */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 3px 3px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '30px 30px',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
      </div>

      {/* النجوم المتحركة */}
      <div className="absolute inset-0">
        <Star className="absolute top-16 left-20 w-6 h-6 text-yellow-300/60 animate-pulse" />
        <Star className="absolute top-40 right-32 w-4 h-4 text-pink-300/60 animate-bounce" style={{animationDelay: '0.5s'}} />
        <Star className="absolute bottom-40 left-40 w-5 h-5 text-blue-300/60 animate-ping" style={{animationDelay: '1s'}} />
        <Sparkles className="absolute top-1/4 right-1/4 w-5 h-5 text-purple-300/60 animate-spin" style={{animationDuration: '4s'}} />
        <Sparkles className="absolute bottom-1/3 right-1/3 w-4 h-4 text-cyan-300/60 animate-bounce" style={{animationDelay: '1.5s'}} />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          {/* قسم الشعار المحسن */}
          <div className="mb-16 relative">
            <div className="relative group">
              {/* الهالة المضيئة */}
              <div className="absolute -inset-8 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              
              {/* إطار الصورة */}
              <div className="relative w-72 h-72 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl border-4 border-white/30 backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 group-hover:scale-110 transition-all duration-700">
                {settings?.welcome_image_url ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={settings.welcome_image_url} 
                      alt="صورة المتجر"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent"></div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-400/20 via-teal-500/20 to-cyan-600/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
                    <div className="text-center relative z-10">
                      <div className="relative mb-6">
                        <Crown className="w-24 h-24 text-yellow-400 mx-auto animate-pulse drop-shadow-2xl" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                          <Heart className="w-4 h-4 text-white fill-current" />
                        </div>
                      </div>
                      <p className="text-white/90 text-lg font-bold drop-shadow-lg">متجر الفخامة</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* النجوم الدوارة */}
              <Star className="absolute -top-6 -right-6 w-10 h-10 text-yellow-300 animate-spin fill-current drop-shadow-lg" />
              <Star className="absolute -bottom-6 -left-6 w-8 h-8 text-pink-300 animate-bounce fill-current drop-shadow-lg" />
              <Sparkles className="absolute top-1/2 -right-12 w-8 h-8 text-purple-300 animate-pulse drop-shadow-lg" />
              <Gift className="absolute top-1/4 -left-12 w-7 h-7 text-cyan-300 animate-bounce drop-shadow-lg" style={{animationDelay: '0.5s'}} />
            </div>

            {/* اسم العلامة التجارية */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl"></div>
              <h1 className="relative text-6xl font-black text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text mb-6 tracking-wide drop-shadow-2xl">
                {settings?.store_name || 'Harvest'}
              </h1>
              
              {/* خط الزينة */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-pink-400/60 to-purple-400/60 rounded-full"></div>
                <div className="relative">
                  <Crown className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-pink-400 to-red-500 rounded-full animate-ping"></div>
                </div>
                <div className="h-1 w-16 bg-gradient-to-l from-transparent via-purple-400/60 to-pink-400/60 rounded-full"></div>
              </div>
              
              {/* الوصف */}
              <div className="space-y-3 mb-8">
                <p className="text-white/95 text-xl font-bold leading-relaxed drop-shadow-lg bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                  ✨ أفضل المنظفات الفاخرة ✨
                </p>
                <div className="flex items-center justify-center gap-6 text-white/90 text-base">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="font-medium">نظافة مثالية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-pink-400 fill-current" />
                    <span className="font-medium">جودة عالية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">أسعار منافسة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* زر الدخول المحسن */}
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-indigo-500/30 rounded-3xl blur-xl animate-pulse"></div>
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="relative w-full py-6 text-xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:via-purple-700 hover:to-indigo-700 text-white transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50 rounded-3xl border-2 border-white/30 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse"></div>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="relative">
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-8 h-8 border-2 border-pink-400/50 border-r-transparent rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
                    </div>
                    <span className="bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                      🚀 جاري تحضير التجربة الفاخرة...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4 relative z-10">
                    <Crown className="w-7 h-7 text-yellow-300" />
                    <span className="bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                      ادخل إلى {settings?.store_name || 'Harvest'} Premium
                    </span>
                    <ChevronLeft className="w-7 h-7 text-white animate-bounce" />
                  </div>
                )}
              </Button>
            </div>

            {/* نقاط المميزات */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Leaf, text: '🌿 طبيعي 100%', color: 'from-green-500 to-emerald-600' },
                { icon: Zap, text: '⚡ فعالية قوية', color: 'from-yellow-500 to-orange-600' },
                { icon: Crown, text: '👑 فخامة مطلقة', color: 'from-purple-500 to-pink-600' }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 group hover:scale-110">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl group-hover:rotate-12 transition-transform duration-300`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white/95 text-sm font-bold text-center leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* شعار الثقة */}
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current animate-pulse" style={{animationDelay: `${i * 0.2}s`}} />
                ))}
              </div>
              <span className="font-medium">موثوق من آلاف العملاء</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
