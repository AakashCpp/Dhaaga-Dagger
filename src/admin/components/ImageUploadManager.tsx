import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import { ImagePlus, Star, Trash2, UploadCloud } from "lucide-react";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function optimizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("This image format could not be processed."));
      image.onload = () => {
        const maxEdge = 1600;
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) return reject(new Error("Image processing is unavailable."));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", .84));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUploadManager({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const addFiles = async (files: File[]) => {
    setError("");
    const available = MAX_IMAGES - images.length;
    const accepted = files.filter((file) => file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE).slice(0, available);
    if (!available) return setError("Maximum six images are allowed.");
    if (!accepted.length) return setError("Choose JPG, PNG or WEBP images under 5 MB.");
    if (files.length > available) setError("Only " + available + " more image" + (available === 1 ? "" : "s") + " can be added.");
    setProcessing(true);
    try {
      const optimized = await Promise.all(accepted.map(optimizeImage));
      onChange([...images, ...optimized]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Images could not be processed.");
    } finally {
      setProcessing(false);
    }
  };
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    void addFiles(Array.from(event.target.files || []));
    event.target.value = "";
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void addFiles(Array.from(event.dataTransfer.files));
  };
  const openPicker = () => inputRef.current?.click();
  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  };
  const makePrimary = (index: number) => onChange([images[index], ...images.filter((_, imageIndex) => imageIndex !== index)]);
  const remove = (index: number) => onChange(images.filter((_, imageIndex) => imageIndex !== index));

  return <div className="image-manager">
    <div className={"image-dropzone " + (dragging ? "dragging " : "") + (processing ? "processing" : "")} role="button" tabIndex={0} aria-label="Upload product images" onClick={openPicker} onKeyDown={handleKey} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleInput} />
      <UploadCloud />
      <div><b>{processing ? "Optimizing images..." : "Drop product images here"}</b><span>or click to browse / JPG, PNG, WEBP / up to 6</span></div>
      <strong>{images.length} / {MAX_IMAGES}</strong>
    </div>
    {error && <p className="image-upload-error">{error}</p>}
    {images.length ? <div className="uploaded-image-grid">{images.map((image, index) => <article className={index === 0 ? "primary-image" : ""} key={image.slice(0, 40) + "-" + index}>
      <img src={image} alt={"Product upload " + (index + 1)} />
      <span>{index === 0 ? <><Star /> Primary</> : "Image 0" + (index + 1)}</span>
      <div><button disabled={index === 0} onClick={() => makePrimary(index)}><Star /> {index === 0 ? "Primary image" : "Set primary"}</button><button className="danger" aria-label={"Remove image " + (index + 1)} onClick={() => remove(index)}><Trash2 /></button></div>
    </article>)}</div> : <div className="image-manager-empty"><ImagePlus /><span>Add at least one product image.</span></div>}
  </div>;
}
