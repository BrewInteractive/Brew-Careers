export interface FormData {
  name: string;
  email: string;
  phone: string;
  cv: File | null;
  birthYear: string;
  city: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  cv?: string;
  birthYear?: string;
  city?: string;
}

// Dosya uzantısını alma fonksiyonu
function getFileExtension(filename: string): string {
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

  // Dosya boyutu kontrolü (maksimum 50 MB)
  const maxFileSize = 50 * 1024 * 1024; // 50 MB

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
      "Desteklenen dosya türleri: DOC, DOCX, PDF, ODT, RTF, JPEG, PNG ve dosya boyutu maksimum 50 MB olmalıdır.";
  }

  // birthYear kontrolü
  if (!formData.birthYear || isNaN(parseInt(formData.birthYear))) {
    errors.birthYear = "Geçerli bir doğum yılı giriniz";
  }

  // city kontrolü
  if (!formData.city || formData.city.trim() === "") {
    errors.city = "Şehir bilgisini giriniz";
  }

  return errors;
}

export default validateForm;
