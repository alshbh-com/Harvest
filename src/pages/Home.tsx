
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import { ShoppingCart, Plus, Search, Settings } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { addItem, getTotalItems } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'الكل', color: 'bg-blue-500' },
    { id: 'kitchen', name: 'مطبخ', color: 'bg-green-500' },
    { id: 'bathroom', name: 'حمام', color: 'bg-purple-500' },
    { id: 'floors', name: 'أرضيات', color: 'bg-orange-500' },
    { id: 'laundry', name: 'غسيل', color: 'bg-pink-500' },
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="gradient-bg text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">متجر النظافة</h1>
              <p className="text-sm text-white/80">أفضل المنظفات</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={checkAdminAccess}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <div className="relative">
              <Button
                onClick={() => navigate('/cart')}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="ابحث عن المنتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg pr-10 pl-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              variant={selectedCategory === category.name ? "default" : "outline"}
              size="sm"
              className={`flex-shrink-0 ${selectedCategory === category.name ? category.color : ''}`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                    خصم {product.discount}%
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-lg font-bold text-green-600">
                          {(product.price * (1 - product.discount / 100)).toFixed(0)} ج.م
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {product.price} ج.م
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-blue-600">
                        {product.price} ج.م
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full gradient-green text-white hover:opacity-90 transition-opacity"
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
