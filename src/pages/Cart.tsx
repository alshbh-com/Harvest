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

  // رقم الواتساب للإدمن - تم تحديثه للرقم المطلوب
  const ADMIN_WHATSAPP = "201113397879";

  const handleInputChange = (field: string, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const validateOrderData = () => {
    const errors = [];
    
    if (!orderData.customerName.trim()) {
      errors.push("الاسم الكامل مطلوب");
    }
    
    if (!orderData.customerPhone.trim()) {
      errors.push("رقم الهاتف مطلوب");
    } else if (orderData.customerPhone.length < 10) {
      errors.push("رقم الهاتف يجب أن يكون صحيحاً");
    }
    
    if (!orderData.customerAddress.trim()) {
      errors.push("العنوان مطلوب");
    }
    
    return errors;
  };

  const formatWhatsAppMessage = (orderId: string) => {
    let message = `🛍️ *طلب جديد*\n\n`;
    message += `📝 *رقم الطلب:* ${orderId.substring(0, 8)}\n`;
    message += `👤 *اسم العميل:* ${orderData.customerName}\n`;
    message += `📱 *رقم الهاتف:* ${orderData.customerPhone}\n`;
    message += `📍 *العنوان:* ${orderData.customerAddress}\n`;
    
    if (orderData.notes.trim()) {
      message += `📋 *ملاحظات:* ${orderData.notes}\n`;
    }
    
    message += `\n🛒 *المنتجات المطلوبة:*\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   الكمية: ${item.quantity}\n`;
      message += `   السعر: ${item.price} ج.م\n`;
      message += `   الإجمالي: ${item.price * item.quantity} ج.م\n\n`;
    });
    
    message += `💰 *إجمالي الطلب: ${getTotalPrice()} ج.م*\n`;
    message += `⏰ *وقت الطلب:* ${new Date().toLocaleString('ar-EG')}`;
    
    return encodeURIComponent(message);
  };

  const sendToWhatsApp = (orderId: string) => {
    const message = formatWhatsAppMessage(orderId);
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${message}`;
    window.open(whatsappURL, '_blank');
  };

  const handleSubmitOrder = async () => {
    console.log('Starting order submission...', { items, orderData });
    
    // التحقق من وجود منتجات في السلة
    if (items.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة منتجات إلى السلة أولاً",
        variant: "destructive"
      });
      return;
    }

    // التحقق من صحة البيانات
    const validationErrors = validateOrderData();
    if (validationErrors.length > 0) {
      toast({
        title: "بيانات ناقصة أو غير صحيحة",
        description: validationErrors.join("\n"),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creating order with data:', orderData);

      // إنشاء الطلب
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customerName.trim(),
          customer_phone: orderData.customerPhone.trim(),
          customer_address: orderData.customerAddress.trim(),
          notes: orderData.notes.trim() || null,
          total_amount: getTotalPrice(),
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`خطأ في إنشاء الطلب: ${orderError.message}`);
      }

      if (!order || !order.id) {
        throw new Error('فشل في إنشاء الطلب');
      }

      console.log('Order created successfully:', order);

      // إضافة عناصر الطلب
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: Number(item.price),
        quantity: Number(item.quantity),
        total_price: Number(item.price) * Number(item.quantity)
      }));

      console.log('Creating order items:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        throw new Error(`خطأ في إضافة عناصر الطلب: ${itemsError.message}`);
      }

      console.log('Order items created successfully');

      // إرسال الطلب للواتساب
      sendToWhatsApp(order.id);

      toast({
        title: "تم إرسال الطلب بنجاح! 🎉",
        description: `تم توجيهك للواتساب لإتمام الطلب مع الإدمن`,
      });

      clearCart();
      navigate('/home');
    } catch (error) {
      console.error('Error submitting order:', error);
      
      let errorMessage = "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "خطأ في إرسال الطلب",
        description: errorMessage,
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
                className={!orderData.customerName.trim() ? 'border-red-300' : ''}
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
                className={!orderData.customerPhone.trim() ? 'border-red-300' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="address">العنوان *</Label>
              <Input
                id="address"
                value={orderData.customerAddress}
                onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                placeholder="أدخل عنوانك بالتفصيل"
                className={!orderData.customerAddress.trim() ? 'border-red-300' : ''}
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
              disabled={isSubmitting || items.length === 0}
              className="w-full gradient-green text-white py-3 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري إرسال الطلب...</span>
                </div>
              ) : (
                'إرسال الطلب للواتساب'
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
