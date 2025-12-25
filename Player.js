import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // 'player'라는 키를 가진 텍스처(이미지) 사용
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.speed = 200;

        // 플레이어 이름표 (옵션)
        this.nameTag = scene.add.text(x, y - 40, '나', {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#000000'
        }).setOrigin(0.5);
    }

    update(cursors) {
        // UI가 열려있으면 정지
        if (this.scene.scene.isPaused('MainScene')) return;

        this.body.setVelocity(0);

        if (cursors.left.isDown) {
            this.body.setVelocityX(-this.speed);
            this.setFlipX(true); // 이미지 좌우 반전
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.speed);
            this.setFlipX(false);
        }

        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.speed);
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.speed);
        }

        // 이름표가 플레이어를 따라다니게 함
        this.nameTag.x = this.x;
        this.nameTag.y = this.y - 40;
    }
}
