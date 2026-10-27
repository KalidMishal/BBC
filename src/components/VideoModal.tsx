'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { Article } from '../types';

interface VideoModalProps {
  video: Article | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && video) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, video]);

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 w-full max-w-4xl rounded-sm overflow-hidden shadow-2xl border border-neutral-800 flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-neutral-950 px-4 py-3 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              BBC Video Player • {video.category || 'News'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded transition cursor-pointer"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Screen Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {video.imageUrl ? (
            <Image
              src={video.imageUrl}
              alt={video.title}
              fill
              className="object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full bg-neutral-950" />
          )}

          {/* Playing Simulation Animation */}
          {isPlaying && (
            <div className="absolute top-4 right-4 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>PLAYING</span>
            </div>
          )}

          {/* Big Center Play/Pause button overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer z-10 backdrop-blur-xs"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-white text-white" />
            ) : (
              <Play className="w-8 h-8 fill-white text-white ml-1" />
            )}
          </button>

          {/* Bottom Player Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 z-10">
            {/* Progress Bar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setProgress(Math.round(pos * 100));
              }}
              className="w-full h-1.5 bg-neutral-700/80 hover:h-2.5 transition-all rounded-full cursor-pointer relative mb-3"
            >
              <div
                className="h-full bg-red-600 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 -translate-y-1/2 shadow" />
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-red-500 transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={() => setProgress(0)}
                  className="hover:text-red-500 transition cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-red-500 transition cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-neutral-400 font-mono text-[11px]">
                  0{Math.floor(progress / 20)}:{String((progress * 3) % 60).padStart(2, '0')} / {video.videoDuration || '05:00'}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  HD 1080p
                </span>
                <button className="hover:text-red-500 transition cursor-pointer">
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info Below Player */}
        <div className="p-6 bg-neutral-900 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
              {video.tag || video.category || 'BBC News'}
            </span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs text-neutral-400">{video.time}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold leading-snug">
            {video.title}
          </h2>
          {video.summary && (
            <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
              {video.summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
