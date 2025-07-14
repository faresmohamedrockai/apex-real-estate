import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compressAndUploadToCloudinary } from "@/lib/ComprssImage";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

const AddDeveloperDialog = ({ open, onClose, onDeveloperAdded }: { open: boolean; onClose: () => void; onDeveloperAdded: () => void }) => {
  const [name, setName] = useState("");
  const [name_en, setNameEN] = useState("");
  const [description, SetDescription] = useState("");
  const [description_en, setDescription_en] = useState("");
  const [logo, setLogo] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [displayLogo, setDisplayLogo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setDisplayLogo(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      let logoUrl = logo;
      if (selectedFile) {
        const url = await compressAndUploadToCloudinary(selectedFile);
        if (typeof url === "string" && url.startsWith("http")) {
          logoUrl = url;
        }
      }
      const res = await fetch("/api/Developers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name,name_en, logo: logoUrl,description,description_en }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessage("تمت إضافة المطور بنجاح");
        onDeveloperAdded();
        onClose();
        setName("");
        setNameEN("");
        SetDescription("");
        setDescription_en("");
        setLogo("");
        setSelectedFile(null);
        setDisplayLogo("");
        setTimeout(() => setMessage("") , 1000);
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
      <SheetContent side="bottom" className="w-full bg-[#b70501] text-white border-white/20 p-16 shadow-xl rounded-2xl font-extrabold md:w-[100vw] min-h-[40vh] max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold text-white text-right">إضافة مطور جديد</SheetTitle>
          <SheetDescription className="text-sm text-white mb-4 text-right">
            أدخل بيانات المطور الجديد:
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-4 mt-6 text-right" dir="rtl" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name" className="mb-2.5 block text-base text-right">اسم المطور</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" required />
          </div>
          <div>
            <Label htmlFor="name_en" className="mb-2.5 block text-base text-left">اسم المطور بالإنجليزية</Label>
            <Input id="name_en" value={name_en} onChange={e => setNameEN(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-left" required />
          </div>
          <div>
            <Label htmlFor="description" className="mb-2.5 block text-base text-right"> معلومات عن المطور </Label>
            <Textarea id="description" value={description} onChange={e => SetDescription(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-right" required />
          </div>
          <div>
            <Label htmlFor="description_en" className="mb-2.5 block text-base text-right">معلومات عن المطور بالانجليزية  </Label>
            <Textarea id="description_en" value={description_en} onChange={e => setDescription_en(e.target.value)} className="bg-white/10 text-white border-white/20 focus:ring-white text-left" required />
          </div>
          <div>
            <Label className="block text-base text-right">الشعار</Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition mb-2 disabled:opacity-50"
            >
              {loading ? "جاري الرفع..." : "إضافة شعار"}
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
          {message && <div className="text-white bg-red-600 p-2 rounded text-center">{message}</div>}
          <Button type="submit" className="mt-4 bg-white/20 hover:bg-white/30 text-white w-full" disabled={loading}>
            {loading ? "جاري الإضافة..." : "إضافة المطور"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddDeveloperDialog; 