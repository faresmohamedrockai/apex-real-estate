import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { FaBed, FaBath, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
import { ReactNode } from "react";
import { useAppContext } from "../../context/contextData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { compressAndUploadToCloudinary } from "@/lib/ComprssImage";
import { useSession } from "next-auth/react";
export type Unit = {
  _id: string;
  title: string;
  title_en?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
  unitType?: string;
  unitType_en?: string;
  isUnique?: boolean;
  area?: number;
  projectId?: string; // ObjectId as string
  region?: string;
  region_en?: string;
  project?: string;
  project_en?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  description_en?: string;

};

interface UnitDialogProps {
  unit: Unit;
  children: ReactNode;
  onUnitUpdated?: () => void;
  onUnitDeleted?: () => void;
}

export default function UnitDialog({ unit, children, onUnitUpdated, onUnitDeleted }: UnitDialogProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: unit.title || "",
    price: unit.price || 0,
    unitType: unit.unitType || "Apartment",
    bedrooms: unit.bedrooms || 1,
    bathrooms: unit.bathrooms || 1,
    area: unit.area || 0,
    projectId: unit.projectId || "",
    isUnique: unit.isUnique || false,
    latitude: unit.latitude || 0,
    longitude: unit.longitude || 0,
    images: unit.images || [],
    description: unit.description || "",
    description_en: unit.description_en || "",
    region: unit.region || "",
    region_en: unit.region_en || "",
    project_en: unit.project_en || "",
  });
  const [images, setImages] = useState<string[]>(unit.images || []);
  const [displayImages, setDisplayImages] = useState<string[]>(unit.images || []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [uniqueMsg, setUniqueMsg] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { projects } = useAppContext()


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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
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
      const res = await fetch(`/api/inventories/${unit._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images: allImages, projectId: form.projectId, project_en: form.project_en }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("تم حفظ التعديلات بنجاح");
        setEditMode(false);
        setTimeout(() => {
          setMessage("");
          setOpen(false);
          if (onUnitUpdated) onUnitUpdated();
        }, 1200);
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
      setMessage("❌ لا يمكنك حذف الوحدات. صلاحيات غير كافية.");
      return;
    }
    
    if (!confirm("هل أنت متأكد من حذف الوحدة؟")) return;
    setDeleteLoading(true);
    setMessage("جاري حذف الوحدة، يرجى الانتظار...");
    try {
      const res = await fetch(`/api/inventories/${unit._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("تم حذف الوحدة بنجاح");
        setTimeout(() => {
          setMessage("");
          setOpen(false);
          if (onUnitDeleted) onUnitDeleted();
        }, 1200);
      } else {
        setMessage(data.error || "حدث خطأ أثناء الحذف");
      }
    } catch (err) {
      setMessage("حدث خطأ في الاتصال بالخادم");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-[550px]">{children}</DialogTrigger>
      <DialogContent className="max-w-5xl w-full bg-black/90 text-white border-white/20 rounded-2xl p-4 md:p-10 max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2 text-right">{unit.title}</DialogTitle>
          <DialogDescription className="mb-4 text-right">
            {unit.description ? unit.description : "لا يوجد وصف لهذه الوحدة."}
          </DialogDescription>
          {editMode ? (




            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-right p-5 overflow-y-auto scrollbar-hidden w-full" dir="ltr" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="title" className="block text-base text-right">اسم الوحدة</Label>
                <Input id="title" name="title" value={form.title} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" required />
              </div>
              <div>
                <Label htmlFor="description" className="block text-base text-right">وصف الوحدة</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20 focus:ring-white text-right min-h-[100px]"
                  placeholder="أدخل وصف مفصل للوحدة..."
                />
              </div>
              <div>
                <Label htmlFor="project_en" className="block text-base text-left">وصف المشروع (بالإنجليزية)</Label>
                <Textarea
                  id="project_en"
                  name="project_en"
                  value={form.project_en || ""}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20 focus:ring-white text-right min-h-[60px]"
                  placeholder="Enter project description in English..."
                />
              </div>
              <div>
                <Label htmlFor="price" className="block text-base text-right">السعر</Label>
                <Input id="price" name="price" type="number" value={form.price} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
              </div>


              <div>
                <Label htmlFor="region" className="block text-base text-right">  مكان الوحدة</Label>
                <Input id="region" type="text" value={form.region} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
              </div>
              <div>
                <Label htmlFor="region_en" className="block text-base text-right">   مكان الوحدة بالانجليزي</Label>
                <Input id="region_en" type="text" value={form.region_en} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-left" />
              </div>



              <div>
                <Label htmlFor="unitType" className="block text-base text-right">نوع الوحدة</Label>
                <Select
                  value={form.unitType}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, unitType: value }))}
                >
                  <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:ring-white text-right">
                    <SelectValue placeholder="اختر نوع الوحدة" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#b70501] text-white text-right">
                    <SelectItem value="شقة">شقة</SelectItem>
                    <SelectItem value="دوبلكس">دوبلكس</SelectItem>
                    <SelectItem value="مكتب">مكتب</SelectItem>
                    <SelectItem value="استوديو">استوديو</SelectItem>
                    <SelectItem value="فيلا">فيلا</SelectItem>
                    <SelectItem value="مكتب اداري">مكتب اداري</SelectItem>
                    <SelectItem value="عقار">عقار</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="bedrooms" className="block text-base text-right">عدد الغرف</Label>
                  <Input id="bedrooms" name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="bathrooms" className="block text-base text-right">عدد الحمامات</Label>
                  <Input id="bathrooms" name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
                </div>
              </div>
              <div>
                <Label htmlFor="area" className="block text-base text-right">المساحة م2</Label>
                <Input id="area" name="area" type="number" value={form.area} onChange={handleChange} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
              </div>
              {/* Project selection */}
              <div>
                <Label htmlFor="projectId" className="block text-base text-right">المشروع</Label>
                <Select value={form.projectId} onValueChange={(value) => setForm(prev => ({ ...prev, projectId: value }))}>
                  <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:ring-white text-right">
                    <SelectValue placeholder="اختر المشروع" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#b70501] text-white text-right">
                    {(projects as { _id: string; name: string; image?: string }[]).map((proj) => (
                      <SelectItem key={proj._id} value={proj._id}>{proj.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Unique switch */}
              <div>
                <Label htmlFor="isUnique" className="block text-base text-right">مميز؟</Label>
                <Switch id="isUnique" checked={form.isUnique} onCheckedChange={(checked) => {
                  setForm(prev => ({ ...prev, isUnique: checked }));
                  setUniqueMsg(checked ? "تم اختيار الوحدة كمميزة" : "تم إلغاء تمييز الوحدة");

                }} className="ml-2" />
                {uniqueMsg && <div className="text-xs text-green-400 mt-1">{uniqueMsg}</div>}
              </div>


              <div className="flex gap-4 col-span-2">
                <div className="flex-1">
                  <Label htmlFor="latitude" className="block text-base text-right">خط العرض من الخريطة</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    value={form.latitude}
                    onChange={handleChange}
                    className="bg-white/10 text-white border-white/20 focus:ring-white text-right"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="longitude" className="block text-base text-right">خط الطول من الخريطة</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    value={form.longitude}
                    onChange={handleChange}
                    className="bg-white/10 text-white border-white/20 focus:ring-white text-right"
                  />
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
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden " dir="rtl">
                <Image
                  src={unit.images?.[0] || "/images/no-image.png"}
                  alt={unit.title}
                  fill
                  className="object-cover"
                />
                {unit.unitType && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full shadow">
                    {unit.unitType}
                  </div>
                )}
                {unit.isUnique && (
                  <div className="absolute top-2 left-2 bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold shadow">
                    مميز
                  </div>
                )}
              </div>
              <div className="space-y-2 text-left">
                {unit.description && (
                  <div className="mb-4 p-3 bg-white/10 rounded-lg">
                    <h4 className="font-semibold mb-2">الوصف:</h4>
                    <p className="text-sm leading-relaxed">{unit.description}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>السعر:</span>
                  <span>{unit.price.toLocaleString()} ج.م</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBed />
                  <span>{unit.bedrooms}</span>
                  <span>|</span>
                  <FaBath />
                  <span>{unit.bathrooms}</span>
                </div>
                {/* Project name (read-only) */}
                {unit.project && (
                  <div className="flex items-center gap-2">
                    <span className="bg-white/10 text-white border-white/20 rounded px-3 py-2 text-right">{unit.project}</span>
                  </div>
                )}
                {unit.region && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    <span>{unit.region}</span>
                  </div>
                )}
              </div>









              {message && <div className="text-white bg-red-600 p-2 rounded text-center mt-2">{message}</div>}
              <div className="flex gap-2 mt-6">
                <Button onClick={() => setEditMode(true)} className="bg-blue-700 hover:bg-blue-800 text-white w-[50%] py-1 px-2 text-sm">تعديل</Button>
                {role !== 'sales' && (
                  <Button onClick={handleDelete} variant="destructive" className="w-[50%] py-1 px-2 text-sm" disabled={deleteLoading}>
                    {deleteLoading ? "جاري الحذف..." : "حذف"}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
} 