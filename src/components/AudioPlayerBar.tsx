'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, X, Volume2, VolumeX, Headphones, SkipForward, SkipBack } from 'lucide-react';
import { PodcastItem } from '../types';

interface AudioPlayerBarProps {
  podcast: PodcastItem | null;
  onClose: () => void;
}

export default function AudioPlayerBar({ podcast, onClose }: AudioPlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && podcast) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, podcast]);

  if (!podcast) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#181818] text-white border-t border-neutral-700 shadow-2xl px-4 py-3">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Podcast Info */}
        <div className="flex items-center space-x-3 w-full md:w-1/3">
          <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-neutral-800">
            <Image
              src={podcast.imageUrl}
              alt={podcast.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 pr-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-1.5 py-0.2 rounded">
                BBC Sounds
              </span>
              {podcast.badge && (
                <span className="text-[10px] text-neutral-400">{podcast.badge}</span>
              )}
            </div>
            <h4 className="font-bold text-sm text-white truncate">{podcast.title}</h4>
            <p className="text-xs text-neutral-400 truncate">{podcast.subtitle}</p>
          </div>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className="flex flex-col items-center w-full md:w-1/2 space-y-1">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setProgress((p) => Math.max(0, p - 10))}
              className="text-neutral-400 hover:text-white transition cursor-pointer"
              title="Skip back 15s"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center transition shadow cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <button
              onClick={() => setProgress((p) => Math.min(100, p + 10))}
              className="text-neutral-400 hover:text-white transition cursor-pointer"
              title="Skip forward 15s"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Slider */}
          <div className="w-full flex items-center space-x-2 text-[10px] text-neutral-400 font-mono">
            <span>0{Math.floor(progress / 10)}:{String((progress * 4) % 60).padStart(2, '0')}</span>
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setProgress(Math.round(pos * 100));
              }}
              className="w-full h-1 bg-neutral-700 hover:h-2 transition-all rounded-full cursor-pointer relative"
            >
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>28:40</span>
          </div>
        </div>

        {/* Right: Sound & Close */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-neutral-400 hover:text-white transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition p-1 cursor-pointer"
            title="Close audio player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
