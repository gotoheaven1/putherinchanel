import Phaser from 'phaser';
import { galaxyData } from '../data/galaxyData.js';

export default class HudScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HudScene' });
    }

    create() {
        const width = this.cameras.main.width;
        
        // 안내 메시지
        this.guideText = this.add.text(width / 2, 50, '방향키(↑←→)로 우주선을 조종하여 행성을 탐사하세요', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#00ffff',
            backgroundColor: '#000000aa',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // 홀로그램 팝업 컨테이너
        this.hologramContainer = this.add.container(width / 2, this.cameras.main.height / 2);
        this.hologramContainer.setVisible(false);

        // 반투명 배경 (홀로그램 느낌)
        const bg = this.add.graphics();
        bg.fillStyle(0x001133, 0.85); // 어두운 남색
        bg.fillRoundedRect(-250, -200, 500, 400, 15);
        bg.lineStyle(2, 0x00ffff, 1); // 네온 테두리
        bg.strokeRoundedRect(-250, -200, 500, 400, 15);
        this.hologramContainer.add(bg);

        // 닫기 안내
        const closeHint = this.add.text(0, 170, '[ SPACE ] 키를 눌러 통신 종료', {
            fontSize: '16px', color: '#00ffff'
        }).setOrigin(0.5);
        this.hologramContainer.add(closeHint);

        // 제목 텍스트
        this.titleText = this.add.text(0, -150, '', {
            fontSize: '28px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.hologramContainer.add(this.titleText);

        // 내용 텍스트
        this.contentText = this.add.text(-220, -100, '', {
            fontSize: '18px', color: '#aaddff', wordWrap: { width: 440 }, lineHeight: 28
        });
        this.hologramContainer.add(this.contentText);

        // 스페이스바 키 입력
        this.input.keyboard.on('keydown-SPACE', () => {
            this.closeHologram();
        });
    }

    openHologram(key) {
        if (this.hologramContainer.visible) return;

        const data = galaxyData[key];
        this.titleText.setText(data.title);
        this.contentText.setText(data.content);

        this.hologramContainer.setVisible(true);
        this.hologramContainer.setScale(0);
        this.guideText.setVisible(false);

        // 팝업 애니메이션
        this.tweens.add({
            targets: this.hologramContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.out'
        });
    }

    closeHologram() {
        if (!this.hologramContainer.visible) return;

        this.tweens.add({
            targets: this.hologramContainer,
            scaleX: 0,
            scaleY: 0,
            duration: 200,
            ease: 'Back.in',
            onComplete: () => {
                this.hologramContainer.setVisible(false);
                this.guideText.setVisible(true);
            }
        });
    }
}
