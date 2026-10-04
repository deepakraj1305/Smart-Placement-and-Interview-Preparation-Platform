import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  stream: MediaStream | null;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording, stream }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (!isRecording || !stream) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      // Draw idle flatline
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#f4f4f5';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#d4d4d8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, canvas.height / 2);
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        }
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const renderFrame = () => {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barCount = 28;
        const barWidth = (canvas.width / barCount) - 2;
        let x = 1;

        for (let i = 0; i < barCount; i++) {
          const sampleIndex = Math.floor((i / barCount) * bufferLength);
          const value = dataArray[sampleIndex] || 0;
          const percent = value / 255;
          const barHeight = Math.max(3, percent * (canvas.height - 8));

          // Professional gradient: charcoal to deep cobalt
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
          gradient.addColorStop(0, '#18181b');
          gradient.addColorStop(1, '#2563eb');

          ctx.fillStyle = gradient;
          const y = (canvas.height - barHeight) / 2;
          ctx.fillRect(x, y, barWidth, barHeight);

          x += barWidth + 2;
        }
      };

      renderFrame();
    } catch (err) {
      console.warn('Audio visualization unavailable:', err);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isRecording, stream]);

  return (
    <div className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-md p-2">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#71717a] mb-1 px-1">
        <span>Mic Stream Frequency</span>
        <span className={isRecording ? 'text-emerald-600 font-semibold' : 'text-[#a1a1aa]'}>
          {isRecording ? 'Active' : 'Standby'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={340}
        height={42}
        className="w-full h-10 rounded block"
      />
    </div>
  );
};
