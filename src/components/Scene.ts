import {
  AmbientLight,
  ColorRepresentation,
  DirectionalLight,
  Fog,
  Group,
  LineSegments,
  Material,
  Mesh,
  PerspectiveCamera,
  Raycaster,
  Scene as ThreeScene,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import StoneTile from "./StoneTile";
import { getRandomBasicColor } from "../support/utils";

class Scene {
  private _renderer: WebGLRenderer;
  private _camera: PerspectiveCamera;
  private _scene: ThreeScene;
  private _fog: Fog;
  private _mouse: Vector2;
  private _raycaster: Raycaster;
  private _orbitControls: OrbitControls;
  private _meshGroup: Group | undefined;

  /**
   * Instantiates a new scene with camera, lighting and fog settings, mouse interactions and orbit controls
   *
   * @param backgroundColor
   */
  public constructor(backgroundColor: ColorRepresentation) {
    // Renderer
    this._renderer = new WebGLRenderer({ antialias: true });
    this._renderer.setClearColor(backgroundColor);
    this._resetRendererSize();

    // Camera
    this._camera = new PerspectiveCamera(45, 1, 0.1, 1000);
    this._camera.position.z = 5;
    this._resetCameraAspectRatio();

    // Lighting
    const ambientLight = new AmbientLight(0x808080);
    const directionalLight = new DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 0, 5);
    directionalLight.castShadow = false;

    // Scene
    this._fog = new Fog(backgroundColor, 1, 100);

    this._scene = new ThreeScene();
    this._scene.fog = this._fog;
    this._scene.add(ambientLight);
    this._scene.add(directionalLight);

    // Orbit Controls
    this._orbitControls = new OrbitControls(
      this._camera,
      this._renderer.domElement
    );
    this._orbitControls.enableDamping = true;
    this._orbitControls.enableZoom = false;
    this._orbitControls.autoRotate = false;

    // Mouse Interactions
    this._mouse = new Vector2();

    this._raycaster = new Raycaster();
    this._raycaster.params.Line.threshold = 0.0;

    window.addEventListener("resize", this._windowResizeHandler);
    window.addEventListener("mousemove", this._mouseMoveHandler);
    window.addEventListener("click", this._mouseClickHandler);
  }

  /**
   * Rotates and/or positions each mesh object in the scene according to its user data state
   */
  private _animate = () => {
    if (this._meshGroup && this._fog) {
      for (const mesh of this._meshGroup.children) {
        mesh.rotation.x += mesh.userData.rotationX;
        mesh.rotation.y += mesh.userData.rotationY;

        if (mesh.userData.clicked) {
          mesh.position.z -= 0.25;

          if (mesh.position.z <= -this._fog.far) {
            mesh.position.z = 5;

            if (mesh instanceof StoneTile) {
              mesh.updateColor(getRandomBasicColor());
            }
          }

          if (mesh.position.z === 0) {
            mesh.userData.clicked = false;
          }
        }
      }
    }

    this._mouseHoverUpdate();
    this._orbitControls.update();
    this._renderer.render(this._scene, this._camera);
  };

  /**
   * Adds a mesh group to the scene
   *
   * @param meshGroup
   */
  public addMeshGroup = (meshGroup: Group) => {
    this._meshGroup = meshGroup;
    this._scene.add(this._meshGroup);
  };

  /**
   * Starts the animation loop and renders the scene
   */
  public render = () => {
    this._renderer.setAnimationLoop(this._animate);

    document.body.appendChild(this._renderer.domElement);
  };

  /**
   * Resets the camera aspect ratio
   */
  private _resetCameraAspectRatio = () => {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  };

  /**
   * Resets the renderer size
   */
  private _resetRendererSize = () => {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  };

  /**
   * Resets the camera aspect ratio and renderer size when the window is resized
   */
  private _windowResizeHandler = () => {
    this._resetCameraAspectRatio();
    this._resetRendererSize();
  };

  /**
   * Gets an array of raycaster object intersections if available
   */
  private _getMeshIntersections = () => {
    this._raycaster.setFromCamera(this._mouse, this._camera);

    if (this._meshGroup) {
      return this._raycaster.intersectObjects(this._meshGroup.children);
    }
  };

  /**
   * Updates the coordinates of the mouse property
   *
   * @param event
   */
  private _mouseMoveHandler = (event: MouseEvent) => {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  /**
   * Displays the wireframe of a mouse hovered mesh object
   */
  private _mouseHoverUpdate = () => {
    if (this._meshGroup) {
      for (const mesh of this._meshGroup.children) {
        const childMesh = mesh.children[0] as Mesh;

        if (childMesh.material instanceof Material) {
          childMesh.material.opacity = 0.0;
        }
      }
    }

    const intersections = this._getMeshIntersections();

    if (intersections?.length) {
      const mesh = intersections[0].object;

      if (mesh.children?.[0] instanceof LineSegments) {
        const wireframe = mesh.children[0];

        if (wireframe.material instanceof Material) {
          wireframe.material.opacity = mesh.userData.clicked ? 0.0 : 1.0;
        }
      }
    }
  };

  /**
   * Updates the user data state of the mouse clicked mesh object
   */
  private _mouseClickHandler = () => {
    const intersections = this._getMeshIntersections();

    if (intersections?.length) {
      intersections[0].object.userData.clicked = true;
    }
  };
}

export default Scene;
