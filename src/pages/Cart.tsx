
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BottomNavigation from '@/components/BottomNavigation';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, User } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    customerAddress: user?.address || '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة منتجات إلى السلة أولاً",
        variant: "destructive"
      });
      return;
    }

    if (!orderData.customerName || !orderData.customerPhone || !orderData.customerAddress) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // إنشاء الطلب
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          customer_address: orderData.customerAddress,
          notes: orderData.notes,
          total_amount: getTotalPrice(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // إضافة عناصر الطلب
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: `رقم الطلب: ${order.id.substring(0, 8)}... سيتم التواصل معك قريباً`,
      });

      clearCart();
      navigate('/home');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileRedirect = () => {
    navigate('/profile');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="gradient-bg text-white p-4 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">السلة</h1>
        </div>

        <div className="flex flex-col items-center justify-center h-96 px-4">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">السلة فارغة</h2>
          <p className="text-gray-500 text-center mb-6">ابدأ بإضافة المنتجات المفضلة لديك</p>
          <Button 
            onClick={() => navigate('/home')}
            className="gradient-green text-white px-8 py-3 rounded-xl font-bold"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            تسوق الآن
          </Button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="gradient-bg text-white p-4 text-center">
        <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">السلة ({items.length} منتج)</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Cart Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">المنتجات المختارة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-green-600 font-bold">{item.price} ج.م</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => removeItem(item.id)}
                    variant="destructive"
                    size="sm"
                    className="w-8 h-8 p-0 mr-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Order Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              بيانات الطلب
              {!user && (
                <Button
                  onClick={handleProfileRedirect}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <User className="w-4 h-4 ml-1" />
                  إدخال البيانات
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input
                id="name"
                value={orderData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input
                id="phone"
                value={orderData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                placeholder="أدخل رقم هاتفك"
                dir="ltr"
              />
            </div>
            
            <div>
              <Label htmlFor="address">العنوان *</Label>
              <Input
                id="address"
                value={orderData.customerAddress}
                onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                placeholder="أدخل عنوانك بالتفصيل"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">ملاحظات إضافية</Label>
              <Textarea
                id="notes"
                value={orderData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="أي ملاحظات أو طلبات خاصة..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">إجمالي الطلب:</span>
              <span className="text-2xl font-bold text-green-600">{getTotalPrice()} ج.م</span>
            </div>
            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full gradient-green text-white py-3 rounded-xl font-bold text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري إرسال الطلب...</span>
                </div>
              ) : (
                'تأكيد الطلب'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Cart;
