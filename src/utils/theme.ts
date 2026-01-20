export type Theme = 'light' | 'dark';

export const themeClasses = {
  // Background colors
  bg: {
    primary: (theme: Theme) => theme === 'light' ? 'bg-gray-50' : 'bg-neutral-950',
    secondary: (theme: Theme) => theme === 'light' ? 'bg-white' : 'bg-neutral-900/40',
    tertiary: (theme: Theme) => theme === 'light' ? 'bg-gray-100' : 'bg-neutral-800',
    card: (theme: Theme) => theme === 'light' ? 'bg-white' : 'bg-neutral-900/40',
    hover: (theme: Theme) => theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-neutral-800',
  },
  
  // Text colors
  text: {
    primary: (theme: Theme) => theme === 'light' ? 'text-gray-900' : 'text-neutral-100',
    secondary: (theme: Theme) => theme === 'light' ? 'text-gray-600' : 'text-neutral-400',
    tertiary: (theme: Theme) => theme === 'light' ? 'text-gray-500' : 'text-neutral-500',
  },
  
  // Border colors
  border: {
    primary: (theme: Theme) => theme === 'light' ? 'border-gray-200' : 'border-neutral-800',
    secondary: (theme: Theme) => theme === 'light' ? 'border-gray-300' : 'border-neutral-700',
  },
  
  // Input/Form colors
  input: {
    bg: (theme: Theme) => theme === 'light' ? 'bg-white' : 'bg-neutral-950',
    border: (theme: Theme) => theme === 'light' ? 'border-gray-300' : 'border-neutral-800',
    text: (theme: Theme) => theme === 'light' ? 'text-gray-900' : 'text-neutral-100',
    placeholder: (theme: Theme) => theme === 'light' ? 'placeholder-gray-400' : 'placeholder-neutral-600',
  },
};

export const getThemeClass = (category: keyof typeof themeClasses, variant: string, theme: Theme): string => {
  const categoryObj = themeClasses[category] as any;
  if (categoryObj && categoryObj[variant]) {
    return categoryObj[variant](theme);
  }
  return '';
};
