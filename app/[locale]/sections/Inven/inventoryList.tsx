'use client';

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface Inventory {
  _id: string;
  title: string;
  price: number;
  unitType: string;
  images: string[];
  projectId: {
    name: string;
    logos: string;
  };
}

const InventoryList = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);

  useEffect(() => {
    fetch("/api/inverntories")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setInventories(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {inventories.map((inv) => (
        <HoverCard key={inv._id} inventory={inv} />
      ))}
    </div>
  );
};

const HoverCard = ({ inventory }: { inventory: Inventory }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [-15, 15]), {
    stiffness: 100,
    damping: 10,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), {
    stiffness: 100,
    damping: 10,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;

    const newX = posX / rect.width;
    const newY = posY / rect.height;

    x.set(newX);
    y.set(newY);
  };

  const resetRotation = () => {
    x.set(0.5);
    y.set(0.5);
  };

  useEffect(() => {
    resetRotation();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetRotation}
      className="group"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        className="rounded-tl-xl rounded-br-xl bg-[#fdfafa] border border-[#b70501]/20 shadow-xl overflow-hidden transition-transform duration-200"
      >
        {/* صورة الوحدة */}
        {inventory.images?.[0] && (
          <img
            src={inventory.images[0]}
            alt={inventory.title}
            className="w-full h-48 object-cover"
          />
        )}

        {/* المحتوى */}
        <div className="p-4 flex flex-col justify-between gap-3">
          {/* اسم الوحدة والسعر */}
          <div>
            <h2 className="text-xl font-bold text-[#b70501]">{inventory.title}</h2>
            <p className="text-gray-800 mt-1">
              السعر:{" "}
              <span className="font-medium text-black">
                {inventory.price.toLocaleString()} ج.م
              </span>
            </p>
            <p className="text-sm text-gray-600">النوع: {inventory.unitType}</p>
          </div>

          {/* معلومات المشروع */}
          <div className="flex justify-between gap-3 p-3 border-b  rounded-lg">
            <div className="flex items-center">



              <h3 className="text-lg font-semibold text-[#b70501]">
                {inventory.projectId.name}
              </h3>
              {inventory.projectId.logos && (
                <img
                  src={inventory.projectId.logos}
                  alt={inventory.projectId.name}
                  className="w-10 h-10 object-contain rounded-full border border-[#b70501]/40"
                />
              )}</div>
            <a
              href={`https://wa.me/201113199101?text=مرحبًا، أريد معرفة تفاصيل عن ${inventory.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-3 text-green-600 hover:text-green-700 transition text-base font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48">
                <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
                <path fill="#fff" fillRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clipRule="evenodd"></path>
              </svg>
              واتساب
            </a>

          </div>

          {/* زر واتساب */}

        </div>
      </motion.div>
    </div>
  );
};

export default InventoryList;
