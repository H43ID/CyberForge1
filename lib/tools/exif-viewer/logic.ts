import exifr from "exifr";

export type ExifSummary = {
  hasData: boolean;
  camera: { make?: string; model?: string; lens?: string } | null;
  settings: { fNumber?: number; exposureTime?: number; iso?: number; focalLength?: number } | null;
  image: { width?: number; height?: number; orientation?: number } | null;
  timestamps: { dateTimeOriginal?: string; createDate?: string } | null;
  gps: { latitude?: number; longitude?: number } | null;
  raw: Record<string, unknown>;
};

export async function parseExif(file: File): Promise<ExifSummary> {
  const raw = (await exifr.parse(file, { gps: true, tiff: true, exif: true })) as
    | Record<string, unknown>
    | undefined;

  if (!raw) {
    return { hasData: false, camera: null, settings: null, image: null, timestamps: null, gps: null, raw: {} };
  }

  const get = (key: string) => raw[key] as string | number | undefined;

  return {
    hasData: true,
    camera: {
      make: get("Make") as string | undefined,
      model: get("Model") as string | undefined,
      lens: (get("LensModel") ?? get("LensMake")) as string | undefined,
    },
    settings: {
      fNumber: get("FNumber") as number | undefined,
      exposureTime: get("ExposureTime") as number | undefined,
      iso: get("ISO") as number | undefined,
      focalLength: get("FocalLength") as number | undefined,
    },
    image: {
      width: (get("ExifImageWidth") ?? get("ImageWidth")) as number | undefined,
      height: (get("ExifImageHeight") ?? get("ImageHeight")) as number | undefined,
      orientation: get("Orientation") as number | undefined,
    },
    timestamps: {
      dateTimeOriginal: raw.DateTimeOriginal ? String(raw.DateTimeOriginal) : undefined,
      createDate: raw.CreateDate ? String(raw.CreateDate) : undefined,
    },
    gps:
      typeof raw.latitude === "number" && typeof raw.longitude === "number"
        ? { latitude: raw.latitude as number, longitude: raw.longitude as number }
        : null,
    raw,
  };
}
