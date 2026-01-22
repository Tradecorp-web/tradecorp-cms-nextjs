import * as THREE from 'three'

window.selObject
window.objects
window.controls
window.scenes
window.design

export const door = (doorCount, data = null) => {
    const textureLoad = new THREE.TextureLoader()

    const doorMat = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        color: 0xffffff,
        bumpScale: 0.002,
        metalness: 0.2
    })

    textureLoad.load('../../../textures/door.png', function(map) {
        map.wrapS = THREE.RepeatWrapping
        map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 4
        map.repeat.set( 1, 1 )
        map.encoding = THREE.sRGBEncoding
        doorMat.map = map
        doorMat.needsUpdate = true
    })

    // object door
    let panjang = 3, tinggi = 6, tebal = 0.2
    const doorpart = new THREE.Mesh(new THREE.BoxGeometry(panjang, tinggi, tebal), doorMat)
    doorpart.name = "door"
    doorpart.userData = (data != null) ? { label: data.label } : { label: "Door "+doorCount }
    doorpart.position.x = (data != null) ? data.posX : 0
    doorpart.position.y = (data != null) ? data.posY : tinggi/2
    doorpart.position.z = (data != null) ? data.posZ : 4
    doorpart.rotation.y = (data != null) ? data.rotY : 0
    doorpart.receiveShadow = true
    //doorpart.rotation.y = THREE.MathUtils.degToRad(90)
    doorpart.on('click', (event) => {
        window.selObject = event.data.target.uuid
        window.controls.attach(event.data.target)
        //this.props.refresh()
    })
    window.objects.push(doorpart)
    window.selObject = doorpart.uuid
    window.controls.attach(doorpart)
    window.scenes.scene.add(doorpart)
    window.design.push({name: doorpart.name , uuid: doorpart.uuid, label: doorpart.userData.label, posX: doorpart.position.x, posY: doorpart.position.y, posZ: doorpart.position.z, rotY: doorpart.rotation.y})
}