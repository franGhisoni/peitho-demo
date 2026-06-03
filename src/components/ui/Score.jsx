import { cn, scoreTone } from '../../lib/helpers'

export function Score({ score }) {
  return <span className={cn('rounded-full px-2 py-1 text-xs font-black ring-1', scoreTone(score))}>{score}</span>
}
