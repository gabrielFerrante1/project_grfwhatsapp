import { ProgressBar } from 'primereact/progressbar';
import styles from './LoadingApp.module.scss';
import { Icon } from '@iconify/react';
import { useEffect, useRef } from 'react';

type Props = {
    loading: boolean;
}

const LoadingApp = ({ loading }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.style.opacity = '0'
                    containerRef.current.style.pointerEvents = 'none'
                }
            }, 300)
        }
    }, [loading])

    return (
        <div className={styles.container} ref={containerRef} >
            <div className={styles.containerBody} style={{ opacity: loading ? 1 : 0, pointerEvents: loading ? 'all' : 'none' }}>
                <div className={styles.containerLoading}>
                    <Icon icon="svg-spinners:bars-scale" className={styles.logoIcon} />

                    <div className={styles.progressBar}>
                        <ProgressBar mode="indeterminate" style={{ height: 4 }} />
                    </div>

                    <span className={styles.title}>Grf WhatsApp</span>

                    <div className={styles.cryptography}>
                        <Icon icon="fa:lock" className={styles.cryptographyIcon} />

                        <span className={styles.cryptographyText}>
                            Protegido com a criptografia de ponta a ponta.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadingApp;