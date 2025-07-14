import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { ReactNode, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { compressAndUploadToCloudinary } from "@/lib/ComprssImage";
import { useSession } from "next-auth/react";

export type Developer = {
  _id: string;
  name: string;
  name_en: string;
  logo?: string;
  description: string;
  description_en?: string;
};

interface DeveloperDialogProps {
  developer: Developer;
  children: ReactNode;
  onDeveloperUpdated?: (dev: Developer) => void;
  onDeveloperDeleted?: () => void;
}

export default function DeveloperDialog({ developer, children, onDeveloperUpdated, onDeveloperDeleted }: DeveloperDialogProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: developer.name || "",
    name_en: developer.name_en || "",
    logo: developer.logo || "",
    description: developer.description || "",
    description_en: developer.description_en || "",
  });

  const [displayLogo, setDisplayLogo] = useState<string>(developer.logo || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setDisplayLogo(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      let logoUrl = form.logo;

      if (selectedFile) {
        const url = await compressAndUploadToCloudinary(selectedFile);
        if (typeof url === "string" && url.startsWith("http")) {
          logoUrl = url;
        }
      }

      const res = await fetch(`/api/Developers/${developer._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          name_en: form.name_en,
          logo: logoUrl,
          description: form.description,
          description_en: form.description_en
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("✅ تم حفظ التعديلات بنجاح");

        setTimeout(() => {
          setMessage("");
        }, 1000);
        setEditMode(false);
        
        const updatedDeveloper: Developer = {
          ...developer,
          name: form.name,
          name_en: form.name_en,
          logo: logoUrl,
          description: form.description,
          description_en: form.description_en,
        };
        
        onDeveloperUpdated && onDeveloperUpdated(updatedDeveloper);
      } else {
        setMessage(data.message || "❌ حدث خطأ أثناء التعديل");
      }
    } catch (err) {
      setMessage("❌ حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (role === 'sales') {
      setMessage("❌ لا يمكنك حذف المطورين. صلاحيات غير كافية.");
      return;
    }
    
    if (!confirm("هل أنت متأكد من حذف المطور؟")) return;
    setLoading(true);
    setMessage("جاري الحذف...");
    
    try {
      const res = await fetch(`/api/Developers/${developer._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("✅ تم حذف المطور بنجاح");
        if (onDeveloperDeleted) {
          setTimeout(() => {
            onDeveloperDeleted();
          }, 800);
        }
      } else {
        setMessage(data.message || "❌ حدث خطأ أثناء الحذف");
      }
    } catch (err) {
      setMessage("❌ حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl w-full bg-black/90 text-white border-white/20 rounded-2xl p-10 overflow-y-auto scrollbar-hidden text-right" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-2xl font-bold mb-2 text-right">
            {developer.name}
          </DialogTitle>
        </DialogHeader>
        
        {editMode ? (
          <form className="space-y-4 mt-4 text-right p-5 overflow-y-auto scrollbar-hidden w-full" dir="rtl" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="block text-base text-right">اسم المطور</Label>
              <Input 
                id="name" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                className="bg-white/10 text-white border-white/20 focus:ring-white text-right" 
                required 
              />
            </div>
            <div>
              <Label htmlFor="name_en" className="block text-base text-right">اسم المطور بالانجليزية</Label>
              <Input 
                id="name_en" 
                name="name_en" 
                value={form.name_en} 
                onChange={handleChange} 
                className="bg-white/10 text-white border-white/20 focus:ring-white text-left" 
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="block text-base text-right">معلومات عن المطور</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                className="bg-white/10 text-white border-white/20 focus:ring-white text-right" 
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="description_en" className="block text-base text-right">معلومات عن المطور بالإنجليزية</Label>
              <Textarea 
                id="description_en" 
                name="description_en" 
                value={form.description_en} 
                onChange={handleChange} 
                className="bg-white/10 text-white border-white/20 focus:ring-white text-left" 
                required 
              />
            </div>
            
            <div>
              <Label className="block text-base text-right">الشعار</Label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition mb-2 disabled:opacity-50"
              >
                {loading ? "جاري الرفع..." : "تغيير الشعار"}
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleLogoChange}
                className="hidden"
              />
              {displayLogo && (
                <div className="mt-2">
                  <Image src={displayLogo} alt="logo" width={80} height={80} className="rounded-full object-contain" />
                </div>
              )}
            </div>
            
            {message && (
              <div className={`p-2 rounded text-right ${
                message.includes("✅") ? "bg-green-600" : "bg-red-600"
              }`}>
                {message}
              </div>
            )}
            
            <div className="flex gap-2 mt-4 text-right">
              <Button 
                type="submit" 
                className="bg-white/20 hover:bg-white/30 text-white w-[50%] py-1 px-2 text-sm" 
                disabled={loading}
              >
                {loading ? "جاري التعديل..." : "حفظ التعديلات"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-[50%] py-1 px-2 text-sm" 
                onClick={() => setEditMode(false)}
              >
                إلغاء
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-col items-center mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white/30 shadow-lg mb-2 overflow-hidden bg-white">
                <Image
                  src={developer.logo || '/images/no-image.png'}
                  alt={developer.name}
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-white mt-2">
                {developer.name}
              </h3>
              {developer.description && (
                <p className="text-sm text-white/80 mt-2 text-center max-w-md">
                  {developer.description}
                </p>
              )}
            </div>
            
            {message && (
              <div className={`p-2 rounded text-right ${
                message.includes("✅") ? "bg-green-600" : "bg-red-600"
              }`}>
                {message}
              </div>
            )}
            
            <div className="flex gap-2 mt-4 text-right">
              <Button 
                type="button" 
                className="bg-white/20 hover:bg-white/30 text-white w-[50%] py-1 px-2 text-sm" 
                onClick={() => setEditMode(true)}
              >
                تعديل
              </Button>
              {role !== 'sales' && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  className="w-[50%] py-1 px-2 text-sm" 
                  onClick={handleDelete} 
                  disabled={loading}
                >
                  حذف
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 