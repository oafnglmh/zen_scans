export interface PromptDefinition {
  version: string;
  name: string;
  description: string;
  extractionPrompt: string;
  verificationPrompt: string;
}

export const PROMPTS_REGISTRY: Record<string, PromptDefinition> = {
  'v2.0': {
    version: 'v2.0',
    name: 'v2.0 (Strict Zero-Hallucination & Dual Pass)',
    description: 'Production-grade prompt carrying all 15 Vietnamese certificate extraction & verification constraints.',
    extractionPrompt: `ROLE:
You are an expert Vietnamese document processing AI specializing in Vietnamese Graduation Certificates (Bằng Tốt Nghiệp / Quyết Định Tốt Nghiệp).

TASK:
Extract ALL student records from the attached PDF document or page images into STRICT, VALID JSON matching the specified format.

STRICT EXTRACTION RULES:
1. NO HALLUCINATION: Never invent any information. If a field cannot be confidently extracted from the document, return an empty string "". Never guess, estimate, or infer missing values.
2. PRESERVE ORDER: Keep every student in EXACTLY the same sequence as in the PDF. Never sort, reorder, merge, or split records.
3. EXTRACT EVERY STUDENT: Extract every single person listed. Never skip anyone.
4. PRESERVE ACCENTS: Preserve all Vietnamese accents/diacritics perfectly (e.g. Nguyễn Văn A, Phạm Thị B).
5. DATE NORMALIZATION: Normalize dates to "DD/MM/YYYY" format (e.g. 06.10.1985 -> 06/10/1985, 06-10-1985 -> 06/10/1985). If only a year exists, return only the year (e.g. "1985"). Never fabricate dates.
6. DECISION NUMBER: Extract ONLY the numeric value from the document decision number header. Example: "3999/QĐ-ĐHĐN" -> "3999".
7. DECISION DATE: Extract the decision date once from the document header and assign it to "decision_date" as well as copying to "quyet_dinh_tot_nghiep_ngay" for every student. Format as "DD/MM/YYYY".
8. GENDER (gioi_tinh): LOOK CAREFULLY AT THE PDF IMAGE for each student (look for column 'Giới tính', 'Nam/Nữ', or in text like 'Nam Kinh Việt Nam' -> Gender: 'Nam', 'Nữ Kinh Việt Nam' -> Gender: 'Nữ'). MANDATORY FIELD: Return ONLY "Nam" or "Nữ".
9. NATIONALITY (quoc_tich): ALWAYS return "Việt Nam" for every student record. Ignore ethnicity/race words like "Kinh".
10. IDENTITY NUMBER (CCCD): Extract ONLY numeric digits. Ignore handwritten names or signatures near the CCCD column.
11. NO OCR ENGINE HAS BEEN USED: You are reading the PDF pages visually and structurally. Ensure highest fidelity.
12. ISSUING ORGANIZATION (don_vi_cap_bang): Always default or extract as "Đại học Đà Nẵng".
13. PLACE OF ISSUANCE (noi_cap): Nơi cấp giấy CCCD/CMND thường là tỉnh/thành phố ở Việt Nam (bao gồm các tỉnh trước khi sáp nhập/thay đổi địa giới hành chính). Thường có tiền tố "CA" (viết tắt của "Công An") đứng trước tên Tỉnh (ví dụ: "CA Quảng Nam", "CA Đà Nẵng", "CA Hà Nội", "CA TPHCM", "CA Thừa Thiên Huế"...). LƯU Ý QUAN TRỌNG: Nơi cấp thường trùng hoặc tương ứng với Nơi sinh (noi_sinh). Nếu phần chữ nơi cấp bị viết tắt hoặc mờ, hãy tham khảo Nơi sinh (noi_sinh) để nhận diện chính xác tên Tỉnh/CA Tỉnh cấp.

REQUIRED JSON FORMAT (RETURN ONLY VALID RAW JSON, NO MARKDOWN, NO EXPLANATION, NO TRIPLE BACKTICKS):
{
  "decision_number": "",
  "decision_date": "",
  "students": [
    {
      "stt_trong_file_tong": 1,
      "stt": 1,
      "ho": "",
      "ten": "",
      "ngay_sinh": "",
      "noi_sinh": "",
      "xep_loai": "",
      "so_vao_so": "",
      "so_hieu_bang": "",
      "quyet_dinh_tot_nghiep_so": "",
      "quyet_dinh_tot_nghiep_ngay": "",
      "gioi_tinh": "",
      "quoc_tich": "",
      "lop": "",
      "dao_tao_tu_nam": "",
      "dao_tao_den_nam": "",
      "nganh_dao_tao": "",
      "ma_chuong_trinh_dao_tao": "",
      "don_vi_cap_bang": "",
      "ghi_chu": "",
      "cccd": "",
      "ngay_cap": "",
      "noi_cap": ""
    }
  ]
}`,
    verificationPrompt: `ROLE:
You are an AI Document Verification Specialist for Vietnamese Graduation Certificates.

TASK:
You are provided with:
1. The original PDF document slice / page images.
2. A candidate JSON extracted in Pass 1.

YOUR GOAL:
Audit and verify the candidate JSON against the original document slice.
- Check if any student was skipped or missed.
- Check for duplicated students or incorrect STT numbers.
- Verify date formats (must be DD/MM/YYYY or YYYY).
- Check decision_number (numeric only) and decision_date.
- Ensure gender is "Nam" or "Nữ" and nationality does NOT contain ethnicity (e.g. "Việt Nam").
- Verify place of issuance (noi_cap): ensure proper prefixing (e.g. "CA [Tỉnh]") and cross-reference with place of birth (noi_sinh) if abbreviated.
- Correct values ONLY when there is clear, explicit visual proof in the document.
- NEVER hallucinate or guess. If uncertain, leave as "".

CANDIDATE JSON TO VERIFY:
__CANDIDATE_JSON__

RETURN ONLY VALID VERIFIED RAW JSON (NO MARKDOWN CODEBLOCKS, NO PRETEXT, NO EXPLANATION):
{
  "decision_number": "",
  "decision_date": "",
  "students": [...]
}`
  },
  'v1.1': {
    version: 'v1.1',
    name: 'v1.1 (Standard Extraction)',
    description: 'Standard extraction prompt with strict date normalization and field mapping.',
    extractionPrompt: `Extract Vietnamese Graduation Certificate PDF to valid JSON schema with stt, ho, ten, ngay_sinh, noi_sinh, xep_loai, so_vao_so, so_hieu_bang, quyet_dinh_tot_nghiep_so, quyet_dinh_tot_nghiep_ngay, gioi_tinh, quoc_tich, cccd, ngay_cap, noi_cap. Return raw JSON without markdown formatting.`,
    verificationPrompt: `Verify JSON output against PDF document slice and return corrected JSON.`
  },
  'v1.0': {
    version: 'v1.0',
    name: 'v1.0 (Basic Direct Prompt)',
    description: 'Basic direct extraction prompt.',
    extractionPrompt: `Convert Vietnamese certificate document to JSON matching decision_number, decision_date, and students array.`,
    verificationPrompt: `Verify student records against PDF pages.`
  }
};
