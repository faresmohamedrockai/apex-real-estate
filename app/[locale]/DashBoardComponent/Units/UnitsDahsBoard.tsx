"use client"
import UnitsList from "@/app/[locale]/DashBoardComponent/Units/UnitsList";
import { Unit } from "@/app/[locale]/DashBoardComponent/Units/UnitDialog";
import { useAppContext } from "../../context/contextData";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compressAndUploadToCloudinary } from "@/lib/ComprssImage";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";

function isValidCloudinaryUrl(url: string | undefined | null): url is string {
  return typeof url === 'string' && url.startsWith('http');
}

const AddUnitDialog = ({ open, onClose, onUnitAdded }: { open: boolean; onClose: () => void; onUnitAdded?: () => void }) => {
  const [title, setTitle] = useState("");
  const [title_en, setTitle_en] = useState("");
  const [price, setPrice] = useState("");
  const [unitType, setUnitType] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState(0);
  const [projectId, setProjectId] = useState("");
  const [isUnique, setIsUnique] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [description_en, setDescription_en] = useState("");
  const [region, setRegion] = useState("");
  const [region_en, setRegion_en] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [project, setProject] = useState<{ _id: string; title: string }[]>([]);
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [project_en, setProjectEn] = useState("");
  const [uniqueMsg, setUniqueMsg] = useState("");

  const { projects } = useAppContext()
// console.log(projects);

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

  // TODO: جلب قائمة المشاريع لعرضها في select

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      let uploadedImages: string[] = [];
      let failedUploads = 0;
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        // ضغط وتحويل إلى base64 ورفع إلى Cloudinary
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
      // أرسل فقط روابط Cloudinary النهائية
      const res = await fetch("/api/inventories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          title_en,
          price: Number(price),
          unitType,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          area: Number(area),
          projectId,
          isUnique,
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
          images: uploadedImages,
          description,
          description_en,
          region,
          region_en,
          project_en,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("تمت إضافة الوحدة بنجاح");
        onClose();
        if (onUnitAdded) onUnitAdded();
      } else {
        setMessage(data.error || "حدث خطأ أثناء الإضافة");
      }
    } catch (err) {
      setMessage("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <SheetContent side="bottom" className="w-full bg-[#b70501] text-white border-white/20 p-16 shadow-xl rounded-2xl font-extrabold md:w-[100vw] min-h-[60vh] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold text-white text-right">إضافة وحدة جديدة</SheetTitle>
          <SheetDescription className="text-sm text-white mb-4 text-right">
            أدخل بيانات الوحدة الجديدة:
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-4 mt-6 text-right" dir="rtl" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title" className="mb-2.5 block text-base text-right">اسم الوحدة</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" required />
          </div>
          <div>
            <Label htmlFor="title_en" className="mb-2.5 block text-base text-right"> اسم الوحدة بالانجليزية</Label>
            <Input id="title_en" value={title_en} onChange={e => setTitle_en(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" required />
          </div>

          <div>
            <Label htmlFor="description" className="block text-base text-right">وصف الوحدة</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              className="bg-white/10 text-white border-white/20 placeholder:text-white focus:ring-white text-right min-h-[100px]"
              placeholder="أدخل وصف مفصل للوحدة..."
            />
          </div>
          {/* وصف الوحدة بالإنجليزية */}
          <div>
            <Label htmlFor="description_en" className="block text-base text-right">وصف الوحدة (بالإنجليزية)</Label>
            <Textarea
              id="description_en"
              value={description_en}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription_en(e.target.value)}
              className="bg-white/10 text-white border-white/20 placeholder:text-white focus:ring-white text-left min-h-[100px]"
              placeholder="Enter unit description in English..."
            />
          </div>

          <div>
            <Label htmlFor="price" className="block text-base text-right">   السعر ج.م</Label>
            <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
          </div>
          <div>
            <Label htmlFor="region" className="block text-base text-right">  مكان الوحدة</Label>
            <Input id="region" type="text" value={region} onChange={e => setRegion(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
          </div>
          <div>
            <Label htmlFor="region_en" className="block text-base text-right">   مكان الوحدة بالانجليزي</Label>
            <Input id="region_en" type="text" value={region_en} onChange={e => setRegion_en(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-left" />
          </div>
          <div>
            <Label htmlFor="unitType" className="block text-base text-right">نوع الوحدة</Label>
            <Select value={unitType} onValueChange={setUnitType}>
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
              <Input id="bedrooms" type="number" value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
            </div>
            <div className="flex-1">
              <Label htmlFor="bathrooms" className="block text-base text-right">عدد الحمامات</Label>
              <Input id="bathrooms" type="number" value={bathrooms} onChange={e => setBathrooms(Number(e.target.value))} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
            </div>
          </div>
          <div>
            <Label htmlFor="area" className="block text-base text-right"> المساحة م2</Label>
            <Input id="area" type="number" value={area} onChange={e => setArea(Number(e.target.value))} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
          </div>
          {/* Project selection */}
          <div>
            <Label htmlFor="projectId" className="block text-base text-right">المشروع</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:ring-white text-left">
                <SelectValue placeholder="اختر المشروع" className="text-white"/>
              </SelectTrigger>
              <SelectContent className="bg-[#b70501] text-white text-left placeholder:text-white">
                {(projects as { _id: string; name: string; image?: string }[]).map((proj) => {
                  return (
                    <SelectItem key={proj._id} value={proj._id} className="flex items-center gap-2">
                      {proj.image && (
                        <img
                          src={proj.image}
                          alt={proj.name}
                          className="w-6 h-6 object-cover rounded"
                        />
                      )}
                      {proj.name}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          {/* Unique switch */}
          <div>
            <Label htmlFor="isUnique" className="block text-base text-right">مميز؟</Label>
            <Switch id="isUnique" checked={isUnique} onCheckedChange={(checked: boolean) => {
              setIsUnique(checked);
              setUniqueMsg(checked ? "تم اختيار الوحدة كمميزة" : "تم إلغاء تمييز الوحدة");
              setTimeout(() => setUniqueMsg("") , 2000);
            }} className="ml-2" />
            {uniqueMsg && <div className="text-xs text-green-400 mt-1">{uniqueMsg}</div>}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="latitude" className="block text-base text-right"> خط العرض من الخريطة</Label>
              <Input id="latitude" type="number" value={latitude} onChange={e => setLatitude(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
            </div>
            <div className="flex-1">
              <Label htmlFor="longitude" className="block text-base text-right">خط الطول من الخريطة </Label>
              <Input id="longitude" type="number" value={longitude} onChange={e => setLongitude(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
            </div>
          </div>
          {/* Images upload */}
          <div>
            <Label className="block text-base text-right">الصور</Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition mb-2 disabled:opacity-50"
            >
              <Plus /> {imageLoading ? "جاري الرفع..." : "إضافة صور"}
            </button>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/jpg"
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
          <Button type="submit" className="mt-4 bg-white/20 hover:bg-white/30 text-white w-full" disabled={loading}>
            {loading ? "جاري الإضافة..." : "إضافة الوحدة"}
          </Button>
        
        </form>
      </SheetContent>
    </Sheet>
  );
};

const UnitsDahsBoard = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch units from API
  const fetchUnits = async () => {
    setLoading(true);
    const res = await fetch("/api/inventories");
    const data = await res.json();
    setUnits(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  // Callbacks for add, update, delete
  const handleUnitAdded = () => {
    setMessage("لقد تم إضافة الوحدة بنجاح");
    fetchUnits();
    setOpenAdd(false);
    setTimeout(() => setMessage(""), 3000);
  };
  const handleUnitUpdated = () => {
    setMessage("تم تعديل الوحدة بنجاح");
    fetchUnits();
    setTimeout(() => setMessage(""), 3000);
  };
  const handleUnitDeleted = () => {
    setMessage("تم حذف الوحدة بنجاح");
    fetchUnits();
    setTimeout(() => setMessage(""), 3000);
  };

  // فلترة الوحدات حسب البحث
  const filteredUnits = units.filter((unit) => {
    const name =
      typeof unit.title === "object" && unit.title !== null && "ar" in unit.title
        ? (unit.title as { ar: string }).ar
        : unit.title;
    return name && name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoadingSpinner size="lg" color="red" />
        </div>
      ) : (
        <>
          {message && (
            <div className="mb-4 text-center text-white bg-green-600 rounded p-2 font-bold animate-pulse">{message}</div>
          )}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <Input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن وحدة..."
                className="w-full rounded-xl bg-neutral-900/80 border border-white/20 text-white py-2 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-[#b70501] text-right placeholder:text-white/50"
                dir="rtl"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" size={22} />
            </div>
            <div className="flex justify-end">
              <Sheet open={openAdd} onOpenChange={setOpenAdd}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-sm text-white border-white/30 hover:bg-neutral-800 hover:text-white rounded-2xl font-bold px-6 py-2"
                    onClick={() => setOpenAdd(true)}
                  >
                    إضافة وحدة
                  </Button>
                </SheetTrigger>
                <AddUnitDialog open={openAdd} onClose={() => setOpenAdd(false)} onUnitAdded={handleUnitAdded} />
              </Sheet>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-8 text-right">الوحدات</h2>
          <UnitsList units={filteredUnits} onUnitUpdated={handleUnitUpdated} onUnitDeleted={handleUnitDeleted} />
        </>
      )}
    </div>
  );
};

export default UnitsDahsBoard;
