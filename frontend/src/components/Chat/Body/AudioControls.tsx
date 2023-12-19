import { Message } from "@/types/Message";
import { useEffect, useRef, useState } from "react"
import { Slider } from 'primereact/slider';
import styles from './ChatBody.module.scss'
import { Icon } from "@iconify/react/dist/iconify.js";
import { Skeleton } from "primereact/skeleton";

type Props = {
    message: Message
}

export const AudioControls = ({ message }: Props) => {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const [audioIsPlaying, setAudioIsPlaying] = useState(false)
    const [currentTimeAudio, setCurrentTimeAudio] = useState({ time: 0, label: '00:00' })
    const [durationAudio, setDurationAudio] = useState({ time: 0, label: '00:00' })
    const [loadingAudio, setLoadingAudio] = useState(true)

    const handlePlayAudio = () => {
        if (!audioRef.current) return;

        setAudioIsPlaying(true)
        audioRef.current.play()

        if (audioRef.current.currentTime == audioRef.current.duration) {
            setCurrentTimeAudio({ time: 0, label: '00:00' })
        }
    }

    const handlePauseAudio = () => {
        if (!audioRef.current) return;

        setAudioIsPlaying(false)
        audioRef.current.pause()
    }

    const handleChangeCurrentTime = () => {
        if (!audioRef.current) return;

        const currentTime = audioRef.current.currentTime
        const currentTimeLabel = new Date(currentTime * 1000).toISOString().substring(14, 19)

        setCurrentTimeAudio({ time: currentTime, label: currentTimeLabel })

        if (currentTime == audioRef.current.duration) {
            setAudioIsPlaying(false)
            setCurrentTimeAudio({ time: 0, label: '00:00' })
        }
    }

    const handleLoadedAudio = () => {
        if (!audioRef.current) return;

        setLoadingAudio(false);

        // set current time 0
        audioRef.current.currentTime = 0
        setCurrentTimeAudio({ time: 0, label: '00:00' })
    }

    useEffect(() => {
        if (audioRef.current) audioRef.current.currentTime = 1e101
    }, [])

    useEffect(() => {
        if (audioRef.current) {
            const duration = audioRef.current.duration;

            if (!isNaN(duration) && duration != Infinity) {
                const currentTime = audioRef.current.duration
                const currentTimeLabel = new Date(currentTime * 1000).toISOString().substring(14, 19)

                setDurationAudio({ time: currentTime, label: currentTimeLabel })
            }
        }
    }, [audioRef.current?.duration])

    return (
        <>

            <div className={styles.containerAudio}>
                {loadingAudio ?
                    <Skeleton height="2rem"></Skeleton>
                    :
                    <>
                        <div className={styles.audioControl}>
                            {audioIsPlaying ?
                                <Icon icon="carbon:pause-filled" onClick={handlePauseAudio} />
                                :
                                <Icon icon="carbon:play-filled-alt" onClick={handlePlayAudio} />
                            }
                        </div>

                        <div className={styles.audioData}>
                            <div className={styles.audioDataSlider}>
                                <Slider
                                    value={currentTimeAudio.time}
                                    max={durationAudio.time}
                                />
                            </div>
                            <div className={styles.audioDataTime}>
                                <span>{currentTimeAudio.label}</span>
                                <span>{durationAudio.label}</span>
                            </div>
                        </div>
                    </>
                }
            </div>

            <audio
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${message.attachments.audio?.src}`}
                ref={audioRef}
                onLoadedData={handleLoadedAudio}
                onTimeUpdate={handleChangeCurrentTime}
            />
        </>
    )
}