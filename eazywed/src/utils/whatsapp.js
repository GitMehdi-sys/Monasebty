// Normalize Moroccan mobile numbers for WhatsApp. Never fabricate a recipient.
export const generateWhatsAppLink = (phone, message = "") => {
  let digits = String(phone || "").replace(/\D/g, "");
  if (/^0[67][0-9]{8}$/.test(digits)) digits = `212${digits.slice(1)}`;
  if (/^[67][0-9]{8}$/.test(digits)) digits = `212${digits}`;
  if (!/^212[67][0-9]{8}$/.test(digits))
    throw new Error("A valid Moroccan vendor phone number is required.");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};
export default { generateWhatsAppLink };
