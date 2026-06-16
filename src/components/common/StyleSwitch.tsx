import type { ThemeName } from '@shared/index';

interface StyleSwitchProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export function StyleSwitch({ currentTheme, onThemeChange }: StyleSwitchProps) {
  const isMinimal = currentTheme === 'minimal';

  return (
    <div 
      className="flex items-center gap-1 p-1 rounded-full"
      style={{
        background: isMinimal ? '#f1f3f5' : 'rgba(212,175,55,0.15)',
        border: `1px solid ${isMinimal ? '#e9ecef' : 'rgba(212,175,55,0.3)'}`
      }}
    >
      <button
        onClick={() => onThemeChange('minimal')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          isMinimal ? 'shadow-md' : ''
        }`}
        style={{
          background: isMinimal ? '#1e3a5f' : 'transparent',
          color: isMinimal ? '#ffffff' : '#c9b896'
        }}
      >
        极简商务
      </button>
      <button
        onClick={() => onThemeChange('luxury')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          !isMinimal ? 'shadow-lg' : ''
        }`}
        style={{
          background: !isMinimal 
            ? 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)' 
            : 'transparent',
          color: !isMinimal ? '#1a0a0a' : '#6c757d'
        }}
      >
        高端奢华
      </button>
    </div>
  );
}
