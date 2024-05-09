import { useEffect, useState, useRef, useCallback } from 'react'
import { useApi } from './useApi'

const useCountdownTimer = (initialSeconds: number, callback: () => void = () => {}) => {
    const [seconds, setSeconds] = useState(initialSeconds)
    const calledClear = useRef(false)
    const intervalId = useRef<NodeJS.Timeout | null>(null)
    const api = useApi()
    const socket = api?.getSocket()

    // Clear interval helper function
    const clearTimer = useCallback(() => {
        if (intervalId.current !== null) {
            clearInterval(intervalId.current)
            intervalId.current = null
        }
    }, [])

    // Start countdown
    const startTimer = useCallback(() => {
        clearTimer() // Ensure any existing timer is cleared before starting a new one
        intervalId.current = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds > 0) return prevSeconds - 1
                clearTimer() // Stop the timer when it reaches 0
                return 0
            })
        }, 1000)
    }, [clearTimer])

    // Reset the timer to the initial value or to a new value
    const resetTimer = useCallback(
        (newInitialSeconds = initialSeconds) => {
            clearTimer() // Clear any ongoing interval
            setSeconds(newInitialSeconds) // Set seconds either to newInitialSeconds or fallback to initialSeconds
            startTimer() // Restart the timer with the new value

            // Emit event to stop all other timers
            calledClear.current = true
            socket?.emit('stop_timer', { seconds })
        },
        [initialSeconds, startTimer, clearTimer]
    )

    useEffect(() => {
        startTimer() // Start the timer when the component mounts

        // Cleanup function to clear interval when the component unmounts
        return () => clearTimer()
    }, [startTimer, clearTimer])

    useEffect(() => {
        if (socket) {
            socket.on('countdown_seconds', ({ seconds }: { seconds: number }) => {
                setSeconds(seconds)
            })

            socket.on('stop_timer', () => {
                if (!calledClear.current) {
                    console.log('Stopping timer')
                    clearTimer()
                }

                calledClear.current = false
            })
        }

        return () => {
            socket.off('countdown_seconds')
            socket.off('stop_timer')
        }
    }, [socket])

    useEffect(() => {
        if (seconds === 0) {
            callback() // Call the callback function when the timer reaches 0
        }

        socket?.emit('countdown_seconds', { seconds })
    }, [seconds, callback])

    return { seconds, resetTimer }
}

export default useCountdownTimer
