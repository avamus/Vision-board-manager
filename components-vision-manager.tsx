"use client"

import React, { useState, useEffect, useRef } from 'react';
import { format, parse, addMonths, subMonths, addDays, getDay, startOfMonth, endOfMonth, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Input } from "@/components/ui/input";

// EditableTextManager Component
interface EditableTextManagerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function EditableTextManager({ value, onChange, className }: EditableTextManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
  }

  const handleBlur = () => {
    setIsEditing(false);
    onChange(tempValue);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onChange(tempValue);
    }
  }

  if (isEditing) {
    return (
      <Input
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        autoFocus
      />
    )
  }

  return (
    <div 
      className={className}
      onDoubleClick={handleDoubleClick}
    >
      {value || "Click to add your vision statement..."}
    </div>
  )
}

// EditableTextWithIcon Component
interface EditableTextWithIconProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  isBold?: boolean;
  isTitle?: boolean;
  placeholder?: string;
}

export function EditableTextWithIcon({
  value,
  onChange,
  className = "",
  textClassName = "",
  iconClassName = "",
  isBold = false,
  isTitle = false,
  placeholder = "Click to edit..."
}: EditableTextWithIconProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  // Focus input when editing begins
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setIsEditing(false);
      onChange(tempValue);
    }
    if (e.key === "Escape") {
      setTempValue(value);
      setIsEditing(false);
    }
  };
  
  // Upravené velikosti podle nové specifikace
  const titleClass = isTitle 
    ? "text-[21px] font-bold" 
    : isBold 
      ? "text-[19px] font-black" 
      : "text-[15px] font-semibold";
  
  const displayClass = `group relative ${className} ${titleClass}`;
  
  return (
    <div className={displayClass}>
      {isEditing ? (
        isTitle || !value.includes("\n") ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`w-full px-2 py-1 border border-purple-300 rounded-md ${textClassName}`}
            autoFocus
          />
        ) : (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`w-full px-2 py-1 border border-purple-300 rounded-md ${textClassName}`}
            rows={2}
            autoFocus
          />
        )
      ) : (
        <>
          <div className={`${textClassName}`}>
            {value || placeholder}
          </div>
          <button
            onClick={handleStartEdit}
            className={`absolute top-0 right-0 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full p-1 transition-opacity ${iconClassName}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// ImprovedDatePicker Component
interface ImprovedDatePickerProps {
  value: string; // format YYYY-MM-DD
  onChange: (date: string) => void;
  onClose: () => void;
}

export function ImprovedDatePicker({ value, onChange, onClose }: ImprovedDatePickerProps) {
  const [currentDate, setCurrentDate] = useState<Date>(value ? new Date(value) : new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  
  // Generate day names
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);
    const daysArray = [];
    
    // Add empty cells for days before the first day of the month
    const startDay = getDay(startDate);
    for (let i = 0; i < startDay; i++) {
      daysArray.push(null);
    }
    
    // Add days of the month
    let currentDay = startDate;
    while (currentDay <= endDate) {
      daysArray.push(new Date(currentDay));
      currentDay = addDays(currentDay, 1);
    }
    
    return daysArray;
  };
  
  const days_in_month = getDaysInMonth(currentDate);
  
  // Navigate through months
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onChange(format(date, 'yyyy-MM-dd'));
    onClose();
  };
  
  // Set today's date
  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    onChange(format(today, 'yyyy-MM-dd'));
    onClose();
  };
  
  // Clear selection
  const handleClearClick = () => {
    setSelectedDate(null);
    onChange('');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <div 
        className="relative p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-72 max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={prevMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <h2 className="text-[15px] font-semibold text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button 
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">
              {day.charAt(0)}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days_in_month.map((day, i) => (
            <div key={i} className="aspect-square flex items-center justify-center">
              {day ? (
                <button
                  type="button"
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm
                    ${isToday(day) ? 'border border-[#5b06be]' : ''}
                    ${selectedDate && isSameDay(day, selectedDate) 
                      ? 'bg-[#5b06be] text-white' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  {format(day, 'd')}
                </button>
              ) : (
                <span className="w-7 h-7"></span>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
            onClick={handleClearClick}
          >
            Clear
          </button>
          
          <button
            type="button"
            className="text-xs text-[#5b06be] font-medium hover:bg-[#5b06be]/10 px-2 py-1 rounded"
            onClick={handleTodayClick}
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
}
