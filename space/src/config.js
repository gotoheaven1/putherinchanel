import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import SpaceScene from './scenes/SpaceScene.js';
import HudScene from './scenes/HudScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#050510', // 깊은 우주색
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // 우주이므로 중력 없음
            debug: false
        }
    },
    scene: [BootScene, SpaceScene, HudScene]
};

export default config;
