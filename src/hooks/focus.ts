import { useEffect, useState } from 'react';

function hasFocus(): boolean {
  return typeof document !== 'undefined' && document.hasFocus();
}

export function useWindowFocus(): boolean {
  const [focus, setFocus] = useState(hasFocus);
  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  useEffect(() => {
    setFocus(hasFocus());
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return focus;
}
