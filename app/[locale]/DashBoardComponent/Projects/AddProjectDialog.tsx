"use client"
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compressAndUploadToCloudinary } from "@/lib/ComprssImage";
import { Plus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type AddProjectDialogProps = {
  open: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
};

const AddProjectDialog = ({ open, onClose, onProjectAdded }: AddProjectDialogProps) => {
  const [name, setName] = useState("");
  const [name_en, setNameEn] = useState("");
  const [zone, setZone] = useState("");
  const [zone_en, setZoneEn] = useState("");
  const [developerId, setDeveloperId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [developers, setDevelopers] = useState<{ _id: string, name: string }[]>([]);

  useEffect(() => {
    fetch("/api/Developers")
      .then(res => res.json())
      .then(data => setDevelopers(data));
  }, []);

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

  function isValidCloudinaryUrl(url: string | undefined | null): url is string {
    return typeof url === 'string' && url.startsWith('http');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (!developerId) {
      setMessage("يجب اختيار المطور");
      setLoading(false);
      return;
    }
    // if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    //   setMessage("أقل سعر لا يمكن أن يكون أكبر من أعلى سعر");
    //   setLoading(false);
    //   return;
    // }

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
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          name_en,
          zone,
          zone_en,
          developerId,
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
          image: uploadedImages,
          minPrice:Number(minPrice)
        }),

      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("تمت إضافة المشروع بنجاح");
        setTimeout(() => {
          setMessage("")
        }, 2000)
        onProjectAdded();
        onClose();
        // Clear form fields
        setName("");
        setNameEn("");
        setZone("");
        setZoneEn("");
        setDeveloperId("");
        setLatitude("");
        setLongitude("");
        setImages([]);
        
        setMinPrice("");
        setSelectedFiles([]);
        setDisplayImages([]);
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
          <SheetTitle className="text-lg font-bold text-white text-right">إضافة مشروع جديد</SheetTitle>
          <SheetDescription className="text-sm text-white mb-4 text-right">
            أدخل بيانات المشروع الجديد:
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-4 mt-6 text-right" dir="rtl" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name" className="mb-2.5 block text-base text-right">اسم المشروع</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" dir="rtl" required />
          </div>
          <div>
            <Label htmlFor="name_en" className="mb-2.5 block text-base text-left">اسم المشروع (بالإنجليزية)</Label>
            <Input id="name_en" value={name_en} onChange={e => setNameEn(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-left" dir="ltr" />
          </div>
          <div>
            <Label htmlFor="zone" className="mb-2.5 block text-base text-right">المنطقة</Label>
            <Input id="zone" value={zone} onChange={e => setZone(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" dir="rtl" />
          </div>
          <div>
            <Label htmlFor="zone_en" className="mb-2.5 block text-base text-left">المنطقة (بالإنجليزية)</Label>
            <Input id="zone_en" value={zone_en} onChange={e => setZoneEn(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-left" dir="ltr" />
          </div>


          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="minPrice" className="block text-base text-right">أقل سعر</Label>
              <Input
                id="minPrice"
                type="number"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="bg-white/10 text-white border-white/20 focus:ring-white text-right"
              />
            </div>
          
          </div>



          <div>
            <Label htmlFor="developerId" className="mb-2.5 block text-base text-right">المطور</Label>
            <Select value={developerId} onValueChange={setDeveloperId} required>
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
              <Input id="latitude" type="number" value={latitude} onChange={e => setLatitude(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
            </div>
            <div className="flex-1">
              <Label htmlFor="longitude" className="block text-base text-right">خط الطول من الخريطة</Label>
              <Input id="longitude" type="number" value={longitude} onChange={e => setLongitude(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" />
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
          <Button type="submit" className="mt-4 bg-[#b70501] hover:bg-[#950401] text-white w-full cursor-pointer" disabled={loading}>
            {loading ? "جاري إضافة المشروع..." : "إضافة المشروع"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddProjectDialog; 