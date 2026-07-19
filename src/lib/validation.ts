export function normalizeCpf(value?: string | null): string {
  return (value || "").replace(/\D/g, "");
}

export function isValidCpf(value?: string | null): boolean {
  const cpf = normalizeCpf(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const digit = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(cpf[index]) * (length + 1 - index);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

export function isValidBirthDate(value?: string | null): boolean {
  if (!value) return false;
  const birth = new Date(`${value}T12:00:00`);
  const today = new Date();
  return !Number.isNaN(birth.getTime()) && birth <= today && birth.getFullYear() >= 1900;
}
