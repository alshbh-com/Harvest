
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ImageUploadAdmin from '@/components/ImageUploadAdmin';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Package, 
  Tag, 
  Percent
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('settings');
  
  // حالات النماذج
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    discount: '',
    description: '',
    stock_quantity: '',
    image_url: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    name_en: '',
    color_class: 'bg-gradient-to-r from-emerald-500 to-teal-500'
  });

  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    valid_until: ''
  });

  const [storeSettings, setStoreSettings] = useState({
    store_name: '',
    welcome_image_url: ''
  });

  // جلب البيانات
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: offers = [] } = useQuery({
    queryKey: ['admin-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

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

  // تحديث الإعدادات عند جلبها
  useEffect(() => {
    if (settings) {
      setStoreSettings({
        store_name: settings.store_name,
        welcome_image_url: settings.welcome_image_url || ''
      });
    }
  }, [settings]);

  // Mutations
  const addProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          price: parseFloat(productData.price),
          category: productData.category,
          discount: parseInt(productData.discount) || 0,
          description: productData.description,
          stock_quantity: parseInt(productData.stock_quantity) || 0,
          image_url: productData.image_url
        }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "تم إضافة المنتج",
        description: "تم إضافة المنتج بنجاح",
      });
      setNewProduct({
        name: '',
        price: '',
        category: '',
        discount: '',
        description: '',
        stock_quantity: '',
        image_url: ''
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "تم حذف المنتج",
        description: "تم حذف المنتج بنجاح",
      });
    }
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: categoryData.name,
          name_en: categoryData.name_en,
          color_class: categoryData.color_class
        }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({
        title: "تم إضافة القسم",
        description: "تم إضافة القسم بنجاح",
      });
      setNewCategory({
        name: '',
        name_en: '',
        color_class: 'bg-gradient-to-r from-emerald-500 to-teal-500'
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({
        title: "تم حذف القسم",
        description: "تم حذف القسم بنجاح",
      });
    }
  });

  const addOfferMutation = useMutation({
    mutationFn: async (offerData: any) => {
      const { data, error } = await supabase
        .from('offers')
        .insert([{
          title: offerData.title,
          description: offerData.description,
          discount: parseInt(offerData.discount),
          valid_until: offerData.valid_until || null
        }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      toast({
        title: "تم إضافة العرض",
        description: "تم إضافة العرض بنجاح",
      });
      setNewOffer({
        title: '',
        description: '',
        discount: '',
        valid_until: ''
      });
    }
  });

  const deleteOfferMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      toast({
        title: "تم حذف العرض",
        description: "تم حذف العرض بنجاح",
      });
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: any) => {
      if (settings?.id) {
        const { error } = await supabase
          .from('store_settings')
          .update({
            store_name: settingsData.store_name,
            welcome_image_url: settingsData.welcome_image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('store_settings')
          .insert([{
            store_name: settingsData.store_name,
            welcome_image_url: settingsData.welcome_image_url
          }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم تحديث إعدادات المتجر بنجاح",
      });
    }
  });

  // معالجات الأحداث
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }
    addProductMutation.mutate(newProduct);
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.name_en) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال اسم القسم بالعربية والإنجليزية",
        variant: "destructive"
      });
      return;
    }
    addCategoryMutation.mutate(newCategory);
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
    addOfferMutation.mutate(newOffer);
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(storeSettings);
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
                    value={storeSettings.store_name}
                    onChange={(e) => setStoreSettings({...storeSettings, store_name: e.target.value})}
                    placeholder="أدخل اسم المتجر"
                  />
                </div>
                
                <div>
                  <Label>صورة الترحيب</Label>
                  <ImageUploadAdmin
                    bucket="store-images"
                    currentImage={storeSettings.welcome_image_url}
                    onImageUploaded={(url) => setStoreSettings({...storeSettings, welcome_image_url: url})}
                  />
                </div>

                <Button onClick={handleSaveSettings} className="w-full gradient-green text-white">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productCategory">القسم</Label>
                    <select
                      id="productCategory"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">اختر القسم</option>
                      {categories.filter(cat => cat.name_en !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.name_en}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="productStock">الكمية المتاحة</Label>
                    <Input
                      id="productStock"
                      type="number"
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="productDescription">وصف المنتج</Label>
                  <Textarea
                    id="productDescription"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="أدخل وصف المنتج"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>صورة المنتج</Label>
                  <ImageUploadAdmin
                    bucket="product-images"
                    currentImage={newProduct.image_url}
                    onImageUploaded={(url) => setNewProduct({...newProduct, image_url: url})}
                  />
                </div>

                <Button 
                  onClick={handleAddProduct} 
                  className="w-full gradient-green text-white"
                  disabled={addProductMutation.isPending}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  {addProductMutation.isPending ? 'جاري الإضافة...' : 'إضافة المنتج'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المنتجات الحالية ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded object-cover" />
                        )}
                        <div>
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-sm text-gray-600">
                            {categories.find(cat => cat.name_en === product.category)?.name} - {product.price} ج.م
                            {product.discount > 0 && <span className="text-red-500"> (خصم {product.discount}%)</span>}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-center text-gray-500 py-8">لا توجد منتجات</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                  <Label htmlFor="categoryName">اسم القسم (عربي)</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="أدخل اسم القسم بالعربية"
                  />
                </div>

                <div>
                  <Label htmlFor="categoryNameEn">اسم القسم (إنجليزي)</Label>
                  <Input
                    id="categoryNameEn"
                    value={newCategory.name_en}
                    onChange={(e) => setNewCategory({...newCategory, name_en: e.target.value})}
                    placeholder="أدخل اسم القسم بالإنجليزية"
                  />
                </div>

                <div>
                  <Label>لون القسم</Label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {[
                      'bg-gradient-to-r from-emerald-500 to-teal-500',
                      'bg-gradient-to-r from-green-500 to-emerald-500',
                      'bg-gradient-to-r from-teal-500 to-cyan-500',
                      'bg-gradient-to-r from-blue-500 to-teal-500',
                      'bg-gradient-to-r from-cyan-500 to-blue-500',
                      'bg-gradient-to-r from-purple-500 to-pink-500',
                      'bg-gradient-to-r from-orange-500 to-red-500'
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewCategory({...newCategory, color_class: color})}
                        className={`w-8 h-8 rounded-full ${color} ${
                          newCategory.color_class === color ? 'ring-2 ring-gray-400' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleAddCategory} 
                  className="w-full gradient-green text-white"
                  disabled={addCategoryMutation.isPending}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  {addCategoryMutation.isPending ? 'جاري الإضافة...' : 'إضافة القسم'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الأقسام الحالية ({categories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {categories.filter(cat => cat.name_en !== 'all').map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${category.color_class}`}></div>
                        <div>
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-gray-500 mr-2">({category.name_en})</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteCategoryMutation.mutate(category.id)}
                        disabled={deleteCategoryMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {categories.filter(cat => cat.name_en !== 'all').length === 0 && (
                    <p className="text-center text-gray-500 py-8">لا توجد أقسام</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                      value={newOffer.valid_until}
                      onChange={(e) => setNewOffer({...newOffer, valid_until: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleAddOffer} 
                  className="w-full gradient-green text-white"
                  disabled={addOfferMutation.isPending}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  {addOfferMutation.isPending ? 'جاري الإضافة...' : 'إضافة العرض'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>العروض الحالية ({offers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {offers.map((offer) => (
                    <div key={offer.id} className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-800">{offer.title}</h4>
                          {offer.description && (
                            <p className="text-sm text-red-700 mt-1">{offer.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className="bg-red-500">{offer.discount}% خصم</Badge>
                            {offer.valid_until && (
                              <span className="text-sm text-red-600">حتى {offer.valid_until}</span>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteOfferMutation.mutate(offer.id)}
                          disabled={deleteOfferMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {offers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">لا توجد عروض</p>
                  )}
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
