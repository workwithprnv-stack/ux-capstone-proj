import crypto from 'crypto';

/**
 * Generate Gravatar URL for author photo
 * @param email Author's email address
 * @param size Image size in pixels (default: 40)
 * @param fallback Fallback type when no Gravatar exists
 * @returns Gravatar URL
 */
export function getGravatarUrl(
  email?: string,
  size: number = 40,
  fallback: 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'blank' = 'identicon'
): string {
  if (!email) {
    return `https://www.gravatar.com/avatar/?d=${fallback}&s=${size}`;
  }

  // Normalize email (trim and lowercase)
  const normalizedEmail = email.trim().toLowerCase();
  
  // Generate MD5 hash
  const hash = crypto.createHash('md5').update(normalizedEmail).digest('hex');
  
  return `https://www.gravatar.com/avatar/${hash}?d=${fallback}&s=${size}`;
}

/**
 * Generate fallback avatar URL using UI Avatars service
 * @param name Author's name for initials
 * @param size Image size in pixels
 * @returns Avatar URL
 */
export function getFallbackAvatarUrl(name: string, size: number = 40): string {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=random&color=fff`;
}
