"use client";
import { formatTime } from '@/lib/utils';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, FastForward } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

export default function MediaPlayer({ 
  duration, 
  currentTime, 
  onTimeUpdate 
}: { 
  duration: number; 
  currentTime: number; 
  onTimeUpdate: (time: number) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;

  // Playback timer simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        const next = currentTimeRef.current + 0.25 * playbackSpeed;
        if (next >= duration) {
          setIsPlaying(false);
          onTimeUpdate(0);
        } else {
          onTimeUpdate(next);
        }
      }, 250);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, duration, onTimeUpdate]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipTime = (delta: number) => {
    const next = Math.max(0, Math.min(duration, currentTime + delta));
    onTimeUpdate(next);
  };

  const cycleSpeed = () => {
    const nextIndex = (SPEED_OPTIONS.indexOf(playbackSpeed) + 1) % SPEED_OPTIONS.length;
    setPlaybackSpeed(SPEED_OPTIONS[nextIndex]);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Generate 48 deterministic visualizer bars
  const waveformBars = Array.from({ length: 48 }, (_, i) => {
    const heightFactor = 25 + Math.sin(i * 0.4) * 20 + Math.cos(i * 0.8) * 25 + (i % 5) * 6;
    return Math.max(15, Math.min(95, heightFactor));
  });

  return (
    <div className="bg-gray-900/95 dark:bg-gray-900 border border-gray-800 text-white p-4 rounded-xl shadow-xl backdrop-blur-md sticky top-0 z-20 mb-4 transition-all">
      {/* Waveform Visualization */}
      <div 
        className="h-10 flex items-end justify-between gap-1 mb-3 cursor-pointer group px-1 relative"
        onMouseMove={(e) => {
          const bounds = e.currentTarget.getBoundingClientRect();
          const p = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
          setHoverTime(p * duration);
          setHoverPosition(e.clientX - bounds.left);
        }}
        onMouseLeave={() => setHoverTime(null)}
        onClick={(e) => {
          const bounds = e.currentTarget.getBoundingClientRect();
          const p = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
          onTimeUpdate(p * duration);
        }}
      >
        {waveformBars.map((height, i) => {
          const barProgress = (i / waveformBars.length) * 100;
          const isPassed = barProgress <= progressPercent;
          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-150 ${
                isPassed 
                  ? 'bg-primary-500 group-hover:bg-primary-400' 
                  : 'bg-gray-700/80 group-hover:bg-gray-600'
              } ${isPlaying && isPassed ? 'animate-pulse' : ''}`}
              style={{ 
                height: `${height}%`,
                minWidth: '2px'
              }}
            />
          );
        })}

        {/* Hover timestamp tooltip */}
        {hoverTime !== null && (
          <div 
            className="absolute -top-7 transform -translate-x-1/2 bg-gray-800 text-xs px-2 py-0.5 rounded shadow pointer-events-none text-gray-200 border border-gray-700"
            style={{ left: hoverPosition }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {/* Scrubber track */}
      <div 
        className="relative group cursor-pointer h-2 bg-gray-700/80 rounded-full mb-3"
        onClick={(e) => {
          const bounds = e.currentTarget.getBoundingClientRect();
          const p = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
          onTimeUpdate(p * duration);
        }}
      >
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-600 to-indigo-500 rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"
          style={{ left: `calc(${progressPercent}% - 7px)` }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-500 active:scale-95 flex items-center justify-center shrink-0 transition-all shadow-md shadow-primary-600/30"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button 
            onClick={() => skipTime(-5)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Rewind 5 seconds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button 
            onClick={() => skipTime(5)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Fast forward 5 seconds"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="text-xs font-mono text-gray-300 tabular-nums ml-1">
            <span className="text-white font-medium">{formatTime(currentTime)}</span>
            <span className="text-gray-500 mx-1">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md transition-colors tabular-nums border border-gray-700"
            title="Change playback speed"
          >
            {playbackSpeed}x
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
