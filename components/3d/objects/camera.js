import * as THREE from 'three'
import { OrbitControls } from '../extra/jsm/controls/OrbitControls'

window.activeCamera
window.camera1
window.camera2
window.orbit
window.orbitOff

export const camera = () => {
    window.camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500)
    camera1.position.set(0, 10, 40)
    camera1.lookAt(0, 4.3, 0)

    window.camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500)//new THREE.OrthographicCamera(-10, 10, 10, -10, 5, 50)
    camera2.position.set(0, window.contLen+10, 0)
    camera2.lookAt(0, 4.3, 0)

    window.activeCamera = window.camera1

    window.orbit = new OrbitControls(window.camera1, renderer.domElement)
    window.orbit.enableDamping = true
    window.orbit.dampingFactor = 0.05
    window.orbit.screenSpacePanning = false
    window.orbit.minDistance = 20
    window.orbit.maxDistance = 100
    window.orbit.maxPolarAngle = Math.PI / 2

    window.orbitOff = false
}