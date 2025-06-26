
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
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden bg-white/95 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image_url || 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'} 
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {product.discount > 0 && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-lg animate-pulse border-2 border-white">
                      🔥 خصم {product.discount}%
                    </Badge>
                  )}
                  
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg border border-white/50">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-800 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      {product.discount > 0 ? (
                        <>
                          <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {(product.price * (1 - product.discount / 100)).toFixed(0)} ج.م
                          </span>
                          <span className="text-sm text-gray-400 line-through font-medium">
                            {product.price} ج.م
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {product.price} ج.م
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-purple-500/50 border-2 border-white/20"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 ml-2" />
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
