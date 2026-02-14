
"use client";

import Link from 'next/link';
import { Network } from 'lucide-react';

export default function CareerPathButton() {
    return (
        <Link href="/career-path" className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
            <button className="relative flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg leading-none">
                <Network size={18} className="text-cyan-400 group-hover:animate-pulse" />
                <span className="font-semibold text-sm">Career Path</span>
            </button>
        </Link>
    );
}
