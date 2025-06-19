import React, { useRef, useState, useEffect } from 'react';
import '../../../styles/components/feature/solarDatePicker.css';

interface SolarDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
}

const SolarDatePicker: React.FC<SolarDatePickerProps> = ({ value, onChange, onClose }) => {  const [selectedDate, setSelectedDate] = useState(() => value ? new Date(value) : new Date());
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringEarth, setIsHoveringEarth] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastAngleRef = useRef(0);
  const totalRotationsRef = useRef(0);
  const startDateRef = useRef(selectedDate);
  const yearRef = useRef(selectedDate.getFullYear());
  const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

  const canvasWidth = 400;
  const canvasHeight = 300;
  const a = 150;
  const b = 100;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const earthRadius = 10;  useEffect(() => {
    const year = selectedDate.getFullYear();
    const start = new Date(year, 0, 0);
    const diff = selectedDate.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const daysInCurrentYear = isLeapYear(year) ? 366 : 365;
    const angleForDate = ((dayOfYear - 1) / daysInCurrentYear) * 2 * Math.PI;
    setAngle(angleForDate);
  }, [selectedDate]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, a, b, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    const x = centerX + a * Math.cos(angle);
    const y = centerY + b * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, earthRadius, 0, 2 * Math.PI);
    ctx.fillStyle = isHoveringEarth || isDragging ? '#4FC3F7' : '#2196f3';
    ctx.shadowColor = '#2196f3';
    ctx.shadowBlur = isHoveringEarth || isDragging ? 15 : 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (isHoveringEarth && !isDragging) {
      ctx.beginPath();
      ctx.arc(x, y, earthRadius + 5, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [angle, selectedDate, isHoveringEarth, isDragging]);
  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const isPointerNearEarth = (pointerX: number, pointerY: number) => {
    const earthX = centerX + a * Math.cos(angle);
    const earthY = centerY + b * Math.sin(angle);
    const distance = Math.sqrt((pointerX - earthX) ** 2 + (pointerY - earthY) ** 2);
    return distance <= earthRadius + 10;
  };  const handlePointerHover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) return;
    
    const { x, y } = getPointerPos(e);
    const nearEarth = isPointerNearEarth(x, y);
    
    if (nearEarth !== isHoveringEarth) {
      setIsHoveringEarth(nearEarth);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = nearEarth ? 'grab' : 'default';
      }
    }
  };  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getPointerPos(e);
    if (!isPointerNearEarth(x, y)) {
      return;
    }
    setIsDragging(true);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'grabbing';
    }
    lastAngleRef.current = angle;
    startDateRef.current = new Date(selectedDate);
    yearRef.current = selectedDate.getFullYear();
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const { x, y } = getPointerPos(e);
    const dx = x - centerX;
    const dy = y - centerY;
    let newAngle = Math.atan2(dy * a / b, dx);
    if (newAngle < 0) newAngle += 2 * Math.PI;
    let prevAngle = lastAngleRef.current;
    let prevMonth = Math.floor((prevAngle / (2 * Math.PI)) * 12);
    let newMonth = Math.floor((newAngle / (2 * Math.PI)) * 12);
    if (prevMonth === 11 && newMonth === 0) {
      yearRef.current += 1;
    } else if (prevMonth === 0 && newMonth === 11) {
      yearRef.current -= 1;
    }
    setAngle(newAngle);
    const daysInTargetYear = isLeapYear(yearRef.current) ? 366 : 365;
    const dayOfYear = Math.floor((newAngle / (2 * Math.PI)) * daysInTargetYear) + 1;
    const newDate = new Date(yearRef.current, 0, dayOfYear);
    setSelectedDate(newDate);
    onChange(newDate.toISOString().slice(0, 10));
    lastAngleRef.current = newAngle;
  };
  const handlePointerUp = () => {
    setIsDragging(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = isHoveringEarth ? 'grab' : 'default';
    }
  };

  return (
    <div className="solar-datepicker-modal-overlay">
      <div className="solar-datepicker-popup">
        <button className="solar-datepicker-close" onClick={onClose}>×</button>
        <div className="solar-datepicker-header">Solar System Datepicker</div>
        <div className="solar-datepicker-date">{selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div className="solar-datepicker-desc">Drag the Earth around the Sun to select a date! One cycle advances the year.</div>
        <div className="solar-datepicker-canvas-container">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="solar-datepicker-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={isDragging ? handlePointerMove : handlePointerHover}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        </div>
      </div>
    </div>
  );
};

export default SolarDatePicker;
