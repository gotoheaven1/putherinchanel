import Phaser from 'phaser';
import Player from '../objects/Player.js';
import Building from '../objects/Building.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // 1. 플레이어 생성
        this.player = new Player(this, 400, 300);

        // 2. 건물 그룹 생성
        this.buildings = this.physics.add.staticGroup();

        // 건물 배치 (위치, 텍스처키, 데이터키, 이름)
        const b1 = new Building(this, 200, 150, 'building_school', 'school', '학교 생활');
        const b2 = new Building(this, 600, 150, 'building_projects', 'projects', '프로젝트');
        const b3 = new Building(this, 200, 450, 'building_skills', 'skills', '기술 스택');
        const b4 = new Building(this, 600, 450, 'building_contact', 'contact', '연락처');

        // 그룹에 추가 (충돌 처리를 위해)
        this.buildings.addMultiple([b1, b2, b3, b4]);

        // 3. 충돌 설정 (플레이어가 건물을 통과하지 못하게)
        this.physics.add.collider(this.player, this.buildings);

        // 4. 키 입력 설정
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // 5. UI 씬 준비
        this.scene.launch('UIScene');

        // 안내 문구
        this.add.text(400, 550, '건물 앞에서 SPACE를 눌러 상세 정보를 확인하세요', {
            fontSize: '16px',
            color: '#fff'
        }).setOrigin(0.5);
    }

    update() {
        this.player.update(this.cursors);

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.checkInteraction();
        }
    }

    checkInteraction() {
        // 플레이어와 가장 가까운 건물 찾기
        const closest = this.physics.closest(this.player, this.buildings.getChildren());

        if (closest) {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                closest.x, closest.y
            );

            // 거리가 100px 이내면 상호작용
            if (distance < 100) {
                this.scene.pause();
                // UI 씬의 openPopup 함수 호출
                this.scene.get('UIScene').openPopup(closest.dataKey, closest.label.text);
            }
        }
    }
}
