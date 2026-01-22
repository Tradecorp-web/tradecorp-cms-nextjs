import * as THREE from 'three'

window.selObject
window.objects
window.controls
window.scenes
window.design

export const acOutdoor = (acOutdoorCount, data = null) => {
    const textureLoad = new THREE.TextureLoader()

    const acoutMat = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        color: 0xffffff,
        bumpScale: 0.002,
        metalness: 0.2
    })

    textureLoad.load('../../../textures/ac_outdoor.png', function(map) {
        map.wrapS = THREE.RepeatWrapping
        map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 4
        map.repeat.set( 1, 1 )
        map.encoding = THREE.sRGBEncoding
        acoutMat.map = map
        acoutMat.needsUpdate = true
    })

    // object window
    var panjang = 2.5, tinggi = 2, tebal = 0.8
    const acoutpart = new THREE.Mesh(new THREE.BoxGeometry(panjang, tinggi, tebal), acoutMat)
    acoutpart.name = "ac-outdoor"
    acoutpart.userData = (data != null) ? { label: data.label } : { label: "AC Outdoor "+acOutdoorCount }
    acoutpart.position.x = (data != null) ? data.posX : 0
    acoutpart.position.y = (data != null) ? data.posY : 1
    acoutpart.position.z = (data != null) ? data.posZ : 4.5
    acoutpart.rotation.y = (data != null) ? data.rotY : 0
    acoutpart.receiveShadow = true
    acoutpart.on('click', (event) => {
        window.selObject = event.data.target.uuid
        window.controls.attach(event.data.target)
        //this.props.refresh()
    })
    window.objects.push(acoutpart)
    window.selObject = acoutpart.uuid
    window.controls.attach(acoutpart)
    window.scenes.scene.add(acoutpart)
    window.design.push({name: acoutpart.name , uuid: acoutpart.uuid, label: acoutpart.userData.label, posX: acoutpart.position.x, posY: acoutpart.position.y, posZ: acoutpart.position.z, rotY: acoutpart.rotation.y})
}