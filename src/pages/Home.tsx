import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import BottomNavigation from '@/components/BottomNavigation';
import { ShoppingCart, Plus, Search, Settings, Leaf, Star, Sparkles, Crown, Gift, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { addItem, getTotalItems } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  // جلب الفئات من قاعدة البيانات
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('created_at');
      
      if (error) throw error;
      return data;
    }
  });

  // جلب المنتجات من قاعدة البيانات
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at');
      
      if (error) throw error;
      return data;
    }
  });

  // جلب العروض
  const { data: offers = [] } = useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  const filteredProducts = products.filter(product => {
    const selectedCategoryEn = categories.find(cat => cat.name === selectedCategory)?.name_en;
    const matchesCategory = selectedCategory === 'الكل' || product.category === selectedCategoryEn;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: any) => {
    const finalPrice = product.discount > 0 
      ? product.price * (1 - product.discount / 100) 
      : product.price;

    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image_url,
      category: product.category
    });
    
    toast({
      title: "✨ تم إضافة المنتج بنجاح!",
      description: `${product.name} أصبح في سلتك الآن`,
    });
  };

  const checkAdminAccess = () => {
    const password = prompt('🔐 أدخل كلمة المرور للوصول إلى لوحة الإدارة:');
    if (password === '01278006248') {
      navigate('/admin');
    } else if (password !== null) {
      toast({
        title: "❌ خطأ في كلمة المرور",
        description: "كلمة المرور غير صحيحة",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-spin"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-8 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-pink-500/50 border-r-transparent rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse'}}></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              جاري التحميل...
            </h2>
            <p className="text-white/80 text-lg">✨ نجهز لك أفضل المنتجات</p>
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20 relative overflow-hidden">
      {/* الإضاءة السينمائية الجانبية */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* إضاءة الجانب الأيمن */}
        <div className="absolute top-0 right-0 w-1/3 h-full">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-cyan-400/30 via-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-l from-purple-400/25 via-pink-500/15 to-transparent rounded-full blur-2xl animate-bounce" style={{animationDuration: '4s'}}></div>
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-gradient-to-l from-indigo-400/35 via-violet-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-0 right-0 w-88 h-88 bg-gradient-to-l from-teal-400/20 via-cyan-500/15 to-transparent rounded-full blur-3xl animate-bounce" style={{animationDuration: '5s'}}></div>
          
          {/* أشعة ضوئية منحنية */}
          <div className="absolute top-1/3 right-0 w-full h-2 bg-gradient-to-l from-white/40 via-cyan-300/30 to-transparent blur-sm animate-pulse opacity-60"></div>
          <div className="absolute top-2/3 right-0 w-full h-1 bg-gradient-to-l from-white/30 via-purple-300/20 to-transparent blur-sm animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
        </div>

        {/* إضاءة الجانب الأيسر */}
        <div className="absolute top-0 left-0 w-1/3 h-full">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-400/25 via-red-500/15 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/3 left-0 w-80 h-80 bg-gradient-to-r from-pink-400/30 via-rose-500/20 to-transparent rounded-full blur-2xl animate-bounce" style={{animationDuration: '6s'}}></div>
          <div className="absolute top-2/3 left-0 w-72 h-72 bg-gradient-to-r from-yellow-400/20 via-amber-500/15 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/4 left-0 w-88 h-88 bg-gradient-to-r from-emerald-400/25 via-green-500/15 to-transparent rounded-full blur-3xl animate-bounce" style={{animationDuration: '7s'}}></div>
          
          {/* أشعة ضوئية منحنية */}
          <div className="absolute top-1/4 left-0 w-full h-2 bg-gradient-to-r from-white/35 via-orange-300/25 to-transparent blur-sm animate-pulse opacity-70" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-white/25 via-pink-300/20 to-transparent blur-sm animate-pulse opacity-60" style={{animationDelay: '3s'}}></div>
        </div>

        {/* فلاشات ضوئية متقطعة - Lens Flares */}
        <div className="absolute top-1/5 right-10 w-4 h-4 bg-white/60 rounded-full blur-sm animate-ping opacity-75"></div>
        <div className="absolute top-2/5 left-16 w-3 h-3 bg-cyan-300/70 rounded-full blur-sm animate-ping opacity-60" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-3/5 right-20 w-2 h-2 bg-purple-300/80 rounded-full blur-sm animate-ping opacity-50" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-1/4 left-12 w-3 h-3 bg-pink-300/60 rounded-full blur-sm animate-ping opacity-70" style={{animationDelay: '3.5s'}}></div>

        {/* خطوط ضوئية مائلة */}
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-30 transform rotate-12 animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent opacity-25 transform -rotate-12 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* خلفية متحركة أساسية */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      {/* الهيدر المحسن */}
      <div className="relative z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white sticky top-0 shadow-2xl backdrop-blur-xl border-b border-white/20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                    Harvest Premium
                  </h1>
                  <div className="flex gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current animate-pulse" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current animate-pulse" style={{animationDelay: '0.2s'}} />
                    <Star className="w-5 h-5 text-yellow-400 fill-current animate-pulse" style={{animationDelay: '0.4s'}} />
                  </div>
                </div>
                <p className="text-white/90 font-medium">🌟 متجر المنظفات الفاخرة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={checkAdminAccess}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-2xl border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <div className="relative">
                <Button
                  onClick={() => navigate('/cart')}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-2xl border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-3 -right-3 h-7 w-7 flex items-center justify-center text-xs bg-gradient-to-br from-red-500 to-pink-600 border-2 border-white animate-pulse shadow-lg">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* شريط البحث المحسن */}
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/95 backdrop-blur-xl border-2 border-white/50 rounded-3xl overflow-hidden shadow-2xl">
              <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-purple-600 w-6 h-6" />
              <input
                type="text"
                placeholder="🔍 ابحث في عالم النظافة الفاخر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-16 pl-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none bg-transparent text-lg font-medium"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* قسم العروض الخاصة */}
      {offers.length > 0 && (
        <div className="relative z-10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-8 h-8 text-pink-400" />
            <h2 className="text-2xl font-bold text-white">🎉 عروض حصرية</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {offers.map((offer) => (
              <div key={offer.id} className="flex-shrink-0 w-80">
                <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 p-1 rounded-3xl">
                  <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-6 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{offer.discount}%</span>
                      </div>
                      <h3 className="font-bold text-lg">{offer.title}</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-4">{offer.description}</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-xs text-white/70">عرض محدود</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الفئات المحسنة */}
      <div className="relative z-10 px-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Leaf className="w-7 h-7 text-green-400" />
          <h2 className="text-xl font-bold text-white">🏷️ التصنيفات</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4">
          <Button
            onClick={() => setSelectedCategory('الكل')}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
              selectedCategory === 'الكل' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-purple-500/50' 
                : 'bg-white/90 text-gray-800 border-2 border-purple-300 hover:bg-purple-50 backdrop-blur-sm'
            }`}
          >
            🌟 الكل
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                selectedCategory === category.name 
                  ? `bg-gradient-to-r ${category.color_class} text-white border-0 shadow-lg` 
                  : 'bg-white/90 text-gray-800 border-2 border-purple-200 hover:bg-purple-50 backdrop-blur-sm'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* شبكة المنتجات المحسنة */}
      <div className="relative z-10 px-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl border border-white/20">
                <Search className="w-16 h-16 text-white/60" />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">🔍 لا توجد منتجات</h3>
            <p className="text-white/70 text-lg">جرب البحث بكلمات أخرى أو اختر فئة مختلفة</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden bg-white/95 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image_url || 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'} 
                    alt={product.name}
                    className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 rounded-xl font-bold text-xs shadow-lg animate-pulse border border-white">
                      🔥 {product.discount}%
                    </Badge>
                  )}
                  
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg border border-white/50">
                    <Leaf className="w-3 h-3 text-green-600" />
                  </div>
                  
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-sm mb-2 text-gray-800 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      {product.discount > 0 ? (
                        <>
                          <span className="text-lg font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {(product.price * (1 - product.discount / 100)).toFixed(0)} ج.م
                          </span>
                          <span className="text-xs text-gray-400 line-through font-medium">
                            {product.price} ج.م
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {product.price} ج.م
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2 h-2 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold py-2 px-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-purple-500/50 border border-white/20 text-xs"
                    size="sm"
                  >
                    <Plus className="w-3 h-3 ml-1" />
                    ✨ إضافة للسلة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Home;
