import Phaser from 'phaser';

export default class Building extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey, dataKey, labelText) {
        super(scene, x, y, textureKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setImmovable(true); // 움직이지 않음
        this.dataKey = dataKey;  // 팝업 띄울 때 사용할 키 (school, projects 등)

        // 건물 이름 표시
        this.label = scene.add.text(x, y + 50, labelText, {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);
    }
}
