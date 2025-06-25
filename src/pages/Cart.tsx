
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BottomNavigation from '@/components/BottomNavigation';
import { Minus, Plus, Trash2, ShoppingBag, MapPin, MessageCircle } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const { user } = useUser();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderData, setOrderData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    notes: ''
  });

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleCompleteOrder = () => {
    if (!orderData.name || !orderData.phone || !orderData.address) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // إنشاء رسالة WhatsApp
    const orderDetails = items.map(item => 
      `${item.name} - الكمية: ${item.quantity} - السعر: ${item.price * item.quantity} ج.م`
    ).join('\n');

    const message = `
🛒 طلب جديد من متجر المنظفات

👤 البيانات الشخصية:
الاسم: ${orderData.name}
الهاتف: ${orderData.phone}
العنوان: ${orderData.address}

📦 تفاصيل الطلب:
${orderDetails}

💰 إجمالي الطلب: ${getTotalPrice()} ج.م

📝 ملاحظات: ${orderData.notes || 'لا توجد ملاحظات'}
    `;

    const whatsappUrl = `https://wa.me/201113397879?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: "تم إرسال الطلب",
      description: "سيتم التواصل معك قريباً",
    });

    clearCart();
    setShowCheckout(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="gradient-bg text-white p-4 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">السلة</h1>
        </div>
        
        <div className="flex flex-col items-center justify-center p-8 mt-20">
          <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">السلة فارغة</h2>
          <p className="text-gray-500 text-center mb-6">
            لم تقم بإضافة أي منتجات بعد
            <br />
            تصفح المنتجات وأضف ما تريد
          </p>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="gradient-bg text-white p-4 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">إكمال الطلب</h1>
        </div>

        <div className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">بيانات التوصيل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  value={orderData.name}
                  onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  value={orderData.phone}
                  onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                  placeholder="أدخل رقم هاتفك"
                  dir="ltr"
                />
              </div>
              
              <div>
                <Label htmlFor="address">العنوان بالتفصيل *</Label>
                <Textarea
                  id="address"
                  value={orderData.address}
                  onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                  placeholder="أدخل عنوانك بالتفصيل (المحافظة، المدينة، الشارع، رقم المبنى)"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea
                  id="notes"
                  value={orderData.notes}
                  onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                  placeholder="أي ملاحظات خاصة بالطلب (اختياري)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{item.price * item.quantity} ج.م</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span>{getTotalPrice()} ج.م</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCheckout(false)}
              variant="outline" 
              className="flex-1"
            >
              رجوع
            </Button>
            <Button 
              onClick={handleCompleteOrder}
              className="flex-1 gradient-green text-white"
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              إرسال عبر واتساب
            </Button>
          </div>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="gradient-bg text-white p-4 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">السلة ({items.length} منتج)</h1>
      </div>

      <div className="p-4 space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <p className="text-blue-600 font-bold text-lg mb-2">
                    {item.price} ج.م
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={() => removeItem(item.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">الإجمالي:</span>
              <span className="text-2xl font-bold text-blue-600">
                {getTotalPrice()} ج.م
              </span>
            </div>
            <Button 
              onClick={() => setShowCheckout(true)}
              className="w-full gradient-green text-white text-lg py-3"
            >
              <MapPin className="w-5 h-5 ml-2" />
              إكمال الطلب
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Cart;
