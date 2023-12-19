import styles from './DefaultPage.module.scss';
import { Icon } from '@iconify/react';
import DownloadAppThumbnail from '../../../public/assets/images/default_page_app.png';
import Image from 'next/image';
import { Button } from 'primereact/button';

const DefaultPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.containerDownLoadApp}>
                <Image
                    width={340}
                    src={DownloadAppThumbnail}
                    alt="Thumbnail - Download app"
                    priority
                />

                <h2 className={styles.downLoadAppTitle}>Baixar o WhatsApp para Windows</h2>
                <span className={styles.downLoadAppSubTitle}>
                    Baixe o novo app para Windows para fazer chamadas, usar o compartilhamento de tela e  <br />  ter uma experiência de uso mais rápida.
                </span>

                <Button className={styles.downLoadAppBtn} size='small'>Baixar App</Button>
            </div>

            <div className={styles.containerCryptography}>
                <Icon icon="fa:lock" className={styles.cryptographyIcon} />

                <span className={styles.cryptographyText}>
                    Suas mensagens pessoais são protegidas com a criptografia de ponta a ponta.
                </span>
            </div>
        </div>
    );
}

export default DefaultPage;