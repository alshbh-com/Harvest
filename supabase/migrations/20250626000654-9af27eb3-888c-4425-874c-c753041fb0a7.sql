
-- إنشاء جدول العروض
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount INTEGER NOT NULL CHECK (discount >= 0 AND discount <= 100),
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول إعدادات المتجر
CREATE TABLE public.store_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL DEFAULT 'متجر النظافة',
  welcome_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إدراج الإعدادات الافتراضية
INSERT INTO public.store_settings (store_name, welcome_image_url) VALUES
('متجر النظافة', 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center');

-- إدراج بعض العروض التجريبية
INSERT INTO public.offers (title, description, discount, valid_until) VALUES
('خصم 25% على منتجات المطبخ', 'عرض خاص على جميع منتجات تنظيف المطبخ', 25, '2024-12-31'),
('اشتري 2 واحصل على 1 مجاناً', 'عرض مميز على منتجات الغسيل', 33, '2024-12-25');

-- إنشاء bucket للصور في التخزين
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('offer-images', 'offer-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('store-images', 'store-images', true);

-- سياسات للوصول العام للعروض وإعدادات المتجر
CREATE POLICY "Allow public read access to offers" ON public.offers FOR SELECT USING (true);
CREATE POLICY "Allow public read access to store_settings" ON public.store_settings FOR SELECT USING (true);

-- سياسات الإدارة (يُفضل تطبيق نظام المصادقة لاحقاً)
CREATE POLICY "Allow public insert offers" ON public.offers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update offers" ON public.offers FOR UPDATE WITH CHECK (true);
CREATE POLICY "Allow public delete offers" ON public.offers FOR DELETE USING (true);

CREATE POLICY "Allow public insert store_settings" ON public.store_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update store_settings" ON public.store_settings FOR UPDATE WITH CHECK (true);

CREATE POLICY "Allow public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" ON public.products FOR UPDATE WITH CHECK (true);
CREATE POLICY "Allow public delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow public insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update categories" ON public.categories FOR UPDATE WITH CHECK (true);
CREATE POLICY "Allow public delete categories" ON public.categories FOR DELETE USING (true);

-- سياسات التخزين للصور
CREATE POLICY "Allow public access to product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Allow public upload to product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Allow public update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Allow public delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

CREATE POLICY "Allow public access to offer images" ON storage.objects FOR SELECT USING (bucket_id = 'offer-images');
CREATE POLICY "Allow public upload to offer images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'offer-images');
CREATE POLICY "Allow public update offer images" ON storage.objects FOR UPDATE USING (bucket_id = 'offer-images');
CREATE POLICY "Allow public delete offer images" ON storage.objects FOR DELETE USING (bucket_id = 'offer-images');

CREATE POLICY "Allow public access to store images" ON storage.objects FOR SELECT USING (bucket_id = 'store-images');
CREATE POLICY "Allow public upload to store images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'store-images');
CREATE POLICY "Allow public update store images" ON storage.objects FOR UPDATE USING (bucket_id = 'store-images');
CREATE POLICY "Allow public delete store images" ON storage.objects FOR DELETE USING (bucket_id = 'store-images');
