
import { useState, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BottomNavigation from '@/components/BottomNavigation';
import { User, Camera, Save, LogOut, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, login, logout } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthDate: user?.birthDate || '',
    avatar: user?.avatar || ''
  });

  const [isEditing, setIsEditing] = useState(!user);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.birthDate) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const age = calculateAge(formData.birthDate);
    if (age < 18) {
      toast({
        title: "عمر غير مسموح",
        description: "يجب أن يكون العمر 18 سنة أو أكثر",
        variant: "destructive"
      });
      return;
    }

    login(formData);
    setIsEditing(false);
    toast({
      title: "تم حفظ البيانات",
      description: "تم تحديث معلومات الحساب بنجاح",
    });
  };

  const handleLogout = () => {
    logout();
    setIsEditing(true);
    setFormData({
      name: '',
      phone: '',
      address: '',
      birthDate: '',
      avatar: ''
    });
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="gradient-bg text-white p-4 text-center">
        <User className="w-12 h-12 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">الحساب</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {formData.name ? formData.name.charAt(0) : 'ن'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-blue-500 hover:bg-blue-600"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <CardTitle className="text-xl">
                {user ? `مرحباً ${user.name}` : 'إنشاء حساب جديد'}
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={!isEditing}
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
                placeholder="أدخل رقم هاتفك"
                dir="ltr"
              />
            </div>
            
            <div>
              <Label htmlFor="address">العنوان *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                disabled={!isEditing}
                placeholder="أدخل عنوانك"
              />
            </div>
            
            <div>
              <Label htmlFor="birthDate">تاريخ الميلاد * (يجب أن يكون العمر 18 سنة أو أكثر)</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                disabled={!isEditing}
              />
              {formData.birthDate && (
                <p className="text-sm text-gray-600 mt-1">
                  العمر: {calculateAge(formData.birthDate)} سنة
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          {isEditing ? (
            <Button 
              onClick={handleSave}
              className="flex-1 gradient-green text-white"
            >
              <Save className="w-4 h-4 ml-2" />
              حفظ البيانات
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex-1"
              >
                تعديل البيانات
              </Button>
              <Button 
                onClick={handleLogout}
                variant="destructive"
                className="flex-1"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </>
          )}
        </div>

        {user && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">معلومات الحساب</span>
              </div>
              <div className="space-y-1 text-sm text-blue-800">
                <p>الاسم: {user.name}</p>
                <p>الهاتف: {user.phone}</p>
                <p>العنوان: {user.address}</p>
                <p>العمر: {calculateAge(user.birthDate)} سنة</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
