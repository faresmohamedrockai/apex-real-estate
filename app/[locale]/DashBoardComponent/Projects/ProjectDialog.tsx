import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ReactNode, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { compressAndUploadToCloudinary } from "@/lib/ComprssImage";
import { useSession } from "next-auth/react";

export type Project = {
  _id: string;
  name: string;
  name_en?: string;
  image?: string[];
  zone?: string;
  zone_en?: string;
  developerId?: string;
  latitude?: number;
  longitude?: number;
};

interface ProjectDialogProps {
  project: Project;
  children: ReactNode;
  onProjectUpdated?: () => void;
  onProjectDeleted?: () => void;
}

export default function ProjectDialog({ project, children, onProjectUpdated, onProjectDeleted }: ProjectDialogProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: project.name || "",
    name_en: project.name_en || "",
    zone: project.zone || "",
    zone_en: project.zone_en || "",
    developerId: project.developerId || "",
    latitude: project.latitude || 0,
    longitude: project.longitude || 0,
    image: project.image || [],
  });
  const [displayImages, setDisplayImages] = useState<string[]>(project.image || []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [developers, setDevelopers] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/Developers")
      .then((res) => res.json())
      .then((data) => setDevelopers(data));
  }, []);


  useEffect(() => {
    setForm({
      name: project.name || "",
      name_en: project.name_en || "",
      zone: project.zone || "",
      zone_en: project.zone_en || "",
      developerId: typeof project.developerId === "object" && project.developerId !== null
        ? (project.developerId as { _id?: string; id?: string })._id || (project.developerId as { id?: string }).id || ""
        : project.developerId || "",
      latitude: project.latitude || 0,
      longitude: project.longitude || 0,
      image: project.image || [],
    });
  }, [project]);


  function isValidCloudinaryUrl(url: string | undefined | null): url is string {
    return typeof url === 'string' && url.startsWith('http');
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setDisplayImages(prev => [...prev, ...previews]);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (idx: number) => {
    setDisplayImages(prev => prev.filter((_, i) => i !== idx));
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (!form.developerId) {
      setMessage("يجب اختيار المطور");
      setLoading(false);
      return;
    }
    try {
      let uploadedImages: string[] = [];
      let failedUploads = 0;
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const url = await compressAndUploadToCloudinary(file);
        if (isValidCloudinaryUrl(url)) {
          uploadedImages.push(url);
        } else {
          failedUploads++;
        }
      }
      if (failedUploads > 0) {
        setMessage(`فشل رفع ${failedUploads} صورة. يرجى المحاولة مرة أخرى.`);
      }
      const oldImages = displayImages.filter(img => img.startsWith('http') || img.includes('cloudinary'));
      const allImages = [...oldImages, ...uploadedImages];

      const res = await fetch(`/api/projects/${project._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: allImages }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("تم حفظ التعديلات بنجاح");
        setEditMode(false);
        onProjectUpdated && onProjectUpdated();
      } else {
        setMessage(data.error || "حدث خطأ أثناء التعديل");
      }
    } catch (err) {
      setMessage("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (role === 'sales') {
      setMessage("❌ لا يمكنك حذف المشاريع. صلاحيات غير كافية.");
      return;
    }
    
    if (!confirm("هل أنت متأكد من حذف المشروع؟")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("تم حذف المشروع بنجاح");
        onProjectDeleted && onProjectDeleted();
      } else {
        setMessage(data.error || "حدث خطأ أثناء الحذف");
      }
    } catch (err) {
      setMessage("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  console.log(project);



  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl w-full bg-black/90 text-white border-white/20 rounded-2xl p-10 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2 text-right">{project.name}</DialogTitle>
          <DialogDescription className="mb-4 text-right">
            تفاصيل المشروع أو وصف مختصر...
          </DialogDescription>
          {editMode ? (
            <form className="space-y-4 mt-4 text-right p-5   w-full" dir="rtl" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="block text-base text-right">اسم المشروع</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" dir="rtl" required />
              </div>
              <div>
                <Label htmlFor="name_en" className="block text-base text-left">اسم المشروع (بالإنجليزية)</Label>
                <Input id="name_en" name="name_en" value={form.name_en} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-left" dir="ltr" required={false} />
              </div>
              <div>
                <Label htmlFor="zone" className="block text-base text-right">المنطقة</Label>
                <Input id="zone" name="zone" value={form.zone} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" dir="rtl" required={false} />
              </div>
              <div>
                <Label htmlFor="zone_en" className="block text-base text-left">المنطقة (بالإنجليزية)</Label>
                <Input id="zone_en" name="zone_en" value={form.zone_en} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-left" dir="ltr" required={false} />
              </div>
              <div>
                <Label htmlFor="developerId" className="block text-base text-right">المطور</Label>
                {/* Show current developer name if available */}
                {form.developerId && developers.length > 0 && (
                  <div className="mb-2 text-sm text-white text-right">
                    المطور الحالي: <span className="font-bold">{developers.find(dev => dev._id === form.developerId)?.name || "غير محدد"}</span>
                  </div>
                )}
                <Select value={form.developerId} onValueChange={(value) => setForm(prev => ({ ...prev, developerId: value }))} required>
                  <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:ring-white text-right" >
                    <SelectValue placeholder="اختر المطور" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#b70501] text-white text-right">
                    {developers.map((dev) => (
                      <SelectItem key={dev._id} value={dev._id}>{dev.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="latitude" className="block text-base text-right">خط العرض من  الخريطة</Label>
                  <Input id="latitude" name="latitude" type="number" value={form.latitude} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="longitude" className="block text-base text-right">خط الطول من الخريطة</Label>
                  <Input id="longitude" name="longitude" type="number" value={form.longitude} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
                </div>
              </div>
              {/* Images upload */}
              <div>
                <Label className="block text-base text-right">الصور</Label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition mb-2 disabled:opacity-50"
                >
                  <Plus /> {loading ? "جاري الرفع..." : "إضافة صور"}
                </button>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex gap-2 flex-wrap mt-2">
                  {displayImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt="img" className="w-20 h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
              {message && <div className="text-white bg-red-600 p-2 rounded text-center">{message}</div>}
              <div className="flex gap-2 mt-4">
                <Button type="submit" className="bg-white/20 hover:bg-white/30 text-white w-[50%] py-1 px-2 text-sm" disabled={loading}>
                  {loading ? "جاري التعديل..." : "حفظ التعديلات"}
                </Button>
                <Button type="button" variant="outline" className="w-[50%] py-1 px-2 text-sm" onClick={() => setEditMode(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                <Image
                  src={project.image?.[0] || "/images/no-image.png"}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 text-right">
                {project.zone && (
                  <div className="mb-4 p-3 bg-white/10 rounded-lg">
                    <h4 className="font-semibold mb-2">المنطقة:</h4>
                    <p className="text-sm leading-relaxed">{project.zone}</p>
                  </div>
                )}
                {!editMode && (
                  <div className="flex flex-col gap-2 mt-4 text-right">
                    <div className="font-bold">المطور: <span className="font-normal">{typeof project.developerId === "object" && project.developerId !== null ? (project.developerId as { name?: string }).name : project.developerId}</span></div>
                  </div>
                )}
                {(typeof project.latitude === 'number' && typeof project.longitude === 'number') && (
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs">({project.latitude}, {project.longitude})</span>
                  </div>
                )}
              </div>
              {message && <div className="text-white bg-red-600 p-2 rounded text-center mt-2">{message}</div>}
              <div className="flex gap-2 mt-6">
                <Button onClick={() => setEditMode(true)} className="bg-blue-700 hover:bg-blue-800 text-white w-[50%] py-1 px-2 text-sm">تعديل</Button>
                {role !== 'sales' && (
                  <Button onClick={handleDelete} variant="destructive" className="w-[50%] py-1 px-2 text-sm">حذف</Button>
                )}
              </div>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
} 