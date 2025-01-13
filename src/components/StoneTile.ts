import {
  BoxGeometry,
  ColorRepresentation,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  Texture,
  Vector2,
} from "three";

class StoneTile extends Mesh {
  /**
   * Instantiates a new mesh with texture, color, position, wireframe and user data state
   *
   * @param texture
   * @param color
   * @param position
   */
  public constructor(
    texture: Texture,
    color: ColorRepresentation,
    position: Vector2
  ) {
    const boxGeometry = new BoxGeometry(1, 1, 0.15);
    const meshMaterial = new MeshStandardMaterial({
      map: texture,
      color: color,
    });

    super(boxGeometry, meshMaterial);

    this.position.set(position.x, position.y, 0);
    this.userData = {
      rotationX: Math.random() * 0.025,
      rotationY: Math.random() * 0.025,
    };

    const wireframeGeometry = new EdgesGeometry(boxGeometry);
    const wireframeMaterial = new LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
    });
    const wireframe = new LineSegments(wireframeGeometry, wireframeMaterial);

    this.add(wireframe);
  }

  /**
   * Sets a new material color
   *
   * @param color
   */
  public updateColor = (color: ColorRepresentation) => {
    (this.material as MeshStandardMaterial).color.set(color);
  };
}

export default StoneTile;
