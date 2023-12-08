import { z } from "zod";

// Dosya boyutu kontrolü (maksimum 10 MB)
const maxFileSize = 10 * 1024 * 1024; // 10 MB

// file kontrolü (desteklenen dosya türleri)
const supportedFileTypes = [
  "doc",
  "docx",
  "pdf",
  "odt",
  "jpeg",
  "jpg",
  "rtf",
  "png",
];

// Doğum yılı formatını kontrol etmek için bir regex
const yearRegex = /^\d{4}$/;

const validationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
  phone: z.string().refine((value) => /^\+\d{1,}$/g.test(value), {
    message:
      "Please enter a valid phone number in international format (e.g., +909999999999)",
  }),
  cv: z
    .any()
    .refine(
      (files) => {
        console.log("file1", files);
        return files?.[0].name !== "";
      },
      {
        message: "cv is required.",
      }
    )
    .refine(
      (files) => {
        console.log("file2", files);
        return files?.[0]?.size <= maxFileSize;
      },
      {
        message: "Max file size is 10MB.",
      }
    )
    .refine(
      (files) => {
        console.log("file3", files?.[0]?.type);
        console.log("supportedFileTypes", supportedFileTypes);
        return (
          supportedFileTypes.some(
            (fileType) => files?.[0]?.type.includes(fileType)
          ) === true
        );
      },
      {
        message: `${supportedFileTypes.join(", ")} files are accepted`,
      }
    ),
  birthYear: z.string().refine((value) => yearRegex.test(value), {
    message: "Please use a valid birth year format (YYYY)",
  }),
  city: z.string().min(1, { message: "City is required" }),
  acceptDataTransferAbroad: z.any().refine(
    (checked) => {
      return checked;
    },
    {
      message: "You must accept Condition",
    }
  ),
  acceptDataSharing: z.any().refine(
    (checked) => {
      return checked;
    },
    {
      message: "You must accept Condition",
    }
  ),
  undertakeInformingPermits: z.any().refine(
    (checked) => {
      return checked;
    },
    {
      message: "You must accept Condition",
    }
  ),
});

export type ValidationSchema = z.infer<typeof validationSchema>;

export default validationSchema;
