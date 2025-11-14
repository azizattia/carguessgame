import { getAvatarById, RARITY_COLORS } from '../data/avatars';

const Avatar = ({ avatarId, size = 'md', className = '' }) => {
  const avatar = getAvatarById(avatarId);
  const colors = RARITY_COLORS[avatar.rarity];

  const sizeClasses = {
    sm: 'text-2xl w-10 h-10',
    md: 'text-4xl w-16 h-16',
    lg: 'text-6xl w-24 h-24',
    xl: 'text-8xl w-32 h-32'
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center
                  glass-effect border-2 ${colors.border} ${colors.glow} ${className}`}
      title={avatar.name}
    >
      {avatar.emoji}
    </div>
  );
};

export default Avatar;
