
-- إزالة RLS من جدول الطلبات للسماح بإدراج الطلبات بدون مصادقة
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- إزالة RLS من جدول عناصر الطلبات أيضاً
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
