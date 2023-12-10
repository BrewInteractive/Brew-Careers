export interface FormData {
  name: string;
  email: string;
  phone: string;
  cv: File | null;
  birthYear: string;
  city: string;
  coverLetter: string;
  jobTitle: string;
}

// Dosya uzantısını alma fonksiyonu
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}
