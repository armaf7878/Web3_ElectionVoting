export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(dateString: string, locale: string = 'vi'): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatTimeRemaining(
endDateString: string,
locale: string = 'vi')
: string {
  const end = new Date(endDateString).getTime();
  const now = new Date().getTime();
  const distance = end - now;

  if (distance < 0) return locale === 'vi' ? 'Đã kết thúc' : 'Ended';

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));

  if (locale === 'vi') {
    if (days > 0) return `còn ${days}n ${hours}g`;
    if (hours > 0) return `còn ${hours}g ${minutes}p`;
    return `còn ${minutes}p`;
  }

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export function generateOrgCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function calculatePercentage(votes: number, total: number): number {
  if (total === 0) return 0;
  return Math.round(votes / total * 100);
}

export function classNames(
...classes: (string | undefined | null | false)[])
: string {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(num: number, locale: string = 'vi'): string {
  return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US').format(num);
}

export function formatCurrency(amount: number, locale: string = 'vi'): string {
  return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency: locale === 'vi' ? 'VND' : 'USD'
  }).format(amount);
}