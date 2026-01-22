import * as THREE from 'three'

window.selObject
window.objects
window.controls
window.scenes
window.design

export const jendela = (windowCount, data = null) => {
    const textureLoad = new THREE.TextureLoader()

    const windowMat = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        color: 0xffffff,
        bumpScale: 0.002,
        metalness: 0.2
    })

    textureLoad.load('../../../textures/window.png', function(map) {
        map.wrapS = THREE.RepeatWrapping
        map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 4
        map.repeat.set( 1, 1 )
        map.encoding = THREE.sRGBEncoding
        windowMat.map = map
        windowMat.needsUpdate = true
    })

    // object window
    let panjang = 3, tinggi = 3, tebal = 0.2
    const windowpart = new THREE.Mesh(new THREE.BoxGeometry(panjang, tinggi, tebal), windowMat)
    windowpart.name = "window"
    windowpart.userData = (data != null) ? { label: data.label } : { label: "Window "+windowCount }
    windowpart.position.x = (data != null) ? data.posX : 0
    windowpart.position.y = (data != null) ? data.posY : 4.5
    windowpart.position.z = (data != null) ? data.posZ : 4
    windowpart.rotation.y = (data != null) ? data.rotY : 0
    windowpart.receiveShadow = true
    windowpart.on('click', (event) => {
        window.selObject = event.data.target.uuid
        window.controls.attach(event.data.target)
        //this.props.refresh()
    })
    window.objects.push(windowpart)
    window.selObject = windowpart.uuid
    window.controls.attach(windowpart)
    window.scenes.scene.add(windowpart)
    window.design.push({name: windowpart.name , uuid: windowpart.uuid, label: windowpart.userData.label, posX: windowpart.position.x, posY: windowpart.position.y, posZ: windowpart.position.z, rotY: windowpart.rotation.y})
}