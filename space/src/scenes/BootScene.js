import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        // 1. 우주선 텍스처 생성
        const shipGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // 본체
        shipGraphics.fillStyle(0xffffff, 1);
        shipGraphics.beginPath();
        shipGraphics.moveTo(0, -20);
        shipGraphics.lineTo(15, 20);
        shipGraphics.lineTo(0, 10);
        shipGraphics.lineTo(-15, 20);
        shipGraphics.closePath();
        shipGraphics.fill();
        
        // 조종석 (파란 창문)
        shipGraphics.fillStyle(0x00ffff, 1);
        shipGraphics.fillCircle(0, -5, 5);

        shipGraphics.generateTexture('ship', 40, 50);

        // 2. 엔진 입자 (파티클) 텍스처 생성
        const particleGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        particleGraphics.fillStyle(0x00ffff, 1);
        particleGraphics.fillCircle(4, 4, 4);
        particleGraphics.generateTexture('particle', 8, 8);

        // 3. 행성 텍스처 생성 (기본 원형)
        // 색상은 나중에 틴트(Tint)로 변경하므로 흰색으로 생성
        const planetGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        planetGraphics.fillStyle(0xffffff, 1);
        planetGraphics.fillCircle(50, 50, 50);
        // 행성 고리 느낌의 테두리
        planetGraphics.lineStyle(4, 0xcccccc, 0.5);
        planetGraphics.strokeCircle(50, 50, 45);
        
        planetGraphics.generateTexture('planet_base', 100, 100);

        // 모든 텍스처 생성 완료 후 메인 씬 시작
        this.scene.start('SpaceScene');
    }
}
