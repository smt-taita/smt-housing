import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  goal: number;
  className?: string;
}

export default function ProgressBar({ current, goal, className }: ProgressBarProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className={cn("bg-white bg-opacity-30 rounded-full h-4", className)}>
      <div 
        className="bg-gradient-to-r from-church-amber to-yellow-400 h-4 rounded-full progress-bar-fill" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
