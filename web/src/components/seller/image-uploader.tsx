"use client";

import Image from "next/image";

const placeholders = ["/products/fashion.svg", "/products/detail-green.svg", "/products/detail-amber.svg"];

export function ImageUploader({ images, onChange, onError, maximum = 6 }: { images: string[]; onChange: (images: string[]) => void; onError: (message: string) => void; maximum?: number }) {
  async function read(files: FileList | null) {
    if (!files?.length) return;
    const remaining = maximum - images.length;
    if (remaining <= 0) return onError(`You can add a maximum of ${maximum} images.`);
    try {
      const selected = Array.from(files).slice(0, remaining);
      const encoded = await Promise.all(selected.map((file) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Invalid image")); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); })));
      onChange([...images, ...encoded]);
    } catch { onError("One or more images could not be read."); }
  }
  return <div><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-slate-800">Product images</h3><p className="mt-1 text-xs text-slate-500">The first image is the main image. Maximum {maximum}.</p></div><span className="text-xs font-bold text-slate-400">{images.length}/{maximum}</span></div><input type="file" multiple accept="image/*" onChange={(event) => void read(event.target.files)} className="mt-4 block w-full rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-bold file:text-emerald-700" /><div className="mt-3 flex flex-wrap gap-2"><span className="w-full text-xs font-bold text-slate-500">Testing placeholders:</span>{placeholders.map((placeholder, index) => <button key={placeholder} type="button" disabled={images.length >= maximum} onClick={() => onChange([...images, placeholder])} className="relative size-14 overflow-hidden rounded-lg border border-slate-200 disabled:opacity-40"><Image src={placeholder} alt={`Use placeholder ${index + 1}`} fill sizes="56px" className="object-cover" /></button>)}</div>{images.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{images.map((image, index) => <div key={`${image}-${index}`} className="rounded-xl border border-slate-200 p-2"><div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100"><Image src={image} alt={`Product preview ${index + 1}`} fill sizes="120px" className="object-cover" />{index === 0 ? <span className="absolute left-1 top-1 rounded bg-emerald-700 px-1.5 py-0.5 text-[9px] font-black text-white">MAIN</span> : null}</div><div className="mt-2 flex gap-1">{index ? <button type="button" onClick={() => onChange([image, ...images.filter((_, imageIndex) => imageIndex !== index)])} className="flex-1 rounded bg-slate-100 px-1 py-1 text-[10px] font-bold">Make main</button> : null}<button type="button" onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))} className="flex-1 rounded bg-rose-50 px-1 py-1 text-[10px] font-bold text-rose-700">Remove</button></div></div>)}</div> : null}</div>;
}
