import { useEffect, useState } from 'react'
import denokLogo from '@/imports/Denok__Mie_Ayam___Bakso.png'

interface LoadingScreenProps {
    onDone: () => void
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
    const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('hold'), 400)
        const t2 = setTimeout(() => setPhase('out'), 1600)
        const t3 = setTimeout(() => onDone(), 2100)

        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
        }
    }, [onDone])

    return (
        <div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#621905] transition-opacity duration-500"
            style={{
                opacity: phase === 'out' ? 0 : 1,
                pointerEvents: phase === 'out' ? 'none' : 'auto',
            }}
        >
            <div
                className="transition-all duration-500"
                style={{
                    opacity: phase === 'in' ? 0 : 1,
                    transform: phase === 'in' ? 'scale(0.85)' : 'scale(1)',
                }}
            >
                <img
                    src={denokLogo}
                    alt="DENOK"
                    className="w-80 md:w-96 lg:w-[28rem] xl:w-[32rem] h-auto object-contain drop-shadow-2xl"
                />
            </div>
        </div>
    )
}