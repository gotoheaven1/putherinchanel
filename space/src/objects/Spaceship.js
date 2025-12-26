import Phaser from 'phaser';

export default class Spaceship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ship');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 물리 설정
        this.setDamping(true);
        this.setDrag(0.95); // 관성 (0.99는 미끄러움, 0.1은 뻑뻑함)
        this.setMaxVelocity(400);
        this.setCollideWorldBounds(true);

        // 엔진 파티클 효과
        this.particles = scene.add.particles(0, 0, 'particle', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 500,
            follow: this,
            on: false // 이동할 때만 켬
        });
    }

    update(cursors) {
        // 방향키 입력 처리
        if (cursors.up.isDown) {
            this.scene.physics.velocityFromRotation(this.rotation - Math.PI/2, 300, this.body.acceleration);
            this.particles.start(); // 파티클 켜기
        } else {
            this.setAcceleration(0);
            this.particles.stop(); // 파티클 끄기
        }

        if (cursors.left.isDown) {
            this.setAngularVelocity(-200);
        } else if (cursors.right.isDown) {
            this.setAngularVelocity(200);
        } else {
            this.setAngularVelocity(0);
        }
    }
}
