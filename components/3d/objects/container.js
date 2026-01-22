import * as THREE from 'three'

window.contLen
window.objects
window.scenes
window.design

export const containerBox = (length = null, label = null) => {
    if (length == 40) {
        window.contLen = 40
    } else if (length == 10) {
        window.contLen = 10
    } else {
        window.contLen = 20
    }

    // texture container
    const textureLoader = new THREE.TextureLoader()

    const boxlongMat1 = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        color: 0xffffff,
        bumpScale: 0.002,
        metalness: 0.2
    })

    const boxlongMat2 = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        color: 0xffffff,
        bumpScale: 0.002,
        metalness: 0.2
    })

    const boxshortMat1 = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        color: 0xffffff,
        bumpScale: 0.002,
        metalness: 0.2
    })

    const boxshortMat2 = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        color: 0xffffff,
        bumpScale: 0.002,
        metalness: 0.2
    })

    const boxfloorMat = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        color: 0xffffff,
        bumpScale: 0.002,
        metalness: 0.2
    })

    textureLoader.load('../../../textures/'+window.contLen+'ft_blue_kanan.jpg', function(map) {
        map.wrapS = THREE.RepeatWrapping
        map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 4
        map.repeat.set( 1, 1 )
        map.encoding = THREE.sRGBEncoding
        boxlongMat1.map = map
        boxlongMat1.needsUpdate = true
    })

    textureLoader.load('../../../textures/'+window.contLen+'ft_blue_kiri.jpg', function(map) {
        map.wrapS = THREE.RepeatWrapping
        map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 4
        map.repeat.set( 1, 1 )
        map.encoding = THREE.sRGBEncoding
        boxlongMat2.map = map
        boxlongMat2.needsUpdate = true
    })

    textureLoader.load('../../../textures/blue_depan.jpg', function(map) {
        map.wrapS = THREE.RepeatWrapping
        map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 4
        map.repeat.set( 1, 1 )
        map.encoding = THREE.sRGBEncoding
        boxshortMat1.map = map
        boxshortMat1.needsUpdate = true
    })

    textureLoader.load('../../../textures/blue_belakang.jpg', function(map) {
        map.wrapS = THREE.RepeatWrapping
        map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 4
        map.repeat.set( 1, 1 )
        map.encoding = THREE.sRGBEncoding
        boxshortMat2.map = map
        boxshortMat2.needsUpdate = true
    })

    textureLoader.load('../../../textures/lantai.jpg', function(map) {
        map.wrapS = THREE.RepeatWrapping
        map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 4
        map.repeat.set( 1, 1 )
        map.encoding = THREE.sRGBEncoding
        boxfloorMat.map = map
        boxfloorMat.needsUpdate = true
    })

    // object box container
    let panjang = window.contLen, lebar = 8, tinggi = 8.6, tebal = 0.1
    let box = new THREE.Group()
    box.name = "container"
    box.userData = (label != null) ? { label: label } : { label: "Container "+window.contLen+"ft" }

    let boxpartlong1 = new THREE.Mesh(new THREE.BoxGeometry(panjang, tinggi, tebal), boxlongMat1)
    boxpartlong1.name = "container"
    boxpartlong1.position.x = 0
    boxpartlong1.position.y = tinggi/2
    boxpartlong1.position.z = lebar/2
    boxpartlong1.castShadow = true
    boxpartlong1.receiveShadow = true
    box.add(boxpartlong1)//this.scene.add(this.boxpartlong1)

    let boxpartlong2 = new THREE.Mesh(new THREE.BoxGeometry(panjang, tinggi, tebal), boxlongMat2)
    boxpartlong2.name = "container"
    boxpartlong2.position.x = 0
    boxpartlong2.position.y = tinggi/2
    boxpartlong2.position.z = -lebar/2
    boxpartlong2.castShadow = true
    boxpartlong2.receiveShadow = true
    box.add(boxpartlong2)//this.scene.add(this.boxpartlong2)

    let boxpartshot1 = new THREE.Mesh(new THREE.BoxGeometry(tebal, tinggi, lebar), boxshortMat1)
    boxpartshot1.name = "container"
    boxpartshot1.position.x = -panjang/2
    boxpartshot1.position.y = tinggi/2
    boxpartshot1.position.z = 0
    boxpartshot1.castShadow = true
    boxpartshot1.receiveShadow = true
    box.add(boxpartshot1)//this.scene.add(this.boxpartshot1)

    let boxpartshot2 = new THREE.Mesh(new THREE.BoxGeometry(tebal, tinggi, lebar), boxshortMat2)
    boxpartshot2.name = "container"
    boxpartshot2.position.x = panjang/2
    boxpartshot2.position.y = tinggi/2
    boxpartshot2.position.z = 0
    boxpartshot2.castShadow = true
    boxpartshot2.receiveShadow = true
    box.add(boxpartshot2)//this.scene.add(this.boxpartshot2)

    let boxpartbottom = new THREE.Mesh(new THREE.BoxGeometry(panjang, tebal, lebar), boxfloorMat)
    boxpartbottom.name = "container"
    boxpartbottom.position.x = 0
    boxpartbottom.position.y = 0
    boxpartbottom.position.z = 0
    boxpartbottom.castShadow = true
    boxpartbottom.receiveShadow = true
    box.add(boxpartbottom)//this.scene.add(this.boxpartbottom)
    
    window.objects.push(box)
    window.scenes.scene.add(box)
    window.design.push({name: box.name, uuid: box.uuid, panjang: panjang, label: box.userData.label})
}