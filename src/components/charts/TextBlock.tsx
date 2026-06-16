import { useState } from 'react';
import type { CanvasComponent, ThemeConfig } from '@shared/index';

interface TextBlockProps {
  component: CanvasComponent;
  theme: ThemeConfig;
}

export function TextBlock({ component, theme }: TextBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(component.config.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full h-full bg-transparent border-none outline-none"
        style={{
          color: theme.colors.text,
          fontFamily: component.config.fontFamily,
          fontSize: component.config.fontSize,
          fontWeight: 600
        }}
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="w-full h-full flex items-center justify-center cursor-text select-none"
      style={{
        color: theme.colors.text,
        fontFamily: component.config.fontFamily,
        fontSize: component.config.fontSize,
        fontWeight: 600
      }}
    >
      {text}
    </div>
  );
}
