export interface FormData {
  name: string;
  email: string;
  phone: string;
  cv: File | null;
  birthYear: string;
  city: string;
  coverLetter: string;
  acceptDataTransferAbroad: boolean;
  acceptDataSharing: boolean;
  undertakeInformingPermits: boolean;
  jobTitle: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  cv?: string;
  birthYear?: string;
  city?: string;
  coverLetter?: string;
  acceptDataTransferAbroad?: string;
  acceptDataSharing?: string;
  undertakeInformingPermits?: string;
}

// Dosya uzantısını alma fonksiyonu
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function validateForm(formData: FormData): Errors {
  const errors: Errors = {};

  // name kontrolü
  if (!formData.name || formData.name.trim() === "") {
    errors.name = "Adınızı giriniz";
  }

  // email kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = "Geçerli bir e-posta adresi giriniz";
  }

  // phone kontrolü
  const phoneRegex = /^(0)?5[0-9]{9}$/;
  if (!formData.phone || !phoneRegex.test(formData.phone)) {
    errors.phone = "Geçerli bir telefon numarası giriniz";
  }

  // Dosya boyutu kontrolü (maksimum 10 MB)
  const maxFileSize = 10 * 1024 * 1024; // 10 MB

  // file kontrolü (desteklenen dosya türleri)
  const supportedFileTypes = [
    "doc",
    "docx",
    "pdf",
    "odt",
    "rtf",
    "jpeg",
    "png",
  ];

  if (
    !formData.cv ||
    !supportedFileTypes.includes(getFileExtension(formData.cv.name)) ||
    formData.cv.size > maxFileSize
  ) {
    errors.cv =
      "Desteklenen dosya türleri: DOC, DOCX, PDF, ODT, RTF, JPEG, PNG ve dosya boyutu maksimum 10 MB olmalıdır.";
  }

  // birthYear kontrolü
  if (!formData.birthYear || isNaN(parseInt(formData.birthYear))) {
    errors.birthYear = "Geçerli bir doğum yılı giriniz";
  }

  // city kontrolü
  if (!formData.city || formData.city.trim() === "") {
    errors.city = "Şehir bilgisini giriniz";
  }

  if (!formData.acceptDataTransferAbroad) {
    errors.acceptDataTransferAbroad =
      "Veri transferini yurtdışına kabul etmelisiniz";
  }

  // acceptDataSharing kontrolü
  if (!formData.acceptDataSharing) {
    errors.acceptDataSharing = "Veri paylaşımını kabul etmelisiniz";
  }

  // undertakeInformingPermits kontrolü
  if (!formData.undertakeInformingPermits) {
    errors.undertakeInformingPermits =
      "İzinleri bildirme taahhüdünü kabul etmelisiniz";
  }

  return errors;
}

export default validateForm;
