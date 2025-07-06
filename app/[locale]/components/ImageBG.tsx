import Image from 'next/image';

const ImageBG = () => {
  return (
    <div className="fixed inset-0 z-[-10]">
        <Image
          src="/images/499794898_122164762250571767_4365539481736873945_n.jpg"
          width={1000}
          height={1000}
          alt="background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#b70501]/60" />
      </div>
  )
}

export default ImageBG
