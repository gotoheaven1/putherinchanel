import Phaser from 'phaser';

export default class Planet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, dataKey, color, labelText) {
        super(scene, x, y, 'planet_base');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.setTint(color); // 행성 색상 입히기
        this.dataKey = dataKey; // 데이터 연결 키

        // 행성 이름표
        this.label = scene.add.text(x, y + 65, labelText, {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // 은은하게 회전하는 애니메이션
        scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 20000,
            repeat: -1
        });

        // 은은하게 커졌다 작아지는 효과 (숨쉬는 효과)
        scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}
