
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Package, 
  Tag, 
  Image as ImageIcon,
  Percent
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');
  
  const [storeSettings, setStoreSettings] = useState({
    name: 'متجر النظافة',
    welcomeImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center'
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    discount: '',
    image: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: 'bg-blue-500'
  });

  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: ''
  });

  const handleSaveSettings = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث إعدادات المتجر بنجاح",
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة ${newProduct.name} بنجاح`,
    });

    setNewProduct({
      name: '',
      price: '',
      category: '',
      discount: '',
      image: ''
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال اسم القسم",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إضافة القسم",
      description: `تم إضافة قسم ${newCategory.name} بنجاح`,
    });

    setNewCategory({
      name: '',
      color: 'bg-blue-500'
    });
  };

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.discount) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إضافة العرض",
      description: `تم إضافة عرض ${newOffer.title} بنجاح`,
    });

    setNewOffer({
      title: '',
      description: '',
      discount: '',
      validUntil: ''
    });
  };

  const tabs = [
    { id: 'settings', label: 'إعدادات عامة', icon: Settings },
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'categories', label: 'الأقسام', icon: Tag },
    { id: 'offers', label: 'العروض', icon: Percent }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-bg text-white p-4">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
            <p className="text-white/80">إدارة المتجر والمنتجات</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                className={`flex-shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 hover:bg-white/90' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4 ml-1" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* إعدادات عامة */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  إعدادات المتجر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="storeName">اسم المتجر</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.name}
                    onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
                    placeholder="أدخل اسم المتجر"
                  />
                </div>
                
                <div>
                  <Label htmlFor="welcomeImage">رابط صورة الترحيب</Label>
                  <Input
                    id="welcomeImage"
                    value={storeSettings.welcomeImage}
                    onChange={(e) => setStoreSettings({...storeSettings, welcomeImage: e.target.value})}
                    placeholder="أدخل رابط الصورة"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>معاينة الصورة</Label>
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={storeSettings.welcomeImage} 
                        alt="معاينة"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSettings} className="w-full gradient-green text-white">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* إدارة المنتجات */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة منتج جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productName">اسم المنتج</Label>
                  <Input
                    id="productName"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="أدخل اسم المنتج"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productPrice">السعر (ج.م)</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productDiscount">الخصم (%)</Label>
                    <Input
                      id="productDiscount"
                      type="number"
                      value={newProduct.discount}
                      onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="productCategory">القسم</Label>
                  <Input
                    id="productCategory"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    placeholder="أدخل قسم المنتج"
                  />
                </div>

                <div>
                  <Label htmlFor="productImage">رابط صورة المنتج</Label>
                  <Input
                    id="productImage"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    placeholder="أدخل رابط صورة المنتج"
                  />
                </div>

                <Button onClick={handleAddProduct} className="w-full gradient-green text-white">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة المنتج
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المنتجات الحالية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'منظف الأطباق المركز', price: 25, category: 'مطبخ' },
                    { name: 'منظف الحمامات القوي', price: 35, category: 'حمام' },
                    { name: 'منظف الأرضيات المتعدد', price: 30, category: 'أرضيات' }
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category} - {product.price} ج.م</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* إدارة الأقسام */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة قسم جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">اسم القسم</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="أدخل اسم القسم"
                  />
                </div>

                <div>
                  <Label>لون القسم</Label>
                  <div className="flex gap-2 mt-2">
                    {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-red-500'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewCategory({...newCategory, color})}
                        className={`w-8 h-8 rounded-full ${color} ${
                          newCategory.color === color ? 'ring-2 ring-gray-400' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <Button onClick={handleAddCategory} className="w-full gradient-green text-white">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة القسم
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الأقسام الحالية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'مطبخ', color: 'bg-green-500' },
                    { name: 'حمام', color: 'bg-purple-500' },
                    { name: 'أرضيات', color: 'bg-orange-500' },
                    { name: 'غسيل', color: 'bg-pink-500' }
                  ].map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* إدارة العروض */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة عرض جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="offerTitle">عنوان العرض</Label>
                  <Input
                    id="offerTitle"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                    placeholder="أدخل عنوان العرض"
                  />
                </div>

                <div>
                  <Label htmlFor="offerDescription">وصف العرض</Label>
                  <Textarea
                    id="offerDescription"
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                    placeholder="أدخل وصف العرض"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerDiscount">نسبة الخصم (%)</Label>
                    <Input
                      id="offerDiscount"
                      type="number"
                      value={newOffer.discount}
                      onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="offerValidUntil">ساري حتى</Label>
                    <Input
                      id="offerValidUntil"
                      type="date"
                      value={newOffer.validUntil}
                      onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                    />
                  </div>
                </div>

                <Button onClick={handleAddOffer} className="w-full gradient-green text-white">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة العرض
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>العروض الحالية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: 'خصم 25% على منتجات المطبخ', discount: 25, validUntil: '2024-12-31' },
                    { title: 'اشتري 2 واحصل على 1 مجاناً', discount: 33, validUntil: '2024-12-25' }
                  ].map((offer, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-800">{offer.title}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className="bg-red-500">{offer.discount}% خصم</Badge>
                            <span className="text-sm text-red-600">حتى {offer.validUntil}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
