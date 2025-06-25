
-- إنشاء جدول المنتجات
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  discount INTEGER DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
  description TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول الطلبات
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  notes TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول عناصر الطلبات
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول الفئات
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  color_class TEXT DEFAULT 'bg-gradient-to-r from-emerald-500 to-teal-500',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إدراج البيانات الأساسية للفئات
INSERT INTO public.categories (name, name_en, color_class) VALUES
('الكل', 'all', 'bg-gradient-to-r from-emerald-500 to-teal-500'),
('مطبخ', 'kitchen', 'bg-gradient-to-r from-green-500 to-emerald-500'),
('حمام', 'bathroom', 'bg-gradient-to-r from-teal-500 to-cyan-500'),
('أرضيات', 'floors', 'bg-gradient-to-r from-blue-500 to-teal-500'),
('غسيل', 'laundry', 'bg-gradient-to-r from-cyan-500 to-blue-500');

-- إدراج المنتجات الأساسية
INSERT INTO public.products (name, price, image_url, category, discount, description, stock_quantity) VALUES
('منظف الأطباق المركز', 25.00, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop', 'kitchen', 15, 'منظف أطباق فعال ومركز لإزالة الدهون والأوساخ', 50),
('منظف الحمامات القوي', 35.00, 'https://images.unsplash.com/photo-1585128887227-88a7b2e9b5c7?w=300&h=300&fit=crop', 'bathroom', 0, 'منظف قوي للحمامات يزيل الجير والبقع الصعبة', 30),
('منظف الأرضيات المتعدد', 30.00, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&h=300&fit=crop', 'floors', 20, 'منظف متعدد الاستخدامات للأرضيات المختلفة', 40),
('مسحوق الغسيل الأتوماتيك', 45.00, 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=300&h=300&fit=crop', 'laundry', 10, 'مسحوق غسيل للغسالات الأتوماتيكية', 25),
('سائل تنظيف الزجاج', 20.00, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop', 'kitchen', 0, 'سائل مخصص لتنظيف الزجاج والمرايا', 35),
('معطر الأقمشة', 28.00, 'https://images.unsplash.com/photo-1615887353976-64b5a8b3f7c2?w=300&h=300&fit=crop', 'laundry', 25, 'معطر طبيعي للأقمشة برائحة منعشة', 45);

-- تمكين Row Level Security للحماية (اختياري حالياً للمنتجات العامة)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات للوصول العام للمنتجات والفئات
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);

-- سياسة للطلبات - يمكن إنشاؤها بدون قيود حالياً
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
