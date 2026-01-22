import React from 'react'

import * as THREE from 'three'
import { Interaction } from 'three.interaction'
import { TransformControls } from './extra/jsm/controls/TransformControls'
import { DDSLoader } from './extra/jsm/loaders/DDSLoader'
import { MTLLoader } from './extra/jsm/loaders/MTLLoader'
import { OBJLoader } from './extra/jsm/loaders/OBJLoader'
import Renderer from './renderer'
import { render } from 'react-dom'
import { lightings } from "./objects/lightings"
import { camera } from "./objects/camera"
import { containerBox } from "./objects/container"
import { door } from "./objects/door"
import { jendela } from './objects/jendela'
import { acOutdoor } from './objects/ac'

window.renderer
window.orbit
window.orbitOff
window.objects = []
window.scenes
window.selObject
window.pointer
window.contLen
window.design = []
window.activeCamera
window.camera1
window.camera2

class Scene extends React.Component {
    constructor(props, context) {
        super(props, context)

        window.scenes = this
        window.selObject = null

        this.state = {
            doorCount: 1,
            windowCount: 1,
            acOutdoorCount: 1
        }
    }

    onResize = (renderer, gl, { width, height }) => {
        // This function is called after canvas has been resized.

        window.camera1.aspect = width / height
        window.camera1.updateProjectionMatrix()
        window.camera2.aspect = width / height
        window.camera2.updateProjectionMatrix()
    }

    initScene = (renderer, gl) => {
        // This function is called once, after canvas component has been mounted.
        // And WebGLRenderer and WebGLRenderingContext have been created.

        window.objects = []
        window.design = []

        this.scene = new THREE.Scene()

        this.ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200),new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }))
        this.ground.name = "ground"
        this.ground.position.x = 0
        this.ground.position.y = 0
        this.ground.rotation.x = - Math.PI / 2
		this.ground.receiveShadow = true;
        this.scene.add(this.ground)

        const groundHelper = new THREE.GridHelper( 200, 40, 0x888888, 0x444444 )
        groundHelper.name = "helper"
        this.scene.add(groundHelper)

        //const axesHelper = new THREE.AxesHelper(10)
        //this.scene.add(axesHelper)

        lightings()

        camera()
        
        this.interaction = new Interaction(renderer, this.scene, window.activeCamera)

        this.transformControl()

        if (this.props.data != null) {
            var data = JSON.parse(this.props.data)
            console.log(data)
            data.forEach((obj) => {
                console.log(obj)
                if (obj.name == "container") {
                    containerBox(obj.panjang, obj.label)
                } else if (obj.name == "door") {
                    door(this.state.doorCount, obj)
                    this.setState({doorCount: this.state.doorCount+1})
                } else if (obj.name == "window") {
                    jendela(this.state.windowCount, obj)
                    this.setState({windowCount: this.state.windowCount+1})
                } else if (obj.name == "ac-outdoor") {
                    acOutdoor(this.state.acOutdoorCount, obj)
                    this.setState({acOutdoorCount: this.state.acOutdoorCount+1})
                }
            })
        } else {
            containerBox(20)
        }

        //this.raycast = new THREE.Raycaster()
        //window.pointer = new THREE.Vector2()

        document.addEventListener('keydown', (event) => {
            switch (event.keyCode) {
                case 46: // del
                    for (var i=0; i<window.objects.length; i++) {
                        if (window.objects[i].uuid == window.selObject) {
                            window.controls.detach()
                            window.scenes.scene.remove(window.objects[i])
                            window.objects.splice(i,1)
                        }
                    }
                    for (var i=0; i<window.design.length; i++) {
                        if (window.design[i].uuid == window.selObject) {
                            window.design.splice(i,1)
                        }
                    }
                    this.props.refresh()
                    break;
                case 82: // R
                    if (window.objects.length > 0) {
                        if (window.controls.getMode() == 'translate') {
                            window.controls.showX = false
                            window.controls.showY = true
                            window.controls.showZ = false
                            window.controls.setMode('rotate')
                        } else if (window.controls.getMode() == 'rotate') {
                            window.controls.showX = true
                            window.controls.showY = false
                            window.controls.showZ = true
                            window.controls.setMode('translate')
                        }
                    }
                    break;
            }
        })

        /*document.addEventListener('mousemove', function(event) {
            event.preventDefault();
            window.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			window.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        })*/

        /*const mtlLoader = new MTLLoader(THREE)
        mtlLoader.load('../objects/table.mtl', materials => {
            materials.preload()

            const objLoader = new OBJLoader(THREE)
            objLoader.setMaterials(materials)
            objLoader.load(
                '../objects/table.obj',
                obj => {
                    console.log(obj)
                    this.scene.add(obj) 
                },
                xhr => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                }
            );
        });*/
        /*const manager = new THREE.LoadingManager();
		manager.addHandler( /\.dds$/i, new DDSLoader() );
        new MTLLoader( manager )
					.setPath( '../objects/' )
					.load( 'table.mtl', function (materials) {
						materials.preload()
						new OBJLoader(manager)
							.setMaterials(materials)
							.setPath( '../objects/' )
							.load( 'table.obj', (object) => {
                                object.name = "table"
                                object.label = "Table"
                                object.scale.set(2,2,2)
                                window.selObject = object.uuid
                                window.objects.push(object)
                                window.controls.attach(object)
                                window.scenes.scene.add(object)
                                //object.on('click', function(event) {
                                //    window.selObject = event.data.target.uuid
                                //    window.controls.attach(event.data.target)
                                //    console.log(window.selObject)
                                //})
                                this.props.refresh()

							}, function (xhr) {
                                if (xhr.lengthComputable) {
                                    const percentComplete = xhr.loaded / xhr.total * 100
                                    console.log( Math.round( percentComplete, 2 ) + '% downloaded' )
                                }
                            }, function () {
                            } )
					} );*/
    
        renderer.setClearColor('#c0c0c0')
    }

    addObject = (component) => {
        if (component == "door") {
            door(this.state.doorCount)
            this.setState({doorCount: this.state.doorCount+1})
        } else if (component == "window") {
            jendela(this.state.windowCount)
            this.setState({windowCount: this.state.windowCount+1})
        } else if (component == "ac-outdoor") {
            acOutdoor(this.state.acOutdoorCount)
            this.setState({acOutdoorCount: this.state.acOutdoorCount+1})
        }
        this.props.refresh()
    }

    selectObject = (uuid) => {
        for (var i=0; i<window.objects.length; i++) {
            if (window.objects[i].uuid == uuid) {
                if (window.objects[i].name != "container") {
                    window.selObject = uuid
                    window.controls.attach(window.objects[i])
                }
            }
        }
    }

    deleteObject = (uuid) => {
        for (var i=0; i<window.objects.length; i++) {
            if (window.objects[i].uuid == uuid) {
                window.controls.detach()
                window.scenes.scene.remove(window.objects[i])
                window.objects.splice(i,1)
            }
        }
        for (var i=0; i<window.design.length; i++) {
            if (window.design[i].uuid == uuid) {
                window.design.splice(i,1)
            }
        }
        this.props.refresh()
    }

    /*dragObject = () => {
        /*this.posX = null
        this.posY = null
        this.posZ = null

        const minX = -(window.contLen/2+1.5), maxX = window.contLen/2+1.5, minZ = -4, maxZ = 4
        this.controls = new DragControls( [ ... window.objects ], this.activeCamera, window.renderer.domElement );
		this.controls.addEventListener( 'dragstart', function(event) {
            if (window.orbitOff == false) {
                window.orbit.enabled = false
            }
            if (event.object.name == "door" || event.object.name == "window") {
                this.posY = event.object.position.y
            } else if (event.object.name == "ac-outdoor") {
                this.posY = 1
            } else {
                this.posY = null
            }
            
        })
        this.controls.addEventListener( 'drag', function(event) {
            if (this.posY != null) {
                if (event.object.name == "door" || event.object.name == "window" || event.object.name == "ac-outdoor") {
                    event.object.position.y = this.posY
                }
            }
            if (event.object.position.x < minX + event.object.geometry.parameters.width/2) {
                event.object.position.x = minX + event.object.geometry.parameters.width/2
            } else if (event.object.position.x > maxX - event.object.geometry.parameters.width/2) {
                event.object.position.x = maxX - event.object.geometry.parameters.width/2
            }
            if (event.object.name == "ac-outdoor") {
                if (event.object.position.z < minZ-0.5) {
                    event.object.position.z = minZ-0.5
                } else if (event.object.position.z > maxZ+0.5) {
                    event.object.position.z = maxZ+0.5
                }
            } else {
                if (event.object.position.z < minZ) {
                    event.object.position.z = minZ
                } else if (event.object.position.z > maxZ) {
                    event.object.position.z = maxZ
                }
            }
        })
        this.controls.addEventListener( 'dragend', function(event) {
            if (window.orbitOff == false) {
                window.orbit.enabled = true
            }
        })
    }*/

    transformControl = () => {
        this.posX = null
        this.posY = null
        this.posZ = null

        const minX = -(window.contLen/2+1.5), maxX = window.contLen/2+1.5, minZ = -4, maxZ = 4
        window.controls = new TransformControls(window.activeCamera, window.renderer.domElement)
        window.controls.showY = false
        window.controls.setRotationSnap(THREE.MathUtils.degToRad(90))
        window.controls.addEventListener('dragging-changed', function(event) {
            window.orbit.enabled = !event.value
            if (this.posY != null) {
                event.target.object.position.y = this.posY
            }
            if (event.target.object.geometry) {
                if (event.target.object.position.x < minX + event.target.object.geometry.parameters.width/2) {
                    event.target.object.position.x = minX + event.target.object.geometry.parameters.width/2
                } else if (event.target.object.position.x > maxX - event.target.object.geometry.parameters.width/2) {
                    event.target.object.position.x = maxX - event.target.object.geometry.parameters.width/2
                }
                /*if (event.target.object.name == "ac-outdoor") {
                    if (event.target.object.position.z < minZ-0.5) {
                        event.target.object.position.z = minZ-0.5
                    } else if (event.target.object.position.z > maxZ+0.5) {
                        event.target.object.position.z = maxZ+0.5
                    }
                } else {*/
                    if (event.target.object.position.z < minZ - event.target.object.geometry.parameters.depth/2) {
                        event.target.object.position.z = minZ - event.target.object.geometry.parameters.depth/2
                    } else if (event.target.object.position.z > maxZ + event.target.object.geometry.parameters.depth/2) {
                        event.target.object.position.z = maxZ + event.target.object.geometry.parameters.depth/2
                    }
                //}
            } else {
                var box = new THREE.Box3().setFromObject(event.target.object)
                var width = (box.max.x - box.min.x)
                var depth = (box.max.z - box.min.z)
                if (event.target.object.position.x < minX + width/2) {
                    event.target.object.position.x = minX + width/2
                } else if (event.target.object.position.x > maxX - width/2) {
                    event.target.object.position.x = maxX - width/2
                }
                if (event.target.object.position.z < minZ - depth/2) {
                    event.target.object.position.z = minZ - depth/2
                } else if (event.target.object.position.z > maxZ + depth/2) {
                    event.target.object.position.z = maxZ + depth/2
                }
            }
        })
        window.controls.addEventListener( 'mouseDown', function(event) {
            window.selObject = event.target.object.uuid
            if (event.target.object.geometry) {
                if (event.target.object.name == "window") {
                    this.posY = event.target.object.geometry.parameters.height/2+3
                } else {
                    this.posY = event.target.object.geometry.parameters.height/2
                }
            } else {
                this.posY = 0
            }
            /*if (event.object.name == "door" || event.object.name == "window") {
                this.posY = event.object.position.y
            } else if (event.object.name == "ac-outdoor") {
                this.posY = 1
            } else {
                this.posY = null
            }*/
        })
        window.controls.addEventListener( 'change', function(event) {
            if (event.target.object) {
                for (var i=0; i<window.design.length; i++) {
                    if (window.design[i].uuid == event.target.object.uuid) {
                        window.design[i].posX = event.target.object.position.x
                        window.design[i].posY = event.target.object.position.y
                        window.design[i].posZ = event.target.object.position.z
                        window.design[i].rotY = event.target.object.rotation.y
                        //console.log(window.design[i])
                    }
                }
            }
        })
        this.scene.add(window.controls)
    }

    switchCamera = () => {
        if (window.activeCamera === window.camera1) {
            window.activeCamera = window.camera2
        } else {
            window.activeCamera = window.camera1
        }
        window.controls.camera = window.activeCamera
    }

    toggleTransMode = () => {
        if (window.objects.length > 0) {
            if (window.controls.getMode() == 'translate') {
                window.controls.showX = false
                window.controls.showY = true
                window.controls.showZ = false
                window.controls.setMode('rotate')
            } else if (window.controls.getMode() == 'rotate') {
                window.controls.showX = true
                window.controls.showY = false
                window.controls.showZ = true
                window.controls.setMode('translate')
            }
        }
    }

    renderScene = (renderer, gl) => {
        // This function is called when browser is ready to repaint the canvas.
        // Draw your single frame here.

        /*this.raycast.setFromCamera( window.pointer, this.activeCamera );
        const intersects = this.raycast.intersectObjects( window.objects );
        if ( intersects.length > 0 ) {
            if ( this.INTERSECTED != intersects[ 0 ].object ) {
                this.selObject = intersects[ 0 ].object
            }
        } else {
            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
            this.INTERSECTED = null;
        }*/

        renderer.render(this.scene, window.activeCamera)
    }

    handleDirectionButtonClick = () => {
        // Flip rotation direction sign
        
    }

    render = () => {
        return (
            <Renderer
                onResize={this.onResize}
                initScene={this.initScene}
                renderScene={this.renderScene}
            />
        )
    }
}
  
export default Scene