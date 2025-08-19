"use client";
import React, { useEffect, useState } from 'react';

const ThemeToggleButton: React.FC<{ className?: string }> = ({ className }) => {
	const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const saved = typeof window !== 'undefined' ? localStorage.getItem('theme-mode') : null;
		let mode: 'light' | 'dark';
		if (saved === 'light' || saved === 'dark') {
			mode = saved;
			setTheme(saved);
		} else {
			mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			setTheme('system');
		}
		document.documentElement.classList.remove('dark', 'light');
		document.documentElement.classList.add(mode);
	}, []);

	const handleToggle = () => {
		const next = theme === 'light' ? 'dark' : 'light';
		setTheme(next);
		localStorage.setItem('theme-mode', next);
		document.documentElement.classList.remove('dark', 'light');
		document.documentElement.classList.add(next);
	};

	if (!mounted) return null;

	const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

		return (
			<button
				aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				onClick={handleToggle}
				className={
					`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground transition-colors ${className ?? ''}`
				}
				style={{ fontWeight: 600 }}
			>
				{isDark ? <span className="text-xl">🌞</span> : <span className="text-xl">🌚</span>}
				<span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'} Mode</span>
			</button>
		);
};

export default ThemeToggleButton;
