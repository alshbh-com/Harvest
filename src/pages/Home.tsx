import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import { ShoppingCart, Plus, Search, Settings, Leaf, Star } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { addItem, getTotalItems } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'الكل', color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    { id: 'kitchen', name: 'مطبخ', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 'bathroom', name: 'حمام', color: 'bg-gradient-to-r from-teal-500 to-cyan-500' },
    { id: 'floors', name: 'أرضيات', color: 'bg-gradient-to-r from-blue-500 to-teal-500' },
    { id: 'laundry', name: 'غسيل', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
  ];

  const products = [
    {
      id: '1',
      name: 'منظف الأطباق المركز',
      price: 25,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop',
      category: 'kitchen',
      discount: 15
    },
    {
      id: '2',
      name: 'منظف الحمامات القوي',
      price: 35,
      image: 'https://images.unsplash.com/photo-1585128887227-88a7b2e9b5c7?w=300&h=300&fit=crop',
      category: 'bathroom',
      discount: 0
    },
    {
      id: '3',
      name: 'منظف الأرضيات المتعدد',
      price: 30,
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&h=300&fit=crop',
      category: 'floors',
      discount: 20
    },
    {
      id: '4',
      name: 'مسحوق الغسيل الأتوماتيك',
      price: 45,
      image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=300&h=300&fit=crop',
      category: 'laundry',
      discount: 10
    },
    {
      id: '5',
      name: 'سائل تنظيف الزجاج',
      price: 20,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop',
      category: 'kitchen',
      discount: 0
    },
    {
      id: '6',
      name: 'معطر الأقمشة',
      price: 28,
      image: 'https://images.unsplash.com/photo-1615887353976-64b5a8b3f7c2?w=300&h=300&fit=crop',
      category: 'laundry',
      discount: 25
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'الكل' || product.category === categories.find(cat => cat.name === selectedCategory)?.id;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price,
      image: product.image,
      category: product.category
    });
    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة ${product.name} إلى السلة`,
    });
  };

  const checkAdminAccess = () => {
    const password = prompt('أدخل كلمة المرور للوصول إلى لوحة الإدارة:');
    if (password === '01278006248') {
      navigate('/admin');
    } else if (password !== null) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور غير صحيحة",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-white p-4 sticky top-0 z-10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Harvest</h1>
                <Star className="w-5 h-5 text-yellow-300" />
              </div>
              <p className="text-sm text-white/90">المنظفات الطبيعية</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={checkAdminAccess}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <div className="relative">
              <Button
                onClick={() => navigate('/cart')}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center text-xs bg-red-500 border-2 border-white animate-pulse">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث في منتجات Harvest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl pr-12 pl-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg"
          />
        </div>
      </div>

      {/* Enhanced Categories */}
      <div className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              variant={selectedCategory === category.name ? "default" : "outline"}
              size="sm"
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.name 
                  ? `${category.color} text-white shadow-lg border-0` 
                  : 'bg-white/80 text-gray-700 border-2 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Products Grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-2 border-emerald-100 rounded-3xl">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-44 object-cover"
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-2xl font-bold animate-pulse shadow-lg">
                    خصم {product.discount}%
                  </Badge>
                )}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <Leaf className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-3 line-clamp-2 text-gray-800">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-xl font-bold text-emerald-600">
                          {(product.price * (1 - product.discount / 100)).toFixed(0)} ج.م
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {product.price} ج.م
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-emerald-600">
                        {product.price} ج.م
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  size="sm"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة للسلة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Home;
