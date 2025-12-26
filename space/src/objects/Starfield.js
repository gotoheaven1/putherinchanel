import Phaser from 'phaser';

export default class Starfield {
    constructor(scene, count = 200) {
        this.scene = scene;
        
        // 배경용 그래픽스 객체
        const graphics = scene.add.graphics();
        graphics.fillStyle(0xffffff, 1);

        // 랜덤하게 점(별) 찍기
        for (let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(0, 2000);
            const y = Phaser.Math.Between(0, 2000);
            const size = Phaser.Math.FloatBetween(1, 3);
            const alpha = Phaser.Math.FloatBetween(0.3, 1);

            graphics.fillStyle(0xffffff, alpha);
            graphics.fillCircle(x, y, size);
        }

        // 텍스처로 변환하여 타일 스프라이트로 사용 (무한 배경 느낌)
        graphics.generateTexture('starfield', 2000, 2000);
        graphics.destroy();

        // 배경 이미지 추가
        this.bg = scene.add.image(0, 0, 'starfield').setOrigin(0).setScrollFactor(0.5); // 원근감을 위해 느리게 움직임
    }
}
