
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Home, ShoppingCart, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();

  const navItems = [
    { path: '/home', icon: Home, label: 'الرئيسية' },
    { path: '/cart', icon: ShoppingCart, label: 'السلة', badge: getTotalItems() },
    { path: '/profile', icon: User, label: 'الحساب' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 shadow-2xl z-50 rounded-t-3xl mx-2 mb-2">
      <div className="flex justify-around items-center max-w-md mx-auto py-3 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              variant="ghost"
              className={`flex flex-col items-center gap-1 p-3 h-auto min-w-0 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-white/20 text-white shadow-lg scale-110 backdrop-blur-sm' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/80'}`} />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white animate-pulse">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-white' : 'text-white/80'
              }`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
      
      {/* Gradient overlay for extra visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-3xl pointer-events-none"></div>
    </div>
  );
};

export default BottomNavigation;
