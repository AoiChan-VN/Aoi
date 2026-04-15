// =======================
// ThemeToggle.tsx
// =======================
import { useEffect, useState } from 'react';
export default function ThemeToggle(){
  const [theme,setTheme]=useState('dark');
  useEffect(()=>{
    const t=localStorage.getItem('theme');
    if(t) setTheme(t);
  },[]);
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme',theme);
    localStorage.setItem('theme',theme);
  },[theme]);
  return <button onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme}</button>;
}
