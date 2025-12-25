import Phaser from 'phaser';
import { portfolioContent } from '../data/content.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // 팝업 컨테이너 (초기엔 숨김)
        this.popup = this.add.container(400, 300).setVisible(false);

        // 배경 오버레이
        this.overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6)
            .setVisible(false)
            .setInteractive();

        // 팝업창 디자인
        const bg = this.add.rectangle(0, 0, 500, 400, 0xffffff, 1)
            .setStrokeStyle(4, 0x333333);

        const closeBtn = this.add.text(220, -180, 'X', {
            fontSize: '28px', 
            color: '#e74c3c', 
            fontStyle: 'bold'
        }).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', () => this.closePopup());

        // 내용 텍스트
        this.titleText = this.add.text(0, -150, '제목', {
            fontSize: '32px', color: '#333', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.descText = this.add.text(-220, -80, '내용', {
            fontSize: '18px', color: '#555', wordWrap: { width: 440 }
        }).setOrigin(0);

        this.popup.add([bg, closeBtn, this.titleText, this.descText]);

        this.input.keyboard.on('keydown-ESC', () => this.closePopup());
    }

    openPopup(key, categoryName) {
        const data = portfolioContent[key];
        
        this.titleText.setText(data ? data.title : categoryName);
        this.descText.setText(data ? data.desc : '내용이 없습니다.');

        this.overlay.setVisible(true);
        this.popup.setVisible(true).setScale(0);

        this.tweens.add({
            targets: this.popup,
            scaleX: 1, scaleY: 1,
            duration: 200, ease: 'Back.out'
        });
    }

    closePopup() {
        if (!this.popup.visible) return;

        this.tweens.add({
            targets: this.popup,
            scaleX: 0, scaleY: 0,
            duration: 200, ease: 'Back.in',
            onComplete: () => {
                this.popup.setVisible(false);
                this.overlay.setVisible(false);
                this.scene.resume('MainScene');
            }
        });
    }
}
