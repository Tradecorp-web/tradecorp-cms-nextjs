import * as THREE from 'three'

window.scenes

export const lightings = () => {
    //const envLight = new THREE.AmbientLight('#ffffff', 0.5)
    const envLight = new THREE.HemisphereLight('#ffffff', 1)
    window.scenes.scene.add(envLight)

    const spotLight1 = new THREE.SpotLight('#ffffff', 2)
    spotLight1.position.set(window.contLen+10, 20, 20)
    spotLight1.angle = Math.PI / 4
    spotLight1.penumbra = 0.1
    spotLight1.decay = 2
    spotLight1.distance = 100
    spotLight1.castShadow = true
    spotLight1.shadow.mapSize.width = 2
    spotLight1.shadow.mapSize.height = 2
    spotLight1.shadow.camera.near = 0.1
    spotLight1.shadow.camera.far = 500
    spotLight1.shadow.camera.fov = 45
    spotLight1.shadow.focus = 1
    window.scenes.scene.add(spotLight1)

    const spotLight2 = new THREE.SpotLight('#ffffff', 2)
    spotLight2.position.set(-(window.contLen+10), 20, 20)
    spotLight2.angle = Math.PI / 4
    spotLight2.penumbra = 0.1
    spotLight2.decay = 2
    spotLight2.distance = 100
    spotLight2.castShadow = true
    spotLight2.shadow.mapSize.width = 2
    spotLight2.shadow.mapSize.height = 2
    spotLight2.shadow.camera.near = 0.1
    spotLight2.shadow.camera.far = 500
    spotLight2.shadow.camera.fov = 45
    spotLight2.shadow.focus = 1
    window.scenes.scene.add(spotLight2)

    /*const lighthelper1 = new THREE.SpotLightHelper(spotLight1)
    window.scenes.scene.add(lighthelper1)

    const lighthelper2 = new THREE.SpotLightHelper(spotLight2)
    window.scenes.scene.add(lighthelper2)*/
}