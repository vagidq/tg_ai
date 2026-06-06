import mascotIdle from '../assets/mascot/gojo-idle.png'
import mascotThinking from '../assets/mascot/gojo-thinking.png'
import mascotSuccess from '../assets/mascot/gojo-success.png'

const MASCOTS = {
  idle: mascotIdle,
  thinking: mascotThinking,
  success: mascotSuccess,
}

const LABELS = {
  idle: 'Годжо ждёт твоё фото',
  thinking: 'Годжо думает...',
  success: 'Годжо в восторге!',
}

const SIZES = {
  sm: 'h-28 w-28',
  md: 'h-40 w-40 sm:h-44 sm:w-44',
  lg: 'h-48 w-48 sm:h-56 sm:w-56',
  xl: 'h-52 w-52 sm:h-64 sm:w-64 md:h-72 md:w-72',
}

export default function Mascot({ state = 'idle', size = 'md', className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`relative flex items-center justify-center ${SIZES[size] ?? SIZES.md}`}
      >
        {state === 'thinking' && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-neutral-600/40" />
            <div className="absolute inset-3 animate-spin rounded-full border-[4px] border-neutral-700/30 border-t-neutral-300 border-r-neutral-400" />
          </>
        )}
        <img
          src={MASCOTS[state]}
          alt={LABELS[state]}
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
          draggable={false}
        />
      </div>
    </div>
  )
}
