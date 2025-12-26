import Phaser from 'phaser';
import Spaceship from '../objects/Spaceship.js';
import Planet from '../objects/Planet.js';
import Starfield from '../objects/Starfield.js';
import { galaxyData } from '../data/galaxyData.js';

export default class SpaceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SpaceScene' });
    }

    create() {
        // 월드 크기 확장 (카메라가 따라다님)
        this.physics.world.setBounds(0, 0, 2000, 2000);
        
        // 배경 별 생성
        new Starfield(this, 300);

        // 플레이어 생성
        this.player = new Spaceship(this, 1000, 1000);

        // 카메라 설정
        this.cameras.main.setBounds(0, 0, 2000, 2000);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        // 행성 배치
        this.planets = this.physics.add.group({ classType: Planet, runChildUpdate: true });

        this.createPlanet(600, 600, 'planet_about');
        this.createPlanet(1400, 600, 'planet_projects');
        this.createPlanet(600, 1400, 'planet_skills');
        this.createPlanet(1400, 1400, 'planet_contact');

        // 충돌 및 상호작용
        this.physics.add.collider(this.player, this.planets, this.handlePlanetCollision, null, this);

        // 입력 키
        this.cursors = this.input.keyboard.createCursorKeys();

        // UI 씬 실행 (오버레이)
        this.scene.launch('HudScene');
        
        // 안내 메시지 이벤트 발송
        this.events.emit('showGuide');
    }

    createPlanet(x, y, key) {
        const data = galaxyData[key];
        const planet = new Planet(this, x, y, key, data.color, data.title);
        this.planets.add(planet);
    }

    handlePlanetCollision(player, planet) {
        // 부딪히면 튕겨나감과 동시에 정보 표시
        this.scene.get('HudScene').openHologram(planet.dataKey);
    }

    update() {
        this.player.update(this.cursors);
    }
}
