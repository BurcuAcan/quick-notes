'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Button from '../atoms/Button';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 py-2 px-4"
    >
      Toggle to {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </Button>
  );
};

export default ThemeToggle;
