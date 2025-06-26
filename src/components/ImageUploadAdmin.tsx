
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadAdminProps {
  bucket: 'product-images' | 'offer-images' | 'store-images';
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  className?: string;
}

const ImageUploadAdmin = ({ bucket, onImageUploaded, currentImage, className = "" }: ImageUploadAdminProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreview(data.publicUrl);
      onImageUploaded(data.publicUrl);
      
      toast({
        title: "تم رفع الصورة",
        description: "تم رفع الصورة بنجاح",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "حجم الملف كبير",
          description: "يجب أن يكون حجم الصورة أقل من 10 ميجابايت",
          variant: "destructive"
        });
        return;
      }
      uploadImage(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUploaded('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id={`file-upload-${bucket}`}
        disabled={uploading}
      />
      
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="معاينة"
            className="w-full h-32 object-cover rounded-lg shadow-md"
          />
          <Button
            onClick={removeImage}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-8 h-8 p-0"
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={`file-upload-${bucket}`}
          className="cursor-pointer"
        >
          <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-emerald-500 transition-colors bg-gray-50 hover:bg-emerald-50">
            {uploading ? (
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">جاري الرفع...</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">اضغط لرفع صورة</p>
                <p className="text-xs text-gray-500">PNG, JPG حتى 10MB</p>
              </div>
            )}
          </div>
        </label>
      )}
    </div>
  );
};

export default ImageUploadAdmin;
